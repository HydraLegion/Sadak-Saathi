"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, FileVideo, Play } from "lucide-react";

export interface DetectionResponse {
  detections: any[];
  frames: number;
  processedVideoURL?: string | null;
}

interface UploadVideoProps {
  onVideoSelected: (data: { file: File; videoURL: string }) => void;
  onDetectionStateChange: (isDetecting: boolean) => void;
  onDetectionComplete: (response: DetectionResponse) => void;
}

export default function UploadVideo({ onVideoSelected, onDetectionStateChange, onDetectionComplete }: UploadVideoProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    onVideoSelected({ file, videoURL: URL.createObjectURL(file) });
  };

  const startDetection = async () => {
    if (!selectedFile) return;

    onDetectionStateChange(true);
    const formData = new FormData();
    formData.append("video", selectedFile);

    try {
      // DYNAMIC URL: Uses your environment variable
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
        method: "POST",
        headers: {
          "ngrok-skip-browser-warning": "true" 
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload via Ngrok");

      const data = await res.json();

      onDetectionComplete({
        detections: [],
        frames: 0,
        processedVideoURL: data.processedVideoURL
      });

    } catch (err) {
      console.error("Backend Error:", err);
      alert("Could not connect to backend. Is your Ngrok tunnel and app.py running?");
    } finally {
      onDetectionStateChange(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 p-6">
      <input 
        type="file" 
        accept="video/mp4,video/webm" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
      />

      {!selectedFile ? (
        <div 
          className="flex flex-col items-center cursor-pointer hover:bg-gray-100 p-4 rounded-lg transition-colors w-full"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
            <UploadCloud size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Select Video</h3>
          <p className="text-sm text-gray-500 text-center">MP4 or WebM format</p>
        </div>
      ) : (
        <div className="flex flex-col items-center w-full">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
            <FileVideo size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Ready to Process</h3>
          <p className="text-sm text-gray-500 text-center mb-6">{selectedFile.name}</p>
          
          <button 
            onClick={startDetection}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <Play size={18} /> Start Detection
          </button>
          
          <button 
            onClick={() => setSelectedFile(null)}
            className="mt-3 text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Change File
          </button>
        </div>
      )}
    </div>
  );
}
