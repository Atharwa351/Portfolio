# Customer Lifetime Value & Expense Forecasting for RevOps

A RevOps-focused Python project to model CLTV, predict customer expenses, and enable data-driven lead prioritization using behavioral segmentation.

---

## Project Objective

This project simulates how a RevOps or GTM (go-to-market) team could:

- Predict **Customer Lifetime Value (CLTV)** from CRM-style data
- Forecast monthly **customer spending behavior**
- Identify high-value customer segments for targeted sales and marketing plays
- Build a lightweight model to support **CAC/LTV ratio optimization**

---

## Business Use Case

In RevOps, aligning GTM efforts to customer profitability is critical. This project:
- Helps **score leads/accounts by lifetime value**
- Surfaces **expense volatility and churn risk**
- Suggests **where to reduce CAC** by eliminating poor-fit segments
- Enables **forecast accuracy improvements** for revenue leadership

---

## Tools & Techniques

| Component | Purpose |
|----------|---------|
| Python (Pandas, NumPy) | Data cleaning, feature engineering |
| Statsmodels, Sklearn | Linear regression modeling |
| Seaborn, Matplotlib | Visual analytics |
| Evaluation | RMSE, MAE, R², Q-Q plot for residuals |

---

## Visual Outputs

 `Graphs/` folder includes:

- ![CLTV Distribution](CLTV%20Distribution.png)  
  *Distribution is long-tailed — top 20% accounts drive most value.*

- ![Income vs CLTV](Income%20vs%20CLTV.png)  
  *Higher income doesn't guarantee higher LTV — behavioral factors matter.*

- ![Actual vs Predicted Expenses](Actual%20vs%20Predicted%20Expenses.png)  
  *R² = 0.15. Indicates high variance in expenses across segments.*

- ![Q-Q Plot](Q-Q%20Plot.png)  
  *Residuals deviate from normality — suggesting model improvement areas.*

---

## Key Metrics Modeled

- **Customer Lifetime Value (CLTV)**
- **Monthly Expense Forecasting**
- **Segment-wise income vs LTV correlation**
- **Model accuracy (RMSE = 6.6k, MAE = 3.9k, R² = 0.15)**

---

## Strategic Insights

- Most value is concentrated in a **small subset of customers** → lead scoring needed.
- Income alone is a weak predictor of LTV → consider multivariate segmentation.
- Expense model R² is modest (0.15) → still helpful for **broad forecasting**, not precision.
- **Low-income, low-expense accounts with high churn risk** should be flagged for deprioritization.

---

## Files

| File | Description |
|------|-------------|
| `cltv_prediction original.xlsx` | Anonymized CRM-style dataset |
| `cltv_model.ipynb` | Feature engineering + regression model |
| `Graphs/` | All visualizations exported from Jupyter |

---

## RevOps Value Add

This model could be integrated into a CRM dashboard (e.g. HubSpot, Salesforce) to:
- Rank leads by **predicted LTV**
- Monitor **forecast deviation** on expense-heavy segments
- Flag **unprofitable CAC-to-LTV channels**
- Support account-based GTM motions

---

🔗 [Back to Portfolio](https://github.com/Atharwa351/Portfolio)
