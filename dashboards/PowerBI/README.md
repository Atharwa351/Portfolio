#  TCS Price Movement Dashboard – Power BI RevOps Simulation

**Objective**  
Visualize and analyze TCS stock trends to simulate real-world Revenue Operations scenarios like forecasting pipeline movement, volume trends, and campaign timing using Power BI.

---

##  Business Use Case

This dashboard emulates how RevOps or Sales Strategy teams might track high-frequency financial or deal-level metrics to:

- Spot market-driven demand shifts
- Model revenue projections based on trend lines
- Align marketing/stocking decisions with seasonality
- Monitor anomalies (e.g., holiday spikes or low-volume days)

---

##  Tools & Techniques

- **Tool**: Microsoft Power BI (Desktop)
- **Data**: Historical stock price data from NSE – TCS Equity
- **Metrics Created**:
  - Daily % Change
  - 7-Day and 30-Day Moving Averages
  - High-volume trading days
- **Visuals Used**:
  - Line Charts (Close Rate & SMAs)
  - Clustered Bar (Volume)
  - Line + Bar Combo (Daily % Change + Volume)
  - Card KPIs (Max Volume, Avg Daily Change, Max Close Rate)
  - Date Slicer for dynamic filtering

---

##  Visual Breakdown

| Visual                        | Purpose                                                                 |
|------------------------------|-------------------------------------------------------------------------|
| **Line Chart – Close Rate**  | Track stock performance over time                                       |
| **Line Chart – SMAs**        | Compare short-term vs long-term movement                                |
| **Bar Chart – Volume**       | Identify trading activity levels                                        |
| **Combo Chart**              | Spot volume surges aligned with sharp price changes                     |
| **KPI Cards**                | Highlight actionable metrics like volatility and high-activity days     |
| **Date Slicer**              | Allows date filtering for trend exploration and dynamic reporting       |

---

##  Dashboard Preview

> *(Add screenshot here once saved as PNG)*  
> `./dashboard_preview.png`

---

##  Folder Contents

| File Name                    | Description                                        |
|-----------------------------|----------------------------------------------------|
| `TCS_PriceDashboard.pbix`   | Full Power BI dashboard file                       |
| `TCS_Data.xlsx`             | Cleaned dataset with calculated fields             |
| `dashboard_preview.png`     | Image of the final Power BI dashboard              |
| `README.md`                 | This documentation                                 |

---

##  RevOps Application

“This dashboard is a blueprint for revenue teams to visualize historical trends, spot seasonality, and proactively align GTM actions with anticipated spikes or drops — be it in sales, renewals, or lead engagement.”

---

##  Return to Portfolio

[Back to Main Portfolio](https://github.com/Atharwa351/Portfolio)
