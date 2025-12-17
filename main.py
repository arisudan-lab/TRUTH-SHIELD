from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np  # add this import

app = FastAPI(title="Fake News Detector API")

vectorizer = joblib.load("models/vectorizer.jb")
model = joblib.load("models/lr_model.jb")

class NewsRequest(BaseModel):
    text: str

@app.get("/")
async def root():
    return {"message": "Fake News Detector API is running"}

@app.post("/api/predict")
async def predict(news: NewsRequest):
    if not news.text.strip():
        raise HTTPException(status_code=400, detail="News text cannot be empty")

    transform_input = vectorizer.transform([news.text])
    raw_pred = model.predict(transform_input)[0]

    # convert numpy → Python
    pred_int = int(raw_pred)          # 0 or 1 as Python int
    label = "Real" if pred_int == 1 else "Fake"

    # handle models without predict_proba safely
    try:
        proba = model.predict_proba(transform_input)[0].max()
        confidence = float(proba)     # Python float
    except Exception:
        confidence = 0.0

    is_real = bool(pred_int == 1)     # Python bool

    return {
        "prediction": label,
        "confidence": confidence,
        "is_real": is_real,
    }
