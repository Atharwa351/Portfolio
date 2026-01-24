# GTM Data Platform — End-to-End System (PoC → Production-Validated)

## Overview

This repository documents an **end-to-end GTM (Go-To-Market) data platform**
designed, built, and operated under real-world constraints.

The system spans:
- Large-scale data ingestion
- A performance-optimized GTM warehouse
- A controlled internal data access & export platform

Together, these components enable **safe, scalable, and self-serve GTM data
activation** without exposing raw infrastructure to non-technical users.

This is not a collection of isolated scripts — it is a **cohesive system**
built to handle **100GB+ datasets and 120M+ rows** in production-like conditions.

---

## System Architecture (High-Level)

```text
Scraped GTM Data (CSV)
        │
        ▼
┌───────────────────────┐
│  Ingestion ETL Layer  │
│  (Async, Retention-   │
│   First Pipeline)     │
└───────────────────────┘
        │
        ▼
┌───────────────────────┐
│ GTM Ingestion Warehouse│
│ (Indexed, Denormalized│
│  PostgreSQL Schema)   │
└───────────────────────┘
        │
        ▼
┌────────────────────────────┐
│ GTM Data Access Platform   │
│ (PoC v1 – Filter, Preview, │
│  Streamed Export)          │
└────────────────────────────┘
```
Each layer has **clear responsibilities** and **explicit trade-offs**.

---

## Core Design Principles

Across all components, the system is guided by a consistent philosophy:

- **Data retention over premature optimization**
- **Predictable performance over theoretical purity**
- **Operational safety over unrestricted flexibility**
- **Clear separation of concerns**

This platform reflects **engineering judgment**, not textbook idealism.

---

## Components

### 1️⃣ GTM Ingestion Warehouse — Database Schema (v1)

📁 `database/`

#### Purpose
Acts as the **central ingestion and staging warehouse** for GTM contact data.

#### Key Characteristics
- ~100GB raw CSV ingested  
- 120M+ contact-level rows  
- Designed for read-heavy GTM workflows  
- Optimized for filtering and export, not OLTP updates  

#### Design Highlights
- Single denormalized table (`apollo_contacts`)
- Explicitly indexed based on GTM query patterns
- Tolerates noisy, incomplete, scraped data
- Preserves raw emails for downstream enrichment

Strict normalization was intentionally deferred to preserve ingestion
resilience and operational simplicity.

---

### 2️⃣ GTM Ingestion ETL — Apollo CSV Pipeline

📁 `etl/`

#### Purpose
Asynchronously ingests large, messy Apollo-style CSV datasets into the
warehouse with **maximum data retention**.

#### Key Characteristics
- Streaming CSV ingestion (no full-file loads)
- Row-level inserts to avoid batch-level data loss
- Minimal validation at ingest
- Explicit rejection logging with retry isolation
- Auto-tuned concurrency based on system resources
- Heartbeat & watchdog for unattended execution

#### Scale & Constraints
- ~100GB input
- Long-running jobs
- Designed to run on constrained infrastructure
- No silent data drops

This ETL prioritizes **correctness and recoverability** over raw throughput.

---

### 3️⃣ GTM Data Access & Export Platform (PoC – v1)

📁 `access-platform-v1/`

#### Purpose
Provides **controlled, self-serve access** to GTM data for non-technical users
without exposing direct database access.

#### Capabilities
- Authentication-backed access
- Dropdown-driven GTM filters
- Indexed query enforcement
- Bounded pagination (top 100 rows) for preview
- High-throughput streaming exports (CSV / Excel)

#### Key Design Decisions
- Pagination is intentionally capped to prevent deep scans
- Full access is provided only via streaming exports
- Filters map strictly to indexed warehouse columns
- Designed to operate under ~8GB RAM and outdated CPU

This platform validates the **access model and performance envelope**
before deeper productization.

---

## Ownership & Contributions

### My Responsibilities
- End-to-end system architecture
- Database schema and indexing strategy
- ETL design and implementation
- Data contracts between layers
- Performance and resource trade-offs
- Query, pagination, and export constraints

### Collaborative Implementation
The access platform was implemented collaboratively with a junior developer
under my technical direction.

The platform was built in Node.js, which was not my primary stack at the time.
All database-facing logic, architectural decisions, and system trade-offs were
designed, reviewed, and owned by me.

---

## Why This System Exists

This platform demonstrated that:
- Massive GTM datasets can be safely ingested and exposed internally
- Index-driven design enables predictable performance at scale
- Non-technical teams do not require raw database access to operate effectively
- Strong system boundaries prevent operational and data governance issues

It reflects **real production constraints**, not hypothetical scenarios.

---

## What This Is — and Is Not

### This **IS**:
- A real-world GTM data system
- Built under constraint
- Designed for scale, safety, and clarity
- Honest about trade-offs

### This is **NOT**:
- A BI dashboard
- A toy analytics project
- A tutorial clone
- A fully productized SaaS

---

## Final Summary

This repository represents **practical data platform engineering**:

- Large-scale ingestion
- Retention-first ETL
- Performance-aware warehousing
- Controlled data access and export

Each component reinforces the others.

**It is not a collection of scripts — it is a system.**

