# GTM Data Access & Export Platform (PoC – v1)

## Overview

This project represents a **proof-of-concept internal GTM data access platform**
built to provide **controlled, self-serve access** to a large GTM contact
warehouse without exposing direct database access.

The platform allows non-technical users to:
- Authenticate via a web interface
- Apply predefined GTM filters
- Preview filtered results
- Export large datasets as CSV or Excel

This system sits downstream of the ingestion warehouse and ETL pipeline and
focuses on **safe access, performance predictability, and operational simplicity**.

---

## Purpose of V1

The primary objective of V1 was **controlled access**, not analytics or BI.

Key goals:
- Eliminate ad-hoc database access by sales and marketing teams
- Enforce query constraints aligned with database indexing
- Support fast exports over very large datasets
- Operate reliably under limited infrastructure resources

This version intentionally validates the **access model and performance
characteristics** before further productization.

---

## Data Model Alignment

All user-facing filters map **directly to indexed columns** in the
`apollo_contacts` warehouse table.

This ensures:
- Predictable query latency
- No unindexed full-table scans
- Stable performance even at high row counts

Example filter dimensions:
- Job title / role
- Industry
- Company industry
- Geographic region and metro

Filter availability is intentionally constrained to fields with known
cardinality and index coverage.

---

## Pagination Strategy

### Bounded Result Preview

Pagination is intentionally limited to **small result windows (top 100 rows)**.

This design:
- Allows users to preview filtered datasets
- Prevents deep pagination over massive tables
- Protects database performance under concurrent usage

Pagination is treated as a **preview mechanism**, not a browsing tool.

---

## Streaming Export Workflow

Full dataset access is provided **exclusively via export workflows**.

Filtered query results are **streamed directly** from the database into CSV or
Excel files.

Key characteristics:
- No full result buffering in application memory
- Constant memory usage during export
- Suitable for very large result sets

Export throughput is bounded by I/O rather than application memory.

---

## Resource Constraints

This PoC was implemented and validated under constrained infrastructure:

- ~8 GB RAM
- Outdated CPU
- Single-node deployment

Design decisions explicitly account for these constraints by:
- Avoiding in-memory result accumulation
- Enforcing bounded pagination
- Streaming exports instead of batch materialization

Reliability and predictability were prioritized over aggressive in-memory
optimization.

---

## System Scope & Non-Goals

### In Scope
- Filtered access to GTM warehouse data
- Index-aware query construction
- Preview via bounded pagination
- High-throughput streaming exports

### Out of Scope (by design)
- Data enrichment or deduplication
- Analytics or visualization
- Free-form querying
- Deep historical exploration via pagination

These responsibilities are handled upstream (ETL) or downstream (activation).

---

## Relationship to ETL & Warehouse

This platform assumes:
- Data is already ingested and schema-aligned
- No additional validation or transformation occurs here
- Exported data reflects warehouse state directly

The separation of concerns is explicit:
- **ETL** → ingestion, retention, resilience
- **Warehouse** → indexing and query performance
- **Access Platform** → controlled exposure and export

---

## Ownership & Contributions

I was responsible for:
- Overall system architecture and design
- Database integration and query strategy
- Index-driven filtering decisions
- Pagination and export constraints
- Performance and resource trade-offs

The platform was implemented collaboratively with a junior developer under my
technical direction.  
The implementation stack (Node.js) was not my primary stack at the time, while
all database-facing logic, contracts, and architectural decisions were designed
and reviewed by me.

---

## Why This Exists

This PoC demonstrated that:
- A single large GTM warehouse can safely support multiple internal users
- Index-driven filtering enables fast exports at scale
- Non-technical teams do not require direct DB access to operate effectively

V1 laid the groundwork for future iterations involving:
- Stronger access controls
- Auditing and usage tracking
- Workflow automation
- More granular export policies

---

## Summary

This platform represents **practical GTM system engineering**:

- Built under real operational constraints
- Designed for performance predictability
- Explicitly aligned with database indexing
- Honest about scope and trade-offs

**It is not a dashboard — it is a controlled data access layer.**
