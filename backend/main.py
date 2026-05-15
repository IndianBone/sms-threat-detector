from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import joblib
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

# Load lightweight ML model
MODEL_PATH = "model"

model = joblib.load(f"{MODEL_PATH}/svm_model.pkl")

vectorizer = joblib.load(f"{MODEL_PATH}/vectorizer.pkl")

label_encoder = joblib.load(f"{MODEL_PATH}/label_encoder.pkl")


# Keyword lists
phishing_keywords = [
    "verify",
    "bank",
    "account",
    "login",
    "otp",
    "click",
    "password",
    "suspended",
    "kyc",
    "aadhaar"
]

spam_keywords = [
    "win",
    "free",
    "prize",
    "lottery",
    "reward",
    "congratulations",
    "offer",
    "discount"
]


# Strong gibberish detector
def is_gibberish(text):

    text = text.lower().strip()

    compact = re.sub(r'[^a-z]', '', text)

    if not compact:
        return True

    if len(compact) >= 6 and len(text.split()) == 1:

        vowels = sum(c in "aeiou" for c in compact)

        vowel_ratio = vowels / len(compact)

        if vowel_ratio < 0.35:
            return True

        if re.search(r'[bcdfghjklmnpqrstvwxyz]{5,}', compact):
            return True

    if re.fullmatch(r'[@#$%^&*()!]{3,}', text):
        return True

    return False


@app.get("/")
def home():
    return {"message": "AI SMS Threat Detection API Running"}


@app.get("/predict")
def predict(message: str):

    lower_msg = message.lower()

    # Gibberish detection
    if is_gibberish(message):
        return {
            "message": message,
            "prediction": "Suspicious",
            "confidence": 99.0,
            "risk_level": "High",
            "keywords": [],
            "risk_factors": ["Possible gibberish text"]
        }

    # Transform input
    transformed = vectorizer.transform([message])

    # Predict
    pred = model.predict(transformed)[0]

    label = label_encoder.inverse_transform([pred])[0]

    # Convert ham → safe
    if label == "ham":
        label = "safe"

    # Safe chat override
    safe_words = [
        "hello",
        "hi",
        "hey",
        "bro",
        "okay",
        "thanks",
        "thank you"
    ]

    if any(word in lower_msg for word in safe_words):
        label = "safe"

    # Approximate confidence
    confidence = 95.0

    # OTP scam override
    otp_keywords = [
        "otp",
        "verification code",
        "share code",
        "one time password",
        "verify otp"
    ]

    if any(k in lower_msg for k in otp_keywords):
        label = "otp_scam"

    # Promotional spam override
    promo_keywords = [
        "buy 1 get 1",
        "limited offer",
        "free",
        "discount",
        "offer",
        "prize",
        "lottery",
        "reward"
    ]

    if any(k in lower_msg for k in promo_keywords):
        label = "promotional_spam"

    # Job scam override
    job_keywords = [
        "earn daily",
        "work from home",
        "telegram",
        "telegram job",
        "part-time job",
        "daily income",
        "rating hotels"
    ]

    if any(k in lower_msg for k in job_keywords):
        label = "job_scam"

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

    # Detect urgency language
    urgency_words = [
        "urgent",
        "immediately",
        "now",
        "asap",
        "suspended"
    ]

    if any(word in lower_msg for word in urgency_words):
        risk_factors.append("Urgent language detected")

    # Risk level
    if confidence >= 90:
        risk_level = "High"

    elif confidence >= 70:
        risk_level = "Medium"

    else:
        risk_level = "Low"

    return {
        "message": message,
        "prediction": label.replace("_", " ").title(),
        "confidence": confidence,
        "risk_level": risk_level,
        "keywords": detected_keywords,
        "risk_factors": risk_factors
    }