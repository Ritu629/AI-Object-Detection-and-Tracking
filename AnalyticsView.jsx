import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, TrendingUp, Sparkles, Activity, Clock, Server } from 'lucide-react';

const categoryDistribution = [
  { name: 'Person', value: 142 },
  { name: 'Sedan/SUV', value: 89 },
  { name: 'Bicycle', value: 24 },
  { name: 'Freight Truck', value: 18 },
  { name: 'Companion Dog', value: 8 },
  { name: 'Domestic Cat', value: 5 }
];

const trackingHistoryPoints = [
  { time: '09:00', active: 3, latency: 9 },
  { time: '10:00', active: 6, latency: 11 },
  { time: '11:00', active: 14, latency: 12 },
  { time: '12:00', active: 9, latency: 10 },
  { time: '13:00', active: 11, latency: 11 },
  { time: '14:00', active: 15, latency: 13 },
  { time: '15:00', active: 8, latency: 9 },
];

const COLORS = ['#10b981', '#06b6d4', '#6366f1', '#f59e0b', '#ec4899', '#3b82f6'];

export default function AnalyticsView() {
  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">Telemetry & Metrics</h1>
        <p className="text-slate-400 text-sm mt-1">Review statistical distributions, tracking consistency, and pipeline performance logs compiled from the database.</p>
      </div>

      {/* Analytical KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Cumulative Detection Hits', val: '4,812', icon: Sparkles, trend: '+14% from yesterday', color: 'text-emerald-400' },
          { label: 'Mean Pipeline Framerate', val: '31.2 FPS', icon: Activity, trend: 'YOLOv8 Weights Active', color: 'text-cyan-400' },
          { label: 'Active Memory Usage', val: '1.42 GB', icon: Server, trend: 'GPU Mode: CUDA ON', color: 'text-indigo-400' }
        ].map((kpi, idx) => {
          const IconComponent = kpi.icon;
          return (
            <div key={idx} className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 shadow-xl relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-800/10 rounded-full blur-2xl group-hover:bg-emerald-500/5 transition duration-300"></div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{kpi.label}</p>
                <div className="p-2 bg-slate-950 border border-slate-800/60 rounded-xl">
                  <IconComponent className="w-5 h-5 text-slate-400" />
                </div>
              </div>
              <p className={`text-3xl font-black mt-3 font-mono ${kpi.color}`}>{kpi.val}</p>
              <p className="text-[11px] text-slate-500 font-mono mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-400" /> {kpi.trend}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Class Density Distribution (Bar Chart) */}
        <div className="bg-slate-900/30 border border-slate-800/80 p-5 rounded-2xl backdrop-blur-md shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-4.5 h-4.5 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Target Object Frequency Count</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]}>
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tracking Activity Over Time (Line Chart) */}
        <div className="bg-slate-900/30 border border-slate-800/80 p-5 rounded-2xl backdrop-blur-md shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-4.5 h-4.5 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Chronological System Tracking Load</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trackingHistoryPoints}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: 12, fontSize: 12 }} />
                <Line type="monotone" dataKey="active" stroke="#22d3ee" strokeWidth={3} name="Active Targets" dot={{ fill: '#22d3ee', r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="latency" stroke="#6366f1" strokeWidth={2} name="Latency (ms)" dot={{ fill: '#6366f1', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Circle Category Distribution Table Map */}
      <div className="bg-slate-900/30 border border-slate-800/80 p-5 rounded-2xl shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Tracking Density Distribution Analysis</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categoryDistribution.map((dist, idx) => (
            <div key={idx} className="bg-slate-950/40 border border-slate-800 p-4 rounded-xl text-center">
              <div className="w-2.5 h-2.5 rounded-full mx-auto mb-2" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
              <p className="text-[10px] text-slate-500 font-bold uppercase">{dist.name}</p>
              <p className="text-xl font-bold mt-1 text-slate-200 font-mono">{dist.value}</p>
              <p className="text-[9px] text-slate-600 font-mono mt-0.5">{(dist.value / 2.86).toFixed(1)}% density</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}