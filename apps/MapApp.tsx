import React from 'react';
import { Map, Navigation, Crosshair, Wifi, Globe } from 'lucide-react';

const MapApp: React.FC = () => {
  return (
     <div className="h-full w-full bg-[#E5E7EB] dark:bg-slate-900 flex flex-col font-sans relative overflow-hidden">
        {/* Header - Fixed Height, Flex Layout */}
        <div className="bg-black text-white px-3 py-2 md:p-3 flex justify-between items-center shrink-0 border-b-4 border-white dark:border-gray-700 z-20 relative shadow-md">
            <div className="flex items-center gap-2 md:gap-3 overflow-hidden min-w-0">
                <Globe className="text-[#FDE047] animate-pulse shrink-0" size={16} />
                <span className="font-black font-mono uppercase tracking-widest text-[10px] sm:text-xs md:text-base truncate">
                    Sat_Link: Halishahar_CTG
                </span>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2 text-[9px] sm:text-[10px] md:text-xs font-mono text-green-400 border border-green-900 bg-green-900/20 px-1.5 py-0.5 md:px-2 md:py-1 shrink-0 rounded-sm">
                <Wifi size={10} className="md:w-3 md:h-3" />
                <span className="hidden xs:inline">SIGNAL_STRONG</span>
                <span className="xs:hidden">OK</span>
            </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative bg-gray-200 w-full h-full">
             {/* Google Maps Embed */}
             <iframe
                width="100%"
                height="100%"
                className="absolute inset-0 w-full h-full"
                style={{ border: 0, filter: 'grayscale(0%) contrast(1.1)' }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src="https://maps.google.com/maps?q=Halishahar,Chittagong,Bangladesh&t=&z=14&ie=UTF8&iwloc=&output=embed"
                title="Location Map"
             />

             {/* UI Overlay Card - Responsive Positioning */}
             {/* Mobile: Bottom aligned card with some margin. Tablet/Desktop: Floating top-left card */}
             <div className="absolute left-4 right-4 bottom-6 md:left-6 md:top-6 md:bottom-auto md:right-auto md:w-80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-4 border-black dark:border-white p-4 shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#fff] z-10 transition-all duration-300 animate-in slide-in-from-bottom-4 md:slide-in-from-left-4">
                <h3 className="font-black uppercase text-sm md:text-lg mb-3 flex items-center gap-2 border-b-2 border-black dark:border-white pb-2 text-black dark:text-white">
                   <Navigation size={16} className="md:w-[18px] md:h-[18px]" /> Target Locked
                </h3>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-gray-500 dark:text-gray-400">Coordinates</span>
                        <span className="font-mono text-[10px] font-bold bg-black text-white px-1.5 py-0.5 rounded-sm">
                           22.3475° N, 91.7690° E
                        </span>
                    </div>
                    <div className="text-xs md:text-sm font-bold leading-tight text-gray-800 dark:text-gray-200">
                       <span className="block text-lg md:text-xl font-black uppercase mb-1">Halishahar</span>
                       Chittagong, Bangladesh
                    </div>
                </div>
             </div>

             {/* Decorative Crosshair Overlay - Centered */}
             <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-40 mix-blend-multiply dark:mix-blend-screen">
                <div className="relative w-[60vw] h-[60vw] md:w-96 md:h-96 max-w-[300px] max-h-[300px] border-2 border-black dark:border-white rounded-full flex items-center justify-center transition-all duration-500">
                    <div className="absolute top-0 bottom-0 w-px bg-black dark:bg-white"></div>
                    <div className="absolute left-0 right-0 h-px bg-black dark:bg-white"></div>
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-ping absolute"></div>
                    
                    {/* Reticle Marks */}
                    <div className="absolute top-0 w-2 h-1 bg-black dark:bg-white"></div>
                    <div className="absolute bottom-0 w-2 h-1 bg-black dark:bg-white"></div>
                    <div className="absolute left-0 w-1 h-2 bg-black dark:bg-white"></div>
                    <div className="absolute right-0 w-1 h-2 bg-black dark:bg-white"></div>
                </div>
             </div>
             
             {/* Scanlines Effect */}
             <div className="absolute inset-0 pointer-events-none opacity-10 z-0" 
                  style={{ 
                      background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', 
                      backgroundSize: '100% 2px, 3px 100%' 
                  }} 
             />
        </div>
     </div>
  );
};

export default MapApp;