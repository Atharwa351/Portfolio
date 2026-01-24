/*
  GTM Ingestion Warehouse — Schema v1

  Data Source:
  Scraped Apollo.io–style GTM/contact datasets.

  Role in System:
  This table serves as the ingestion + warehouse layer for large-scale
  GTM contact data. It is intentionally denormalized to support:
  - High-volume CSV ingestion (~100GB / 120M+ rows)
  - Fast ad-hoc filtering
  - Simple exports for non-technical stakeholders

  IMPORTANT:
  - Column names, order, and types are source-aligned
  - Do NOT normalize or rename without updating upstream ETL/extractors
*/

-- Enables fuzzy matching on noisy, non-standardized text fields
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ================================================================
-- Core ingestion table
-- ================================================================
CREATE TABLE apollo_contacts (
    -- Surrogate key for internal reference only
    id SERIAL PRIMARY KEY,

    -- Contact identity (often partially populated)
    first_name TEXT,
    last_name TEXT,

    -- Role metadata used heavily for GTM targeting
    job_title TEXT,
    sub_role TEXT,

    -- Industry classification as received from source
    industry TEXT,
    industry_2 TEXT,

    -- Raw multi-email field from source CSVs
    -- Preserved to avoid early data loss; validated downstream
    emails TEXT,

    -- Contact communication channels (format varies by source)
    mobile VARCHAR(20),
    phone_number VARCHAR(20),
    linkedin_url TEXT,

    -- Company-level attributes
    company_name TEXT,
    company_industry TEXT,
    company_website TEXT,
    company_linkedin_url TEXT,

    -- Location attributes used for geographic segmentation
    company_locality TEXT,
    company_metro TEXT,
    company_region TEXT,

    -- Address fields (inconsistently populated upstream)
    street_address TEXT,
    address_2 TEXT,
    postal_code TEXT
);

-- ================================================================
-- Indexing Strategy
-- Indexes reflect real downstream GTM filtering patterns
-- ================================================================

-- Frequent filter on job titles for role-based targeting
CREATE INDEX idx_job_title
    ON apollo_contacts (job_title);

-- Primary industry segmentation filter
CREATE INDEX idx_industry
    ON apollo_contacts (industry);

-- Secondary industry field from source
CREATE INDEX idx_industry_2
    ON apollo_contacts (industry_2);

-- Company-level industry targeting
CREATE INDEX idx_company_industry
    ON apollo_contacts (company_industry);

-- Metro-level geographic slicing
CREATE INDEX idx_company_metro
    ON apollo_contacts (company_metro);

-- Region-level geographic slicing
CREATE INDEX idx_company_region
    ON apollo_contacts (company_region);

-- Common GTM export pattern: industry + region
CREATE INDEX idx_industry_region
    ON apollo_contacts (industry, company_region);

-- Role-based targeting within specific company industries
CREATE INDEX idx_jobtitle_company
    ON apollo_contacts (job_title, company_industry);

-- Geographic segmentation at region + metro granularity
CREATE INDEX idx_region_metro
    ON apollo_contacts (company_region, company_metro);

-- ================================================================
-- Fuzzy search support for messy upstream text values
-- ================================================================

-- Supports tolerant matching on inconsistent job titles
CREATE INDEX idx_job_title_trgm
    ON apollo_contacts
    USING gin (job_title gin_trgm_ops);

-- Supports tolerant matching on inconsistent company industries
CREATE INDEX idx_company_industry_trgm
    ON apollo_contacts
    USING gin (company_industry gin_trgm_ops);
