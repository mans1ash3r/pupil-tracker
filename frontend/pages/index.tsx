import { useState } from "react";
import PupilTracker from "../components/PupilTracker"; // ✅ Use the webcam component

export default function Home() {
    const [detections, setDetections] = useState<any>(null);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
            <h1 className="text-3xl font-bold mb-6">👀 Pupil Detection</h1>

            {/* ✅ Replace file input with webcam */}
            <PupilTracker />

            {detections && <pre className="mt-4 text-sm">{JSON.stringify(detections, null, 2)}</pre>}
        </div>
    );
}