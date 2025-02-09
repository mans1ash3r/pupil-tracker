from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import requests
import shutil
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

ROBOFLOW_API_URL = "https://detect.roboflow.com/eyes-pupil-detection/1"
API_KEY = "your_api_key"

# Temporary storage for the latest detection result
temp_storage = {}

@app.get("/")
def read_root():
    return {"message": "FastAPI is working!"}

@app.post("/detect/")
async def detect_pupil(file: UploadFile = File(...)):
    global temp_storage

    # Save uploaded image
    file_path = f"{UPLOAD_FOLDER}/{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Send image to Roboflow API
    with open(file_path, "rb") as image_file:
        files = {"file": ("image.jpg", image_file, "image/jpeg")}
        response = requests.post(
            f"{ROBOFLOW_API_URL}?api_key={API_KEY}",
            files=files,
        )

    # Store the response temporarily
    if response.status_code == 200:
        temp_storage["latest_result"] = response.json()
        return temp_storage["latest_result"]
    else:
        return {"error": "Failed to process image", "details": response.text}

@app.get("/latest/")
def get_latest_result():
    """Retrieve the latest detection result."""
    return temp_storage.get("latest_result", {"message": "No recent result found"})
