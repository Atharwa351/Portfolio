# 💸 CLTV & Expense Prediction – Behavioral Segmentation Project

## 🎯 Objective
To analyze customer attributes and spending behavior to:
1. Predict **Customer Lifetime Value (CLTV)**
2. Estimate **monthly expenses** using regression models
3. Visualize and interpret the **financial profile of target customer segments**

## 🧠 Business Use Case
- Understand which customers offer high long-term value
- Support **GTM decisions** by identifying profitable segments
- Inform **marketing personalization**, cross-sell, and churn prevention efforts

## 🛠️ Tools & Techniques
- **Language**: Python (Pandas, NumPy, Seaborn, StatsModels)
- **Methods**: Linear regression, Q–Q normalization, data visualization
- **Metrics**: R-squared, RMSE, Distribution plots

## 📊 Visuals (Uploaded in Folder)
- 📈 `CLTV_distribution.png`: Shows skew in customer LTV  
- 🧮 `Income_vs_CLTV.png`: Correlation between income and long-term value  
- 📉 `Actual_vs_Predicted_Expenses.png`: Regression model performance  
- 🔍 `QQ_plot.png`: Normality check for residuals  

## ✅ Key Insights
- Customers with income > ₹X tend to have disproportionately high CLTV.
- Expense prediction model achieved R² of 0.78 (solid fit).
- Outliers in low-income segments skew the CLTV model — further segmentation may be needed.

## 📂 Files
- `expenses_model.ipynb` – Regression logic and results
- `cltv_analysis.ipynb` – EDA and visualization
- `dataset.csv` – Anonymized sample data
- Graphs folder – Key visual outputs

## 📎 Business Relevance
This model could plug directly into a **CRM or RevOps dashboard** to:
- Prioritize leads by LTV
- Optimize budget allocation
- Track actuals vs predicted for forecasting

---

📁 Return to Portfolio: [Main Repository](https://github.com/Atharwa351/Portfolio)
