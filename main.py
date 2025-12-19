from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
import cv2
import tempfile
import os
from keras.models import load_model

app = FastAPI(title="TRUTH-SHIELD - Fake News & Deepfake Detector")

# CORS setup
origins = [
    "http://localhost:3000",
    "http://localhost:8080",
    "https://truth-shield-navy.vercel.app",
    "https://truthshield-7j3r.onrender.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for Lazy Loading
vectorizer = None
news_model = None
deepfake_model = None

class NewsRequest(BaseModel):
    text: str

@app.get("/")
async def root():
    return {"message": "TRUTH-SHIELD API is running"}

@app.post("/api/predict")
async def predict(news: NewsRequest):
    global vectorizer, news_model
    if not news.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    # Only load text models when first used
    if vectorizer is None:
        vectorizer = joblib.load("models/vectorizer.jb")
    if news_model is None:
        news_model = joblib.load("models/lr_model.jb")

    transform_input = vectorizer.transform([news.text])
    raw_pred = news_model.predict(transform_input)[0]
    label = "Real" if int(raw_pred) == 1 else "Fake"
    
    try:
        confidence = float(news_model.predict_proba(transform_input)[0].max())
    except:
        confidence = 0.0

    return {"prediction": label, "confidence": confidence, "is_real": bool(int(raw_pred) == 1)}

def extract_frames(video_path, num_frames=10):
    cap = cv2.VideoCapture(video_path)
    frames = []
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    if total <= 0: return None
    for i in range(num_frames):
        cap.set(cv2.CAP_PROP_POS_FRAMES, i * (total // num_frames))
        ret, frame = cap.read()
        if ret:
            # CHANGE THIS LINE: from (224, 224) to (128, 128)
            frames.append(cv2.resize(frame, (128, 128)) / 255.0)
    cap.release()
    return np.array(frames) if frames else None

@app.post("/api/deepfake-detect")
async def detect_deepfake(file: UploadFile = File(...)):
    global deepfake_model
    
    # Only load heavy Keras model when a video is scanned
    if deepfake_model is None:
        deepfake_model = load_model("models/truth_shield_model.h5")

    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    frames = extract_frames(tmp_path)
    if frames is None:
        os.remove(tmp_path)
        raise HTTPException(status_code=400, detail="Invalid video")

    preds = deepfake_model.predict(frames)
    avg_pred = float(np.mean(preds))
    is_real = avg_pred < 0.5
    
    os.remove(tmp_path)
    return {
        "prediction": "REAL" if is_real else "FAKE",
        "confidence": abs(avg_pred - 0.5) * 2,
        "is_real": is_real
    }
