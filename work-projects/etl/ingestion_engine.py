import os
import csv
import json
import asyncio
import logging
import traceback
from datetime import datetime
from collections import defaultdict, deque
from typing import Dict, List, Optional
import aiofiles
import aiocsv
import asyncpg
import psutil
import functools
import signal
import time
import multiprocessing

# ---------------------------
# Logging setup
# ---------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)

# ---------------------------
# Auto-tuning + globals
# ---------------------------
WATCHDOG_TIMEOUT = 300
HEARTBEAT_INTERVAL = 15
ROLLING_METRICS_WINDOW = 5
MAX_DB_RETRIES = 5  # Max retry attempts per record

def auto_tune():
    cpu_count = os.cpu_count() or 4
    free_ram_mb = psutil.virtual_memory().available // (1024*1024)
    if free_ram_mb >= 24000:
        chunk = 50000
        max_workers = min(24, cpu_count)
        max_files = 3
    elif free_ram_mb >= 12000:
        chunk = 40000
        max_workers = min(16, cpu_count)
        max_files = 2
    else:
        chunk = 30000
        max_workers = min(12, cpu_count)
        max_files = 2
    load = psutil.cpu_percent(interval=0.5)
    if load > 80:
        max_workers = max(1, max_workers // 2)
    return chunk, max_workers, max_files

CHUNK_SIZE, MAX_TRANSFORM_CONCURRENCY, MAX_CONCURRENT_FILES = auto_tune()

# ---------------------------
# Paths
# ---------------------------
LOGS_DIR = os.path.join(os.path.expanduser("~"), "etl_logs")
os.makedirs(LOGS_DIR, exist_ok=True)
RUN_SUFFIX = datetime.now().strftime("%Y%m%d_%H%M%S")
REJECT_LOG_PATH = os.path.join(LOGS_DIR, f"rejected_log_{RUN_SUFFIX}.csv")
SUMMARY_JSON_PATH = os.path.join(LOGS_DIR, f"ingest_summary_{RUN_SUFFIX}.json")
HEARTBEAT_FILE = os.path.join(LOGS_DIR, f"etl_heartbeat_{RUN_SUFFIX}.tmp")

# ---------------------------
# DB Config
# ---------------------------
DB_CONFIG = {
    'user': 'postgres',
    'password': '1234',
    'database': 'postgres',
    'host': 'localhost',
    'port': 5432,
}

# ---------------------------
# Counters
# ---------------------------
COUNTERS = defaultdict(int)
COUNTER_LOCK = asyncio.Lock()

async def increment_counter(key: str, delta: int = 1):
    async with COUNTER_LOCK:
        COUNTERS[key] += delta

# ---------------------------
# Column mapping
# ---------------------------
COLUMN_MAPPING = {
    "First Name": "first_name",
    "Last Name": "last_name",
    "Job title": "job_title",
    "Sub Role": "sub_role",
    "Industry": "industry",
    "Industry 2": "sub_industry",
    "Emails": "emails",
    "Mobile": "mobile",
    "Phone numbers": "phone_numbers",
    "LinkedIn Url": "linkedin_url",
    "Company Name": "company_name",
    "Company Industry": "company_industry",
    "Company Website": "company_website",
    "Company Linkedin Url": "company_linkedin_url",
    "Company Location Locality": "company_locality",
    "Company Location Metro": "company_metro",
    "Company Location Region": "company_region",
    "Company Location Street Address": "street_address",
    "Company Location Address Line 2": "address_2",
    "Company Location Postal Code": "postal_code",
}
APOLLO_COLUMNS = list(COLUMN_MAPPING.values())

# ---------------------------
# Async rejection buffer
# ---------------------------
REJECTION_BUFFER_SIZE = 100
rejection_queue: asyncio.Queue = asyncio.Queue()

def _sync_write_csv_rows(path: str, rows: list):
    with open(path, 'a', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerows(rows)

async def rejection_writer_task():
    buffer = []
    loop = asyncio.get_running_loop()
    while True:
        item = await rejection_queue.get()
        if item is None:
            if buffer:
                await loop.run_in_executor(None, functools.partial(_sync_write_csv_rows, REJECT_LOG_PATH, buffer))
            break
        buffer.append(item)
        if len(buffer) >= REJECTION_BUFFER_SIZE:
            await loop.run_in_executor(None, functools.partial(_sync_write_csv_rows, REJECT_LOG_PATH, buffer))
            buffer.clear()

async def queue_rejection(row: Dict[str,str], reason: str, file_path: str):
    flat_row = [row.get(col, "").strip() for col in APOLLO_COLUMNS]
    flat_row.extend([reason, file_path])
    await rejection_queue.put(flat_row)

# ---------------------------
# CSV streaming
# ---------------------------
async def stream_csv_batches(file_path: str, chunk_size: int):
    async with aiofiles.open(file_path, "r", encoding="utf-8", errors="ignore") as fh:
        reader = aiocsv.AsyncDictReader(fh)
        batch = []
        async for row in reader:
            batch.append(row)
            if len(batch) >= chunk_size:
                yield batch
                batch = []
        if batch:
            yield batch

# ---------------------------
# Transform & validate
# ---------------------------
# Validation Philosophy:
# Validation is intentionally minimal at ingestion time.
# Only structurally unusable records (e.g., missing email field)
# are rejected here.
#
# Aggressive validation, normalization, and enrichment are deferred
# to downstream systems to preserve source fidelity and avoid
# irreversible data loss.

def transform_row(row: Dict[str,str]):
    return {col: (row.get(orig) or "").strip() for orig, col in COLUMN_MAPPING.items()}

async def validate_and_transform(row: Dict[str,str], file_path: str):
    mapped = transform_row(row)
    # Reject only if emails field is empty
    if not mapped.get("emails"):
        await increment_counter("validation_failed")
        await queue_rejection(mapped, "Missing emails", file_path)
        return None
    return mapped

# ---------------------------
# DB insert with retry & batch splitting
# ---------------------------
# Insertion Strategy Note:
# Row-level inserts are used intentionally.
#
# Earlier bulk/batch insert attempts caused entire batches to fail
# due to single-row data issues, resulting in unacceptable data loss.
#
# This implementation prioritizes maximum data retention and
# precise rejection tracking over raw ingestion throughput.
#
# Failed records are isolated, retried individually, and explicitly
# logged for downstream inspection rather than dropped silently.

async def insert_batch(pool, records: List[Dict[str,str]], file_path: str):
    if not records:
        return
    sql_cols = ", ".join(APOLLO_COLUMNS)
    placeholders = ", ".join(f"${idx+1}" for idx in range(len(APOLLO_COLUMNS)))
    sql = f"INSERT INTO apollo_contacts ({sql_cols}) VALUES ({placeholders})"

    retry_queue = [(r, 0) for r in records]  # (record, retry_count)

    while retry_queue:
        r, retries = retry_queue.pop(0)
        try:
            async with pool.acquire() as conn:
                values = [[r[c] for c in APOLLO_COLUMNS]]
                await conn.executemany(sql, values)
                await increment_counter("accepted")
        except Exception:
            if retries < MAX_DB_RETRIES:
                retry_queue.append((r, retries + 1))
            else:
                await increment_counter("validation_failed")
                await queue_rejection(r, "DB insert error after retries", file_path)

# ---------------------------
# File processing with backpressure
# ---------------------------
async def process_csv_file(file_path: str, pool):
    logging.info(f"📂 Starting {file_path}")
    rows_processed = 0
    sem = asyncio.Semaphore(MAX_TRANSFORM_CONCURRENCY)

    async for batch in stream_csv_batches(file_path, CHUNK_SIZE):
        async def safe_transform(row):
            async with sem:
                return await validate_and_transform(row, file_path)

        tasks = [asyncio.create_task(safe_transform(r)) for r in batch]
        transformed = [r for r in await asyncio.gather(*tasks) if r]

        if transformed:
            await insert_batch(pool, transformed, file_path)
            rows_processed += len(transformed)
            logging.info(f"➡️ Progress: {rows_processed} rows processed in {file_path}")

    logging.info(f"🏁 Finished {file_path} (total {rows_processed} rows)")

# ---------------------------
# Heartbeat + Watchdog
# ---------------------------
rolling_cpu = deque(maxlen=ROLLING_METRICS_WINDOW)
rolling_ram = deque(maxlen=ROLLING_METRICS_WINDOW)

def _sync_write_heartbeat(path: str, metrics: dict):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(json.dumps(metrics))

async def heartbeat_writer(interval: int = HEARTBEAT_INTERVAL):
    loop = asyncio.get_running_loop()
    while True:
        cpu = psutil.cpu_percent(interval=0.1)
        mem = psutil.virtual_memory().available // (1024*1024)
        rolling_cpu.append(cpu)
        rolling_ram.append(mem)
        metrics = {
            "timestamp": datetime.now().isoformat(),
            "cpu_avg": sum(rolling_cpu)/len(rolling_cpu),
            "ram_avg_mb": sum(rolling_ram)//len(rolling_ram),
            "accepted": COUNTERS.get("accepted",0),
            "validation_failed": COUNTERS.get("validation_failed",0),
        }
        await loop.run_in_executor(None, functools.partial(_sync_write_heartbeat, HEARTBEAT_FILE, metrics))
        await asyncio.sleep(interval)

def watchdog_process(path: str, timeout: int = WATCHDOG_TIMEOUT):
    last_seen = time.time()
    while True:
        try:
            if os.path.exists(path):
                with open(path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    last_seen = datetime.fromisoformat(data.get("timestamp")).timestamp()
        except Exception:
            pass
        if time.time() - last_seen > timeout:
            print(f"🚨 Watchdog: no heartbeat for {timeout}s. Exiting gracefully.")
            os._exit(1)
        time.sleep(5)

def launch_watchdog():
    p = multiprocessing.Process(target=watchdog_process, args=(HEARTBEAT_FILE,), daemon=True)
    p.start()

# ---------------------------
# Summary
# ---------------------------
async def write_summary():
    summary = dict(COUNTERS)
    summary["timestamp"] = datetime.now().isoformat()
    async with aiofiles.open(SUMMARY_JSON_PATH, "w", encoding="utf-8") as f:
        await f.write(json.dumps(summary, indent=2))

# ---------------------------
# Main
# ---------------------------
# Idempotency & Retention Trade-off:
# This ingestion pipeline assumes CSV inputs are processed once.
#
# Enforcing idempotency or deduplication at this layer was intentionally
# avoided to prevent premature data loss on imperfect source data.
#
# Deduplication and reconciliation are handled in downstream systems
# where more context is available.

shutdown_flag = False
def handle_exit(signum, frame):
    global shutdown_flag
    print(f"Received signal {signum}, shutting down gracefully...")
    shutdown_flag = True

async def main(source_dir: str):
    signal.signal(signal.SIGINT, handle_exit)
    signal.signal(signal.SIGTERM, handle_exit)

    asyncio.create_task(rejection_writer_task())
    asyncio.create_task(heartbeat_writer())
    launch_watchdog()

    pool = await asyncpg.create_pool(
        **DB_CONFIG,
        min_size=max(1, MAX_TRANSFORM_CONCURRENCY//2),
        max_size=MAX_TRANSFORM_CONCURRENCY
    )
    try:
        if os.path.isfile(source_dir):
            files = [source_dir]
        elif os.path.isdir(source_dir):
            files = [os.path.join(source_dir, f) for f in os.listdir(source_dir) if f.lower().endswith(".csv")]
        else:
            logging.error(f"Invalid source_dir: {source_dir}")
            return

        logging.info(f"Found {len(files)} CSV file(s) in {source_dir}")

        sem = asyncio.Semaphore(MAX_CONCURRENT_FILES)
        async def bounded(f):
            async with sem:
                if shutdown_flag:
                    return
                await process_csv_file(f, pool)

        await asyncio.gather(*(bounded(f) for f in files))

        await rejection_queue.put(None)
        await write_summary()
        logging.info("Summary JSON + rejection logs written.")
    finally:
        await pool.close()

# ---------------------------
# Execution
# ---------------------------
if __name__ == "__main__":
    SOURCE_DIR = r"C:\Users\Atharwa Malawade\Documents\GP Final\csv_files"
    try:
        asyncio.run(main(SOURCE_DIR))
        print(f"\n✅ ETL completed. Summary: {SUMMARY_JSON_PATH}")
        print(f"🛑 Rejected log: {REJECT_LOG_PATH}")
    except Exception as e:
        logging.critical(f"Fatal error: {e}")
        traceback.print_exc()
