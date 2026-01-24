# GTM Ingestion ETL — Apollo CSV Pipeline

## Overview
This project contains the ETL pipeline responsible for ingesting large-scale, scraped GTM contact data (Apollo-style CSVs) into the GTM ingestion warehouse (`apollo_contacts`).  
This pipeline was engineered for **high-volume ingestion, operational resilience, and maximal data retention** under real-world constraints.

This is not a toy script — it reflects deliberate trade-offs and production experience handling ~100GB of data and 120M+ rows with minimal data loss.

---

## Goals & Design Philosophy

### 🚀 Primary Goals
- Efficiently ingest hundreds of millions of rows from CSV into the database.
- Preserve every valid record and minimize data loss.
- Enable downstream enrichment, validation, and analytics without early truncation.

### 🧠 Core Design Principles
- **Data retention over throughput:** Row-level inserts were chosen over batch inserts to prevent entire batch failures due to single malformed records.
- **Minimal validation at ingest:** Only structurally invalid rows (e.g., missing required fields) are rejected. Downstream layers handle deeper validation/enrichment.
- **Robust operational behavior:** This pipeline is designed to run unattended with backpressure, health monitoring, and graceful shutdown.

---

## Architecture
CSV Files
└─> Async Streaming (chunked)
└─> Validate / Transform
└─> Row-level DB Insert
└─> Rejection Logging
└─> Post-Processing


### Key Components
- **CSV Streaming:** Asynchronously reads CSVs in chunks to avoid memory spikes.
- **Transform & Validation:** Maps columns to schema and rejects only truly unusable rows.
- **Row-level Inserts:** Ensures maximum data retention and per-record error handling.
- **Rejection Logging:** Captures and logs rejected rows with reasons for audit and reprocessing.
- **Heartbeat & Watchdog:** Tracks progress, logs system health, and prevents silent failures.

---

## Operational Features

### 📦 Auto-tuning
Concurrency and chunk sizes adapt based on available CPU and memory. This helps:
- Balance transform parallelism
- Avoid resource starvation
- Scale across machines with different capacities

### 🧪 Failure Isolation
- Failed inserts are retried up to a set number of times.
- Persistent failures are logged with context for later remediation.
- No valid row is dropped silently.

### 🫀 Health Monitoring
- Heartbeat files with rolling CPU & memory stats ensure the pipeline remains alive.
- Watchdog process exits cleanly if heartbeats stop.

### ✋ Graceful Shutdown
Handles `SIGINT` and `SIGTERM`, allowing in-flight operations to complete before exiting.

---

## Usage

Place CSV files in a directory and run:

```bash
python ingest_apollo.py /path/to/csv_directory

## Usage Notes

Accepted files must have a `.csv` extension.

Logs and summaries are automatically written to:

```text
etl_logs/
├─ rejected_log_YYYYMMDD_HHMMSS.csv
└─ ingest_summary_YYYYMMDD_HHMMSS.json

## Validation & Rejection Handling

### What gets validated
- Required fields (e.g., presence of email)
- Column mapping completeness

### What gets rejected
- Rows with missing required fields
- Rows with persistent DB insert errors after retries

### Rejected rows include
- All input columns
- Reason for rejection
- Originating file path

This makes audits and reprocessing straightforward.

---

## Trade-offs & Intentional Choices

### Row-level vs Batch Inserts
- Batch inserts caused whole-batch failures when a single row was bad
- Row-level inserts maximize retention and simplify error isolation
- Bulk loading (`COPY` / batch) is deferred to future pipeline versions when  
  deduplication and stronger schema guarantees are available

### Minimal Early Validation
- Aggressive validation at ingest would cause unnecessary data loss
- Downstream enrichment layers are better suited for complex quality checks

### Schema Coupling
- The script relies on a specific schema and column mapping
- Any schema change must be coordinated with both upstream extractor  
  and downstream consumers

---

## Metrics & Monitoring

The summary file logs:
- Total accepted rows
- Total rejected rows
- Validation failure counts
- Processing timestamps

This enables easy integration with dashboards or alerting systems.

### Example summary snippet
```json
{
  "accepted": 12500000,
  "validation_failed": 10342,
  "timestamp": "20260115T093012"
}

## Future Evolution

The current ETL is optimized for data retention and resilience.  
Future improvements could include:

- Faster bulk insertion (`COPY`, staged tables, partitioning)
- Smart deduplication before insert
- Stronger incremental loading
- Checkpointing and restart support

These features are deferred until larger-scale production needs emerge.

---

## Summary

This ETL pipeline embodies **real production engineering judgment**:

- Built to handle real-world ingestion constraints
- Prioritizes correctness and retention over simplistic speed claims
- Designed to be maintainable, observable, and robust

**It is not a script — it’s a system.**






