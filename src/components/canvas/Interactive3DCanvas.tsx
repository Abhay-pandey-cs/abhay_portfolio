'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Cpu, Layers, Terminal, Database, Activity, RefreshCw } from 'lucide-react';

interface Interactive3DCanvasProps {
  splineUrl?: string;
  className?: string;
}

export const Interactive3DCanvas: React.FC<Interactive3DCanvasProps> = ({ splineUrl, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeMode, setActiveMode] = useState<'interactive-mesh' | 'spline-3d'>('interactive-mesh');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeNode, setActiveNode] = useState<string | null>(null);

  // Floating technical nodes in the 3D space
  const techNodes = [
    { id: 'java', label: 'Java 21 / JVM', icon: Cpu, color: '#f89820', x: 20, y: 30, desc: 'Heap, Stack & Concurrency' },
    { id: 'spring', label: 'Spring Boot', icon: Layers, color: '#6db33f', x: 75, y: 25, desc: 'IoC & REST APIs' },
    { id: 'esp32', label: 'ESP32 MCU', icon: Activity, color: '#e73525', x: 80, y: 70, desc: 'AgroSmart Dual-Core IoT' },
    { id: 'linux', label: 'Linux Kernel', icon: Terminal, color: '#fcc624', x: 25, y: 75, desc: 'Syscalls & Virtual Memory' },
    { id: 'pg', label: 'PostgreSQL', icon: Database, color: '#336791', x: 50, y: 85, desc: 'ACID & B-Tree Indexes' }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight || 450;
    };

    window.addEventListener('resize', handleResize);

    // Particle nodes definition
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      radius: Math.random() * 2 + 1.2,
      baseAlpha: Math.random() * 0.4 + 0.2,
      color: Math.random() > 0.6 ? '#007acc' : Math.random() > 0.3 ? '#5865f2' : '#25d366'
    }));

    let currentMouseX = width / 2;
    let currentMouseY = height / 2;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      currentMouseX = e.clientX - rect.left;
      currentMouseY = e.clientY - rect.top;
      setMousePos({ x: currentMouseX, y: currentMouseY });
    };

    window.addEventListener('mousemove', onMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update & Draw particles
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse attraction/repulsion
        const dx = currentMouseX - p.x;
        const dy = currentMouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          p.x -= (dx / dist) * 0.8;
          p.y -= (dy / dist) * 0.8;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.baseAlpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const distNodes = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (distNodes < 90) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = (1 - distNodes / 90) * 0.18;
            ctx.stroke();
            ctx.globalAlpha = 1.0;
          }
        }

        // Connect to mouse
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(currentMouseX, currentMouseY);
          ctx.strokeStyle = '#007acc';
          ctx.globalAlpha = (1 - dist / 130) * 0.25;
          ctx.stroke();
          ctx.globalAlpha = 1.0;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={`relative w-full h-[380px] md:h-[460px] rounded-xl overflow-hidden border border-[#2e3038] bg-[#15161a]/80 shadow-2xl ${className}`}>
      {/* Top control bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between px-3 py-1.5 bg-[#1e1f24]/90 backdrop-blur-md rounded-lg border border-[#363842] text-xs font-mono">
        <div className="flex items-center gap-2 text-gray-300">
          <Sparkles className="w-3.5 h-3.5 text-[#007acc]" />
          <span className="text-gray-400">Interactive Architecture Engine</span>
          <span className="px-1.5 py-0.5 rounded bg-[#007acc]/20 text-[#38bdf8] text-[10px]">WebGL 60FPS</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveMode('interactive-mesh')}
            className={`px-2.5 py-1 rounded transition-all flex items-center gap-1.5 ${
              activeMode === 'interactive-mesh'
                ? 'bg-[#007acc] text-white font-semibold'
                : 'text-gray-400 hover:text-white bg-[#25272e]'
            }`}
          >
            <Cpu className="w-3 h-3" />
            <span>Interactive Mesh</span>
          </button>
          {splineUrl && (
            <button
              onClick={() => setActiveMode('spline-3d')}
              className={`px-2.5 py-1 rounded transition-all flex items-center gap-1.5 ${
                activeMode === 'spline-3d'
                  ? 'bg-[#5865f2] text-white font-semibold'
                  : 'text-gray-400 hover:text-white bg-[#25272e]'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>Spline 3D Scene</span>
            </button>
          )}
        </div>
      </div>

      {/* Main visual display */}
      {activeMode === 'interactive-mesh' ? (
        <div className="relative w-full h-full">
          <canvas ref={canvasRef} className="w-full h-full block" />

          {/* Interactive Floating Tech Badges */}
          {techNodes.map((node) => (
            <div
              key={node.id}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              onMouseEnter={() => setActiveNode(node.id)}
              onMouseLeave={() => setActiveNode(null)}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group transition-transform duration-300 hover:scale-110"
            >
              <div 
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md transition-all shadow-lg"
                style={{
                  backgroundColor: 'rgba(26, 27, 34, 0.85)',
                  borderColor: activeNode === node.id ? node.color : 'rgba(255, 255, 255, 0.12)',
                  boxShadow: activeNode === node.id ? `0 0 16px ${node.color}55` : 'none'
                }}
              >
                <node.icon className="w-3.5 h-3.5" style={{ color: node.color }} />
                <span className="text-xs font-mono font-medium text-gray-200">{node.label}</span>
              </div>

              {/* Hover detail tooltip */}
              {activeNode === node.id && (
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-48 p-2.5 bg-[#1e2026] border border-[#3e424e] rounded-lg shadow-xl text-center z-30 animate-in fade-in zoom-in duration-200">
                  <p className="text-[11px] font-mono text-gray-300">{node.desc}</p>
                </div>
              )}
            </div>
          ))}

          {/* Bottom telemetry hint */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between pointer-events-none text-[11px] font-mono text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#25d366] animate-ping" />
              Hover nodes or move cursor to interact with system architecture
            </span>
            <span className="hidden sm:inline text-gray-400">System: Active · Low-Latency</span>
          </div>
        </div>
      ) : (
        <div className="w-full h-full pt-10">
          <iframe
            src={splineUrl}
            frameBorder="0"
            width="100%"
            height="100%"
            className="w-full h-full pointer-events-auto"
            title="Spline 3D Scene"
          />
        </div>
      )}
    </div>
  );
};
