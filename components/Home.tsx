
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SimulationCard from './SimulationCard';
import { CATEGORIES } from '../constants';
import { MotionType } from '../types';

interface Props {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const Home: React.FC<Props> = ({ theme, toggleTheme }) => {
  const navigate = useNavigate();

  return (
    <div className="relative pb-24 overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.15),transparent_70%)]" />
        <div className="absolute w-full h-full opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/blueprint.png')]" />
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-40 glass border-b border-white/10 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-white font-bold text-xs">PV</span>
          </div>
          <span className="text-2xl font-black tracking-tighter">Physics <span className="text-blue-500">Viz</span></span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-white/5 transition-colors">
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
          <button onClick={() => navigate('/lab/projectile')} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-full font-bold transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-blue-600/20">
            Enter Lab
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[85vh] flex flex-col items-center justify-center px-6 text-center overflow-hidden">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative z-10"
        >
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-none mb-6">
            Understand Physics <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-600 to-purple-600 animate-pulse">Visually.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto mb-12 font-medium">
            Transform complex word problems into interactive, cinematic simulations powered by intelligent parsing.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/lab/projectile')}
              className="bg-white text-slate-950 px-10 py-5 rounded-2xl font-black text-xl hover:bg-blue-50 transition-all hover:scale-105 shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
            >
              Start Exploring
            </button>
            <button className="glass px-10 py-5 rounded-2xl font-bold text-xl hover:bg-white/5 transition-all">
              Watch Demo
            </button>
          </div>
        </motion.div>

        {/* Floating elements */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/4 right-[15%] text-6xl opacity-20 blur-sm pointer-events-none"
        >⚛️</motion.div>
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
          className="absolute bottom-1/4 left-[10%] text-5xl opacity-20 blur-sm pointer-events-none"
        >🏹</motion.div>
      </section>

      {/* Featured Sim - Cinematic Row */}
      <section className="px-8 mb-24">
        <h2 className="text-3xl font-black mb-8 px-4 flex items-center gap-3">
          <span className="w-1 h-8 bg-blue-600 rounded-full" />
          Featured Simulations
        </h2>
        <div className="flex gap-6 overflow-x-auto pb-10 px-4 snap-x hide-scrollbar no-scrollbar">
          {CATEGORIES.map(cat => (
            <SimulationCard
              key={cat.id}
              type={cat.id as MotionType}
              title={cat.title}
              icon={cat.icon}
              onClick={() => navigate(`/lab/${cat.id}`)}
            />
          ))}
        </div>
      </section>

      {/* Why Section */}
      <section className="max-w-7xl mx-auto px-8 py-24 border-t border-white/5">
        <div className="grid md:grid-cols-3 gap-12">
          {[
            { title: "AI-Powered Parsing", desc: "Just describe your problem in plain English. Our system extracts velocity, mass, and environment variables instantly.", icon: "🧠" },
            { title: "Real-Time Engine", desc: "Built with a high-fidelity 2D canvas engine that recalculates trajectory and force vectors at 60fps.", icon: "⚡" },
            { title: "Interactive Exploration", desc: "Change gravity from Earth to Moon or Mars with a single click to see how the laws of physics adapt.", icon: "🌍" }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -10 }}
              className="glass p-8 rounded-3xl border-white/5"
            >
              <div className="text-5xl mb-6">{item.icon}</div>
              <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
              <p className="text-slate-400 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-24 py-12 text-center text-slate-500 border-t border-white/5">
        <p>© 2025 Physics Viz. Built for the Hackathon Excellence.</p>
      </footer>
    </div>
  );
};

export default Home;
