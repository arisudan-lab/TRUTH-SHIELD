from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
import cv2
import tempfile
import os

# We import load_model here, but don't call it yet
from keras.models import load_model

app = FastAPI(title="TruthGuard - Fake News & Deepfake Detector")

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

# Global variables to store models once loaded
vectorizer = None
news_model = None
deepfake_model = None

class NewsRequest(BaseModel):
    text: str

@app.get("/")
async def root():
    return {"message": "TruthGuard API is running"}

# ===== FAKE NEWS ENDPOINT =====
@app.post("/api/predict")
async def predict(news: NewsRequest):
    global vectorizer, news_model
    
    if not news.text.strip():
        raise HTTPException(status_code=400, detail="News text cannot be empty")

    # LAZY LOAD: Only load text models if they aren't in memory yet
    if vectorizer is None:
        vectorizer = joblib.load("models/vectorizer.jb")
    if news_model is None:
        news_model = joblib.load("models/lr_model.jb")

    transform_input = vectorizer.transform([news.text])
    raw_pred = news_model.predict(transform_input)[0]
    pred_int = int(raw_pred)
    label = "Real" if pred_int == 1 else "Fake"

    try:
        proba = news_model.predict_proba(transform_input)[0].max()
        confidence = float(proba)
    except Exception:
        confidence = 0.0

    return {
        "prediction": label,
        "confidence": confidence,
        "is_real": bool(pred_int == 1),
    }

# ===== DEEPFAKE DETECTION HELPERS =====
def extract_frames(video_path: str, num_frames: int = 10):
    cap = cv2.VideoCapture(video_path)
    frames = []
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    if total_frames <= 0:
        cap.release()
        return None

    for i in range(num_frames):
        cap.set(cv2.CAP_PROP_POS_FRAMES, i * (total_frames // num_frames))
        ret, frame = cap.read()
        if ret:
            frame = cv2.resize(frame, (224, 224))
            frame = frame / 255.0
            frames.append(frame)

    cap.release()
    return np.array(frames) if frames else None

# ===== DEEPFAKE DETECTION ENDPOINT =====
@app.post("/api/deepfake-detect")
async def detect_deepfake(file: UploadFile = File(...)):
    global deepfake_model
    
    if not file.filename.lower().endswith((".mp4", ".mov", ".avi", ".mkv")):
        raise HTTPException(status_code=400, detail="Invalid video format")

    try:
        # LAZY LOAD: Only load the heavy Keras model when a video is uploaded
        if deepfake_model is None:
            print("Loading deepfake model into memory...")
            deepfake_model = load_model("models/deepfake_detection_vibe_model.h5")

        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp_file:
            content = await file.read()
            tmp_file.write(content)
            tmp_path = tmp_file.name

        frames = extract_frames(tmp_path, num_frames=10)
        if frames is None:
            os.remove(tmp_path)
            raise HTTPException(status_code=400, detail="Could not process video")

        predictions = deepfake_model.predict(frames)
        avg_prediction = float(np.mean(predictions))

        is_real = avg_prediction < 0.5
        label = "REAL" if is_real else "FAKE"
        confidence = abs(avg_prediction - 0.5) * 2

        os.remove(tmp_path)

        return {
            "prediction": label,
            "confidence": confidence,
            "is_real": is_real,
            "raw_score": avg_prediction,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
