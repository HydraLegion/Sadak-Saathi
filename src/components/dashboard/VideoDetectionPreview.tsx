"use client";

import React, { useEffect, useState } from "react";
import { Activity, AlertTriangle, CheckCircle, Video as VideoIcon, RefreshCw } from "lucide-react";

interface VideoDetectionPreviewProps {
  videoURL: string | null; 
  processedVideoURL: string | null; 
  loading: boolean;
}

export default function VideoDetectionPreview({
  videoURL,
  processedVideoURL,
  loading
}: VideoDetectionPreviewProps) {
  const [liveFrames, setLiveFrames] = useState(0);
  const [liveHazards, setLiveHazards] = useState(0);
  const [streamError, setStreamError] = useState(false);
  
  const [stableStreamUrl, setStableStreamUrl] = useState<string | null>(null);

  useEffect(() => {
    if (processedVideoURL) {
      setStableStreamUrl(`${processedVideoURL}?t=${Date.now()}`);
      setStreamError(false);
    } else {
      setStableStreamUrl(null);
    }
  }, [processedVideoURL]);

  useEffect(() => {
    if (!processedVideoURL) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch("http://localhost:5000/detection_count");
        if (res.ok) {
          const data = await res.json();
          setLiveFrames(data.frames);
          setLiveHazards(data.detections);
        }
      } catch (err) {
        // Silently ignore telemetry fails during timeouts
      }
    }, 500);

    return () => clearInterval(interval);
  }, [processedVideoURL]);

  const handleRetryStream = () => {
    setStreamError(false);
    setStableStreamUrl(`${processedVideoURL}?retry=${Date.now()}`);
  };

  if (!videoURL && !loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl min-h-[350px]">
         <div className="w-16 h-16 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center mb-4">
            <VideoIcon size={32} />
         </div>
         <p className="text-gray-500 font-medium">Video ready. Click "Start Detection" to begin.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col bg-slate-900 rounded-xl min-h-[350px] overflow-hidden relative shadow-inner border border-gray-200">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
           <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
           <h3 className="text-lg font-bold tracking-wide">Starting AI stream...</h3>
           <p className="text-sm text-gray-400 mt-2">Connecting to Python Backend</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      <div className="relative w-full bg-black rounded-t-xl overflow-hidden shadow-inner aspect-video flex items-center justify-center border border-gray-200">
        
        {stableStreamUrl && !streamError && (
          <img 
            src={stableStreamUrl} 
            alt="Live OpenCV Stream"
            className="w-full h-full object-contain"
            onError={() => setStreamError(true)}
          />
        )}

        {streamError && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center text-red-500 font-bold p-6 text-center z-50">
            <AlertTriangle size={36} className="mb-3 text-red-500 animate-pulse" />
            <span className="text-lg">Stream Disconnected or Timed Out.</span>
            <span className="text-sm font-normal text-gray-400 mt-2 max-w-xs">
              If your AI model is still warming up, click below to try reconnecting to the stream.
            </span>
            <button 
              onClick={handleRetryStream}
              className="mt-6 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-sm transition-all shadow-lg active:scale-95"
            >
              <RefreshCw size={16} /> Force Reconnect
            </button>
          </div>
        )}
      </div>

      <div className="bg-green-600 text-white px-4 py-2.5 flex items-center gap-2 text-sm font-bold shadow-md">
        <CheckCircle size={18} />
        Live Stream Connected — Processing via Flask OpenCV
      </div>

      <div className="grid grid-cols-2 gap-4 mt-5">
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center gap-3 shadow-sm">
          <div className="bg-blue-200 text-blue-700 p-2.5 rounded-lg">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Frames Analyzed</p>
            <p className="text-2xl font-black text-blue-900 leading-none mt-1 font-mono">{liveFrames}</p>
          </div>
        </div>
        
        <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex items-center gap-3 shadow-sm">
          <div className="bg-orange-200 text-orange-700 p-2.5 rounded-lg">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Hazards Detected</p>
            <p className="text-2xl font-black text-orange-900 leading-none mt-1 font-mono">{liveHazards}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
