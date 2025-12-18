from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
import cv2
import tempfile
import os
from keras.models import load_model

app = FastAPI(title="TruthGuard - Fake News & Deepfake Detector")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models
vectorizer = joblib.load("models/vectorizer.jb")
news_model = joblib.load("models/lr_model.jb")
deepfake_model = load_model("models/deepfake_detection_vibe_model.h5")


class NewsRequest(BaseModel):
    text: str


@app.get("/")
async def root():
    return {"message": "TruthGuard API is running"}


# ===== FAKE NEWS ENDPOINT =====
@app.post("/api/predict")
async def predict(news: NewsRequest):
    if not news.text.strip():
        raise HTTPException(status_code=400, detail="News text cannot be empty")

    transform_input = vectorizer.transform([news.text])
    raw_pred = news_model.predict(transform_input)[0]
    pred_int = int(raw_pred)
    label = "Real" if pred_int == 1 else "Fake"

    try:
        proba = news_model.predict_proba(transform_input)[0].max()
        confidence = float(proba)
    except Exception:
        confidence = 0.0

    is_real = bool(pred_int == 1)

    return {
        "prediction": label,
        "confidence": confidence,
        "is_real": is_real,
    }


# ===== DEEPFAKE DETECTION ENDPOINT =====
def extract_frames(video_path, num_frames=10):
    """Extract frames from video"""
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


@app.post("/api/deepfake-detect")
async def detect_deepfake(file: UploadFile = File(...)):
    """Detect deepfake in uploaded video"""
    
    if not file.filename.lower().endswith(('.mp4', '.mov', '.avi', '.mkv')):
        raise HTTPException(status_code=400, detail="Invalid file format. Supported: MP4, MOV, AVI, MKV")
    
    try:
        # Save temp file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp_file:
            content = await file.read()
            tmp_file.write(content)
            tmp_path = tmp_file.name
        
        # Extract frames
        frames = extract_frames(tmp_path, num_frames=10)
        if frames is None:
            raise HTTPException(status_code=400, detail="Could not process video")
        
        # Predict
        predictions = deepfake_model.predict(frames)
        avg_prediction = float(np.mean(predictions))
        
        # Determine if real or fake (adjust threshold as needed)
        is_real = avg_prediction < 0.5
        label = "REAL" if is_real else "FAKE"
        confidence = abs(avg_prediction - 0.5) * 2  # Convert to 0-1 confidence
        
        # Cleanup
        os.remove(tmp_path)
        
        return {
            "prediction": label,
            "confidence": confidence,
            "is_real": is_real,
            "raw_score": avg_prediction
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing video: {str(e)}")
