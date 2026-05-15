# 🛡️ SMS Threat Detector

An AI-powered cybersecurity web application that detects Spam, Phishing, and malicious SMS messages using Machine Learning and NLP.

Built with:

* Next.js
* FastAPI
* Scikit-learn
* TF-IDF Vectorization
* Naive Bayes Classification
* Framer Motion
* Tailwind CSS

---

# 🚀 Live Demo

## Frontend

```bash
https://sms-threat-detector.vercel.app/
```

## Backend API

````ba

---

# ✨ Features

- 🔍 Real-time SMS threat analysis
- 🤖 Machine Learning powered detection
- 🛡️ Spam & phishing classification
- 📊 Confidence score generation
- ⚠️ Suspicious keyword detection
- 🌐 URL and risk factor analysis
- 🎨 Modern cybersecurity-themed UI
- ⚡ Fast API-based architecture
- 📱 Responsive design
- ☁️ Fully deployed online

---

# 🧠 Machine Learning Workflow

## Dataset
The model was trained using the SMS Spam Collection Dataset.

## NLP Pipeline
1. Text preprocessing
2. Lowercasing
3. Tokenization
4. Stopword removal
5. Stemming
6. TF-IDF Vectorization
7. Model training

## Model Used
- Multinomial Naive Bayes

## Additional Threat Logic
Custom phishing and spam keyword detection was added to enhance explainability and risk assessment.

---

# 🏗️ Project Architecture

```bash
Frontend (Next.js)
        ↓
FastAPI Backend
        ↓
TF-IDF Vectorizer
        ↓
Naive Bayes ML Model
        ↓
Threat Analysis Engine
````

---

# 🖥️ Tech Stack

## Frontend

* Next.js
* React
* Tailwind CSS
* Framer Motion
* TypeScript
* Lucide React

## Backend

* FastAPI
* Python
* Scikit-learn
* Pandas
* NumPy
* NLTK

## Deployment

* Vercel (Frontend)
* Render (Backend)

---

# 📂 Project Structure

```bash
sms-threat-detector/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── public/
│   └── ...
│
├── backend/
│   ├── main.py
│   ├── spam_model.pkl
│   ├── vectorizer.pkl
│   ├── requirements.txt
│   └── ...
│
└── README.md
```

---

# ⚙️ Local Setup

## 1. Clone Repository

```bash
git clone https://github.com/IndianBone/sms-threat-detector.git
cd sms-threat-detector
```

---

## 2. Backend Setup

```bash
cd backend

python -m venv .venv

# Windows
.venv\Scripts\activate

pip install -r requirements.txt

uvicorn main:app --reload
```

Backend runs on:

```bash
http://localhost:8000
```

---

## 3. Frontend Setup

```bash
cd frontend

npm install
npm run dev
```

Frontend runs on:

```bash
http://localhost:3000
```

---

# 📡 API Endpoint

## Predict Message

```bash
GET /predict?message=your_message_here
```

### Example

```bash
https://sms-threat-detector.onrender.com/predict?message=win%20free%20money
```

### Sample Response

```json
{
  "message": "win free money",
  "prediction": "Spam",
  "confidence": 97.2,
  "keywords": ["win", "free"],
  "risk_factors": ["Contains URL"]
}
```

---

# 🧪 Sample Test Messages

## Safe

```text
Hey bro, are we still meeting tomorrow?
```

## Spam

```text
Congratulations! You have won a FREE shopping voucher worth $500. Claim now!!!
```

## Phishing

```text
URGENT: Your bank account has been suspended. Verify immediately at http://fake-bank.com
```

---

# 📈 Future Improvements

* BERT-based NLP model
* Multi-language SMS detection
* User authentication
* Dashboard analytics
* Database integration
* Mobile app version
* Real-time monitoring
* Email threat detection

---

# 👨‍💻 Author

## Aditya Tripathi

VIT Chennai

GitHub:

```bash
https://github.com/IndianBone
```

---

# 📜 License

This project is developed for educational and portfolio purposes.
