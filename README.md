EyeQ 👀

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

### **Frontend (Next.js + React)**
📁 **frontend/** – The user interface and webcam handling
- **📂 components/**
  - `PupilTracker.tsx` → Captures webcam frames and sends them to the backend. Displays detected pupils.
- **📂 pages/**
  - `index.tsx` → Main webpage, imports `<PupilTracker />`
- **📂 styles/** → CSS for styling the UI
- `package.json` → Lists dependencies (React, Next.js, Tailwind, Axios, React-Webcam)
- `tsconfig.json` → TypeScript configuration

### **Backend (FastAPI + Python)**
📁 **backend/** – The API server for pupil detection
- `main.py` →  
