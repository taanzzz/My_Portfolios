import React, { useEffect, useRef, useState } from 'react';
import { useWindowStore } from '../store/useWindowStore';
import { AppConfig } from '../types';
import { Power, User, Search, Grid, LayoutGrid, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StartMenuProps {
  apps: AppConfig[];
}

const StartMenu: React.FC<StartMenuProps> = ({ apps }) => {
  const { isStartMenuOpen, toggleStartMenu, openWindow, isMobile, theme, setShuttingDown } = useWindowStore();
  const menuRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isMobile && menuRef.current && !menuRef.current.contains(event.target as Node) && isStartMenuOpen) {
        const target = event.target as Element;
        if (!target.closest('button')) { 
             toggleStartMenu(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isStartMenuOpen, toggleStartMenu, isMobile]);

  // Reset search when menu closes
  useEffect(() => {
    if (!isStartMenuOpen) setSearchTerm('');
  }, [isStartMenuOpen]);

  const filteredApps = apps.filter(app => 
    app.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isStartMenuOpen && (
        <div className={`fixed flex pointer-events-none 
            ${isMobile ? 'inset-0 items-end z-[20000]' : 'bottom-16 left-0 pl-2 z-[9990]'}
        `}>
            {/* Backdrop for mobile */}
            {isMobile && (
                 <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto"
                    onClick={() => toggleStartMenu(false)}
                 />
            )}

            <motion.div
              ref={menuRef}
              initial={isMobile ? { y: "100%" } : { y: 20, opacity: 0, scale: 0.95 }}
              animate={isMobile ? { y: 0 } : { y: 0, opacity: 1, scale: 1 }}
              exit={isMobile ? { y: "100%" } : { y: 20, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`pointer-events-auto bg-white dark:bg-slate-900 border-[4px] border-black dark:border-white shadow-[8px_8px_0_0_#000] dark:shadow-[8px_8px_0_0_#000] flex flex-col overflow-hidden relative
                ${isMobile ? 'w-full max-h-[90vh] rounded-t-2xl pb-[env(safe-area-inset-bottom)]' : 'w-[450px] h-[650px] mb-2'}
              `}
            >
                {/* Mobile Drag Handle */}
                {isMobile && (
                    <div className="w-full flex justify-center pt-3 pb-1 bg-white dark:bg-slate-900" onClick={() => toggleStartMenu(false)}>
                        <div className="w-16 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
                    </div>
                )}

                {/* Header Profile Section */}
                <div 
                  className="p-5 border-b-4 border-black dark:border-white flex items-center justify-between shrink-0 transition-colors duration-300 relative overflow-hidden"
                  style={{ backgroundColor: theme.accentColor }}
                >
                    <div className="flex items-center gap-4 text-black relative z-10">
                        <div className="w-14 h-14 bg-white border-4 border-black flex items-center justify-center shadow-[4px_4px_0_0_rgba(0,0,0,0.2)]">
                            <img 
                                src="https://res.cloudinary.com/dnatiwtcj/image/upload/v1767753721/binary-code_a5tk1h.png" 
                                alt="User" 
                                className="w-full h-full object-cover p-1"
                            />
                        </div>
                        <div>
                            <h3 className="font-black text-2xl leading-none uppercase tracking-tight">Porosh Islam Tarek</h3>
                            <div className="flex items-center gap-1.5 mt-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full border border-black animate-pulse" />
                                <span className="text-xs font-bold uppercase tracking-widest opacity-80">System Admin</span>
                            </div>
                        </div>
                    </div>
                    {/* Decorative Background Pattern */}
                    <div className="absolute right-0 top-0 bottom-0 w-32 opacity-10 pointer-events-none transform skew-x-12 bg-black" />
                </div>

                {/* Search Bar */}
                <div className="p-4 bg-white dark:bg-slate-900 border-b-4 border-black dark:border-white shrink-0">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            type="text" 
                            placeholder="Find apps, settings..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-[#F3F4F6] dark:bg-slate-800 border-2 border-black dark:border-white font-bold text-black dark:text-white placeholder:text-gray-400 focus:outline-none focus:bg-white dark:focus:bg-slate-700 transition-all shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_rgba(255,255,255,0.2)] focus:shadow-none focus:translate-x-[4px] focus:translate-y-[4px]"
                        />
                    </div>
                </div>

                {/* App Grid */}
                <div className="flex-1 p-4 md:p-6 bg-[#F3F4F6] dark:bg-slate-800 overflow-y-auto custom-scrollbar">
                    
                    {/* Section Title */}
                    <div className="flex items-center gap-2 mb-4 opacity-50">
                        <LayoutGrid size={16} />
                        <span className="text-xs font-black uppercase tracking-widest">Applications</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                        {filteredApps.map((app) => (
                            <button
                                key={app.id}
                                onClick={() => {
                                    openWindow(app.id, app.title);
                                    if(isMobile) toggleStartMenu(false);
                                }}
                                className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-700 border-2 border-black dark:border-white shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_#000] dark:hover:shadow-[6px_6px_0_0_#000] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all group aspect-square"
                            >
                                <div className="mb-3 transition-transform duration-300 group-hover:scale-110">
                                    <app.icon size={isMobile ? 48 : 42} className="text-black dark:text-white" strokeWidth={1.5} />
                                </div>
                                <span className="font-bold text-xs md:text-sm uppercase tracking-tight text-center leading-tight text-black dark:text-white">
                                    {app.title}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Resume Special Button */}
                    {!searchTerm && (
                        <div className="mt-6 pt-6 border-t-2 border-dashed border-gray-300 dark:border-gray-600">
                             <div className="flex items-center gap-2 mb-4 opacity-50">
                                <FileText size={16} />
                                <span className="text-xs font-black uppercase tracking-widest">Documents</span>
                            </div>
                            <button
                                onClick={() => {
                                    openWindow('resume', 'Resume');
                                    if(isMobile) toggleStartMenu(false);
                                }}
                                className="w-full flex items-center gap-4 p-4 bg-[#E0E7FF] dark:bg-slate-800 border-2 border-black dark:border-white shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#000] hover:bg-white dark:hover:bg-slate-700 transition-all hover:scale-[1.02] group"
                            >
                                <div className="w-12 h-12 bg-black text-white flex items-center justify-center border-2 border-black group-hover:bg-white group-hover:text-black transition-colors">
                                    <span className="font-black text-xs">PDF</span>
                                </div>
                                <div className="text-left">
                                    <h4 className="font-black text-sm uppercase">Curriculum Vitae</h4>
                                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400">Updated: Recently</p>
                                </div>
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-white dark:bg-slate-900 border-t-4 border-black dark:border-white flex justify-between items-center shrink-0">
                    <div className="text-xs font-bold uppercase text-gray-400 hidden md:block">
                        v3.0.1 Stable
                    </div>
                    <button 
                        onClick={() => setShuttingDown(true)}
                        className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#F87171] dark:bg-red-800 text-black dark:text-white border-2 border-black dark:border-white font-black uppercase hover:bg-red-500 hover:text-white transition-all shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#fff] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
                    >
                        <Power size={20} strokeWidth={3} />
                        System Shutdown
                    </button>
                </div>
            </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default StartMenu;