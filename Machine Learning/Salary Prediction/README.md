# Salary Prediction – Placement Outcome Modeling 📊

💼 *This project analyzes structured academic, demographic, and employment data to predict post-MBA salary outcomes and placement status using regression and classification models. It demonstrates how data can guide expectations, optimize training pipelines, and support hiring strategies—directly tying into RevOps applications such as talent funnel health and ROI from human capital investments.*

---

### • Tools & Tech Used:
- Python (Pandas, NumPy, Scikit-learn, Statsmodels)
- Models: Linear Regression, OLS, ElasticNet, Random Forest (Regressor & Classifier)
- Model Evaluation: R² Score, Classification Report, GridSearchCV
- Model Explainability: LIME
- Data Viz: Plotly, Seaborn, Matplotlib

---

### • Business Insight(s) Extracted:
- Identified how academic and experiential variables affect salary potential and placement odds
- Demonstrated overfitting in basic regression, resolved using regularization (ElasticNet)
- Extracted key feature importances influencing salary and employability
- Modeled regression vs. classification tradeoffs in salary vs. placement prediction tasks

---

### • GTM or RevOps Applications:
- 🧲 Evaluate placement predictors to inform student profile targeting in education GTM
- 📈 Use regression outcomes to benchmark salary trends or hiring ROI
- 🧪 Simulate hiring filters (e.g. work experience, CGPA) to optimize candidate fit
- 💡 Visualize and explain model decisions using LIME to build stakeholder trust

---

### • Sample Outputs:

**OLS Regression R² Score (Test Set)**: 0.847  
**Logistic Classifier Accuracy**: ~76%  
**Top Predictive Features for Salary (via Random Forest)**:
- Placement Status
- Work Experience
- Specialization (Mkt&Fin > Mkt&HR)

---

📁 Directory:
Salary Prediction/
│
├── salary_prediction_modeling.ipynb # Core regression + classification
├── feature_importance_lime.ipynb # Model explainability with LIME
└── README.md # This file


🔗 [View Full Project on GitHub](https://github.com/Atharwa351/Portfolio/tree/main/Machine%20Learning/Salary%20Prediction)
