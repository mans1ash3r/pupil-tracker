"use client";

import React, { useRef, useEffect, useState } from "react";

interface Pupil {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence?: number;
}

const PupilTracker: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [pupilData, setPupilData] = useState<Pupil[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    };

    startWebcam();
  }, []);

  const handleDetection = async () => {
    setLoading(true);
    setTimeout(() => {
      setPupilData([
        { x: 100, y: 150, width: 50, height: 50, confidence: 0.85 },
        { x: 300, y: 250, width: 60, height: 60, confidence: 0.92 },
      ]);
      setLoading(false);
    }, 2000);
  };

  return (
    <div style={pageStyles.container}>
      <div style={pageStyles.webcamSection}>
        <div style={pageStyles.webcamWrapper}>
          <video ref={videoRef} autoPlay style={pageStyles.video} />
        </div>
        <button style={pageStyles.button} onClick={handleDetection}>
          {loading ? "Processing..." : "Start Detection"}
        </button>
      </div>

      <div style={pageStyles.resultsSection}>
        <h3 style={pageStyles.resultsTitle}>Detection Results</h3>
        <div style={pageStyles.resultsContent}>
          {pupilData.length > 0 ? (
            pupilData.map((pupil, index) => (
              <div key={index} style={pageStyles.resultItem}>
                <strong>Pupil {index + 1}:</strong> x={pupil.x}, y={pupil.y}, size={pupil.width}x{pupil.height}px, confidence={pupil.confidence?.toFixed(2)}
              </div>
            ))
          ) : (
            <p style={pageStyles.emptyState}>No pupils detected yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const pageStyles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "20px",
    gap: "20px",
    backgroundColor: "#1e1e2f",
    color: "#fff",
    minHeight: "100vh",
  },
  webcamSection: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
  },
  webcamWrapper: {
    width: "640px",
    height: "480px",
    border: "2px solid #4caf50",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    backgroundColor: "#000",
  },
  video: {
    width: "100%",
    height: "100%",
    filter: "grayscale(100%)", // 👈 Grayscale applied here
  },
  button: {
    padding: "12px 24px",
    fontSize: "16px",
    color: "#fff",
    backgroundColor: "#4caf50",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.2s",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
  resultsSection: {
    flex: 1,
    maxWidth: "400px",
    backgroundColor: "#2e2e3f",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
  resultsTitle: {
    fontSize: "1.5rem",
    marginBottom: "10px",
    borderBottom: "2px solid #4caf50",
    paddingBottom: "10px",
  },
  resultsContent: {
    maxHeight: "300px",
    overflowY: "auto",
  },
  resultItem: {
    padding: "10px",
    backgroundColor: "#3e3e4f",
    borderRadius: "5px",
    marginBottom: "10px",
  },
  emptyState: {
    fontSize: "1rem",
    color: "#aaa",
    textAlign: "center",
    fontStyle: "italic",
  },
};

export default PupilTracker;
