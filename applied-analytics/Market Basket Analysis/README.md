# Market Basket Analysis – Grocery Retail GTM Optimization

### Project Summary  
This project uses **market basket analysis** on transactional retail data (`groceries.csv`) to uncover high-confidence association rules. The objective is to identify product pairings that can optimize **cross-sell strategies**, **store layout**, and **combo promotions** — all core to revenue growth and GTM efficiency.

---

## RevOps & GTM Use Case

This simulation shows how RevOps or commercial strategy teams can use **frequent itemset mining** to:
- Improve **promotional targeting** (e.g., combo pricing)
- Increase **basket size (AOV)** with cross-sell nudges
- Inform **store layout or product tile design** in ecommerce
- Feed insights into **CRM-triggered offers** (milk + yogurt bundle for repeat buyers)

---

## Objective  
- Run Market Basket Analysis using Apriori algorithm  
- Extract itemsets with high **support**, **confidence**, and **lift**  
- Visualize association rules to uncover meaningful product pairings  
- Recommend data-backed bundling strategies

---

## Tools & Techniques
| Tool/Package | Purpose |
|--------------|---------|
| `R` | Programming environment |
| `arules` | Rule mining (Apriori algorithm) |
| `arulesViz` | Rule visualization |
| `ggplot2`, `dplyr` | Visual & data wrangling support |

---

## Key Results

- ✅ Generated **200+ rules** with confidence > 70% and lift > 1.5  
- 🥛 “whole milk” = central hub item, highly associated with bread, yogurt, rolls  
- 🍊 “tropical fruit” → high co-occurrence with citrus and bottled water  
- 💡 Recommended GTM combo: **milk + yogurt + rolls** (high lift + frequency)  

---

## Visuals (in `/visuals` folder)

- `item_frequency.png` → Top-selling items  
- `rules_network.png` → Association network of product combos  
- `lift_vs_support.png` → Performance clustering of rules  

---

## Files

| File | Description |
|------|-------------|
| `groceries.csv` | Anonymized basket data |
| `mba_analysis.R` | Apriori rule generation, filtering, and export |
| `groceryrules1.csv` | Output ruleset |
| `/visuals` | All key PNG visualizations |

---

🔗 [Return to Portfolio](https://github.com/Atharwa351/Portfolio)
