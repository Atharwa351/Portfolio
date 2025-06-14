# Sales Forecasting – Weekly Store Revenue Time Series

### Objective  
Forecast weekly sales using historical store data to support **inventory planning**, **resource allocation**, and **revenue projection** for upcoming quarters.

---

## RevOps & GTM Use Case  
This project simulates how **RevOps teams** can leverage time-series forecasting to:  
- Align **sales targets** and **operations plans**  
- Prepare for seasonal demand changes  
- Detect holiday spikes and stock buffers  
- Improve accuracy in quarterly GTM campaigns

---

## Tools & Techniques  
- Python (Pandas, Statsmodels, SKlearn metrics)  
- Models: Simple/Triple Exponential Smoothing, ARIMA via `pmdarima`  
- Evaluation metrics: MAE, MAPE, MSE, RMSE  
- Trend & seasonality decomposition (Additive/Multiplicative)

---

## Key Visuals  
Located in `/visuals` folder, including:  
- `sales_trend.png`: Weekly revenue trend line  
- `forecast_vs_actual.png`: Model accuracy  
- `residual_plot.png`: Stationarity and model fit

---

## Output Summary  
- **ARIMA model** achieved MAE=371, MAPE=2.8%, RMSE=440  
- **Seasonal spikes** flagged during holidays; **Q4 buffer of +15%** advised  
- Forecast aligned with trend decomposition, giving confidence in operational plans

---

## Files  
| File | Description |
|------|-------------|
| `Sales_data.xlsx` | Historic weekly store sales data |
| `forecast_model.ipynb` | Time-series decomposition & forecasting pipeline |
| `/visuals/` | Model output visuals |

---

## RevOps Value Add  
> “This model helps RevOps teams predict revenue ahead of time, flagging demand peaks, enabling quota adjustments, and aligning inventory with pipeline forecasts.”

---

🔗 [Return to Portfolio](https://github.com/Atharwa351/Portfolio)
