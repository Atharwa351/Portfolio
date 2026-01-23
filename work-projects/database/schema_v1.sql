/*
  GTM Ingestion Warehouse — Schema v1

  Source:
  Scraped contact data from Apollo.io–style datasets.

  Purpose:
  Ingestion and staging layer for large-scale GTM contact data.
  Designed to support high-volume CSV ingestion, flexible filtering,
  and downstream enrichment under real operational constraints.

  IMPORTANT:
  - Column names, order, and types are source-aligned
  - This schema is intentionally denormalized
  - Do NOT modify without updating upstream extractors and ETL
*/

CREATE TABLE apollo_contacts (
    id SERIAL PRIMARY KEY,

    -- Contact identity
    first_name TEXT,
    last_name TEXT,

    -- Role / positioning
    job_title TEXT,
    sub_role TEXT,

    -- Industry classification from source
    industry TEXT,
    industry_2 TEXT,

    -- Raw multi-email field from source CSVs
    -- Preserved to avoid early data loss; validated downstream
    emails TEXT,

    -- Contact channels
    mobile VARCHAR(20),
    phone_number VARCHAR(20),
    linkedin_url TEXT,

    -- Company attributes
    company_name TEXT,
    company_industry TEXT,
    company_website TEXT,
    company_linkedin_url TEXT,

    -- Location attributes
    company_locality TEXT,
    company_metro TEXT,
    company_region TEXT,

    -- Address fields (inconsistently populated upstream)
    street_address TEXT,
    address_2 TEXT,
    postal_code TEXT
);

-- Enable trigram extension for fuzzy search on non-standardized text
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ------------------------------------------------------------------
-- Indexing strategy
-- Indexes reflect downstream GTM targeting and export patterns
-- ------------------------------------------------------------------

-- Single-column indexes for high-selectivity filters
CREATE INDEX idx_job_title
    ON apollo_contacts (job_title);

CREATE INDEX idx_industry
    ON apollo_contacts (industry);

CREATE INDEX idx_industry_2
    ON apollo_contacts (industry_2);

CREATE INDEX idx_company_industry
    ON apollo_contacts (company_industry);

CREATE INDEX idx_company_metro
    ON apollo_contacts (company_metro);

CREATE INDEX idx_company_region
    ON apollo_contacts (company_region);

-- Composite indexes for common GTM segmentation patterns
CREATE INDEX idx_industry_region
    ON apollo_contacts (industry, company_region);

CREATE INDEX idx_jobtitle_company
    ON apollo_contacts (job_title, company_industry);

CREATE INDEX idx_region_metro
    ON apollo_contacts (company_region, company_metro);

-- ------------------------------------------------------------------
-- Fuzzy search support for messy upstream text values
-- ------------------------------------------------------------------

CREATE INDEX idx_job_title_trgm
    ON apollo_contacts
    USING gin (job_title gin_trgm_ops);

CREATE INDEX idx_company_industry_trgm
    ON apollo_contacts
    USING gin (company_industry gin_trgm_ops);
