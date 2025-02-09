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
  const [fact, setFact] = useState<string>("No detection yet. Start tracking to see pupil facts.");

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

  const getFactBasedOnPupilSize = (size: number) => {
    if (size >= 2 && size <= 4) {
      return "Your pupils are within the normal range in bright light (2-4 mm).";
    } else if (size > 4 && size <= 8) {
      return "Your pupils are within the normal range in low light (4-8 mm).";
    } else if (size > 8) {
      return "Your pupils seem dilated more than usual. It could be due to low light, excitement, or medication.";
    } else if (size < 2) {
      return "Your pupils seem constricted. This can occur due to bright light exposure or certain medications.";
    } else {
      return "Pupil size detection in progress...";
    }
  };

  const handleDetection = async () => {
    setLoading(true);

    if (!videoRef.current) {
      console.error("Webcam not available.");
      setLoading(false);
      return;
    }

    // Capture image from video
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setLoading(false);
      return;
    }
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    // Convert image to blob
    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const formData = new FormData();
      formData.append("file", blob, "frame.jpg");

      try {
        // Send image to backend for processing
        const response = await fetch("http://127.0.0.1:8000/detect/", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        console.log("🔍 Pupil Data from Backend:", data.predictions); // Debug log

        if (data.predictions) {
          setPupilData(data.predictions);
          setFact(getFactBasedOnPupilSize(data.predictions[0]?.width || 0));
        }
      } catch (error) {
        console.error("Error detecting pupil:", error);
      }

      setLoading(false);
    }, "image/jpeg");
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
                <strong>Pupil {index + 1}:</strong> x={pupil.x}, y={pupil.y}, size={pupil.width}px, confidence={pupil.confidence?.toFixed(2)}
              </div>
            ))
          ) : (
            <p style={pageStyles.emptyState}>No pupils detected yet.</p>
          )}
        </div>

        {/* Fact Display */}
        <div style={pageStyles.factSection}>
          <h3 style={pageStyles.factTitle}>Pupil Fact</h3>
          <p style={pageStyles.factText}>{fact}</p>
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
    filter: "grayscale(100%)",
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
  factSection: {
    marginTop: "20px",
    padding: "10px",
    backgroundColor: "#3e3e4f",
    borderRadius: "5px",
    textAlign: "center",
  },
  factTitle: {
    fontSize: "1.3rem",
    marginBottom: "10px",
    color: "#4caf50",
  },
  factText: {
    fontSize: "1rem",
    color: "#fff",
  },
};

export default PupilTracker;
