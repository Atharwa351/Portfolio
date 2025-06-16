# Time Series Forecasting – TCS Stock Price Simulation (ARIMA & Holt-Winters)

A GTM-aligned time series modeling project using ARIMA and Holt-Winters to simulate sales-like stock trends, aimed at enabling RevOps teams to forecast pipeline and seasonal revenue flows.

## Project Objective

This project demonstrates how a Revenue Operations or GTM team can:

- Forecast future performance using historical time series data
- Compare forecasting models for accuracy and stability
- Identify seasonal and trend-based shifts in revenue behavior
- Improve planning for campaigns, renewals, and sales targeting

## Business Use Case

For RevOps teams, accurate forecasting of MRR or pipeline velocity is mission-critical. This project:

- Simulates 30-day rolling forecasts of TCS stock data
- Tests models for overfitting, accuracy, and volatility handling
- Offers a strategic tool for quarterly planning or campaign timing
- Helps identify which forecasting technique performs better under seasonal pressure

## Tools & Techniques

| Component        | Purpose                              |
|------------------|--------------------------------------|
| Python (Pandas, NumPy)  | Data cleaning, transformation   |
| Statsmodels, pmdarima   | Time series modeling (ARIMA, Holt-Winters) |
| Matplotlib, Seaborn     | Visualization and seasonal decomposition |
| TimeSeriesSplit         | Rolling cross-validation |
| Metrics: MSE, MAE, MAPE | Model evaluation and comparison |

## Visual Outputs

**Graphs/** folder includes:

- **Seasonal Decomposition**
  Identifies clear seasonality and trend signals in closing prices.
  
- **Forecast vs Actuals**
  Visualizes model accuracy across 30-day windows.

- **Error Analysis**
  MAPE of ~3.8% on ARIMA suggests strong generalization.

## Key Metrics Modeled

- 30-day forecast for stock closing price
- Multi-model comparison: Holt-Winters vs ARIMA
- Evaluation using: MAPE, MAE, MSE, rolling splits

## Strategic Insights

- ARIMA models provided tighter forecasts (MAPE ≈ 3.8%)
- Holt-Winters was more volatile in presence of sudden trends
- Cross-validation helped identify model drift
- Seasonal components suggest when GTM teams should avoid campaigns

## Files

| File                               | Description                            |
|------------------------------------|----------------------------------------|
| TCS_ARIMA_HoltWinters_Forecasting.ipynb | Full pipeline: preprocessing → model tuning → evaluation |
| TCS.csv                            | Raw stock data                         |
| Graphs/                            | Forecast and decomposition plots       |
| README.md                          | This file                              |

## RevOps Value Add

This modeling pipeline can be used to:

- Forecast MRR, renewals, or churn using historical GTM or revenue data
- Schedule campaigns around seasonal demand spikes
- Build sanity-checks into pipeline or ad-spend forecasting dashboards
- Strengthen revenue planning with proven statistical methods

🔗 [Back to Portfolio](https://github.com/Atharwa351/Portfolio)
"""
