GTM Ingestion Warehouse — Database Schema (v1)
Overview

This schema implements the ingestion and warehouse layer of a production GTM (Go-To-Market) data platform.
It is designed to ingest large-scale, messy contact data under real business constraints while enabling fast downstream filtering, export, and activation workflows.

The design intentionally prioritizes ingestion resilience, query performance, and operational simplicity over strict normalization.

This is not a theoretical schema — it reflects production usage and real operational trade-offs.

Scale

Ingested ~100GB of raw CSV data

Stored 120+ million contact-level rows

Source datasets contained ~64 columns per record

Optimized for repeated ad-hoc filtering and bulk export workloads

The schema was validated at production scale, not as a toy or academic exercise.

Source Characteristics

Data sourced from scraped GTM/contact datasets (Apollo-style data)

Upstream CSVs were:

Wide (high column count)

Inconsistently populated

Poorly standardized across records

The schema needed to tolerate missing, partial, and noisy fields without ingestion failures

Column Selection Strategy

Not all source columns were retained

Columns were intentionally reduced to high-signal fields required for:

Targeting

Segmentation

Export and activation

This reduced storage overhead and materially improved filter performance at scale

Column reduction was a deliberate design decision, not a shortcut.

Schema Design Rationale
Single-Table Structure

A flat, single-table schema was a non-negotiable operational requirement

Enabled:

Simple exports

Easy consumption by non-technical stakeholders

Lower cognitive overhead for internal users

Trade-off against strict normalization was explicitly accepted

Denormalization

Contact, company, and location attributes are co-located

Optimized for read-heavy GTM workflows rather than OLTP-style updates

Appropriate for a warehouse / staging layer, not a final analytical model

Email Handling

Source data frequently contained multiple email addresses per contact

All emails were preserved in raw form at ingestion time

Email validation, deduplication, and enrichment were handled downstream

This avoided irreversible data loss early in the pipeline

Indexing Strategy

Indexes were designed based on expected downstream query patterns, not source structure.

Primary optimization targets

Role-based targeting (job title, sub-role)

Industry segmentation

Geographic slicing (region, metro)

Tolerant search over non-standardized text fields

Implementation details

Single-column indexes for high-selectivity filters

Composite indexes for common GTM targeting combinations

Trigram (GIN) indexes to support fuzzy matching on inconsistent text values

Indexing decisions balanced query performance against write overhead at high ingestion volumes.

Search & Fuzzy Matching

PostgreSQL pg_trgm extension enabled

Trigram indexes applied selectively to:

Job titles

Company industries

This significantly improved usability when filtering on unstandardized or noisy text fields

Example Query

A representative GTM targeting query pattern:

SELECT *
FROM apollo_contacts
WHERE industry = 'SaaS'
  AND company_region = 'North America'
  AND job_title ILIKE '%marketing%';


This query pattern directly informed composite and trigram index design.

Data Flow Context

This database functioned as a warehouse / staging layer, not a final analytical schema.

Typical downstream flow:

Raw ingestion into this schema

Cleaning and normalization

Enrichment (e.g., email verification)

Loading into downstream databases for analytics and activation

Design decisions reflect this position in the pipeline.

Constraints

Flat schema required for operational simplicity

Must support easy exports for sales and marketing teams

Designed and delivered under real business and stakeholder constraints

These constraints directly influenced schema and indexing choices.

Future Evolution

With relaxed constraints, the schema would evolve toward:

Normalized contact and company entities

Dedicated child tables for communication channels (emails, phones)

Incremental enrichment and deduplication pipelines

Clear separation between raw, cleaned, and analytics-ready layers

A normalized evolution is intentionally deferred, not overlooked.

Summary

This schema reflects practical production engineering, not textbook database design:

Built for scale

Designed under constraint

Optimized for real GTM workflows

Intended to evolve as the system matures

It demonstrates ownership of both technical and business trade-offs in a real data platform.
