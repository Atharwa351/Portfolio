# 📊 Time Series Forecasting – TCS Stock Price Simulation (ARIMA & Holt-Winters)

🔗 [View Full Project on GitHub](https://github.com/Atharwa351/Portfolio/tree/main/Machine%20Learning/Time%20Series)

> **Built and compared ARIMA and Holt-Winters models to simulate time series forecasting of stock prices. Includes full pipeline: data cleaning, seasonal decomposition, cross-validation, model tuning, and forecast visualization.**

---

### • Tools & Tech Used:
- Python (Pandas, NumPy, Matplotlib, Seaborn)
- `statsmodels` (ARIMA, Holt-Winters)
- `pmdarima` for auto ARIMA tuning
- `TimeSeriesSplit` for rolling validation
- Error metrics: MSE, MAE, MAPE

---

### • Business Insight(s) Extracted:
- Visualized trend, seasonality, and noise with decomposition  
- Validated forecasting accuracy using multi-fold CV  
- Compared Holt-Winters vs ARIMA for 30-day rolling forecasts  

---

### • GTM or RevOps Applications:
- 📆 Forecasting MRR, pipeline, or renewals from historical GTM data  
- 📉 Simulating seasonal trends in sales, lead gen, or ad spend  
- 🎯 Identifying optimal models for time-based decision support  

---

### • Sample Outputs:

```python
# Sample metrics
ARIMA MAPE ≈ 3.8%
Holt-Winters MAPE range: 3.7%–10.6%
30-day forecast plotted on top of real closing prices

Time Series/
│
├── TCS_ARIMA_HoltWinters_Forecasting.ipynb     # Full forecasting pipeline
├── TCS.csv                                      # Raw stock data
└── README.md                                    # This file


---

### 🧩 Portfolio Snippet (for `README.md` in root)

```markdown
### 📈 TCS Stock Forecasting – ARIMA & Holt-Winters

Forecasted 30-day trends using ARIMA and Holt-Winters models. Cross-validated forecasts and simulated seasonal effects on close prices.

- Tools: Python, statsmodels, pmdarima, matplotlib
- GTM Use Case: Forecasting sales, pipeline, or churn over time
- Insight: ARIMA outperformed Holt-Winters with MAPE ≈ 3.8%

🔗 [Project Link](https://github.com/Atharwa351/Portfolio/tree/main/Machine%20Learning/Time%20Series)
