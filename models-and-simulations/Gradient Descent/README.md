# RevOps Trend Forecasting – Manual Gradient Descent Optimizer

📈 *Forecasted pipeline or revenue growth by manually modeling linear regression using gradient descent. Built to simulate how GTM teams can track and project performance using basic time-series CRM exports.*

---

### • Tools & Tech Used:
- Python (NumPy, matplotlib, statsmodels)
- Jupyter Notebook
- Custom gradient descent implementation
- OLS regression for benchmarking

---

### • Business Insight(s) Extracted:
- Visualized convergence patterns in slope (`a`) and intercept (`b`)
- Demonstrated model improvement via error minimization
- Validated model accuracy using OLS (R² = 0.88)
- Predicted performance trends using limited data

---

### • GTM or RevOps Application:
- Forecasting SQL or revenue growth from CRM snapshots  
- Modeling uplift from campaigns or demand-gen pushes  
- Predictive logic for lead flow, deal size, or funnel health  
- Lightweight analytics for early-stage ops teams with no BI tooling

---

### • Output Summary:
- Gradient Descent → Slope = 0.0636 | Intercept = 7.339
- OLS Regression → Slope = 7.2878 | Intercept = 13.881
- R² = 0.884

  
---

### • Visualizations:
- Error reduction over time for `a` and `b`
- Final predicted line vs. actual values
- OLS regression summary from `statsmodels`

---

### • What I’d Improve Next:
- Add multivariate regression for deeper CRM use cases  
- Simulate real pipeline stages as categorical variables  
- Integrate Power BI or Tableau dashboards for exec visibility  
- Plug into CRM exports (CSV/Excel) for live modeling

---

## 📁 Folder Structure:
```bash
Gradient Descent/
│
├── Gradient_Descent_RevOps.ipynb    # Core model logic + plots
├── screenshots/                     # Output graphs (optional)
└── README.md                        # This file

🔗 Repo Link
🔗 View Full Project on GitHub
