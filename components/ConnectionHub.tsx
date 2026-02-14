import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Linkedin, MessageCircle, ArrowRight, ChevronRight, Zap, Globe } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';
import { useWindowStore } from '../store/useWindowStore';

const ASSETS = {
  icon: "https://res.cloudinary.com/dnatiwtcj/image/upload/v1767829121/love_2_gimbq3.png"
};

const ConnectionHub: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { windows } = useWindowStore();

  // Check if any application window is currently open (not minimized)
  // If so, we hide the hub launcher to keep the interface clean for the active task.
  const isAnyAppOpen = windows.some(w => !w.isMinimized);

  return (
    <>
      {/* Launcher Button (Left Side) */}
      <AnimatePresence>
        {!isOpen && !isAnyAppOpen && (
            <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed left-0 bottom-24 md:bottom-20 z-[20000] flex items-center"
            >
                <button
                    onClick={() => setIsOpen(true)}
                    className="group flex items-center gap-2 bg-white dark:bg-slate-900 border-r-4 border-t-4 border-b-4 border-black dark:border-white py-1.5 pr-3 pl-1 md:py-3 md:pr-4 shadow-[4px_4px_0_0_rgba(0,0,0,0.3)] hover:pl-2 md:hover:pl-4 transition-all hover:bg-[#FDE047] dark:hover:bg-[#FDE047] hover:text-black rounded-r-2xl relative"
                >
                     <div className="w-10 h-10 md:w-14 md:h-14 rounded-full border-2 border-black overflow-hidden bg-white shrink-0 relative z-10">
                        <img src={ASSETS.icon} alt="Connect" className="w-full h-full object-contain p-1.5 md:p-2" />
                    </div>

                    <div className="text-left pl-1 md:pl-2">
                        <div className="flex items-center gap-1 md:gap-1.5 mb-0.5">
                            <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="font-black uppercase text-[9px] md:text-[10px] tracking-widest opacity-60 leading-none">Status: Online</span>
                        </div>
                        <div className="font-bold text-xs md:text-sm flex items-center gap-1 group-hover:gap-2 transition-all leading-none">
                             Collab Hub <ArrowRight size={14} className="md:w-4 md:h-4" strokeWidth={3} />
                        </div>
                    </div>
                </button>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Connection Interface */}
      <AnimatePresence>
        {isOpen && (
             <motion.div
                initial={{ opacity: 0, x: -50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.95 }}
                className="fixed left-4 bottom-24 md:left-8 md:bottom-20 z-[20001] w-[calc(100vw-32px)] md:w-[400px]"
             >
                <div className="bg-white dark:bg-slate-900 border-4 border-black dark:border-white shadow-[12px_12px_0_0_#000] dark:shadow-[12px_12px_0_0_#fff] relative overflow-hidden">
                    
                    {/* Decorative Top Strip */}
                    <div className="h-2 w-full bg-[#FDE047] border-b-4 border-black dark:border-white" />

                    <div className="p-6 md:p-8 relative z-10">
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 p-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black rounded-full transition-colors border-2 border-transparent hover:border-black dark:hover:border-white"
                        >
                            <X size={20} strokeWidth={3} />
                        </button>

                        {/* Header */}
                        <div className="flex items-start gap-4 mb-6">
                             <div className="w-16 h-16 bg-white border-4 border-black dark:border-white shadow-[4px_4px_0_0_rgba(0,0,0,0.1)] rounded-full flex items-center justify-center shrink-0">
                                <img src={ASSETS.icon} alt="Connect" className="w-10 h-10 object-contain" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <Zap size={14} className="text-[#FDE047] fill-current" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Open for Opportunities</span>
                                </div>
                                <h2 className="text-2xl font-black uppercase leading-none">Let's Build<br/>Something Real.</h2>
                            </div>
                        </div>

                        {/* Body Copy */}
                        <div className="mb-8 space-y-4">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 leading-relaxed">
                                Whether you have a fully formed blueprint or just a spark of an idea, I'm here to help you engineer it into reality.
                            </p>
                            <div className="p-3 bg-gray-50 dark:bg-slate-800 border-l-4 border-black dark:border-white text-xs font-bold text-gray-500 dark:text-gray-400 italic">
                                "No pitch decks required—just a conversation about what we can achieve together."
                            </div>
                        </div>

                        {/* Action Grid */}
                        <div className="grid grid-cols-1 gap-3">
                            <a 
                                href="https://wa.me/+8801568239708"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-between p-4 bg-[#25D366] text-white border-4 border-black dark:border-white shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#fff] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] active:shadow-none transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <MessageCircle size={24} strokeWidth={2.5} className="fill-white/20" />
                                    <div>
                                        <div className="font-black uppercase text-sm leading-none">WhatsApp</div>
                                        <div className="text-[10px] font-bold opacity-80 uppercase">Fastest Response</div>
                                    </div>
                                </div>
                                <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                            </a>

                            <div className="grid grid-cols-2 gap-3">
                                <a 
                                    href={`mailto:${portfolioData.personal.email}`}
                                    className="flex flex-col items-center justify-center p-3 border-4 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                                >
                                    <Mail size={24} strokeWidth={2} className="mb-1" />
                                    <span className="font-black uppercase text-xs">Email</span>
                                </a>
                                <a 
                                    href={portfolioData.social.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center justify-center p-3 border-4 border-black dark:border-white hover:bg-[#0A66C2] hover:text-white transition-colors"
                                >
                                    <Linkedin size={24} strokeWidth={2} className="mb-1" />
                                    <span className="font-black uppercase text-xs">LinkedIn</span>
                                </a>
                            </div>
                        </div>
                        
                        {/* Footer Status */}
                        <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-bold uppercase text-gray-400">
                            <Globe size={12} />
                            <span>Based in Bangladesh • Remote Worldwide</span>
                        </div>
                    </div>

                    {/* Background Texture */}
                    <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
                </div>
             </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ConnectionHub;