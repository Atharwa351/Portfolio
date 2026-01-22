📊 Atharva Malawade — Business & Operations Analytics Portfolio
A business-first analytics portfolio demonstrating how I design and execute decision-support systems across Revenue, Operations, and Go-To-Market (GTM) functions using:
SQL · Python · R · Power BI · Tableau · Excel
I work as an individual contributor at the intersection of business context and data, following a repeatable operating model:
Ambiguous problem → structured analysis → clear insight → operational handoff
🧭 TL;DR — Why this portfolio matters
Built one real production data system (Python ETL + PostgreSQL) processing 150M+ rows / 50GB+ CSV data, actively used by GTM teams
Converted unused, decaying CSV dumps into a usable marketing dataset (only ~25% salvageable due to data age), directly shaping targeting strategy and preventing wasted outbound effort
Designed and shipped under real constraints: old hardware, weak infrastructure, strict batching limits, and time pressure
Academic analytics projects are included intentionally to demonstrate business framing, forecasting, and BI fundamentals
Background across Sales, Operations, and Analytics informs how I prioritize signal over theory
Best suited for startup and mid-sized environments where ownership, clarity, and execution matter more than tooling buzzwords
📌 What this repository contains (by design)
This portfolio includes both production work and academic projects, each clearly labeled and framed for business relevance.
Included
Primary work
1 production-grade data system (ETL + database) used by Marketing & Lead Generation teams
Applied academic analytics
Forecasting, BI, modeling, and simulations
Strategy & research
MBA coursework focused on GTM and market analysis
Academic projects are included to demonstrate
Analytical structuring and reasoning
Business framing of ambiguous problems
Forecasting and modeling fundamentals
Clear communication of insights (not just code)
🎯 Target roles
Business Analyst · BizOps · RevOps · Strategy / Operations Analyst
Best suited for startup and mid-sized company environments
Explicitly not targeting
ML research roles
Tooling-first data positions
Enterprise-only reporting roles disconnected from operating decisions
🔎 What I do in practice
Translate ambiguous business problems into structured analytical questions
Build data models, dashboards, and pipelines that support operating decisions
Work cross-functionally with Sales, Marketing, and Operations
Prioritize clarity, usability, and business impact over tool complexity
Own work end-to-end as an IC — from framing to delivery and handoff
My sales experience directly informs my analytics:
I optimize for actionable signals, not theoretically perfect models.
🔍 Core focus areas
Revenue & Operations Analytics
Forecasting & Performance Tracking
GTM & Funnel Intelligence
Customer & Account Segmentation
Decision-oriented Dashboards
SQL-driven analysis & data modeling
🚀 How to navigate this repository (recommended)
If you’re short on time, start here:
Data Infrastructure & ETL (Production Work)
Revenue Forecasting & CLTV Modeling
BI Dashboards (Tableau / Power BI)
Each folder contains its own README explaining:
Problem framing
Constraints
Approach
Business relevance
🧩 Data Infrastructure & ETL — Primary / Production Work
Marketing & Lead-Generation Data Platform
(Real work project)
Designed and built a production-grade data pipeline that evolved from a PoC into an internal system used by Marketing and Lead Generation teams.
Role: Sole designer and implementer
Context: Built alongside core sales responsibilities, under time and infrastructure constraints, then handed off for ongoing use
Problem context
Large volumes of unused CSV data sitting idle
Data was 2+ years old, making only ~25% realistically usable for current GTM efforts
Infrastructure was old and resource-constrained, requiring careful batching and validation
Scale
~76M rows (Apollo.io data)
~100M rows (LinkedIn Navigator data)
~50GB+ raw CSVs
Stack
PostgreSQL
Custom Python ETL scripts
Architecture
Ingest → Validate → Transform → Load → Query
Batch ingestion capped at 1,000 rows per batch to avoid memory and system failures
Schema normalization and validation for inconsistent third-party CSV formats
Designed for reliability over speed given infrastructure constraints
Usage
Segmentation
Targeting
Outbound planning
Outcome
Converted fragmented CSV dumps into a queryable marketing dataset
Revealed that only ~25% of records were viable, directly shaping GTM targeting decisions
Eliminated manual, CSV-heavy workflows
Enabled fast, SQL-driven segmentation
Supported repeatable GTM execution across teams
Design patterns and validation logic were built to be reusable across future data sources.
(Sanitized schema and pipeline overview to be added.)
📈 Revenue & Operations Analytics — Primary / Applied Academic
CLTV & Expense Forecasting — Behavioral Segmentation
Built CLTV and spend models on CRM-style datasets to identify high-impact account segments
Key insight: Top 20% of accounts contributed ~65% of projected CLTV
Business framing: Account prioritization, CAC optimization, GTM focus
Context: Applied academic project demonstrating business-driven modeling
Weekly Revenue Forecasting
Short-horizon revenue forecasts using ARIMA and Exponential Smoothing
Key insight: Seasonality and volatility patterns impacting Q4 performance
Business framing: Pipeline planning, campaign cadence, revenue predictability
Context: Forecasting and planning simulation
📊 Business Intelligence & Dashboards — Primary
CRM Account Segmentation — Tableau
Segmented accounts by geography, industry, and revenue contribution
Insight: Subsidiaries accounted for ~18% of total revenue
Business framing: ABM targeting, account prioritization, GTM planning
Stock Volatility Dashboard — Power BI
Tracked trend shifts and anomalies using moving averages and volatility metrics
Business framing: Performance monitoring, scenario planning, leadership review
Dashboards emphasize decision cues over visual polish.
🧠 Market & Customer Intelligence — Applied / Academic
Conjoint Analysis — GTM Feature Prioritization
Pricing & feature trade-offs (Price + RAM >70% utility)
Market Basket Analysis — Retail Promotions (R)
Cross-sell and bundling insights
🤖 Machine Learning & Simulation — Supporting Work
Baseline modeling projects focused on analytical reasoning, not production ML:
Salary Prediction — Placement Modeling
Admission Prediction — Lead Scoring Simulation (82% accuracy)
Gradient Descent — Manual Regression Simulation
MNIST Classification — Intent Routing Simulation
Neural Net Forecasting — Revenue Simulation
Purpose: Understand drivers, trade-offs, and predictive signals in business data.
📚 Strategy & Research
Birla Paints — GTM Strategy Whitepaper
SWOT + Porter’s Five Forces analysis
Street Vendor Impact Study — Urban GTM
Field survey and economic impact research
🏅 Certifications
Data Governance — Coursera
Globo Persona — Internship Certificate
👨‍💼 About me
🎓 MBA — Data Analytics, Garden City University
💼 Experience across Sales, Operations, and Analytics
⚙️ Stack: SQL · Python · R · Power BI · Tableau · Excel
Strength: Translating business context into structured, actionable analytical execution.
🔗 Links
LinkedIn: (add link)
Resume: (add link)
🤝 Let’s connect
If you’re building data-driven operating systems and value analytical thinking grounded in real business execution, I’d be glad to connect.
