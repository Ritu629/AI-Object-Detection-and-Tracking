import React, { useState } from 'react';
import { 
  Activity, 
  TrendingUp, 
  History, 
  Cpu, 
  ShieldCheck, 
  HardDrive, 
  Terminal, 
  Settings, 
  Layers, 
  Compass, 
  HelpCircle,
  Menu,
  X
} from 'lucide-react';

import DashboardView from './components/DashboardView';
import AnalyticsView from './components/AnalyticsView';
import HistoryView from './components/HistoryView';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // System status parameters (simulated telemetry indicators)
  const [systemHealth] = useState({
    status: 'Operational',
    gpuTemp: '68°C',
    cpuLoad: '42%',
    pipelineLatency: '12ms'
  });

  const menuItems = [
    { id: 'dashboard', label: 'Inference Studio', icon: Cpu, desc: 'Real-time YOLO processing' },
    { id: 'analytics', label: 'Telemetry Metrics', icon: TrendingUp, desc: 'Analytics & performance logs' },
    { id: 'history', label: 'Archived Registry', icon: History, desc: 'Past video logs and data assets' }
  ];

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'history':
        return <HistoryView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      
      {}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Activity className="w-5 h-5 text-slate-950" />
          </div>
          <span className="font-bold tracking-wider text-sm text-emerald-400">VISIONTRACK AI</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-slate-400 hover:text-slate-100 focus:outline-none"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-900/90 backdrop-blur-xl border-r border-slate-800/80 p-6 flex flex-col justify-between transition-transform duration-300 md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="space-y-8">
          {/* Workspace Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <Activity className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-widest text-slate-100">VISIONTRACK AI</h1>
              <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider font-mono">v8.2 Tracking Hub</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    // Auto-close on mobile selection
                    if (window.innerWidth < 768) setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-left transition duration-200 group relative ${
                    isActive 
                      ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold' 
                      : 'hover:bg-slate-800/50 border border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {/* Neon Active Glow Strip */}
                  {isActive && (
                    <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-emerald-400 rounded-r-md"></div>
                  )}
                  <Icon className={`w-5 h-5 transition duration-150 ${isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                  <div>
                    <span className="text-xs tracking-wide block">{item.label}</span>
                    <span className="text-[9px] text-slate-500 block mt-0.5 font-normal leading-none group-hover:text-slate-400 transition">{item.desc}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {}
        <div className="space-y-4 pt-6 border-t border-slate-800/60 font-mono">
          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/50 space-y-2 text-[10px]">
            <div className="flex justify-between">
              <span className="text-slate-500">SYSTEM ENG:</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                {systemHealth.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">GPU TEMP:</span>
              <span className="text-slate-300 font-bold">{systemHealth.gpuTemp}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">CPU LOAD:</span>
              <span className="text-slate-300 font-bold">{systemHealth.cpuLoad}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">LATENCY:</span>
              <span className="text-cyan-400 font-bold">{systemHealth.pipelineLatency}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" /> Engine Native
            </span>
            <span className="hover:text-slate-300 cursor-pointer">
              <Settings className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </aside>

      {}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-screen">
        <div className="max-w-7xl mx-auto space-y-6">
          {renderActiveView()}
        </div>
      </main>
    </div>
  );
}