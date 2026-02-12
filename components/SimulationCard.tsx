
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MotionType } from '../types';

interface Props {
  type: MotionType;
  title: string;
  icon: string;
  onClick: () => void;
}

const SimulationCard: React.FC<Props> = ({ type, title, icon, onClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#3b82f6';
      ctx.fillStyle = '#3b82f6';
      ctx.lineWidth = 2;

      if (type === 'projectile') {
        const x = (frame % 100) * 1.5;
        const y = 80 - (Math.sin((frame % 100) / 100 * Math.PI) * 60);
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        for (let i = 0; i < (frame % 100); i++) {
           const tx = i * 1.5;
           const ty = 80 - (Math.sin(i / 100 * Math.PI) * 60);
           ctx.lineTo(tx, ty);
        }
        ctx.stroke();
      } else if (type === 'free_fall') {
        const y = (frame % 60) * 1.5;
        ctx.beginPath();
        ctx.arc(50, y, 4, 0, Math.PI * 2);
        ctx.fill();
      } else if (type === 'inclined_plane') {
        ctx.beginPath();
        ctx.moveTo(10, 80); ctx.lineTo(90, 80); ctx.lineTo(90, 40); ctx.closePath();
        ctx.stroke();
        const t = (frame % 80) / 80;
        const bx = 90 - t * 80;
        const by = 40 + t * 40;
        ctx.fillRect(bx - 5, by - 5, 10, 10);
      } else {
        ctx.fillRect(40, 40, 20, 20);
      }

      frame++;
      requestAnimationFrame(render);
    };
    const animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [type]);

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="relative group min-w-[240px] h-[320px] glass rounded-2xl p-6 cursor-pointer overflow-hidden transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]"
    >
      <div className="flex flex-col h-full">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400 text-sm mb-6">Interactive 2D physical environment with AI-ready inputs.</p>
        
        <div className="mt-auto relative w-full h-24 bg-slate-900/50 rounded-xl overflow-hidden border border-white/5">
          <canvas ref={canvasRef} width={100} height={100} className="w-full h-full opacity-60 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-blue-600/20 text-blue-400 text-xs font-bold px-2 py-1 rounded border border-blue-500/30 uppercase tracking-widest">
          Enter Lab
        </div>
      </div>
    </motion.div>
  );
};

export default SimulationCard;
