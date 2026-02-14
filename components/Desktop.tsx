import React, { useEffect, useRef, useState } from 'react';
import { useWindowStore } from '../store/useWindowStore';
import { AppConfig } from '../types';
import Icon from './Icon';
import Window from './Window';
import Taskbar from './Taskbar';
import StartMenu from './StartMenu';
import { AnimatePresence, motion } from 'framer-motion';
import { MousePointerClick } from 'lucide-react';

// --- Technical Corpus ---
const EQUATIONS = [
  { id: 1, tex: "e^{iπ} + 1 = 0", label: "EULER ID", pos: "top-[10%] left-[5%]" },
  { id: 2, tex: "iℏ ∂Ψ/∂t = ĤΨ", label: "SCHRÖDINGER", pos: "top-[15%] right-[10%]" },
  { id: 3, tex: "∮ E⋅dA = Q/ε₀", label: "GAUSS LAW", pos: "bottom-[20%] left-[8%]" },
  { id: 4, tex: "f'(x) = lim(h→0) [f(x+h)-f(x)]/h", label: "DERIVATIVE", pos: "bottom-[15%] right-[15%]" },
  { id: 5, tex: "A = ∫_a^b f(x)dx", label: "INTEGRAL", pos: "top-[40%] left-[12%]" },
  { id: 6, tex: "x(t) = A cos(ωt + φ)", label: "HARMONIC", pos: "top-[30%] left-[50%]" },
  { id: 7, tex: "∇ × B = μ₀J + μ₀ε₀∂E/∂t", label: "AMPERE", pos: "bottom-[40%] right-[8%]" },
  { id: 8, tex: "sin²θ + cos²θ = 1", label: "TRIGONOMETRY", pos: "top-[8%] right-[30%]" },
  { id: 9, tex: "V - E + F = 2", label: "EULER CHAR", pos: "bottom-[5%] left-[40%]" },
  { id: 10, tex: "E = mc²", label: "RELATIVITY", pos: "bottom-[10%] left-[20%]" },
];

