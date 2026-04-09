'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, FileVideo, FileText, X, CheckCircle, AlertCircle, Loader2, ChevronRight, Info } from 'lucide-react';
import { toast } from 'sonner';

type UploadStage =
  | 'idle' |'uploading' |'extracting_frames' |'running_detection' |'matching_gps' |'generating_complaints' |'complete' |'error';

interface ProcessingStep {
  id: string;
  label: string;
  sublabel: string;
  stage: UploadStage;
}

const PROCESSING_STEPS: ProcessingStep[] = [
  { id: 'upload', label: 'Uploading files', sublabel: 'Transferring to server', stage: 'uploading' },
  { id: 'frames', label: 'Extracting frames', sublabel: 'OpenCV frame sampling at 2 FPS', stage: 'extracting_frames' },
  { id: 'detection', label: 'Running YOLOv8 detection', sublabel: 'Analyzing each frame for potholes', stage: 'running_detection' },
  { id: 'gps', label: 'Matching GPS coordinates', sublabel: 'Aligning timestamps with GPS log', stage: 'matching_gps' },
  { id: 'complaints', label: 'Generating complaints', sublabel: 'Auto-filing reports per severity', stage: 'generating_complaints' },
];

function StepIndicator({ step, currentStage }: { step: ProcessingStep; currentStage: UploadStage }) {
  const stages: UploadStage[] = ['idle', 'uploading', 'extracting_frames', 'running_detection', 'matching_gps', 'generating_complaints', 'complete'];
  const currentIdx = stages.indexOf(currentStage);
  const stepIdx = stages.indexOf(step.stage);

  const isDone = currentIdx > stepIdx;
  const isActive = currentStage === step.stage;
  const isPending = currentIdx < stepIdx;

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-primary/8 border border-primary/20' : isPending ? 'opacity-40' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
        isDone ? 'bg-success/20 border border-success/40' : isActive ?'bg-primary/20 border border-primary/40': 'bg-surface-elevated border border-border'
      }`}>
        {isDone ? (
          <CheckCircle size={16} className="text-success" />
        ) : isActive ? (
          <Loader2 size={16} className="text-primary animate-spin" />
        ) : (
          <span className="w-2 h-2 rounded-full bg-border" />
        )}
      </div>
      <div className="min-w-0">
        <p className={`text-sm font-500 ${isActive ? 'text-text' : isDone ? 'text-text/70' : 'text-muted-foreground'}`}>
          {step.label}
        </p>
        <p className="text-xs text-muted-foreground truncate">{step.sublabel}</p>
      </div>
      {isActive && (
        <div className="ml-auto flex-shrink-0">
          <div className="w-16 h-1 rounded-full bg-border overflow-hidden">
            <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: '60%' }} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function VideoUploadPanel() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [gpsFile, setGpsFile] = useState<File | null>(null);
  const [stage, setStage] = useState<UploadStage>('idle');
  const [progress, setProgress] = useState(0);
  const [detectionResult, setDetectionResult] = useState<{
    framesExtracted: number;
    potholesFound: number;
    dangerous: number;
    moderate: number;
    minor: number;
    processingTime: string;
  } | null>(null);
  const [dragOverVideo, setDragOverVideo] = useState(false);
  const [dragOverGPS, setDragOverGPS] = useState(false);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const gpsInputRef = useRef<HTMLInputElement>(null);

  const handleVideoDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOverVideo(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
    } else {
      toast.error('Please drop a valid video file (.mp4, .mov, .avi)');
    }
  }, []);

  const handleGPSDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOverGPS(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.csv') || file.name.endsWith('.gpx'))) {
      setGpsFile(file);
    } else {
      toast.error('Please drop a valid GPS log file (.csv or .gpx)');
    }
  }, []);

  const simulateProcessing = async () => {

  if (!videoFile) {
    toast.error("Please select a road video first");
    return;
  }

  try {

    setStage("uploading");
    setProgress(10);

    const formData = new FormData();
    formData.append("video", videoFile);

    if (gpsFile) {
      formData.append("gps", gpsFile);
    }

    const res = await fetch("http://127.0.0.1:5000/detect", {
      method: "POST",
      body: formData
    });

    setStage("running_detection");
    setProgress(60);

    const rawBody = await res.text();
    const data = rawBody ? JSON.parse(rawBody) : {};

    if (!res.ok) {
      throw new Error(data?.details || data?.error || `Backend request failed with status ${res.status}`);
    }

    setStage("complete");
    setProgress(100);

    setDetectionResult({
      framesExtracted: data.frames || 0,
      potholesFound: data.potholes || 0,
      dangerous: data.dangerous || 0,
      moderate: data.moderate || 0,
      minor: data.minor || 0,
      processingTime: data.processing_time || "—",
    });

    toast.success(`Detection complete - ${data.potholes || 0} potholes found`);

  } catch (err) {

    console.error(err);
    setStage("error");
    const message = err instanceof Error ? err.message : "Video processing failed";
    toast.error(message);

  }

};

  const handleReset = () => {
    setVideoFile(null);
    setGpsFile(null);
    setStage('idle');
    setProgress(0);
    setDetectionResult(null);
  };

  const isProcessing = stage !== 'idle' && stage !== 'complete' && stage !== 'error';

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-600 text-text">Upload Road Video</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Upload .mp4 road footage + GPS log CSV for AI-powered pothole detection
          </p>
        </div>
        {stage === 'complete' && (
          <button onClick={handleReset} className="btn-ghost text-xs py-1.5 px-3">
            <X size={14} />
            New Upload
          </button>
        )}
      </div>

      {stage === 'idle' && (
        <div className="space-y-4">
          {/* Video file drop zone */}
          <div>
            <label className="block text-xs font-500 text-muted-foreground uppercase tracking-wider mb-2">
              Road Video <span className="text-destructive">*</span>
            </label>
            <div
              className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 cursor-pointer group ${
                dragOverVideo
                  ? 'border-primary bg-primary/8'
                  : videoFile
                  ? 'border-success/50 bg-success/5' :'border-border hover:border-primary/50 hover:bg-surface-elevated'
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragOverVideo(true); }}
              onDragLeave={() => setDragOverVideo(false)}
              onDrop={handleVideoDrop}
              onClick={() => !videoFile && videoInputRef.current?.click()}
            >
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && setVideoFile(e.target.files[0])}
              />
              {videoFile ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-success/15 flex items-center justify-center flex-shrink-0">
                    <FileVideo size={20} className="text-success" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-500 text-text truncate">{videoFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(videoFile.size / (1024 * 1024)).toFixed(1)} MB · {videoFile.type}
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setVideoFile(null); }}
                    className="flex-shrink-0 p-1.5 rounded-lg hover:bg-surface-elevated text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-surface-elevated flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <FileVideo size={22} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-500 text-text">Drop road video here</p>
                    <p className="text-xs text-muted-foreground">or click to browse · MP4, MOV, AVI up to 500MB</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* GPS file drop zone */}
          <div>
            <label className="block text-xs font-500 text-muted-foreground uppercase tracking-wider mb-2">
              GPS Log
              <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-400 normal-case tracking-normal text-muted-foreground">
                <Info size={10} /> Optional — enables geolocation matching
              </span>
            </label>
            <div
              className={`relative border-2 border-dashed rounded-xl p-4 transition-all duration-200 cursor-pointer ${
                dragOverGPS
                  ? 'border-info bg-info/8'
                  : gpsFile
                  ? 'border-info/50 bg-info/5' :'border-border/60 hover:border-info/40 hover:bg-surface-elevated'
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragOverGPS(true); }}
              onDragLeave={() => setDragOverGPS(false)}
              onDrop={handleGPSDrop}
              onClick={() => !gpsFile && gpsInputRef.current?.click()}
            >
              <input
                ref={gpsInputRef}
                type="file"
                accept=".csv,.gpx"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && setGpsFile(e.target.files[0])}
              />
              {gpsFile ? (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-info/15 flex items-center justify-center flex-shrink-0">
                    <FileText size={16} className="text-info" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-500 text-text truncate">{gpsFile.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {(gpsFile.size / 1024).toFixed(1)} KB · GPS CSV
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setGpsFile(null); }}
                    className="flex-shrink-0 p-1 rounded text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-sm font-500 text-text/70">GPS log CSV or GPX</p>
                    <p className="text-xs text-muted-foreground">Format: timestamp, latitude, longitude</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* GPS format hint */}
          <div className="flex items-start gap-2 p-3 rounded-xl bg-info/5 border border-info/20">
            <Info size={14} className="text-info flex-shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground font-mono leading-relaxed">
              <span className="text-info font-500 font-sans">Expected CSV format:</span>
              <br />
              timestamp,latitude,longitude
              <br />
              00:00:01,21.2513,81.6293
            </div>
          </div>

          <button
            onClick={simulateProcessing}
            disabled={!videoFile}
            className="w-full btn-primary justify-center py-3 text-sm font-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
          >
            <Upload size={16} />
            Start AI Detection
            <ChevronRight size={14} className="ml-auto" />
          </button>
        </div>
      )}

      {/* Processing stages */}
      {isProcessing && (
        <div className="space-y-2 fade-in">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-500 text-text">Processing {videoFile?.name}</p>
              <p className="text-xs text-muted-foreground">Do not close this window</p>
            </div>
            <span className="font-mono text-sm font-600 text-primary">{progress}%</span>
          </div>

          {/* Overall progress bar */}
          <div className="h-2 rounded-full bg-surface-elevated overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-primary to-orange-400 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="space-y-1">
            {PROCESSING_STEPS.map((step) => (
              <StepIndicator key={step.id} step={step} currentStage={stage} />
            ))}
          </div>
        </div>
      )}

      {/* Complete state */}
      {stage === 'complete' && detectionResult && (
        <div className="fade-in space-y-4">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-success/8 border border-success/25">
            <CheckCircle size={22} className="text-success flex-shrink-0" />
            <div>
              <p className="text-sm font-600 text-text">Detection complete</p>
              <p className="text-xs text-muted-foreground">
                {detectionResult.framesExtracted} frames analyzed · {detectionResult.processingTime} total
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Potholes Found', value: detectionResult.potholesFound, color: 'text-primary' },
              { label: 'Dangerous', value: detectionResult.dangerous, color: 'text-destructive' },
              { label: 'Moderate', value: detectionResult.moderate, color: 'text-warning' },
              { label: 'Minor', value: detectionResult.minor, color: 'text-success' },
            ].map((item) => (
              <div key={item.label} className="card-elevated p-3 text-center">
                <p className={`text-2xl font-700 font-variant-numeric tabular-nums ${item.color}`}>{item.value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground text-center">
            11 complaints auto-generated and submitted to relevant departments
          </p>
        </div>
      )}

      {/* Error state */}
      {stage === 'error' && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/8 border border-destructive/25">
          <AlertCircle size={20} className="text-destructive flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-600 text-text">Detection failed</p>
            <p className="text-xs text-muted-foreground">Could not process video. Check file format and try again.</p>
          </div>
          <button onClick={handleReset} className="btn-ghost text-xs py-1 px-2">Retry</button>
        </div>
      )}
    </div>
  );
}