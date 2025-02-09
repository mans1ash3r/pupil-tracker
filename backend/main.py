from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import requests
import shutil
import os

app = FastAPI()

# ✅ Enable CORS (Frontend-Backend Communication)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ✅ Roboflow API Details
ROBOFLOW_API_URL = "https://detect.roboflow.com/eyes-pupil-detection/1"
API_KEY = "N5eLTInggyBnrZ0qLSFF"  # Replace with your actual API key

@app.get("/")
def read_root():
    return {"message": "FastAPI is working!"}

@app.post("/detect/")
async def detect_pupil(file: UploadFile = File(...)):
    """Receives an image, saves it, and sends it to the Roboflow pupil detection API."""
    
    # ✅ Debugging: Print received file details
    print(f"Received file: {file.filename} | Type: {file.content_type}")

    # ✅ Ensure it's a valid image type
    if file.content_type not in ["image/jpeg", "image/png"]:
        return {"error": "Invalid file format", "expected": "image/jpeg or image/png", "received": file.content_type}

    # ✅ Save uploaded image
    file_path = f"{UPLOAD_FOLDER}/{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # ✅ Send image to Roboflow API
    with open(file_path, "rb") as image_file:
        files = {"file": ("image.jpg", image_file, "image/jpeg")}
        response = requests.post(
            f"{ROBOFLOW_API_URL}?api_key={API_KEY}",
            files=files,  
        )

    # ✅ Return API Response
    if response.status_code == 200:
        return response.json()
    else:
        return {"error": "Failed to process image", "details": response.text}