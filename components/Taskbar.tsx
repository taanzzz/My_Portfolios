import React, { useState, useEffect } from 'react';
import { useWindowStore } from '../store/useWindowStore';
import { AppConfig } from '../types';
import { Wifi, Battery, ChevronUp, ChevronDown, Menu } from 'lucide-react';

interface TaskbarProps {
  apps: AppConfig[];
}

const TaskbarItem: React.FC<{
  app: AppConfig;
  isOpen: boolean;
  isActive: boolean;
  onClick: (app: AppConfig) => void;
  isMobile: boolean;
  accentColor: string;
}> = ({ app, isOpen, isActive, onClick, isMobile, accentColor }) => {
  return (
    <button
      onClick={() => onClick(app)}
      className={`relative h-full px-4 flex items-center justify-center gap-2 transition-colors border-l-2 border-black dark:border-white shrink-0
          ${isMobile ? 'min-w-[60px]' : 'min-w-[140px]'}
          ${!isActive ? 'bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-black dark:text-white' : 'text-black dark:text-black font-bold'}
      `}
      style={{ backgroundColor: isActive ? accentColor : undefined }}
      title={app.title}
    >
        <app.icon 
            size={isMobile ? 24 : 20} 
            strokeWidth={2.5}
            className={isActive ? "text-black" : "text-gray-700 dark:text-gray-200"}
        />
        {!isMobile && (
            <span className="truncate max-w-[100px] uppercase text-sm tracking-wide">
                {app.title}
            </span>
        )}
        {/* Mobile Active Indicator */}
        {isMobile && isActive && (
            <div className="absolute bottom-1 w-1 h-1 bg-black rounded-full" />
        )}
    </button>
  );
};

const Taskbar: React.FC<TaskbarProps> = ({ apps }) => {
  const { 
    windows, 
    activeWindowId, 
    isStartMenuOpen, 
    toggleStartMenu, 
    openWindow, 
    minimizeWindow,
    isMobile,
    theme
  } = useWindowStore();

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAppClick = (app: AppConfig) => {
    const isOpen = windows.find(w => w.appId === app.id);
    const isActive = activeWindowId === isOpen?.id;

    if (isOpen && isActive && !isOpen.isMinimized) {
      minimizeWindow(isOpen.id);
    } else {
      openWindow(app.id, app.title);
    }
  };

  // Derive open apps list from windows state to maintain opening order
  // Reversed to show the most recently opened app first (leftmost)
  const openApps = [...windows].reverse().map(w => apps.find(a => a.id === w.appId)).filter(Boolean) as AppConfig[];

  return (
    <div 
        className={`fixed bottom-0 left-0 right-0 z-[10000] bg-white dark:bg-slate-900 border-t-4 border-black dark:border-white flex items-stretch shadow-2xl
            ${isMobile ? 'h-[calc(65px+env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)]' : 'h-14'}
        `}
    >
        
        {/* Start Button */}
        <button
            onClick={() => toggleStartMenu()}
            className={`h-full flex items-center gap-2 border-r-4 border-black dark:border-white font-black tracking-widest text-lg uppercase transition-all shrink-0 relative group
                ${isMobile ? 'px-5' : 'px-6'}
                ${isStartMenuOpen 
                ? 'bg-black text-white dark:bg-white dark:text-black' 
                : 'bg-[#F87171] text-black hover:bg-[#EF4444] dark:bg-red-800 dark:text-white dark:hover:bg-red-700'
            }`}
        >
            {/* Mobile Visual Cue */}
            {isMobile ? (
                <div className="flex flex-col items-center justify-center gap-0.5">
                    {/* Animated Chevron to indicate 'Open Up' */}
                    {!isStartMenuOpen && (
                        <ChevronUp 
                            size={14} 
                            strokeWidth={4} 
                            className="animate-bounce mb-[-2px] opacity-70" 
                        />
                    )}
                    {isStartMenuOpen && (
                        <ChevronDown 
                            size={14} 
                            strokeWidth={4} 
                            className="mb-[-2px]" 
                        />
                    )}
                    
                    <div className="flex items-center gap-2">
                         <div className={`w-3 h-3 border-2 ${isStartMenuOpen ? 'border-white bg-black dark:border-black dark:bg-white' : 'border-black bg-white dark:border-white dark:bg-black'}`} />
                         <span className="text-sm font-black tracking-wider">MENU</span>
                    </div>
                </div>
            ) : (
                <>
                    <div className={`w-4 h-4 border-2 ${isStartMenuOpen ? 'border-white bg-black dark:border-black dark:bg-white' : 'border-black bg-white dark:border-white dark:bg-black'}`} />
                    <span>Start</span>
                </>
            )}

            {/* Hover Glitch Effect Line for Desktop */}
            {!isMobile && (
                <div className="absolute inset-x-0 bottom-0 h-1 bg-black dark:bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            )}
        </button>

        {/* Taskbar Items - Fixed scrolling and width issues with flex-1 w-0 min-w-0 */}
        <div 
            className={`flex-1 h-full flex items-center overflow-x-auto w-0 min-w-0`} 
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
            {openApps.map((app) => {
                const windowInstance = windows.find(w => w.appId === app.id);
                const isOpen = !!windowInstance;
                const isActive = windowInstance?.id === activeWindowId && !windowInstance.isMinimized;

                return (
                    <TaskbarItem 
                        key={app.id}
                        app={app}
                        isOpen={isOpen}
                        isActive={isActive}
                        onClick={handleAppClick}
                        isMobile={isMobile}
                        accentColor={theme.accentColor}
                    />
                );
            })}
        </div>

        {/* System Tray - Updated to show icons on mobile with responsive sizing */}
        <div className={`h-full flex items-center bg-[#E5E7EB] dark:bg-slate-800 border-l-4 border-black dark:border-white shrink-0 text-black dark:text-white
            ${isMobile ? 'px-3 gap-2' : 'px-4 gap-4'}
        `}>
            <div className={`flex items-center ${isMobile ? 'gap-1.5' : 'gap-3'}`}>
                <Wifi size={isMobile ? 16 : 20} strokeWidth={2.5} />
                <Battery size={isMobile ? 16 : 20} strokeWidth={2.5} />
            </div>
            <div className={`font-bold font-mono ${isMobile ? 'text-sm' : 'text-lg'}`}>
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
        </div>
    </div>
  );
};

export default Taskbar;