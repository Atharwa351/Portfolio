## Database Schema – v1 (Ingestion Warehouse)

### Purpose
This schema represents the initial ingestion and warehouse layer of a GTM data platform.
It was designed to prioritize resilient bulk ingestion, flexible filtering, and downstream processing over strict normalization.

### Key Constraints
- Single-table structure was a business requirement to simplify exports and usage by non-technical teams
- Source data arrived as large, inconsistent CSV files
- Schema needed to tolerate incomplete and messy fields without ingestion failures

### Design Decisions
- Wide denormalized table to preserve raw source structure
- Multi-value email field retained to avoid early data loss
- Indexes optimized for common GTM targeting dimensions (role, industry, geography)
- Trigram indexes enabled to support fuzzy matching on unstandardized text fields

### Data Flow Context
This database served as a warehouse/staging layer.
Data was later cleaned, enriched, validated (e.g., email verification), and loaded into downstream systems.

### Future Evolution
With relaxed constraints, this schema would evolve toward:
- Normalized contact and company entities
- Dedicated child tables for communication channels
- Incremental enrichment and deduplication pipelines
