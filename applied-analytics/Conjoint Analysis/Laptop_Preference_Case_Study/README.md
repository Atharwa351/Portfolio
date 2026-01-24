# Conjoint Analysis – Laptop Preference GTM Strategy Simulation

### Project Summary
This self-run, end-to-end project uses **choice-based conjoint analysis** to simulate product-market fit for three laptop configurations. By analyzing user preferences collected through a structured survey, the project models attribute importance and predicts preference scores to support **feature bundling**, **pricing strategy**, and **SKU optimization** in a GTM context.

---

## Objective

- Quantify customer preference tradeoffs between features like RAM, processor, battery life, screen size, and price
- Predict customer preference scores for alternative SKU configurations
- Identify dominant product attributes using regression, ensemble learning, and feature selection
- Provide GTM teams with data to align **product design**, **price tiers**, and **launch strategy**

---

## Business Use Case (RevOps + GTM)

This project simulates a scenario where **RevOps analysts** and **GTM teams** collaborate to:
- Choose winning configurations for a new product launch
- Quantify **price sensitivity vs feature value**
- Design **SKU bundles** based on user utility data
- Feed insight into **forecasting models** for better SKU-level sales prediction

---

## Methodology

 **Primary Data Collection**: Custom-designed preference survey using feature-rating questions (e.g., “Most important attribute when buying a laptop?”)
- **Conjoint-style Modeling**: Regressed preference scores using:
  - Linear Regression
  - Lasso / Ridge Regularization
  - Random Forest Regressor
  - Polynomial Expansion + CV
  - **Data Cleaning**: One-hot encoding, Isolation Forest for outlier removal
-  **Model Diagnostics**: MAE, RMSE, R², cross-validation

---

##  Tools Used

| Tool | Purpose |
|------|---------|
| Python (Pandas, NumPy) | Data wrangling |
| Scikit-learn | Regression, model selection, CV |
| Seaborn / Matplotlib | Visualizations |
| IsolationForest | Outlier detection |
| PolynomialFeatures | Model complexity tuning |

---

##  Key Visuals

- `Top ten features.png` – Feature importances via Random Forest  
- `Residuals.png` – Distribution of model errors (Ridge)  
- Simulated prediction scores for alternate SKUs

<p float="left">
  <img src="Top ten features.png" width="420"/>
  <img src="Residuals.png" width="420"/>
</p>

---

##  Key Results

- **Top Attributes**: Price (32.6%), RAM (20.3%), Storage (17.6%)
- **Ideal SKU**: i5 processor, 8GB RAM, 512GB SSD, 15” screen, ₹50–75k
- **High-end Configs**: Show diminishing returns in utility at ₹1L+
- **Outlier Filtering**: Improved model MAE by ~15% using Isolation Forest

---

## File Structure

| File | Description |
|------|-------------|
| `Laptop Preference Survey.csv` | Raw self-collected survey data |
| `laptop_conjoint_analysis.ipynb` | Full notebook including modeling and CV |
| `Top ten features.png` | Feature importances chart |
| `Residuals.png` | Residual error distribution |

---

## RevOps Value Add

- Helps **RevOps or Product Ops** teams quantify feature-level ROI
- Enables **data-driven GTM targeting** before launch
- Supports **forecasting**, **SKU rationalization**, and **pricing tier validation**
- Demonstrates real-world application of **customer preference modeling** in commercial decisions

---

🔗 [Return to Portfolio](https://github.com/Atharwa351/Portfolio)
