
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { PhysicsParams, SimulationState, MotionType } from '../types';

interface Props {
  params: PhysicsParams;
  isPlaying: boolean;
  speed: number;
  showGrid: boolean;
  showTrajectory: boolean;
  onStateUpdate: (state: SimulationState) => void;
}

const PhysicsCanvas: React.FC<Props> = ({ params, isPlaying, speed, showGrid, showTrajectory, onStateUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<SimulationState>({
    time: 0, posX: 0, posY: 0, velX: 0, velY: 0, accX: 0, accY: 0, isCompleted: false, history: []
  });
  const requestRef = useRef<number | undefined>(undefined);

  const resetState = useCallback(() => {
    const p = params;
    const rad = (p.angle * Math.PI) / 180;
    
    // Initial conditions based on motion type
    // Coordinates are in meters. Canvas width 1200px / 5 scale = 240m horizontal range.
    let initX = 20; 
    let initY = 0; 
    let initVX = 0;
    let initVY = 0;
    let initAX = 0;
    let initAY = -p.gravity;

    switch (p.motion_type) {
      case 'projectile':
        initX = 20;
        initY = p.initial_height;
        initVX = p.initial_velocity * Math.cos(rad);
        initVY = p.initial_velocity * Math.sin(rad);
        break;
      case 'free_fall':
        initX = 120; // Centered
        initY = p.initial_height;
        initVX = 0;
        initVY = 0;
        break;
      case 'newton_second_law':
        initX = 20;
        initY = 0;
        initAX = p.force ? p.force / p.mass : 0;
        initAY = 0;
        break;
      case 'inclined_plane':
        initX = 40;
        initY = Math.tan(rad) * 160;
        initAY = -p.gravity * Math.cos(rad);
        initAX = p.gravity * Math.sin(rad);
        break;
      case 'spring':
        initX = 120;
        initY = 0;
        break;
    }

    stateRef.current = {
      time: 0,
      posX: initX,
      posY: initY,
      velX: initVX,
      velY: initVY,
      accX: initAX,
      accY: initAY,
      isCompleted: false,
      history: []
    };
  }, [params]);

  useEffect(() => {
    resetState();
  }, [resetState]);

  const update = useCallback((dt: number) => {
    if (!isPlaying || stateRef.current.isCompleted) return;

    const s = stateRef.current;
    const p = params;
    const actualDt = dt * speed;

    let nextX = s.posX;
    let nextY = s.posY;
    let nextVX = s.velX;
    let nextVY = s.velY;
    let nextAX = s.accX;
    let nextAY = s.accY;

    if (p.motion_type === 'projectile' || p.motion_type === 'free_fall') {
      nextVX += nextAX * actualDt;
      nextVY += nextAY * actualDt;
      nextX += nextVX * actualDt;
      nextY += nextVY * actualDt;

      if (nextY <= 0) {
        nextY = 0;
        stateRef.current.isCompleted = true;
      }
    } else if (p.motion_type === 'newton_second_law') {
      nextVX += nextAX * actualDt;
      nextX += nextVX * actualDt;
      if (nextX > 220) stateRef.current.isCompleted = true;
    } else if (p.motion_type === 'spring') {
      const k = p.spring_k || 200;
      const x = s.posX - 120; // equilibrium at 120m
      nextAX = (-k * x) / p.mass;
      nextVX += nextAX * actualDt;
      nextX += nextVX * actualDt;
    } else if (p.motion_type === 'inclined_plane') {
      const rad = (p.angle * Math.PI) / 180;
      const a = p.gravity * Math.sin(rad);
      nextVX += a * actualDt;
      nextX += nextVX * actualDt * Math.cos(rad);
      nextY -= nextVX * actualDt * Math.sin(rad);
      if (nextY <= 0) {
        nextY = 0;
        stateRef.current.isCompleted = true;
      }
    }

    const newState = {
      ...s,
      time: s.time + actualDt,
      posX: nextX,
      posY: nextY,
      velX: nextVX,
      velY: nextVY,
      accX: nextAX,
      accY: nextAY,
      history: [...s.history, { t: s.time, x: nextX, y: nextY, vx: nextVX, vy: nextVY, ax: nextAX, ay: nextAY }]
    };

    stateRef.current = newState;
    onStateUpdate(newState);
  }, [isPlaying, speed, params, onStateUpdate]);

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    const { width, height } = ctx.canvas;
    ctx.clearRect(0, 0, width, height);

    const scale = 5; // pixels per meter
    const groundY = height - 100;
    const offsetX = 0;

    // Background Styling
    const isMoon = params.environment_context === 'moon';
    ctx.fillStyle = isMoon ? '#0a0a0a' : '#0f172a';
    ctx.fillRect(0, 0, width, height);

    if (isMoon) {
      ctx.fillStyle = '#1a1a1a';
      ctx.beginPath(); ctx.arc(200, height-80, 40, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(600, height-95, 20, 0, Math.PI*2); ctx.fill();
    }

    if (showGrid) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 50) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }
      for (let y = 0; y < height; y += 50) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }
    }

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(0, groundY); ctx.lineTo(width, groundY); ctx.stroke();

    const { posX, posY, history, time } = stateRef.current;
    const canvasX = offsetX + posX * scale;
    const canvasY = groundY - posY * scale;

    // Start coordinates for environment elements
    const startXUnits = params.motion_type === 'projectile' ? 20 : 120;
    const envX = startXUnits * scale;

    // Environment Visuals
    if (params.environment_context === 'tower' || (params.motion_type === 'free_fall' && params.initial_height > 0)) {
      ctx.fillStyle = '#475569';
      const towerWidth = 40;
      const towerHeight = params.initial_height * scale;
      ctx.fillRect(envX - 20, groundY - towerHeight, towerWidth, towerHeight);
      
      ctx.fillStyle = '#1e293b';
      const winCount = Math.min(10, Math.floor(params.initial_height / 10));
      for (let i = 1; i <= winCount; i++) {
        ctx.fillRect(envX - 10, groundY - (i * 40), 20, 20);
      }
      ctx.fillStyle = '#64748b';
      ctx.fillRect(envX - 30, groundY - towerHeight - 5, towerWidth + 20, 10);
    } else if (params.environment_context === 'cliff') {
       ctx.fillStyle = '#334155';
       ctx.beginPath();
       ctx.moveTo(0, groundY);
       ctx.lineTo(envX, groundY);
       ctx.lineTo(envX, groundY - params.initial_height * scale);
       ctx.lineTo(0, groundY - params.initial_height * scale);
       ctx.fill();
    } else if (params.environment_context === 'bridge') {
       ctx.fillStyle = '#475569';
       const bridgeY = groundY - params.initial_height * scale;
       ctx.fillRect(0, bridgeY, width, 20);
       for(let i=1; i<6; i++) ctx.fillRect(i*240 - 10, bridgeY, 20, groundY - bridgeY);
    } else if (params.environment_context === 'standard' && params.initial_height > 0) {
       ctx.fillStyle = '#334155';
       ctx.fillRect(envX - 30, groundY - params.initial_height * scale, 60, 10);
    }

    if (showTrajectory && history.length > 1) {
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(offsetX + history[0].x * scale, groundY - history[0].y * scale);
      history.forEach(p => ctx.lineTo(offsetX + p.x * scale, groundY - p.y * scale));
      ctx.stroke();
      ctx.setLineDash([]);
    }

    if (params.actor === 'human') {
      const hx = envX - 30;
      const hy = groundY - params.initial_height * scale;
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(hx, hy - 40, 8, 0, Math.PI * 2); ctx.stroke(); // Head
      ctx.beginPath(); ctx.moveTo(hx, hy - 32); ctx.lineTo(hx, hy - 10); ctx.stroke(); // Body
      ctx.beginPath(); ctx.moveTo(hx, hy - 10); ctx.lineTo(hx - 10, hy); ctx.stroke(); // Legs
      ctx.beginPath(); ctx.moveTo(hx, hy - 10); ctx.lineTo(hx + 10, hy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(hx, hy - 28); ctx.lineTo(hx - 15, hy - 20); ctx.stroke(); // Left arm
      
      // Right arm release logic
      const releaseDuration = 0.2;
      let targetX, targetY;
      if (time === 0) {
        targetX = canvasX; targetY = canvasY;
      } else if (time < releaseDuration) {
        targetX = canvasX; targetY = canvasY;
      } else {
        targetX = hx + 15; targetY = hy - 15; // Reset to side
      }
      ctx.beginPath(); ctx.moveTo(hx, hy - 28); ctx.lineTo(targetX, targetY); ctx.stroke();
    }

    ctx.fillStyle = '#3b82f6';
    ctx.shadowBlur = 15;
    ctx.shadowColor = 'rgba(59, 130, 246, 0.5)';
    if (params.object === 'ball' || params.object === 'stone') {
      ctx.beginPath(); ctx.arc(canvasX, canvasY, 10, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.fillRect(canvasX - 15, canvasY - 15, 30, 30);
    }
    ctx.shadowBlur = 0;

    if (isPlaying && !stateRef.current.isCompleted) {
       ctx.strokeStyle = '#ef4444';
       ctx.beginPath();
       ctx.moveTo(canvasX, canvasY);
       ctx.lineTo(canvasX + stateRef.current.velX * 2, canvasY - stateRef.current.velY * 2);
       ctx.stroke();
    }
  }, [params, showGrid, showTrajectory, isPlaying]);

  const animate = useCallback((time: number) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        update(0.016);
        draw(ctx);
      }
    }
    requestRef.current = requestAnimationFrame(animate);
  }, [update, draw]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [animate]);

  return (
    <div className="relative w-full h-full bg-slate-950 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
      <canvas ref={canvasRef} width={1200} height={800} className="w-full h-full object-contain" />
      <div className="absolute top-6 left-6 flex gap-4">
        <div className="glass px-4 py-2 rounded-xl text-xs font-mono">
          <span className="text-slate-400">Time:</span> <span className="text-blue-400">{stateRef.current.time.toFixed(2)}s</span>
        </div>
        <div className="glass px-4 py-2 rounded-xl text-xs font-mono">
          <span className="text-slate-400">Gravity:</span> <span className="text-purple-400">{params.gravity} m/s²</span>
        </div>
      </div>
    </div>
  );
};

export default PhysicsCanvas;
