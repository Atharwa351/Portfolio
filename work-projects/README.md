# GTM Data Platform — End-to-End System (Production-Validated PoC)

## Overview
This repository documents an **end-to-end GTM (Go-To-Market) data platform**
designed, built, and operated under real-world constraints, with validation through internal usage by Marketing and Lead Generation teams.

The platform enables **safe, scalable, self-serve GTM data activation**
without exposing raw infrastructure to non-technical users.

**Scope of the system:**
- Large-scale GTM data ingestion
- Performance-aware ingestion warehouse
- Controlled internal data access and export layer

The system reliably processes **100GB+ datasets and 120M+ rows**
under production-like conditions and operational constraints.

---

## System Architecture (High-Level)

```text
Scraped GTM Data (CSV)
        │
        ▼
┌────────────────────────┐
│   Ingestion ETL Layer  │
│   (Async, Retention-   │
│    First Pipeline)     │
└────────────────────────┘
        │
        ▼
┌────────────────────────┐
│ GTM Ingestion Warehouse│
│ (Indexed, Denormalized │
│  PostgreSQL Schema)    │
└────────────────────────┘
        │
        ▼
┌────────────────────────────────┐
│ GTM Data Access Platform       │
│ (v1 – Filtered Preview +       │
│  Streamed Export)              │
└────────────────────────────────┘
```
Each layer has **clearly defined responsibilities**, explicit boundaries,
and documented trade-offs.

---

## Core Design Principles

Across all components, the system is guided by the following principles:

- **Data retention over premature optimization**
- **Predictable performance over theoretical purity**
- **Operational safety over unrestricted flexibility**
- **Clear separation of concerns between layers**

The platform reflects **engineering judgment shaped by constraints**, not
textbook idealism.

---

## Platform Components

### 1️⃣ GTM Ingestion Warehouse — Database Schema (v1)

📁 `database/`

#### Purpose
Acts as the **central ingestion and staging warehouse** for GTM contact data,
supporting read-heavy filtering and export workflows.

#### Key Characteristics
- ~100GB raw CSV ingested  
- 120M+ contact-level rows  
- Read-optimized for GTM segmentation and export  
- Not designed for OLTP-style updates  

#### Design Highlights
- Single denormalized ingestion table (`apollo_contacts`)
- Explicit indexing aligned with GTM query patterns
- Tolerates noisy, incomplete, third-party scraped data
- Preserves raw contact fields for downstream enrichment

Strict normalization was intentionally deferred to preserve ingestion
resilience, simplify recovery, and reduce operational overhead.

---

### 2️⃣ GTM Ingestion ETL — Apollo CSV Pipeline

📁 `etl/`

#### Purpose
Asynchronously ingests large, inconsistent Apollo-style CSV datasets into the
warehouse with **maximum data retention and recoverability**.

#### Key Characteristics
- Streaming CSV ingestion (no full-file memory loads)
- Row-level inserts to avoid batch-level data loss
- Minimal validation at ingest time
- Explicit rejection logging with retry isolation
- Auto-tuned concurrency based on available system resources
- Heartbeat and watchdog support for unattended execution

#### Scale & Constraints
- ~100GB total input volume  
- Long-running jobs by design  
- Operates reliably on constrained hardware  
- No silent row drops  

This ETL prioritizes **correctness, traceability, and recovery**
over raw throughput.

---

### 3️⃣ GTM Data Access & Export Platform (v1)

📁 `access-platform-v1/`

#### Purpose
Provides **controlled, self-serve access** to GTM data for non-technical users
without granting direct database access.

#### Capabilities
- Authentication-backed access
- Dropdown-driven GTM filters
- Enforcement of indexed query paths
- Bounded preview pagination (top 100 rows)
- High-throughput streaming exports (CSV / Excel)

#### Key Design Decisions
- Pagination limits prevent unbounded scans
- Full data access is exposed only via streaming exports
- All filters map directly to indexed warehouse columns
- Designed to operate within ~8GB RAM and outdated CPU constraints

This layer validates the **access model, safety boundaries, and performance
envelope** prior to deeper productization.

---

## Ownership & Contributions

### Primary Ownership
I was the **sole owner** of the core data platform, including:
- End-to-end system architecture
- Database schema and indexing strategy (PostgreSQL)
- GTM ingestion ETL design, implementation, and recovery logic
- Data contracts and boundaries between platform layers
- Performance, memory, and resource trade-offs
- Query design, pagination limits, and export constraints

All data-layer behavior, constraints, and failure modes were designed,
implemented, and validated by me.

### Access Platform Implementation
The GTM data access platform (Node.js) was implemented **collaboratively**
with a junior developer.

My role included:
- Defining the access model and safety boundaries
- Designing query patterns and enforcing indexed access paths
- Specifying pagination, export, and performance constraints
- Reviewing database-facing logic and system behavior

While Node.js is not my primary stack, **all architectural
decisions, data-layer interactions, and trade-offs were owned and reviewed
by me**.

---

## Why This System Exists

This platform demonstrated that:
- Large-scale GTM datasets can be safely ingested and activated internally
- Index-driven design enables predictable performance at scale
- Non-technical teams do not require raw database access to operate effectively
- Strong system boundaries reduce operational and data governance risk

It reflects **real operational constraints**, not hypothetical scenarios.

---

## Scope & Positioning

### This platform **IS**:
- A real-world GTM data system
- Designed and built under constraint
- Focused on scale, safety, and clarity
- Explicit about trade-offs and limitations

### This platform is **NOT**:
- A BI dashboard
- A toy analytics project
- A tutorial or reference implementation
- A fully productized SaaS offering

---

## Final Summary

This repository represents **practical data platform engineering**:

- Large-scale ingestion under constraint
- Retention-first ETL design
- Performance-aware warehousing
- Controlled internal data access and export

Each component reinforces the others.

**This is not a collection of scripts — it is a system.**


