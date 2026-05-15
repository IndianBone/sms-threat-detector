from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification
)

import torch
torch.set_grad_enabled(False)

import torch.nn.functional as F

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

# Model path
MODEL_PATH = "model"

# Lazy loading variables
tokenizer = None
model = None
label_encoder = None


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

    # Empty after cleanup
    if not compact:
        return True

    # Random single-word strings
    if len(compact) >= 6 and len(text.split()) == 1:

        vowels = sum(c in "aeiou" for c in compact)

        vowel_ratio = vowels / len(compact)

        # Too few vowels
        if vowel_ratio < 0.35:
            return True

        # Too many consonants together
        if re.search(r'[bcdfghjklmnpqrstvwxyz]{5,}', compact):
            return True

    # Random symbols spam
    if re.fullmatch(r'[@#$%^&*()!]{3,}', text):
        return True

    return False


# Lazy model loader
def load_model():

    global tokenizer
    global model
    global label_encoder

    if tokenizer is None:

        tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)

        model = AutoModelForSequenceClassification.from_pretrained(
            MODEL_PATH,
            low_cpu_mem_usage=True
        )

        label_encoder = joblib.load(f"{MODEL_PATH}/label_encoder.pkl")

        model.eval()


@app.get("/")
def home():
    return {"message": "AI SMS Threat Detection API Running"}


@app.get("/predict")
def predict(message: str):

    # Load model only when needed
    load_model()

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

    # Tokenize
    inputs = tokenizer(
        message,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=64
    )

    # Predict
    with torch.no_grad():
        outputs = model(**inputs)

    probs = F.softmax(outputs.logits, dim=1)

    confidence, pred = torch.max(probs, dim=1)

    confidence = round(confidence.item() * 100, 2)

    label = label_encoder.inverse_transform([pred.item()])[0]

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