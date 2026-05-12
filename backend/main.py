from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pickle
import re

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and vectorizer
model = pickle.load(open('spam_model.pkl', 'rb'))
vectorizer = pickle.load(open('vectorizer.pkl', 'rb'))


# Keyword lists
phishing_keywords = [
    "verify",
    "bank",
    "account",
    "login",
    "otp",
    "click",
    "password",
    "suspended"
]

spam_keywords = [
    "win",
    "free",
    "prize",
    "lottery",
    "reward",
    "congratulations",
    "offer"
]


@app.get("/")
def home():
    return {"message": "SMS Spam Detection API Running"}


@app.get("/predict")
def predict(message: str):

    # Transform message
    transformed_message = vectorizer.transform([message])

    # Prediction
    prediction = model.predict(transformed_message)[0]

    # Confidence score
    probability = model.predict_proba(transformed_message)[0]

    confidence = round(max(probability) * 100, 2)

    # Lowercase message for keyword matching
    lower_msg = message.lower()

    detected_keywords = []
    risk_factors = []

    # Detect phishing keywords
    for word in phishing_keywords:
        if word in lower_msg:
            detected_keywords.append(word)

    # Detect spam keywords
    for word in spam_keywords:
        if word in lower_msg:
            detected_keywords.append(word)

    # Detect URL
    if re.search(r"http|www|https", lower_msg):
        risk_factors.append("Contains URL")

    # Detect excessive punctuation
    if "!!!" in message:
        risk_factors.append("Multiple exclamation marks")

    # Detect currency symbols
    if "$" in message or "₹" in message:
        risk_factors.append("Contains currency symbols")

    # Final threat classification
    if prediction == 0:
        threat_type = "Safe"

    else:
        phishing_found = any(
            word in lower_msg for word in phishing_keywords
        )

        if phishing_found:
            threat_type = "Phishing"
        else:
            threat_type = "Spam"

    return {
        "message": message,
        "prediction": threat_type,
        "confidence": confidence,
        "keywords": detected_keywords,
        "risk_factors": risk_factors
    }