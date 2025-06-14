# Academic CBC Conjoint Analysis – Product Utility Modeling in R

📍 [Project Repo](https://github.com/Atharwa351/Portfolio/tree/main/Financial%20Modelling/Conjoint%20Analysis/Academic_CBC_Project)

This project performs a choice-based conjoint (CBC) analysis using R to estimate customer preferences across speed, capacity, and price attributes. Built on academic survey data, it simulates product utility, importance scores, and shares of preference using max utility and BTL models.

---

## 🔍 Objective

Estimate the importance of product attributes and simulate buyer behavior using choice-based data from a manually constructed CBC survey. Designed to replicate market preference modeling tasks commonly seen in RevOps-driven GTM analysis.

---

## 🛠️ Tools & Packages Used

- R (v4.4+)
- Libraries: `conjoint`, `MASS`, `reshape`, `reshape2`, `dplyr`, `ggplot2`

---

## 🧪 Methodology

- **Data Inputs**:  
  - `profiles.csv`: 8 unique product profiles  
  - `preferences.csv`: Respondent-level profile rankings  
  - `levelnames.csv`: Attribute and level mapping

- **Steps**:  
  - Calculated part-worth utilities via `caPartUtilities()`  
  - Derived attribute importance with `caImportance()`  
  - Simulated top-choice share via max utility model  
  - Estimated choice probability using BTL model

---

## 📈 Key Results

- **Attribute Importance**:  
  - Speed: **68%**  
  - Price: 24%  
  - Capacity: 8%

- **Top-performing Product Profile**:  
  - Profile 3 (Fast, 2 Cups, Cheap) with **57.6% utility share**

- **BTL Probabilities** (Top 3):  
  - Profile 3 → 20.7%  
  - Profile 1 → 19.5%  
  - Profile 4 → 16.6%

---

## 🧠 Business Insight

- Fast speed clearly dominates preference, while capacity has minimal influence.
- Pricing remains a sensitive but secondary attribute—useful for bundling, discounts, or freemium GTM design.
- BTL and utility models help simulate likely uptake for new SKUs.

---

## 🧰 Files Included

| File              | Description                                         |
|-------------------|-----------------------------------------------------|
| `preferences.csv` | Respondent preference data (ranked)                 |
| `profiles.csv`    | Product configurations (speed, capacity, price)     |
| `levelnames.csv`  | Mapping of attribute level names                     |
| `cbc_model.R`     | Full R script with model, output, and visual logic  |

---

## 💼 RevOps Application

> This academic CBC model demonstrates how RevOps teams can simulate product-market fit and forecast SKU preference using quantitative buyer utility modeling.

- Tier/pricing strategy simulation  
- SKU configuration decisions  
- Feature prioritization in product launches

---

## 📌 Related Projects

- [Laptop Conjoint Analysis – GTM Feature Prioritization (Python)](https://github.com/Atharwa351/Portfolio/tree/main/Financial%20Modelling/Conjoint%20Analysis/Laptop_Preference_Case_Study)


