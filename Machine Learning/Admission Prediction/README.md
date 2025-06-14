# Applicant Decision Prediction – Random Forest with LIME Explainability

📊 *Built a classification model using structured academic data to simulate real-world decision-making systems (e.g. lead scoring, application filtering, or funnel drop-off modeling). The project integrates feature engineering, model tuning, and model explainability using LIME.*

---

### • Tools & Tech Used:
- Python (pandas, NumPy, scikit-learn, matplotlib, plotly, LIME)
- RandomForestClassifier
- GridSearchCV for hyperparameter tuning
- LIME (Local Interpretable Model-agnostic Explanations)

---

### • Business Insight(s) Extracted:
- Identified key academic and profile variables influencing admit decisions  
- Achieved ~82% accuracy with optimally tuned Random Forest model  
- Applied LIME to visualize and explain individual-level predictions  
- Simulated "black-box" auditability for model transparency in decision workflows

---

### • GTM or RevOps Applications:
- 🎯 Lead qualification modeling based on profile scores or behavioral traits  
- 📋 Application or onboarding stage progression prediction  
- 🔍 Deal win/loss prediction using structured pre-close features  
- 💬 Interpretable modeling for CS or marketing analytics with LIME

---

### • Model Performance Snapshot:
Validation Accuracy: 82%
Top Features (via LIME): CGPA, SOP score, Research indicator
After tuning:
→ Precision: 85% | Recall: 80% | F1-Score: 82% (on class 0)
→ Accuracy on train: 89%

---

### • Modeling Pipeline:
1. Cleaned & preprocessed structured applicant data  
2. Normalized inputs using `StandardScaler`  
3. Modeled classification using `RandomForestClassifier`  
4. Performed grid search over:
   - `max_depth`: [3, 4, 5, 6]
   - `n_estimators`: [50, 100, 150, 200]
   - `min_samples_leaf`: [5, 10, 15, 20]
   - `max_features`: [0.6, 0.7, 0.8]
5. Explained results using `lime.lime_tabular.LimeTabularExplainer`

---

### • Visuals & Interpretability:
- Box plots of features (GRE, TOEFL, CGPA, etc.)
- LIME-generated prediction tables per instance  
- Feature importance heatmaps and precision-recall reports

---

## 📁 Folder Structure:
```bash
Admission Prediction/
│
├── admission_rf_lime.ipynb         # Full modeling notebook
├── screenshots/                    # LIME visuals (optional)
└── README.md                       # This file

🔗 Repo Link
🔗 View Full Project on GitHub
