from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import requests
import shutil
import os
import json

# Initialize FastAPI app
app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (change this for security if needed)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directory for storing uploaded images
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Roboflow API Details
ROBOFLOW_API_URL = "https://detect.roboflow.com/eyes-pupil-detection/1"
API_KEY = "N5eLTInggyBnrZ0qLSFF"  

# Temporary storage for latest detection results
temp_storage = {}

@app.get("/")
def read_root():
    """Test endpoint to verify FastAPI is running."""
    return {"message": "FastAPI is working!"}

@app.post("/detect/")
async def detect_pupil(file: UploadFile = File(...)):
    """
    Receives an image from the frontend, sends it to Roboflow's API for processing, 
    and returns detected pupil data.
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

    # Check if API request was successful
    if response.status_code == 200:
        response_json = response.json()

        # Debugging log: Print the full API response
        print("Roboflow Response:", json.dumps(response_json, indent=4))

        # Extract predictions (pupil detections)
        predictions = response_json.get("predictions", [])

        # Store and return the detection result
        temp_storage["latest_result"] = {"predictions": predictions}
        return temp_storage["latest_result"]
    
    else:
        print("Error from Roboflow:", response.text)  # Log the error
        return {"error": "Failed to process image", "details": response.text}

@app.get("/latest/")
def get_latest_result():
    """
    Retrieve the latest pupil detection result.
    If no result exists, return an empty list instead of an error.
    """
    return temp_storage.get("latest_result", {"predictions": []})
