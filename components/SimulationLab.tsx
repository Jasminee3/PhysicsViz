
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PhysicsCanvas from './PhysicsCanvas';
import { parsePhysicsPrompt } from '../services/physicsParser';
import { PhysicsParams, MotionType, SimulationState, LocationGravity } from '../types';
import { PLACEHOLDERS, DEFAULT_PARAMS } from '../constants';
import GraphPanel from './GraphPanel';

interface Props {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const SimulationLab: React.FC<Props> = ({ theme, toggleTheme }) => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const motionType = (type || 'projectile') as MotionType;

  const [prompt, setPrompt] = useState('');
  const [params, setParams] = useState<PhysicsParams>(DEFAULT_PARAMS[motionType]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [showTrajectory, setShowTrajectory] = useState(true);
  const [simState, setSimState] = useState<SimulationState | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'controls' | 'graphs' | 'data'>('controls');

  useEffect(() => {
    setParams({ ...DEFAULT_PARAMS[motionType], motion_type: motionType });
    setIsPlaying(false);
  }, [motionType]);

  const handleGenerate = () => {
    const parsed = parsePhysicsPrompt(prompt, motionType);
    setParams(parsed);
    setIsPlaying(true);
  };

  const handleParamChange = (key: keyof PhysicsParams, value: any) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const currentPlaceholder = PLACEHOLDERS[motionType]?.[0] || "Describe your physics problem...";

  return (
    <div className={`h-screen flex flex-col ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-6 glass z-30">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="text-2xl hover:bg-white/5 p-2 rounded-xl transition-colors">←</button>
          <h2 className="text-xl font-black uppercase tracking-widest">{motionType.replace('_', ' ')} LAB</h2>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setIsPlaying(!isPlaying)} className={`px-6 py-2 rounded-full font-bold transition-all ${isPlaying ? 'bg-red-500 hover:bg-red-400' : 'bg-green-600 hover:bg-green-500'}`}>
            {isPlaying ? 'PAUSE' : 'PLAY'}
          </button>
          <button onClick={() => { setIsPlaying(false); setParams({...params}); }} className="glass px-6 py-2 rounded-full font-bold">RESET</button>
          <button onClick={toggleTheme} className="p-2 rounded-full glass">{theme === 'dark' ? '🌙' : '☀️'}</button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden relative">
        {/* Workspace Canvas (Center) */}
        <div className="flex-1 p-6 pb-48 relative">
          <PhysicsCanvas
            params={params}
            isPlaying={isPlaying}
            speed={speed}
            showGrid={showGrid}
            showTrajectory={showTrajectory}
            onStateUpdate={setSimState}
          />

          {/* Prompt Overlay - Adjusted to prevent overlap */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6 flex flex-col gap-3">
            <div className="flex gap-2 justify-center">
              {PLACEHOLDERS[motionType]?.map((ex, i) => (
                <button 
                  key={i} 
                  onClick={() => setPrompt(ex)} 
                  className="text-[10px] uppercase font-bold text-slate-500 hover:text-blue-400 transition-colors bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-full border border-white/10"
                >
                  Example {i+1}
                </button>
              ))}
            </div>
            <div className="glass p-2 rounded-3xl shadow-2xl flex items-center gap-2 border-white/10 bg-slate-900/60">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={currentPlaceholder}
                className="flex-1 bg-transparent border-none focus:outline-none px-6 py-4 text-lg font-medium text-white placeholder:text-slate-500"
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              />
              <button
                onClick={handleGenerate}
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
              >
                Generate
              </button>
            </div>
          </div>
        </div>

        {/* Sliding Sidebar (Right) */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              className="w-96 glass border-l border-white/10 h-full overflow-y-auto custom-scrollbar"
            >
              <div className="p-6">
                <div className="flex gap-2 mb-8 bg-black/20 p-1 rounded-xl">
                  {['controls', 'graphs', 'data'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {activeTab === 'controls' && (
                  <div className="space-y-6">
                    <section>
                      <h3 className="text-xs font-black text-slate-500 uppercase mb-4 tracking-widest">Environment</h3>
                      <div className="space-y-4">
                        <div className="flex flex-col gap-1">
                          <label className="text-sm font-bold text-slate-300">Gravity Location</label>
                          <select
                            value={params.gravity}
                            onChange={(e) => handleParamChange('gravity', parseFloat(e.target.value))}
                            className="bg-slate-900 border border-white/10 rounded-xl p-3 text-sm text-white"
                          >
                            <option value={LocationGravity.EARTH}>Earth (9.81 m/s²)</option>
                            <option value={LocationGravity.MOON}>Moon (1.62 m/s²)</option>
                            <option value={LocationGravity.MARS}>Mars (3.71 m/s²)</option>
                            <option value={LocationGravity.JUPITER}>Jupiter (24.79 m/s²)</option>
                          </select>
                        </div>
                        <div className="flex items-center justify-between glass p-4 rounded-2xl">
                          <span className="text-sm font-bold">Grid Overlay</span>
                          <input type="checkbox" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} className="w-5 h-5 accent-blue-600" />
                        </div>
                        <div className="flex items-center justify-between glass p-4 rounded-2xl">
                          <span className="text-sm font-bold">Trace Path</span>
                          <input type="checkbox" checked={showTrajectory} onChange={(e) => setShowTrajectory(e.target.checked)} className="w-5 h-5 accent-blue-600" />
                        </div>
                      </div>
                    </section>

                    <section>
                      <h3 className="text-xs font-black text-slate-500 uppercase mb-4 tracking-widest">Physical Parameters</h3>
                      <div className="space-y-6">
                        <ParamSlider label="Initial Velocity" value={params.initial_velocity} min={0} max={100} unit="m/s" onChange={v => handleParamChange('initial_velocity', v)} />
                        <ParamSlider label="Angle" value={params.angle} min={0} max={90} unit="°" onChange={v => handleParamChange('angle', v)} />
                        <ParamSlider label="Height" value={params.initial_height} min={0} max={200} unit="m" onChange={v => handleParamChange('initial_height', v)} />
                        <ParamSlider label="Mass" value={params.mass} min={0.1} max={50} unit="kg" onChange={v => handleParamChange('mass', v)} />
                        {params.motion_type === 'newton_second_law' && (
                          <ParamSlider label="Applied Force" value={params.force || 0} min={0} max={500} unit="N" onChange={v => handleParamChange('force', v)} />
                        )}
                        {params.motion_type === 'spring' && (
                          <ParamSlider label="Spring K" value={params.spring_k || 200} min={50} max={1000} unit="N/m" onChange={v => handleParamChange('spring_k', v)} />
                        )}
                      </div>
                    </section>
                  </div>
                )}

                {activeTab === 'data' && (
                   <div className="grid grid-cols-1 gap-4">
                      <DataCard label="Current Velocity" value={simState?.velY.toFixed(2) || "0.00"} unit="m/s" color="text-blue-400" />
                      <DataCard label="Current Position (Y)" value={simState?.posY.toFixed(2) || "0.00"} unit="m" color="text-purple-400" />
                      <DataCard label="Acceleration" value={params.gravity.toFixed(2)} unit="m/s²" color="text-red-400" />
                      <DataCard label="Momentum" value={(params.mass * (simState?.velY || 0)).toFixed(2)} unit="kg·m/s" color="text-green-400" />
                      
                      <div className="mt-8 glass p-6 rounded-3xl border-white/5">
                        <h4 className="text-xs font-black uppercase text-slate-500 mb-4">Educational Insights</h4>
                        <p className="text-sm text-slate-400 leading-relaxed italic">
                          "Changing location to the <strong>Moon</strong> increases flight time because gravity is 1/6th of Earth's. Observe how the object hangs longer in the air."
                        </p>
                      </div>
                   </div>
                )}

                {activeTab === 'graphs' && (
                  <GraphPanel history={simState?.history || []} />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-40 glass p-2 rounded-l-2xl border-r-0 border-white/10 hover:bg-white/10 transition-all"
        >
          {sidebarOpen ? '→' : '←'}
        </button>
      </main>
    </div>
  );
};

const ParamSlider: React.FC<{ label: string; value: number; min: number; max: number; unit: string; onChange: (v: number) => void }> = ({ label, value, min, max, unit, onChange }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-xs font-bold">
      <span className="text-slate-400">{label}</span>
      <span className="text-blue-400">{value} {unit}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={label === 'Mass' ? 0.1 : 1}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
    />
  </div>
);

const DataCard: React.FC<{ label: string; value: string; unit: string; color: string }> = ({ label, value, unit, color }) => (
  <div className="glass p-4 rounded-2xl border-white/5">
    <div className="text-[10px] font-black uppercase text-slate-500 mb-1">{label}</div>
    <div className={`text-2xl font-black ${color}`}>{value} <span className="text-xs font-normal opacity-50">{unit}</span></div>
  </div>
);

export default SimulationLab;
