
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  history: { t: number; x: number; y: number; vx: number; vy: number; ax: number; ay: number }[];
}

const GraphPanel: React.FC<Props> = ({ history }) => {
  const [metric, setMetric] = useState<'height' | 'velocity' | 'acceleration'>('height');

  const chartData = history.filter((_, i) => i % 5 === 0).map(p => ({
    time: p.t.toFixed(2),
    height: p.y.toFixed(2),
    velocity: Math.sqrt(p.vx * p.vx + p.vy * p.vy).toFixed(2),
    acceleration: Math.sqrt(p.ax * p.ax + p.ay * p.ay).toFixed(2)
  }));

  const metricConfig = {
    height: { color: "#3b82f6", label: "Height (m)" },
    velocity: { color: "#8b5cf6", label: "Velocity (m/s)" },
    acceleration: { color: "#ef4444", label: "Acc. (m/s²)" }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex p-1 glass rounded-xl gap-1">
        {(['height', 'velocity', 'acceleration'] as const).map(m => (
          <button
            key={m}
            onClick={() => setMetric(m)}
            className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${metric === m ? 'bg-white/10 text-white' : 'text-slate-500'}`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-[300px] w-full glass rounded-3xl p-4 border-white/5">
        <h4 className="text-xs font-bold text-slate-500 mb-4 uppercase">{metricConfig[metric].label} vs Time</h4>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={metricConfig[metric].color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={metricConfig[metric].color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
            <YAxis stroke="#64748b" fontSize={10} />
            <Tooltip 
              contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} 
              labelStyle={{ color: '#94a3b8' }}
            />
            <Area 
              type="monotone" 
              dataKey={metric} 
              stroke={metricConfig[metric].color} 
              fillOpacity={1} 
              fill="url(#colorMetric)" 
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="glass p-4 rounded-2xl border-white/5">
        <div className="text-[10px] font-black uppercase text-slate-500 mb-2">Equation Used</div>
        <div className="font-mono text-sm text-blue-400">
          {metric === 'height' ? 'y = h + v₀sin(θ)t - ½gt²' : 
           metric === 'velocity' ? 'v = v₀ + at' : 'F = ma'}
        </div>
      </div>
    </div>
  );
};

export default GraphPanel;
