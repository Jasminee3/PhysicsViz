
import React from 'react';
import { motion } from 'framer-motion';

const SplashScreen: React.FC = () => {
  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 overflow-hidden"
    >
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.3)_0%,transparent_70%)]" />
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="relative w-32 h-32 mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent shadow-[0_0_20px_rgba(59,130,246,0.5)]"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 border-4 border-purple-500 rounded-full border-b-transparent shadow-[0_0_20px_rgba(168,85,247,0.5)]"
          />
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_15px_white]" />
          </div>
        </div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-6xl font-black tracking-tighter text-white"
        >
          Physics <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 text-glow">Viz</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-4 text-slate-400 font-medium tracking-widest uppercase text-sm"
        >
          AI-Powered Interactive Physics Experience
        </motion.p>
      </motion.div>

      {/* Flashing Icons */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
            style={{
              position: 'absolute',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              fontSize: '2rem'
            }}
          >
            {['📐', '⚛️', '⚡', '🌀', '🍎', '🏹'][i % 6]}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SplashScreen;
