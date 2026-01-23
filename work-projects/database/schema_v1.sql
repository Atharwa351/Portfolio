CREATE TABLE apollo_contacts (
    id SERIAL PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    job_title TEXT,
    sub_role TEXT,
    industry TEXT,
    industry_2 TEXT,
    emails TEXT,                
    mobile VARCHAR(20),
    phone_number VARCHAR(20),
    linkedin_url TEXT,
    company_name TEXT,
    company_industry TEXT,
    company_website TEXT,
    company_linkedin_url TEXT,
    company_locality TEXT,
    company_metro TEXT,
    company_region TEXT,
    street_address TEXT,
    address_2 TEXT,
    postal_code TEXT

);-- Enable trigram extension for fuzzy search (optional but recommended)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Single-column indexes
CREATE INDEX idx_job_title        ON apollo_contacts(job_title);
CREATE INDEX idx_industry         ON apollo_contacts(industry);
CREATE INDEX idx_industry_2       ON apollo_contacts(industry_2);
CREATE INDEX idx_company_industry ON apollo_contacts(company_industry);
CREATE INDEX idx_company_metro    ON apollo_contacts(company_metro);
CREATE INDEX idx_company_region   ON apollo_contacts(company_region);

-- Composite indexes for common query patterns
CREATE INDEX idx_industry_region       ON apollo_contacts(industry, company_region);
CREATE INDEX idx_jobtitle_company      ON apollo_contacts(job_title, company_industry);
CREATE INDEX idx_region_metro          ON apollo_contacts(company_region, company_metro);

-- Optional: fuzzy/trigram indexes for search tolerance on messy data
CREATE INDEX idx_job_title_trgm        ON apollo_contacts USING gin (job_title gin_trgm_ops);
CREATE INDEX idx_company_industry_trgm ON apollo_contacts USING gin (company_industry gin_trgm_ops);

