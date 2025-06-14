# Revenue Forecasting with Neural Backpropagation – TensorFlow Regression

⚙️ *Used TensorFlow’s Keras API to build a simple neural network model that predicts continuous output (e.g. revenue or performance trends) using backpropagation. Demonstrates how lightweight neural models can be applied to RevOps forecasting and uplift prediction from structured numeric inputs.*

---

### • Tools & Tech Used:
- Python (NumPy)
- TensorFlow / Keras (Sequential API)
- Dense Layer with Mean Squared Error loss
- Manual data arrays to simulate linear revenue patterns

---

### • Business Insight(s) Extracted:
- Demonstrated how a simple feedforward neural network can fit linear revenue or SQL trends  
- Showed the impact of training duration (epochs) on accuracy of model predictions  
- Simulated forward prediction use cases (e.g., forecasting value at `x = 15`)  

---

### • GTM or RevOps Applications:
- 🔮 Predicting lead conversion revenue based on deal age or pipeline stage  
- 📈 Modeling continuous GTM metrics using small datasets  
- 🧪 Quick simulation of forecast models where data is clean and limited  
- ⚙️ Explaining neural logic to non-technical RevOps stakeholders using visual tools

---

### • Sample Output:
```python
Input: x = [1,2,3,4,5,6,7,10]  
Target: y = [5,8,11,14,17,20,23,32]  
Prediction for x = 15 → y = 24.46  

---

• Architecture:
- Model: Flatten() → Dense(1)
- Optimizer: Adam
- Loss Function: Mean Squared Error
- Epochs: 250

Back Propogation/
│
├── Backprop_TF_Forecasting.ipynb    # Core TensorFlow logic
└── README.md                        # This file

🔗 Repo Link
🔗 View Full Project on GitHub

