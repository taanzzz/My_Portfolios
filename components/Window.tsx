import React, { useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { X, Minus, Square, Maximize2 } from 'lucide-react';
import { useWindowStore } from '../store/useWindowStore';
import { WindowState } from '../types';
import { motion, PanInfo, useAnimation, useDragControls } from 'framer-motion';

interface WindowProps {
  window: WindowState;
  children: React.ReactNode;
}

const Window: React.FC<WindowProps> = ({ window: windowState, children }) => {
  const { 
    closeWindow, 
    minimizeWindow, 
    maximizeWindow, 
    focusWindow, 
    updateWindowPosition, 
    updateWindowSize,
    activeWindowId,
    isMobile,
    theme
  } = useWindowStore();

  const isActive = activeWindowId === windowState.id;
  const controls = useAnimation();
  const dragControls = useDragControls();

  // Mobile specific logic
  const isEffectiveMaximized = windowState.isMaximized || isMobile;

  const handleDragEnd = async (event: any, info: PanInfo) => {
    if (isMobile) {
        // Threshold for swipe-to-close
        if (info.offset.y > 100) {
            await controls.start({ y: "100%" });
            closeWindow(windowState.id);
        } else {
            controls.start({ y: 0 });
        }
    }
  };

  if (windowState.isMinimized) return null;

  // --- Mobile Render ---
  if (isMobile) {
      return (
        <motion.div
            // Use declarative variants for mobile enter/exit to ensure consistency when unminimizing
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }} 
            drag="y"
            dragListener={false} // Disable auto-listener to prevent scroll conflict
            dragControls={dragControls} // Manually start drag from header
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.1 }}
            onDragEnd={handleDragEnd}
            // Added padding-bottom to ensure content sits above the mobile taskbar
            className="fixed inset-0 z-[50] flex flex-col pt-[var(--safe-top)] pb-[calc(60px+env(safe-area-inset-bottom))] shadow-2xl pointer-events-auto"
            style={{ 
                zIndex: 100 + windowState.zIndex,
                willChange: 'transform' // GPU acceleration hint
            }}
        >
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm -z-10" 
                onClick={() => minimizeWindow(windowState.id)} 
            />
            
            {/* Window Content Container */}
            <div className="flex flex-col h-full w-full bg-white dark:bg-slate-900 border-[3px] border-black dark:border-white rounded-t-2xl overflow-hidden shadow-[0_-4px_10px_rgba(0,0,0,0.2)]">
                
                {/* Mobile Title Bar (Drag Handle) */}
                <div 
                    className="flex items-center justify-between px-4 py-3 select-none shrink-0 border-b-4 border-black dark:border-white touch-none transition-colors duration-300"
                    style={{ backgroundColor: isActive ? theme.accentColor : '#E5E7EB' }}
                    onPointerDown={(e) => dragControls.start(e)} // Attach drag here
                >
                     {/* Drag Indicator */}
                     <div className="flex items-center gap-3 overflow-hidden flex-1">
                         <div className="w-10 h-1 bg-black/20 rounded-full mx-auto absolute left-0 right-0 top-2" />
                         <div className={`w-3 h-3 border-2 border-black shrink-0 ${isActive ? 'bg-white' : 'bg-gray-400'}`} />
                         <span className="font-bold text-lg uppercase tracking-tight truncate text-black">
                            {windowState.title}
                         </span>
                     </div>

                     <div className="flex items-center gap-3 z-10" onPointerDown={(e) => e.stopPropagation()}>
                         <button 
                            onClick={() => minimizeWindow(windowState.id)}
                            className="w-10 h-10 bg-white border-2 border-black hover:bg-gray-200 active:bg-black active:text-white flex items-center justify-center transition-colors rounded-full"
                         >
                             <Minus size={20} strokeWidth={3} className="text-black"/>
                         </button>
                         <button 
                            onClick={() => closeWindow(windowState.id)}
                            className="w-10 h-10 bg-[#F87171] border-2 border-black active:bg-red-600 text-white flex items-center justify-center transition-colors rounded-full shadow-[2px_2px_0_0_#000]"
                         >
                             <X size={20} strokeWidth={3} />
                         </button>
                     </div>
                </div>

                {/* Mobile Content Area (Scrollable) */}
                <div className="flex-1 overflow-hidden relative bg-white dark:bg-slate-900 touch-pan-y">
                     {children}
                </div>
            </div>
        </motion.div>
      );
  }

  // --- Desktop Render ---
  return (
    <Rnd
      // Calculate height to account for 3.5rem (56px) taskbar when maximized
      size={{ 
        width: isEffectiveMaximized ? '100%' : windowState.size.width, 
        height: isEffectiveMaximized ? 'calc(100% - 3.5rem)' : windowState.size.height 
      }}
      position={isEffectiveMaximized ? { x: 0, y: 0 } : { x: windowState.position.x, y: windowState.position.y }}
      onDragStop={(e, d) => {
        if (!isEffectiveMaximized) updateWindowPosition(windowState.id, d.x, d.y);
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        if (!isEffectiveMaximized) {
          updateWindowSize(windowState.id, ref.style.width, ref.style.height);
          updateWindowPosition(windowState.id, position.x, position.y);
        }
      }}
      onMouseDown={() => focusWindow(windowState.id)}
      minWidth={320}
      minHeight={200}
      disableDragging={isEffectiveMaximized}
      enableResizing={!isEffectiveMaximized}
      dragHandleClassName="window-header"
      style={{ zIndex: windowState.zIndex }}
      bounds="parent"
      className="flex flex-col pointer-events-auto"
    >
        <div className={`w-full h-full ${isEffectiveMaximized ? '' : 'pb-2 pr-2'}`}>
            <div className={`flex flex-col h-full w-full overflow-hidden bg-white dark:bg-slate-900 border-[3px] border-black dark:border-white ${isEffectiveMaximized ? '' : 'neo-shadow-lg'}`}>
                
                {/* Desktop Title Bar */}
                <div 
                  className="window-header flex items-center justify-between px-3 py-2 select-none shrink-0 border-b-4 border-black dark:border-white cursor-grab active:cursor-grabbing transition-colors duration-300"
                  style={{ backgroundColor: isActive ? theme.accentColor : '#E5E7EB' }}
                  onDoubleClick={() => maximizeWindow(windowState.id)}
                >
                  <div className="flex items-center gap-2 overflow-hidden flex-1">
                     <div className={`w-3 h-3 border-2 border-black ${isActive ? 'bg-white' : 'bg-gray-400'}`} />
                     <span className="font-bold text-lg uppercase tracking-tight truncate text-black">
                        {windowState.title}
                     </span>
                  </div>
                  
                  <div className="flex items-center gap-2" onMouseDown={e => e.stopPropagation()}>
                        <button 
                            onClick={() => minimizeWindow(windowState.id)}
                            className="w-8 h-8 bg-white border-2 border-black hover:bg-gray-200 active:bg-black active:text-white flex items-center justify-center transition-colors"
                        >
                            <Minus size={18} strokeWidth={3} className="text-black"/>
                        </button>
                        <button 
                            onClick={() => maximizeWindow(windowState.id)}
                            className="w-8 h-8 bg-white border-2 border-black hover:bg-gray-200 active:bg-black active:text-white flex items-center justify-center transition-colors"
                        >
                            <span className="text-black">
                              {windowState.isMaximized ? <Square size={16} strokeWidth={3} /> : <Maximize2 size={16} strokeWidth={3} />}
                            </span>
                        </button>
                        <button 
                            onClick={() => closeWindow(windowState.id)}
                            className="w-8 h-8 bg-[#F87171] border-2 border-black hover:bg-red-500 active:bg-black active:text-white flex items-center justify-center transition-colors"
                        >
                            <X size={20} strokeWidth={3} />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-hidden relative bg-white dark:bg-slate-900 text-black dark:text-white">
                  {children}
                  {!isActive && (
                    <div 
                      className="absolute inset-0 z-50 bg-white/20 dark:bg-black/20" 
                      onMouseDown={() => focusWindow(windowState.id)}
                    />
                  )}
                </div>
            </div>
        </div>
    </Rnd>
  );
};

export default Window;