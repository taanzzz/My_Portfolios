import React, { useState } from 'react';
import { portfolioData } from '../data/portfolioData';
import { useWindowStore } from '../store/useWindowStore';
import { Brain, ArrowRight, GitBranch, AlertTriangle, CheckCircle, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ReasoningApp: React.FC = () => {
  const { theme, isMobile } = useWindowStore();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="h-full w-full bg-[#F3F4F6] dark:bg-slate-950 flex flex-col font-sans overflow-hidden text-black dark:text-white">
      
      {/* Header */}
      <div className="p-6 md:p-10 shrink-0 border-b-4 border-black dark:border-white bg-white dark:bg-slate-900 relative overflow-hidden">
          <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                  <div className="bg-[#A78BFA] p-2 border-2 border-black shadow-[4px_4px_0_0_#000]">
                      <Brain size={28} className="text-black" />
                  </div>
                  <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">How I Think</h1>
              </div>
              <p className="text-lg md:text-xl font-bold opacity-70 max-w-2xl">
                  "I don't just code — I reason." <br/>
                  <span className="text-sm md:text-base font-normal opacity-100 mt-2 block">
                      Software engineering is 80% mental models and 20% syntax. Here is a breakdown of how I tackle complex problems.
                  </span>
              </p>
          </div>
          {/* Background Decoration */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-5 pointer-events-none">
             <Brain size={400} />
          </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          {portfolioData.caseStudies.map((study, index) => (
              <motion.div 
                layout
                key={study.id}
                className={`bg-white dark:bg-slate-900 border-4 border-black dark:border-white shadow-[8px_8px_0_0_#000] dark:shadow-[8px_8px_0_0_#000] overflow-hidden transition-all duration-300
                    ${expandedId === study.id ? 'ring-4 ring-[#FDE047]/50' : 'hover:-translate-y-1'}
                `}
              >
                  {/* Card Header (Clickable) */}
                  <button 
                    onClick={() => toggleExpand(study.id)}
                    className="w-full text-left p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 z-10 relative"
                  >
                      <div>
                          <div className="flex items-center gap-2 mb-2">
                              <span className="bg-black text-white px-2 py-0.5 text-xs font-black uppercase tracking-widest">Case Study #{index + 1}</span>
                          </div>
                          <h2 className="text-xl md:text-3xl font-black uppercase leading-tight">{study.title}</h2>
                          <div className="flex items-start gap-2 mt-2 text-red-600 dark:text-red-400 font-bold text-sm md:text-base">
                              <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                              <span>Problem: {study.problem}</span>
                          </div>
                      </div>
                      <div className="flex items-center gap-2 font-black uppercase text-sm border-2 border-black dark:border-white px-4 py-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_#fff]">
                          {expandedId === study.id ? 'Close Analysis' : 'View Logic'}
                          {expandedId === study.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                  </button>

                  {/* Expanded Content */}
                  <AnimatePresence>
                      {expandedId === study.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-t-4 border-black dark:border-white"
                          >
                              <div className="p-6 md:p-8 space-y-8 bg-[#F3F4F6] dark:bg-slate-800">
                                  
                                  {/* 1. Visual Flow */}
                                  <section>
                                      <h3 className="font-black uppercase text-lg mb-4 flex items-center gap-2">
                                          <GitBranch size={20} /> The Thought Process
                                      </h3>
                                      <div className="flex flex-col md:flex-row gap-4 relative">
                                          {/* Connecting Line (Desktop) */}
                                          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-black dark:bg-white -translate-y-1/2 z-0 opacity-20" />
                                          
                                          {study.process.map((step, i) => (
                                              <div key={i} className="flex-1 relative z-10 flex flex-col items-center text-center">
                                                  <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border-4 border-black dark:border-white flex items-center justify-center font-black mb-3 shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#000]">
                                                      {i + 1}
                                                  </div>
                                                  <div className="bg-white dark:bg-slate-900 p-3 border-2 border-black dark:border-white text-sm font-bold w-full shadow-sm min-h-[80px] flex items-center justify-center">
                                                      {step}
                                                  </div>
                                                  {i < study.process.length - 1 && (
                                                      <div className="md:hidden mt-2 text-black dark:text-white"><ArrowDownIcon /></div>
                                                  )}
                                              </div>
                                          ))}
                                      </div>
                                  </section>

                                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                      {/* 2. Constraints & Trade-offs */}
                                      <section className="bg-white dark:bg-slate-900 p-6 border-4 border-black dark:border-white shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#fff]">
                                          <h3 className="font-black uppercase text-lg mb-4 flex items-center gap-2 border-b-2 border-black dark:border-white pb-2">
                                              <AlertTriangle size={20} /> Constraints & Analysis
                                          </h3>
                                          
                                          <div className="mb-6">
                                              <h4 className="text-xs font-black uppercase text-gray-500 mb-2">Hard Constraints</h4>
                                              <ul className="list-disc pl-4 space-y-1 font-medium">
                                                  {study.constraints.map((c, i) => (
                                                      <li key={i}>{c}</li>
                                                  ))}
                                              </ul>
                                          </div>

                                          <div>
                                              <h4 className="text-xs font-black uppercase text-gray-500 mb-2">The Trade-Off Decision</h4>
                                              <div className="flex gap-2 mb-2 text-sm font-bold">
                                                  <div className="flex-1 p-2 bg-red-100 dark:bg-red-900/30 border border-red-300 text-center opacity-70 grayscale">
                                                      Option A: {study.tradeOffs.optionA}
                                                  </div>
                                                  <div className="flex items-center justify-center font-black">VS</div>
                                                  <div className="flex-1 p-2 bg-green-100 dark:bg-green-900/30 border-2 border-green-500 text-center relative overflow-hidden">
                                                      Option B: {study.tradeOffs.optionB}
                                                      <div className="absolute top-0 right-0 bg-green-500 text-white text-[8px] px-1 font-bold uppercase">Winner</div>
                                                  </div>
                                              </div>
                                              <p className="text-sm italic border-l-4 border-black dark:border-white pl-3 py-1">
                                                  "{study.tradeOffs.decision}"
                                              </p>
                                          </div>
                                      </section>

                                      {/* 3. Solution */}
                                      <section className="bg-[#10B981] text-black p-6 border-4 border-black shadow-[4px_4px_0_0_#000]">
                                          <h3 className="font-black uppercase text-lg mb-4 flex items-center gap-2 text-white">
                                              <Lightbulb size={24} className="fill-yellow-400 stroke-black stroke-2" /> Final Solution
                                          </h3>
                                          <p className="text-lg font-bold leading-relaxed mb-6 bg-white/20 p-4 border-2 border-black/10 rounded-sm backdrop-blur-sm">
                                              {study.solution}
                                          </p>
                                          <div className="flex items-center gap-2 font-black uppercase bg-black text-white px-4 py-2 w-fit">
                                              <CheckCircle size={18} /> Outcome: {study.outcome}
                                          </div>
                                      </section>
                                  </div>

                              </div>
                          </motion.div>
                      )}
                  </AnimatePresence>
              </motion.div>
          ))}
      </div>
    </div>
  );
};

const ArrowDownIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 5V19M12 19L19 12M12 19L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export default ReasoningApp;