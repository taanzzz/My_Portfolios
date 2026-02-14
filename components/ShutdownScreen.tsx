import React, { useEffect, useState } from 'react';
import { useWindowStore } from '../store/useWindowStore';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const FUNNY_LOGS = [
  "DELETING_SYSTEM32...",
  "SELLING_DATA_TO_ALIENS...",
  "MINING_DOGECOIN_BACKGROUND_PROCESS...",
  "DOWNLOADING_MORE_RAM...",
  "CALCULATING_MEANING_OF_LIFE...",
  "DIVIDING_BY_ZERO...",
  "INSTALLING_WINDOWS_95...",
  "ESCAPING_THE_MATRIX...",
  "FORMATTING_BRAIN_CELLS...",
  "REMOVING_FUN.EXE...",
  "INITIATING_SELF_DESTRUCT...",
  "PLAYING_NICKELBACK_DISCOGRAPHY...",
  "LEAKING_BROWSER_HISTORY..."
];

const ShutdownScreen: React.FC = () => {
  const { setShuttingDown } = useWindowStore();
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState(FUNNY_LOGS[0]);

  // Glitchy Progress Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const jump = Math.random() * 15;
        // Occasionally go backwards to be annoying/funny
        if (Math.random() > 0.8) return Math.max(0, prev - 10);
        // Occasionally jump past 100%
        if (prev > 95 && Math.random() > 0.9) return 404;
        
        return Math.min(prev + jump, 120);
      });

      // Change log randomly
      if (Math.random() > 0.6) {
        setLog(FUNNY_LOGS[Math.floor(Math.random() * FUNNY_LOGS.length)]);
      }
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[99999] bg-[#0000AA] text-white font-mono flex flex-col items-center justify-center p-4 md:p-8 overflow-y-auto md:overflow-hidden select-none cursor-wait scrollbar-hide">
        
        {/* Background Noise/Scanlines */}
        <div className="absolute inset-0 opacity-10 pointer-events-none fixed" 
            style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }} 
        />

        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl w-full flex flex-col gap-4 md:gap-8 relative z-10 my-auto"
        >
            {/* Sad Face */}
            <motion.div 
                animate={{ rotate: [0, -5, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="text-7xl md:text-9xl font-black mb-2 md:mb-4 select-none"
            >
                :(
            </motion.div>

            {/* Error Message */}
            <div className="space-y-2 md:space-y-4">
                <h1 className="text-2xl md:text-6xl font-bold uppercase tracking-tight leading-tight">
                    Your PC ran into a problem.
                </h1>
                <p className="text-lg md:text-2xl font-medium opacity-80">
                    Just kidding. I'm just a website. But you did click the button.
                </p>
                <p className="text-sm md:text-lg opacity-60">
                    We're just collecting some <span className="line-through">personal data</span> error info, and then you can leave.
                </p>
            </div>

            {/* Glitchy Stats */}
            <div className="flex items-center gap-4 text-xl md:text-2xl font-bold mt-4 md:mt-8">
                <span className="text-[#FDE047]">
                    {progress > 100 ? 404 : Math.floor(progress)}% Complete
                </span>
                <motion.div 
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.2, repeat: Infinity }}
                    className="w-3 h-6 md:w-4 md:h-8 bg-white"
                />
            </div>

            {/* Funny Log Stream */}
            <div className="font-mono text-xs md:text-base bg-black/20 p-3 md:p-4 border-l-4 border-white mt-2 md:mt-4 break-all">
                <span className="opacity-50 text-[10px] md:text-xs uppercase">Current Task:</span>
                <motion.div 
                    key={log}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[#FDE047] font-bold mt-1 tracking-wider"
                >
                    {`> ${log}`}
                </motion.div>
            </div>

            {/* Tech Babble Footer */}
            <div className="mt-4 md:mt-8 text-[10px] md:text-sm space-y-1 opacity-70 font-mono">
                <p>Stop Code: CRITICAL_PROCESS_DIED_INSIDE</p>
                <p>Error Code: 0xDEADBEEF (ID_10_T)</p>
                <p>What failed: COMMON_SENSE.SYS</p>
            </div>

            {/* Action Button */}
            <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 2, type: "spring" }}
                className="mt-8 md:mt-12 pb-8 md:pb-0"
            >
                <button
                    onClick={() => setShuttingDown(false)}
                    className="group w-full md:w-auto bg-white text-[#0000AA] px-6 py-3 md:px-8 md:py-4 font-black text-lg md:text-xl uppercase border-4 border-white hover:bg-[#FDE047] hover:text-black hover:border-black transition-all shadow-[8px_8px_0_0_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-none flex items-center justify-center gap-3 cursor-pointer"
                >
                    <RefreshCw className="group-hover:rotate-180 transition-transform duration-500" size={20} strokeWidth={3} />
                    Force Reboot System
                </button>
            </motion.div>

        </motion.div>

        {/* Random Floating Skull */}
        <motion.div
            animate={{ 
                x: [0, 50, -50, 20, 0], 
                y: [0, -20, 20, -10, 0],
                rotate: [0, 180, 360],
                opacity: [0, 0.2, 0]
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-10 right-4 md:top-20 md:right-20 text-white pointer-events-none opacity-50 md:opacity-100"
        >
            <AlertTriangle size={80} className="md:w-[200px] md:h-[200px]" />
        </motion.div>
    </div>
  );
};

export default ShutdownScreen;