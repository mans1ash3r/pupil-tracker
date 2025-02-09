from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import requests
import shutil
import os

# Initialize FastAPI app
app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (change if needed for security)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directory for storing uploaded images
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Roboflow API Details
ROBOFLOW_API_URL = "https://detect.roboflow.com/eyes-pupil-detection/1"
API_KEY = "your_api_key"  # Replace with your actual API key

# Temporary storage for latest detection result
temp_storage = {}

@app.get("/")
def read_root():
    """Test endpoint to verify FastAPI is running."""
    return {"message": "FastAPI is working!"}

@app.post("/detect/")
async def detect_pupil(file: UploadFile = File(...)):
    """
    Receive an image from the frontend, send it to Roboflow's API for processing, 
    and return the detected pupil data.
    """
    global temp_storage

    # Save uploaded image
    file_path = f"{UPLOAD_FOLDER}/{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Send the image to Roboflow API for pupil detection
    with open(file_path, "rb") as image_file:
        files = {"file": ("image.jpg", image_file, "image/jpeg")}
        response = requests.post(
            f"{ROBOFLOW_API_URL}?api_key={API_KEY}",
            files=files,
        )

    # Store and return the detection result
    if response.status_code == 200:
        temp_storage["latest_result"] = response.json()
        return temp_storage["latest_result"]
    else:
        return {"error": "Failed to process image", "details": response.text}

@app.get("/latest/")
def get_latest_result():
    """
    Retrieve the latest pupil detection result.
    If no result exists, return a message indicating no recent data.
    """
    return temp_storage.get("latest_result", {"message": "No recent result found"})
