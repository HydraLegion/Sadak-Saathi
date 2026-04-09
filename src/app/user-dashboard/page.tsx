"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import UploadVideo, { DetectionResponse } from "@/components/dashboard/UploadVideo";
import PotholeMap from "@/components/dashboard/PotholeMap";
import VideoDetectionPreview from "@/components/dashboard/VideoDetectionPreview";
import PotholeDatasetUploader from "@/components/PotholeDatasetUploader";
import { Video, MapPin, AlertTriangle, ShieldCheck, UploadCloud, FileText } from "lucide-react";

export default function UserDashboardPage() {
  // --- VIDEO STATES ---
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [detectionLoading, setDetectionLoading] = useState(false);
  const [detections, setDetections] = useState<unknown[]>([]);
  const [frames, setFrames] = useState(0);
  const [processedVideoURL, setProcessedVideoURL] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (videoURL) {
        URL.revokeObjectURL(videoURL);
      }
    };
  }, [videoURL]);

  const handleVideoSelected = ({ videoURL: nextVideoURL }: { file: File; videoURL: string }) => {
    if (videoURL) {
      URL.revokeObjectURL(videoURL);
    }
    setVideoURL(nextVideoURL);
    setProcessedVideoURL(null);
    setDetections([]);
    setFrames(0);
  };

  const handleDetectionComplete = (result: DetectionResponse) => {
    setDetections(Array.isArray(result.detections) ? result.detections : []);
    setFrames(Number(result.frames ?? 0));
    setProcessedVideoURL(typeof result.processedVideoURL === "string" ? result.processedVideoURL : null);
  };

  return (
    <MainLayout tickerMessage="User dashboard active. Upload dashcam footage or GPS datasets to auto-map road hazards.">
      
      {/* Dashboard Header */}
      <section className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Citizen Workspace</h1>
        <p className="text-gray-500 mt-2 text-sm max-w-2xl">
          Upload your dashcam footage (local preview) or GPS text files. Our system will automatically process the data and drop precision pins on the live map.
        </p>
      </section>

      {/* Quick Stats Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
            <Video size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Footage Analyzed</p>
            <p className="text-2xl font-bold text-gray-900">12 <span className="text-xs font-normal text-gray-400">clips</span></p>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center shrink-0">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Hazards Reported</p>
            <p className="text-2xl font-bold text-gray-900">47 <span className="text-xs font-normal text-gray-400">verified</span></p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center shrink-0">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Saathi Trust Score</p>
            <p className="text-2xl font-bold text-gray-900">94% <span className="text-xs font-normal text-gray-400">High</span></p>
          </div>
        </div>
      </div>

      {/* --- 1. VIDEO UPLOAD & PREVIEW GRID --- */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        
        {/* Upload Panel */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
            <UploadCloud className="text-blue-600" size={20} />
            <h2 className="text-lg font-bold text-gray-800">1. Upload Video (Local Playback)</h2>
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <UploadVideo
              onVideoSelected={handleVideoSelected}
              onDetectionStateChange={setDetectionLoading}
              onDetectionComplete={handleDetectionComplete}
            />
          </div>
        </div>

        {/* AI Preview Panel */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
            <Video className="text-orange-500" size={20} />
            <h2 className="text-lg font-bold text-gray-800">2. AI Detection Preview</h2>
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <VideoDetectionPreview
              videoURL={videoURL}
              processedVideoURL={processedVideoURL}
              detections={detections}
              frames={frames}
              loading={detectionLoading}
            />
          </div>
        </div>
      </div>

      {/* --- 2. GPS DATASET UPLOADER --- */}
      <div className="mb-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
          <FileText className="text-blue-600" size={20} />
          <h2 className="text-lg font-bold text-gray-800">3. Upload GPS Text File to Database</h2>
        </div>
        <div className="p-6">
          <PotholeDatasetUploader />
        </div>
      </div>

      {/* --- 3. LIVE MAP PANEL --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
          <MapPin className="text-green-600" size={20} />
          <h2 className="text-lg font-bold text-gray-800">4. Live Verification Map</h2>
        </div>
        <div className="p-2">
          <div className="rounded-xl overflow-hidden border border-gray-200">
            <PotholeMap title="" />
          </div>
        </div>
      </div>

    </MainLayout>
  );
}