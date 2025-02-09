"use client";

import React, { useRef, useEffect, useState } from "react";

const PupilTracker = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [pupilData, setPupilData] = useState<
        { x: number; y: number; width: number; height: number; confidence: number }[]
    >([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const startWebcam = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                console.log("Webcam started!");
            } catch (err) {
                console.error("Error accessing webcam ❌:", err);
                setError("Webcam access denied. Please allow camera permissions.");
            }
        };

        const captureFrame = (): Blob | null => {
            if (!videoRef.current) return null;

            const canvas = document.createElement("canvas");
            canvas.width = videoRef.current.videoWidth || 640;
            canvas.height = videoRef.current.videoHeight || 480;
            const ctx = canvas.getContext("2d");

            if (ctx) {
                ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                return dataURLtoBlob(canvas.toDataURL("image/jpeg"));
            }
            return null;
        };

        const dataURLtoBlob = (dataURL: string): Blob => {
            const byteString = atob(dataURL.split(",")[1]);
            const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            return new Blob([ab], { type: mimeString });
        };

        const sendFrameToServer = async () => {
            const frameData = captureFrame();
            if (!frameData) {
                console.error("Failed to capture frame ❌");
                return;
            }

            setLoading(true);
            const formData = new FormData();
            formData.append("file", frameData, "frame.jpg");

            try {
                const response = await fetch("http://127.0.0.1:8000/detect/", {
                    method: "POST",
                    body: formData,
                });

                const result = await response.json();
                console.log("Processed result ✅:", JSON.stringify(result, null, 2));

                if (result.predictions.length > 0) {
                    setPupilData(
                        result.predictions.map((pupil: any) => ({
                            x: pupil.x,
                            y: pupil.y,
                            width: pupil.width,
                            height: pupil.height,
                            confidence: pupil.confidence,
                        }))
                    );
                } else {
                    setPupilData([]);
                }
            } catch (err) {
                console.error("Error processing frame:", err);
                setError("Failed to send frame to server.");
            } finally {
                setLoading(false);
            }
        };

        startWebcam();
        const interval = setInterval(sendFrameToServer, 2000); // Capture frame every 2 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    return (
        <div className="flex flex-col items-center relative">
            <div style={{ position: "relative" }}>
                <video ref={videoRef} autoPlay style={{ width: "640px", height: "480px", border: "2px solid black" }} />

                {/* 🔥 Overlay detected pupils */}
                {pupilData.map((pupil, index) => (
                    <div
                        key={index}
                        style={{
                            position: "absolute",
                            left: `${pupil.x - pupil.width / 2}px`,
                            top: `${pupil.y - pupil.height / 2}px`,
                            width: `${pupil.width}px`,
                            height: `${pupil.height}px`,
                            border: "2px solid red",
                            backgroundColor: "rgba(255, 0, 0, 0.3)",
                        }}
                    />
                ))}
            </div>

            {error && <p className="text-red-500 mt-2">{error}</p>}
            {loading && <p className="text-blue-500 mt-2">Processing frame...</p>}

            <div className="mt-4">
                {pupilData.length > 0 ? (
                    pupilData.map((pupil, index) => (
                        <p key={index}>
                            Pupil {index + 1}: x={pupil.x}, y={pupil.y}, size={pupil.width}x{pupil.height}px,
                            confidence={pupil.confidence.toFixed(2)}
                        </p>
                    ))
                ) : (
                    <p>No pupil detected</p>
                )}
            </div>
        </div>
    );
};

export default PupilTracker;