const BlueprintCanvas: React.FC<{ theme: any }> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    let animationFrameId: number;
    
    // Helper to detect mobile for scaling purposes (not for hiding)
    const isMobile = window.innerWidth < 768;

    const resize = () => {
      // Limit DPR on mobile to prevent overheating while maintaining quality
      const dpr = isMobile ? Math.min(window.devicePixelRatio, 2) : (window.devicePixelRatio || 1);
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };
    
    window.addEventListener('resize', resize);
    resize();

    // --- Complex Drawing Helpers ---

    const drawGrid = (w: number, h: number, color: string) => {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 0.5;
      const step = isMobile ? 50 : 60;

      for (let x = 0; x <= w; x += step) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      for (let y = 0; y <= h; y += step) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.stroke();

      // Coordinates text
      ctx.fillStyle = color;
      ctx.font = '9px monospace';
      // Draw fewer coordinates on mobile
      const labelStep = isMobile ? step * 3 : step * 2;
      for (let x = 0; x <= w; x += labelStep) {
          ctx.fillText(`x:${x}`, x + 2, 10);
      }
      for (let y = 0; y <= h; y += labelStep) {
          ctx.fillText(`y:${y}`, 2, y - 2);
      }
    };

    // Lissajous Figure (Complex Harmonic Motion)
    const drawLissajous = (cx: number, cy: number, size: number, color: string) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        
        // Parameters: x = A sin(at + δ), y = B sin(bt)
        const a = 3;
        const b = 2;
        const delta = time * 0.5; // Phase shift changing over time
        
        const res = isMobile ? 0.05 : 0.02; 
        
        for (let t = 0; t <= Math.PI * 2; t += res) {
            const x = size * Math.sin(a * t + delta);
            const y = size * Math.sin(b * t);
            if (t === 0) ctx.moveTo(cx + x, cy + y);
            else ctx.lineTo(cx + x, cy + y);
        }
        ctx.stroke();

        // Moving dot on curve
        const tx = size * Math.sin(a * time + delta);
        const ty = size * Math.sin(b * time);
        ctx.fillStyle = color.replace('0.15', '0.8').replace('0.1', '0.5'); // Brighter opacity
        ctx.beginPath();
        ctx.arc(cx + tx, cy + ty, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Label
        ctx.font = '10px monospace';
        ctx.fillStyle = color;
        ctx.fillText(`LISSAJOUS [3:2]`, cx - 35, cy + size + 15);
    };

    // Wave Packet (Interference Pattern)
    const drawWavePacket = (cx: number, cy: number, width: number, color: string) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        
        const step = isMobile ? 4 : 2;
        
        for(let x = -width/2; x < width/2; x+=step) {
            // Envelope * Carrier
            // Gaussian envelope: e^(-x^2)
            const envelope = Math.exp(-Math.pow(x / (width * 0.25), 2));
            // Carrier wave traveling
            const carrier = Math.cos(0.2 * x - time * 4);
            
            const y = envelope * carrier * 40; // Amplitude 40
            
            if (x === -width/2) ctx.moveTo(cx + x, cy + y);
            else ctx.lineTo(cx + x, cy + y);
        }
        ctx.stroke();
        
        ctx.fillStyle = color;
        ctx.fillText(`ψ(x,t)`, cx - 15, cy + 50);
    };

    // Tesseract (Hypercube) Projection
    // 4D Rotation matrices projected to 3D then 2D
    const drawTesseract = (cx: number, cy: number, scale: number, color: string) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;

        // 16 Vertices of a Tesseract
        const points4D = [];
        for(let i=0; i<16; i++) {
            points4D.push([
                (i & 1) ? 1 : -1,
                (i & 2) ? 1 : -1,
                (i & 4) ? 1 : -1,
                (i & 8) ? 1 : -1
            ]);
        }

        // Rotations
        const angle = time * 0.4;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        // Project 4D -> 2D
        const points2D = points4D.map(p => {
            let [x, y, z, w] = p;

            // Rotate in XW plane
            let tx = x * cos - w * sin;
            let tw = x * sin + w * cos;
            x = tx; w = tw;

            // Rotate in ZW plane
            let tz = z * cos - w * sin;
            tw = z * sin + w * cos;
            z = tz; w = tw;

            // 4D to 3D projection (Perspective)
            const dist4 = 3;
            const factor4 = dist4 / (dist4 - w);
            x *= factor4; y *= factor4; z *= factor4;

            // 3D rotation (Y axis)
            tx = x * Math.cos(angle * 0.5) - z * Math.sin(angle * 0.5);
            tz = x * Math.sin(angle * 0.5) + z * Math.cos(angle * 0.5);
            x = tx; z = tz;

            // 3D to 2D projection
            const dist3 = 3;
            const factor3 = dist3 / (dist3 - z);
            
            return {
                x: cx + x * scale * factor3,
                y: cy + y * scale * factor3
            };
        });

        // Edges
        // In a tesseract, vertices connect if they differ by exactly 1 coordinate
        for(let i=0; i<16; i++) {
            for(let j=i+1; j<16; j++) {
                // Check Hamming distance using XOR power of 2 check
                const diff = i ^ j;
                if ((diff & (diff - 1)) === 0) { // is power of 2
                    ctx.beginPath();
                    ctx.moveTo(points2D[i].x, points2D[i].y);
                    ctx.lineTo(points2D[j].x, points2D[j].y);
                    ctx.stroke();
                }
            }
        }
        
        // Nodes
        ctx.fillStyle = color;
        points2D.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2, 0, Math.PI*2);
            ctx.fill();
        });
        
        ctx.fillText(`HYPERCUBE 4D`, cx - 35, cy + scale + 30);
    };

    const render = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      time += 0.015;
      ctx.clearRect(0, 0, w, h);

      const isDark = theme.isDarkMode;
      // Slightly more visible on mobile to compensate for screen size
      const opacityMult = isMobile ? 1.5 : 1.0;
      
      const gridColor = isDark ? `rgba(255,255,255,${0.05 * opacityMult})` : `rgba(0,0,0,${0.04 * opacityMult})`;
      const accentColor = isDark ? `rgba(255,255,255,${0.2 * opacityMult})` : `rgba(0,0,0,${0.15 * opacityMult})`;
      const mathColor = isDark ? `rgba(255,255,255,${0.15 * opacityMult})` : `rgba(0,0,0,${0.1 * opacityMult})`;

      drawGrid(w, h, gridColor);
      
      // Adaptive Layout for Visuals
      if (isMobile) {
          // Stacked layout for mobile
          drawTesseract(w * 0.5, h * 0.25, 30, accentColor);
          drawWavePacket(w * 0.5, h * 0.5, w * 0.8, mathColor);
          drawLissajous(w * 0.5, h * 0.75, 40, accentColor);
      } else {
          // Spread layout for desktop
          drawTesseract(w * 0.85, h * 0.25, 40, accentColor);
          drawLissajous(w * 0.15, h * 0.25, 50, accentColor);
          drawWavePacket(w * 0.5, h * 0.5, 300, mathColor);
          
          // Integration Area (Desktop only for variety, or could fit on mobile if scaled)
          // Keeping it desktop-focused to fill empty space
          drawIntegrationArea(w * 0.15, h * 0.75, accentColor); 
      }
      
      // Time Delta
      ctx.fillStyle = mathColor;
      ctx.font = '10px monospace';
      ctx.fillText(`Δt: ${time.toFixed(2)}`, w - 80, h - 20);
      
      animationFrameId = requestAnimationFrame(render);
    };

    // Helper for integration (moved inside to access ctx/isMobile easily if needed)
    const drawIntegrationArea = (cx: number, cy: number, color: string) => {
        ctx.strokeStyle = color;
        ctx.fillStyle = color.replace('0.2', '0.05').replace('0.15', '0.05');
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        for(let x=0; x<=100; x+=5) {
            const y = 0.008 * (x-50)**2;
            ctx.lineTo(cx + x, cy - 60 + y);
        }
        ctx.lineTo(cx + 100, cy);
        ctx.lineTo(cx, cy);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = color;
        ctx.fillText("∫ f(x)dx", cx + 30, cy + 15);
    };

    render();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};

