👀 Pupil Tracker

Pupil Tracker is a **real-time pupil detection system** that captures webcam frames, processes them using a **FastAPI backend**, and detects pupils using **Roboflow’s AI model**. The detected pupils are **highlighted with bounding boxes** on the live webcam feed.

---

## 🚀 Features
✅ **Live Webcam Feed** – Captures frames in real-time  
✅ **AI-powered Pupil Detection** – Uses Roboflow's model  
✅ **FastAPI Backend** – Handles image processing requests  
✅ **Bounding Box Overlay** – Visualizes detected pupils  
✅ **Next.js Frontend** – Clean UI with TailwindCSS  

---

## 📂 Project Structure

### 📁 **Frontend (Next.js + React)**
The frontend is built with **Next.js** and **React**, handling the user interface and webcam input.

- **📂 `frontend/`** – Contains the user interface and webcam handling logic
  - **📂 `components/`**
    - `PupilTracker.tsx` → Captures webcam frames, sends them to the backend, and displays detected pupils.
  - **📂 `pages/`**
    - `index.tsx` → Main webpage, imports `<PupilTracker />`
  - **📂 `styles/`** → Contains CSS for UI styling
  - `package.json` → Lists dependencies (React, Next.js, Tailwind, Axios, React-Webcam)
  - `tsconfig.json` → TypeScript configuration

---

### 📁 **Backend (FastAPI + Python)**
The backend is powered by **FastAPI** and processes pupil detection requests.

- **📂 `backend/`** – The API server for pupil detection
  - `main.py` → Runs the FastAPI server at `http://127.0.0.1:8000`
    - Accepts images at **`/detect/`** endpoint
    - Sends images to **Roboflow API** for processing
    - Returns detected pupil coordinates: `(x, y, width, height, confidence)`
  - `requirements.txt` → Lists Python dependencies (FastAPI, Uvicorn, Requests)
  - **📂 `uploads/`** → Temporary storage for images before they are sent to Roboflow
