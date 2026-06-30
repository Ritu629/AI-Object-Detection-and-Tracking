import React, { useState, useEffect } from 'react';
import { Upload, Play, Square, Sliders, Shield, Eye, Camera, CheckSquare, SquareDot, Layers, Flame, RefreshCcw } from 'lucide-react';

export default function DashboardView() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [confidence, setConfidence] = useState(0.50);
  const [iouThreshold, setIouThreshold] = useState(0.45);
  const [selectedModel, setSelectedModel] = useState('YOLOv8n');
  const [trackerType, setTrackerType] = useState('DeepSORT');
  const [activeSource, setActiveSource] = useState('upload'); // 'upload' | 'webcam'
  const [activeVideo, setActiveVideo] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  // Active detected classes filter state
  const [classes, setClasses] = useState({
    person: true,
    car: true,
    truck: false,
    bicycle: true,
    motorcycle: false,
    dog: true,
    cat: false
  });

  // Display overlay settings
  const [displayOpts, setDisplayOpts] = useState({
    boxes: true,
    labels: true,
    conf: true,
    ids: true,
    trails: true,
    fps: true
  });

  // Simulation statistics
  const [stats, setStats] = useState({
    fps: 0,
    framesProcessed: 0,
    activeTracks: 0,
    cumulativeCount: 0,
    latency: 0
  });

  // Simulation detection log
  const [logs, setLogs] = useState([
    { time: '17:11:02', frame: 12, id: 1, class: 'Person', conf: '94%', status: 'Active' },
    { time: '17:11:03', frame: 32, id: 3, class: 'Car', conf: '88%', status: 'Active' },
    { time: '17:11:05', frame: 88, id: 1, class: 'Person', conf: '96%', status: 'Active' },
  ]);

  const handleClassToggle = (cls) => {
    setClasses(prev => ({ ...prev, [cls]: !prev[cls] }));
  };

  const handleDisplayToggle = (opt) => {
    setDisplayOpts(prev => ({ ...prev, [opt]: !prev[opt] }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setActiveVideo(URL.createObjectURL(file));
      setUploadStatus('File Selected');
      setUploadProgress(0);
      
      // Simulate an upload pipeline delay
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setUploadStatus('Uploaded Successfully');
        }
      }, 150);
    }
  };

  // Simulated telemetry loops
  useEffect(() => {
    let interval;
    if (isProcessing) {
      interval = setInterval(() => {
        setStats(prev => ({
          fps: (29.5 + Math.random() * 3).toFixed(1),
          framesProcessed: prev.framesProcessed + 1,
          activeTracks: Math.max(1, Math.min(18, prev.activeTracks + (Math.random() > 0.5 ? 1 : -1))),
          cumulativeCount: prev.cumulativeCount + (Math.random() > 0.85 ? 1 : 0),
          latency: (8 + Math.random() * 5).toFixed(0)
        }));
      }, 100);
    } else {
      setStats({ fps: 0, framesProcessed: 0, activeTracks: 0, cumulativeCount: 0, latency: 0 });
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">VisionTrack Core Engine</h1>
          <p className="text-slate-400 text-sm mt-1">Configure weights, map regions, and execute real-time YOLOv8 + DeepSORT visual tracking.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => { setActiveSource('upload'); setIsProcessing(false); setActiveVideo(null); setUploadStatus(''); }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg border transition duration-200 ${activeSource === 'upload' ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'}`}
          >
            <Upload className="w-3.5 h-3.5 inline mr-1.5" /> Video Upload
          </button>
          <button 
            onClick={() => { setActiveSource('webcam'); setIsProcessing(false); setActiveVideo(null); setUploadStatus(''); }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg border transition duration-200 ${activeSource === 'webcam' ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'}`}
          >
            <Camera className="w-3.5 h-3.5 inline mr-1.5" /> Live Webcam
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Main Feed + Logging Area */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Video / Camera Feed Canvas Wrapper */}
          <div className="aspect-video w-full rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-col items-center justify-center p-3 relative overflow-hidden group shadow-2xl">
            
            {/* Overlay indicators inside viewport */}
            {isProcessing && displayOpts.fps && (
              <div className="absolute top-4 left-4 z-10 bg-slate-950/85 border border-slate-800/60 rounded-lg px-2.5 py-1 text-[11px] font-mono text-emerald-400 font-semibold tracking-wider flex items-center gap-1.5 shadow-md">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                LIVE: {stats.fps} FPS
              </div>
            )}

            {activeSource === 'upload' ? (
              activeVideo ? (
                isProcessing ? (
                  <div className="w-full h-full relative rounded-xl overflow-hidden bg-black flex items-center justify-center">
                    {/* Simulated stream link to server backend */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent pointer-events-none"></div>
                    <div className="absolute bottom-4 left-4 bg-slate-900/90 border border-emerald-500/30 text-emerald-300 text-xs px-3 py-1.5 rounded-lg font-mono">
                      Feed Source: {videoFile?.name}
                    </div>
                    {/* Static frame fallback visualization inside preview container */}
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 border-4 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin mx-auto"></div>
                      <p className="text-xs text-slate-400 font-mono">Decoding frames and feeding YOLO-DeepSORT pipeline...</p>
                    </div>
                  </div>
                ) : (
                  <video src={activeVideo} className="w-full h-full object-contain rounded-xl" controls />
                )
              ) : (
                <label className="flex flex-col items-center justify-center cursor-pointer space-y-4 w-full h-full border-2 border-dashed border-slate-800 rounded-xl hover:border-emerald-500/30 transition duration-300">
                  <div className="p-4 bg-slate-950/50 rounded-full border border-slate-800 shadow-inner group-hover:scale-110 transition duration-300">
                    <Upload className="w-8 h-8 text-slate-500 group-hover:text-emerald-400 transition" />
                  </div>
                  <div className="text-center space-y-1">
                    <span className="text-sm font-semibold text-slate-300 block">Drag & Drop or Select Local Source Video</span>
                    <span className="text-xs text-slate-500 font-mono block">Supports MP4, MOV, AVI (Max 250MB)</span>
                  </div>
                  {uploadStatus && (
                    <div className="px-3 py-1 text-xs bg-slate-900 text-slate-400 rounded-full border border-slate-800 font-mono">
                      {uploadStatus}
                    </div>
                  )}
                  <input type="file" accept="video/*" className="hidden" onChange={handleFileUpload} />
                </label>
              )
            ) : (
              // Live Webcam Canvas Simulation
              <div className="w-full h-full flex flex-col items-center justify-center text-center space-y-4 rounded-xl relative">
                {isProcessing ? (
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin mx-auto"></div>
                    <p className="text-sm font-mono text-cyan-400">Capturing video input device 0...</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-w-sm">
                    <Camera className="w-12 h-12 text-slate-600 mx-auto" />
                    <div>
                      <h3 className="text-sm font-semibold text-slate-300">Active Camera Detection Ready</h3>
                      <p className="text-xs text-slate-500 mt-1">This uses your local browser webcam stream and pipelines frames directly to our YOLO processing thread.</p>
                    </div>
                    <button 
                      onClick={() => setIsProcessing(true)}
                      className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition duration-200 shadow-md"
                    >
                      Connect Camera
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Real-time Statistics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Active Pipeline FPS', val: isProcessing ? `${stats.fps}` : '0.0', color: 'text-emerald-400' },
              { label: 'Objects Tracked', val: isProcessing ? `${stats.activeTracks}` : '0', color: 'text-cyan-400' },
              { label: 'Total Seen Targets', val: isProcessing ? `${stats.cumulativeCount}` : '0', color: 'text-purple-400' },
              { label: 'Model Latency', val: isProcessing ? `${stats.latency} ms` : '0 ms', color: 'text-amber-400' }
            ].map((stat, idx) => (
              <div key={idx} className="bg-slate-900/50 backdrop-blur-md border border-slate-800/80 p-4 rounded-xl shadow-lg relative group overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-slate-800 group-hover:bg-emerald-500/50 transition duration-300"></div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{stat.label}</p>
                <p className={`text-2xl font-black mt-1.5 font-mono ${stat.color}`}>{stat.val}</p>
              </div>
            ))}
          </div>

          {/* Live Tracking Event Logs */}
          <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Frame Detection Registry Logs</h3>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">Updates Active</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 font-mono border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500">
                    <th className="pb-2">Time</th>
                    <th className="pb-2">Frame</th>
                    <th className="pb-2">Track ID</th>
                    <th className="pb-2">Class Target</th>
                    <th className="pb-2">Confidence</th>
                    <th className="pb-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/30">
                  {logs.map((log, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/10">
                      <td className="py-2.5 text-slate-500">{log.time}</td>
                      <td className="py-2.5 text-slate-400">{log.frame}</td>
                      <td className="py-2.5 text-emerald-400 font-bold">ID-{log.id}</td>
                      <td className="py-2.5 font-semibold text-slate-200">{log.class}</td>
                      <td className="py-2.5 text-cyan-400">{log.conf}</td>
                      <td className="py-2.5 text-right"><span className="px-1.5 py-0.5 text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded">{log.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Control Sidebar Panel */}
        <div className="space-y-6 bg-slate-900/30 border border-slate-800/80 p-5 rounded-2xl backdrop-blur-xl shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800/60">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <h2 className="font-bold text-slate-200 tracking-tight">Execution Controls</h2>
          </div>

          {/* Model Weights Architecture selection */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-[11px] text-slate-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-500" /> YOLOv8 Model Weights
              </label>
              <span className="text-[9px] bg-slate-800 border border-slate-700 text-slate-400 px-1.5 py-0.5 rounded font-mono">COCO dataset</span>
            </div>
            <select 
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500/50 transition font-mono shadow-inner cursor-pointer"
            >
              <option value="YOLOv8n">YOLOv8n (Nano - Fast - 3.2M params)</option>
              <option value="YOLOv8s">YOLOv8s (Small - Balanced - 11.2M params)</option>
              <option value="YOLOv8m">YOLOv8m (Medium - Accurate - 25.9M params)</option>
            </select>
          </div>

          {/* Multi-Object Tracker settings */}
          <div>
            <label className="text-[11px] text-slate-400 uppercase tracking-widest font-bold block mb-2 flex items-center gap-1.5">
              <SquareDot className="w-3.5 h-3.5 text-slate-500" /> Tracking Algorithm
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['SORT', 'DeepSORT'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTrackerType(t)}
                  className={`py-2 text-xs font-bold rounded-xl border capitalize transition duration-150 ${
                    trackerType === t 
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' 
                      : 'bg-slate-950 border-slate-800/80 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Double Sliders: Confidence and IoU */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-[11px] text-slate-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-slate-500" /> Confidence Threshold
                </span>
                <span className="text-emerald-400 font-mono font-bold">{(confidence * 100).toFixed(0)}%</span>
              </div>
              <input 
                type="range" min="0.1" max="0.95" step="0.05" 
                value={confidence} 
                onChange={(e) => setConfidence(parseFloat(e.target.value))}
                className="w-full accent-emerald-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-[11px] text-slate-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-slate-500" /> NMS IoU Threshold
                </span>
                <span className="text-cyan-400 font-mono font-bold">{(iouThreshold * 100).toFixed(0)}%</span>
              </div>
              <input 
                type="range" min="0.1" max="0.9" step="0.05" 
                value={iouThreshold} 
                onChange={(e) => setIouThreshold(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Class category filters */}
          <div>
            <label className="text-[11px] text-slate-400 uppercase tracking-widest font-bold block mb-2.5">
              Target Class Filters
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(classes).map((cls) => (
                <button
                  key={cls}
                  type="button"
                  onClick={() => handleClassToggle(cls)}
                  className={`px-3 py-2 rounded-xl border text-[11px] font-bold capitalize text-left transition flex items-center justify-between ${
                    classes[cls] 
                      ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300' 
                      : 'bg-slate-950 border-slate-800/80 text-slate-500'
                  }`}
                >
                  {cls}
                  {classes[cls] && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-glow" />}
                </button>
              ))}
            </div>
          </div>

          {/* Display Overlay details toggle list */}
          <div>
            <label className="text-[11px] text-slate-400 uppercase tracking-widest font-bold block mb-2.5">
              Inference View Layers
            </label>
            <div className="space-y-1.5">
              {Object.keys(displayOpts).map((opt) => (
                <label 
                  key={opt} 
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/45 border border-slate-800/60 text-xs text-slate-300 cursor-pointer hover:bg-slate-950 transition duration-150 capitalize"
                >
                  <span className="flex items-center gap-2">
                    <Eye className="w-3.5 h-3.5 text-slate-500" /> {opt === 'fps' ? 'Pipeline FPS Indicator' : `Render ${opt}`}
                  </span>
                  <input 
                    type="checkbox" checked={displayOpts[opt]} 
                    onChange={() => handleDisplayToggle(opt)}
                    className="rounded border-slate-800 text-emerald-500 focus:ring-emerald-500 bg-slate-950 accent-emerald-400"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Action trigger button */}
          <div className="pt-2">
            {isProcessing ? (
              <button 
                onClick={() => setIsProcessing(false)}
                className="w-full py-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 transition duration-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 text-white shadow-lg shadow-rose-950/10"
              >
                <Square className="w-3.5 h-3.5 fill-white" /> Stop Real-time Engine
              </button>
            ) : (
              <button 
                onClick={() => setIsProcessing(true)}
                disabled={activeSource === 'upload' && !activeVideo}
                className="w-full py-3 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition duration-200 font-bold rounded-xl text-xs flex items-center justify-center gap-2 text-slate-950 shadow-lg shadow-emerald-500/5"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" /> Start Tracking Core
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}