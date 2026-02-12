
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SplashScreen from './components/SplashScreen';
import Home from './components/Home';
import SimulationLab from './components/SimulationLab';

const AppContent: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`min-h-screen transition-colors duration-700 ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <AnimatePresence mode="wait">
        {!isLoaded ? (
          <SplashScreen key="splash" />
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative"
          >
            <Routes>
              <Route path="/" element={<Home theme={theme} toggleTheme={toggleTheme} />} />
              <Route path="/lab/:type" element={<SimulationLab theme={theme} toggleTheme={toggleTheme} />} />
            </Routes>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const App: React.FC = () => (
  <HashRouter>
    <AppContent />
  </HashRouter>
);

export default App;