interface DesktopProps {
  apps: AppConfig[];
}

const Desktop: React.FC<DesktopProps> = ({ apps }) => {
  const { windows, openWindow, theme, isMobile } = useWindowStore();
  const [toast, setToast] = useState<string | null>(null);
  const toastTimeout = useRef<number | null>(null);

  const handleSingleClick = () => {
    // Only show if no window is currently being opened (basic check) and preventing spam
    if (toast) return;
    
    // Updated mobile text to "Double-tap" as requested
    setToast(isMobile ? "Double-tap to open app" : "Double-click to launch application");
    
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    toastTimeout.current = window.setTimeout(() => setToast(null), 2000);
  };

  return (
    <div 
      className="relative w-screen h-screen overflow-hidden transition-colors duration-700 ease-in-out bg-[#E0E7FF] dark:bg-[#0f172a]"
      style={{ 
        backgroundColor: theme.isDarkMode ? '#0f172a' : theme.background 
      }}
    >
      {/* 1. Mathematical Canvas Layer */}
      <BlueprintCanvas theme={theme} />

      {/* 2. Floating Equations Layer - Adapted for both Mobile and Desktop */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
         {EQUATIONS.map((eq) => (
          <div 
            key={eq.id}
            className={`absolute ${eq.pos} transition-colors duration-500`}
          >
            {/* Responsive opacity and hover effects */}
            <div className={`flex flex-col items-start transition-opacity ${isMobile ? 'opacity-20' : 'opacity-30 hover:opacity-60'}`}>
               
               {/* Decorative corner bracket */}
               <div className={`border-t-2 border-l-2 mb-1 border-black dark:border-white ${isMobile ? 'w-2 h-2' : 'w-3 h-3'}`} />
               
               {/* Equation Text */}
               <div className={`px-2 font-serif font-bold tracking-wider italic text-black dark:text-white ${isMobile ? 'text-xs' : 'text-lg md:text-xl'}`}>
                 {eq.tex}
               </div>
               
               {/* Label Text */}
               <div className={`px-2 mt-1 font-mono uppercase tracking-widest text-gray-600 dark:text-gray-400 ${isMobile ? 'text-[7px]' : 'text-[9px]'}`}>
                 {eq.label}
               </div>

               {/* Decorative bottom corner */}
               <div className={`border-b-2 border-r-2 mt-1 self-end border-black dark:border-white ${isMobile ? 'w-2 h-2' : 'w-3 h-3'}`} />
            </div>
          </div>
        ))}
      </div>

      {/* 3. Icon Grid */}
      <div className={`absolute inset-0 p-6 pb-40 overflow-auto z-10 flex flex-row flex-wrap content-start gap-8`}>
        {apps.map((app) => (
          <Icon 
            key={app.id} 
            id={app.id} 
            title={app.title} 
            icon={app.icon} 
            onDoubleClick={() => openWindow(app.id, app.title)}
            onSingleClick={handleSingleClick}
          />
        ))}
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: isMobile ? -20 : 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: isMobile ? -20 : 20, x: "-50%" }}
            transition={{ duration: 0.2 }}
            className={`absolute left-1/2 z-[9999] pointer-events-none ${isMobile ? 'top-20' : 'bottom-24'}`}
          >
             <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-black/10 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] px-6 py-3 rounded-2xl flex items-center gap-3">
                <div className="bg-black dark:bg-white text-white dark:text-black p-1 rounded-full">
                    <MousePointerClick size={16} />
                </div>
                <span className="font-bold text-sm text-black dark:text-white tracking-wide">{toast}</span>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Window Manager Layer */}
      <div className="absolute inset-0 pointer-events-none z-20">
        <AnimatePresence>
          {windows.map((window) => {
            const App = apps.find(a => a.id === window.appId)?.component;
            return (
              <Window key={window.id} window={window}>
                {App ? <App /> : <div className="p-10 font-bold text-2xl dark:text-white">APP_NOT_FOUND</div>}
              </Window>
            );
          })}
        </AnimatePresence>
      </div>

      <StartMenu apps={apps} />
      <Taskbar apps={apps} />
    </div>
  );
};

export default Desktop;