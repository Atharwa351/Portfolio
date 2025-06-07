# 🛒 Market Basket Analysis – Grocery Retail Optimization

## 🎯 Objective
To uncover frequent itemsets and high-confidence association rules from retail basket data (`groceries.csv`) using Market Basket Analysis. This simulation helps optimize **cross-sell strategies**, **store layout**, and **promotional bundling**.

## 🧠 Business Use Case
- Improve **product placement** based on item pairings
- Drive **basket size growth** via targeted offers
- Inform GTM promotions and combo pricing

## 🛠️ Tools & Techniques
- R (arules, arulesViz)
- Apriori algorithm
- Support, confidence, lift thresholds
- Association rule visualization

## 📊 Key Visuals
📂 Inside `/visuals/` folder:
- `item_frequency.png` → Top-selling items  
- `rules_network.png` → Network graph of item pairings  
- `lift_vs_support.png` → Performance of generated rules  

## 📈 Output Summary
- Generated **200+ rules** with confidence >70% and lift >1.5
- Key cross-sell findings:
  - `"whole milk"` is a hub product → pairs with yogurt, bread, rolls
  - `"tropical fruit"` frequently co-occurs with `"citrus fruit"` and `"bottled water"`
- Suggested promo: **milk + yogurt + rolls combo**

## 📂 Files
- `groceries.csv` — Basket data (anonymized)
- `mba_analysis.R` — Apriori implementation


## ✅ Results
This model could support a RevOps or retail team by:
- Structuring combo deals to increase AOV
- Powering a **smart recommendation engine**
- Optimizing physical shelf layout or online product tiles

---

📁 [Back to Portfolio](https://github.com/Atharwa351/Portfolio)
