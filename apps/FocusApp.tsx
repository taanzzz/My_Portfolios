import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Box, Server, Loader2, Cpu, Database, Layers } from 'lucide-react';

const FOCUS_AREAS = [
  {
    id: 'ai',
    title: 'AI Engineering',
    subtitle: 'From Chatbots to Agents',
    icon: Brain,
    progress: 75,
    color: 'bg-emerald-100 dark:bg-emerald-900/50',
    borderColor: 'border-emerald-500',
    description: "I am actively moving beyond basic API wrappers to master the intrinsic mechanics of AI. My current playground involves orchestrating multi-agent systems and fine-tuning open-source models for specific domain tasks.",
    tags: ["Open Source Models (Llama 3, Mistral)", "Autonomous Agents (LangGraph)", "TTS & Real-time Audio", "RAG Pipelines"]
  },
  {
    id: '3d',
    title: 'Spatial Computing',
    subtitle: 'Immersive Environments',
    icon: Box,
    progress: 60,
    color: 'bg-orange-100 dark:bg-orange-900/50',
    borderColor: 'border-orange-500',
    description: "The web is evolving into a 3D medium. I'm deepening my skills in creating high-fidelity 3D assets and environments that run performantly in the browser, bridging the gap between game design and web dev.",
    tags: ["Three.js / R3F Shaders", "Environmental Modeling (Blender)", "Physics Engines", "WebGL Performance"]
  },
  {
    id: 'systems',
    title: 'System Mastery',
    subtitle: 'Scale & Resilience',
    icon: Server,
    progress: 45,
    color: 'bg-blue-100 dark:bg-blue-900/50',
    borderColor: 'border-blue-500',
    description: "Building is easy; scaling is hard. I am exploring lower-level languages and distributed patterns to build software that remains robust under extreme load and unpredictable failure states.",
    tags: ["Distributed Systems", "Rust for Tooling", "Micro-Frontends", "Advanced Caching"]
  }
];

const FocusApp: React.FC = () => {
  return (
    <div className="h-full w-full bg-[#FAFAFA] dark:bg-slate-950 flex flex-col font-sans overflow-hidden text-black dark:text-white">
      
      {/* Header */}
      <div className="p-8 md:p-10 shrink-0 border-b-4 border-black dark:border-white bg-white dark:bg-slate-900">
        <div className="flex items-center gap-4 mb-2">
            <div className="bg-black text-white p-2 animate-spin-slow">
                <Loader2 size={32} />
            </div>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">What I'm Improving</h1>
        </div>
        <p className="text-lg font-medium text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
           Technology never stops, and neither do I. Here is a live look at the skills I am currently compiling into my stack.
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-12">
        <div className="max-w-5xl mx-auto space-y-8">
            
            {FOCUS_AREAS.map((area, i) => (
                <motion.div 
                    key={area.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`bg-white dark:bg-slate-900 border-4 border-black dark:border-white shadow-[8px_8px_0_0_#000] dark:shadow-[8px_8px_0_0_#fff] overflow-hidden group`}
                >
                    <div className="flex flex-col md:flex-row">
                        {/* Left: Indicator & Icon */}
                        <div className={`p-6 md:w-64 shrink-0 border-b-4 md:border-b-0 md:border-r-4 border-black dark:border-white flex flex-col items-center justify-center text-center ${area.color}`}>
                            <div className="w-20 h-20 bg-white dark:bg-slate-800 border-4 border-black dark:border-white rounded-full flex items-center justify-center mb-4 shadow-[4px_4px_0_0_rgba(0,0,0,0.2)]">
                                <area.icon size={40} className="text-black dark:text-white" strokeWidth={1.5} />
                            </div>
                            <h2 className="text-xl font-black uppercase leading-tight">{area.title}</h2>
                            <span className="text-xs font-bold uppercase opacity-60 mt-1">{area.subtitle}</span>
                        </div>

                        {/* Right: Details & Progress */}
                        <div className="p-6 md:p-8 flex-1">
                            <div className="mb-6">
                                <h3 className="text-sm font-black uppercase text-gray-400 mb-2 flex items-center gap-2">
                                    <Cpu size={14} /> Status: Installing Knowledge...
                                </h3>
                                {/* Progress Bar */}
                                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 border-2 border-black dark:border-white rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${area.progress}%` }}
                                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 + (i * 0.2) }}
                                        className={`h-full ${area.borderColor.replace('border', 'bg')} relative`}
                                    >
                                        <div className="absolute inset-0 bg-white/20" style={{ backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)', backgroundSize: '1rem 1rem' }} />
                                    </motion.div>
                                </div>
                            </div>

                            <p className="text-base md:text-lg font-medium text-gray-800 dark:text-gray-200 leading-relaxed mb-6">
                                {area.description}
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {area.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-slate-800 border border-black dark:border-gray-500 text-xs font-bold uppercase flex items-center gap-2">
                                        <Layers size={12} className="opacity-50" /> {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}

            {/* Bottom Note */}
            <div className="p-6 border-2 border-dashed border-gray-400 text-center opacity-60">
                <p className="font-mono text-sm uppercase">
                    "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice."
                </p>
            </div>

        </div>
      </div>
    </div>
  );
};

export default FocusApp;