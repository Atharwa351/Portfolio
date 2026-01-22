# 📊 Atharva Malawade — Business & Operations Analytics Portfolio

## TL;DR
I build production-grade decision-support systems across **Revenue, Operations, and Go-To-Market (GTM)**—most often in environments where no usable data infrastructure exists.

This repository documents how messy, real-world business data is converted into usable, decision-driving operating systems.

> This is **not** a collection of toy notebooks, Kaggle experiments, or one-off dashboards.

**Core stack:** SQL · Python · R · Power BI · Tableau · Excel  

**Operating model:**  
Ambiguous problem → structured analysis → clear insight → operational handoff

---

## 🔎 Start Here (2-minute skim)

If you read only three things, read these:

1. **Data Infrastructure & ETL**  
   Production GTM data system built from scratch *(core work)*

2. **Revenue Forecasting & CLTV**  
   Applied forecasting and segmentation tied directly to operating decisions

3. **Dashboards**  
   Tableau & Power BI tools built for decisions, not aesthetics

Each folder includes a short README covering:  
**problem · constraints · approach · business relevance**

---

## 🧭 Executive Snapshot

- Built the company’s first marketing data and storage infrastructure (Python ETL + PostgreSQL) from scratch  
  → no database, pipeline, or storage layer existed beforehand
- Processed **150M+ rows / 50GB+ raw CSV data**, converting idle, decaying datasets into a reusable GTM data foundation
- Determined that only **~25% of legacy data** was viable, directly reshaping:
  - ICP definitions
  - Targeting rules
  - Outbound prioritization
- Shifted marketing from volume-led execution to **query-driven, intent-led execution**, reducing wasted outbound effort and improving qualified lead focus
- Delivered under real constraints:
  - Old hardware  
  - Weak infrastructure  
  - Strict batching limits  
  - Time pressure
- End-to-end owner of the system: **design · implementation · documentation · handoff**
- Led interns to build a controlled frontend access layer, enabling non-technical teams to self-serve while preserving data safety and schema integrity

**Best suited for:** startup and mid-sized environments where ownership, clarity, and execution matter more than tooling buzzwords.

---

## 📦 What This Repository Contains (by design)

This repository combines **production systems** and **applied analytics**, framed for business relevance—not academic completeness.

### Primary Work
- One production-grade **GTM data system (ETL + database)**
- Actively used by Marketing and Lead Generation teams

### Applied Analytics
- Forecasting, BI, modeling, and simulations  
- Framed around **operating decisions**, not model performance

### Strategy & Research *(Supporting)*
- GTM strategy and market analysis projects from MBA coursework  
- Included intentionally to demonstrate analytical reasoning and business framing, **not** production ownership

---

## 🔎 How I Work

- Translate ambiguous business problems into structured analytical questions
- Build data models, dashboards, and pipelines that support real decisions
- Work cross-functionally with Sales, Marketing, and Operations
- Prioritize clarity and usability over technical novelty
- Deliver work designed to be used, not admired

Sales background → analytics optimized for **actionable signals**, not theoretical perfection.

---

## 🧩 Data Infrastructure & ETL — Production System

### Marketing & Lead-Generation Data Platform

**Before:** Fragmented, unused CSV dumps  
**After:** Reusable, queryable GTM data foundation  

**Role:** Sole designer and implementer

### Problem Context
- Large CSV volumes with no queryable structure
- Data 2+ years old → only ~25% realistically usable
- Severe infrastructure constraints required careful batching and validation

### Scale
- ~76M rows (Apollo.io)
- ~100M rows (LinkedIn Navigator)
- ~50GB+ raw CSVs

### Architecture
- Ingest → Validate → Transform → Load → Query

- Batch ingestion capped at 1,000 rows
- Schema normalization for inconsistent third-party data
- Explicit trade-off: **reliability and data integrity over ingestion speed**

### Enablement
- Led interns building a frontend interface
- Enabled GTM teams to self-serve without SQL access
- Enforced controlled access to protect schema and data integrity

### Outcome
- Converted raw dumps into a reusable GTM dataset
- Eliminated CSV-driven workflows
- Reduced wasted outbound effort caused by stale data
- Enabled query-driven execution with improved qualified lead focus
- Established a repeatable GTM data foundation

*(Screenshots included; sanitized schema available.)*

---

## 📈 Revenue & Operations Analytics *(Applied Academic)*

### CLTV & Expense Forecasting
- Top 20% of accounts ≈ 65% of projected CLTV  
- Framed for CAC optimization and prioritization

### Weekly Revenue Forecasting
- ARIMA & Exponential Smoothing  
- Framed for pipeline planning and predictability

---

## 📊 Dashboards

### CRM Account Segmentation — Tableau
- Subsidiaries ≈ 18% of total revenue → ABM focus

### Stock Volatility — Power BI
- Trend shifts and anomaly detection for scenario planning

Dashboards emphasize **decision signals**, not visual polish.

---

## 🧠 Market & Customer Intelligence *(Supporting)*

- **Conjoint Analysis**  
  Survey → analysis → GTM trade-offs  
  Price + RAM explained >70% of preference utility

- **Market Basket Analysis (R)**  
  Cross-sell and bundling insights

---

## 🤖 Machine Learning & Simulation *(Supporting)*

Used to build analytical intuition—not production ML:

- Salary Prediction
- Lead Scoring (82% accuracy)
- Manual Gradient Descent
- MNIST Classification
- Neural Network Revenue Simulation

---

## 📚 Strategy & Research *(Supporting)*

- **Birla Paints** — GTM Strategy (SWOT + Porter)
- **Street Vendor Impact Study** — Urban GTM

---

## 👨‍💼 About Me

**MBA — Data Analytics**  
Experience across Sales, Operations, and Analytics  

**Core strength:** turning messy business reality into structured, executable systems.

---

## 🤝 Let’s Connect

If you’re building data-driven operating systems from imperfect reality  
—and value execution over theory—I’m happy to connect.
