import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Globe, Shield, Wifi, Zap } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);

  const logs = [
    "INITIALIZING_KERNEL...",
    "LOADING_NEO_BRUTALIST_UI...",
    "CONNECTING_TO_SATELLITE_UPLINK...",
    "DECRYPTING_PORTFOLIO_DATA...",
    "OPTIMIZING_ASSETS...",
    "ESTABLISHING_SECURE_HANDSHAKE...",
    "SYSTEM_READY."
  ];

  useEffect(() => {
    const duration = 2500; // Match boot time in App.tsx
    const interval = 50;
    const steps = duration / interval;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return next;
      });
    }, interval);

    const logTimer = setInterval(() => {
      setLogIndex(prev => (prev < logs.length - 1 ? prev + 1 : prev));
    }, duration / logs.length);

    return () => {
      clearInterval(timer);
      clearInterval(logTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-[99999] flex flex-col items-center justify-center overflow-hidden font-mono text-white">
      
      {/* Background Grid Animation */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{ 
            backgroundImage: 'linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            transform: 'perspective(500px) rotateX(60deg) translateY(-100px) scale(2)',
        }}
      />

      <div className="relative z-10 w-full max-w-md p-6">
          {/* Central Logo / Core */}
          <div className="flex justify-center mb-12 relative">
             <div className="relative w-32 h-32 flex items-center justify-center">
                 {/* Spinning Rings */}
                 <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-4 border-t-transparent border-l-white/20 border-r-white/20 border-b-white rounded-full"
                 />
                 <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-2 border-2 border-t-white border-l-transparent border-r-transparent border-b-white/50 rounded-full"
                 />
                 
                 {/* Core Icon */}
                 <div className="bg-white text-black p-4 rounded-full relative z-10 shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                     <Cpu size={40} strokeWidth={2} />
                 </div>

                 {/* Pulse Effect */}
                 <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-white/20 rounded-full -z-10"
                 />
             </div>
          </div>

          {/* System Status Indicators */}
          <div className="grid grid-cols-3 gap-2 mb-8 text-xs font-bold uppercase tracking-widest text-gray-400">
              <div className="flex flex-col items-center gap-1 border border-white/10 p-2 bg-white/5">
                  <Globe size={16} className="text-blue-400" />
                  <span>Net: OK</span>
              </div>
              <div className="flex flex-col items-center gap-1 border border-white/10 p-2 bg-white/5">
                  <Shield size={16} className="text-green-400" />
                  <span>Sec: OK</span>
              </div>
              <div className="flex flex-col items-center gap-1 border border-white/10 p-2 bg-white/5">
                  <Zap size={16} className="text-yellow-400" />
                  <span>Pwr: 100%</span>
              </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-2 flex justify-between text-xs font-bold uppercase text-white/70">
              <span>System Boot</span>
              <span>{Math.floor(progress)}%</span>
          </div>
          <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden mb-6 border border-gray-700">
              <motion.div 
                 className="h-full bg-white shadow-[0_0_10px_white]"
                 style={{ width: `${progress}%` }}
              />
          </div>

          {/* Console Logs */}
          <div className="h-24 overflow-hidden border-l-2 border-white/30 pl-4 font-mono text-xs md:text-sm text-green-400 bg-black/50 backdrop-blur-sm p-2">
              {logs.slice(0, logIndex + 1).reverse().map((log, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1 - i * 0.2, x: 0 }}
                    className="mb-1"
                  >
                      <span className="opacity-50 mr-2">{`>`}</span>
                      {log}
                  </motion.div>
              ))}
          </div>

          <div className="mt-8 text-center text-[10px] uppercase tracking-[0.2em] text-gray-600">
              Porosh Islam Tarek // v2.5.0
          </div>
      </div>
    </div>
  );
};

export default LoadingScreen;