import React, { useState, useMemo } from 'react';
import { portfolioData } from '../data/portfolioData';
import { ExternalLink, Github, Star, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectsApp: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(portfolioData.projects.map(p => p.category));
    return ['All', ...Array.from(cats)];
  }, []);

  // Filter projects
  const filteredProjects = useMemo(() => {
    if (filter === 'All') return portfolioData.projects;
    return portfolioData.projects.filter(p => p.category === filter);
  }, [filter]);

  const selectedProject = useMemo(() => 
    portfolioData.projects.find(p => p.id === selectedId), 
  [selectedId]);

  return (
    <div className="h-full w-full bg-[#E5E7EB] dark:bg-slate-950 overflow-y-auto p-4 md:p-8 text-black dark:text-white relative">
      <header className="mb-8">
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-2">Projects</h1>
        <div className="h-4 w-32 bg-black dark:bg-white mb-6"></div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-3 items-center">
             <div className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-3 py-2 font-bold uppercase border-2 border-black dark:border-white shadow-[4px_4px_0_0_rgba(0,0,0,0.2)]">
                <Filter size={18} />
                <span className="hidden sm:inline">Filter</span>
             </div>
             {categories.map(cat => (
                 <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-4 py-2 border-2 border-black dark:border-white font-bold uppercase transition-all shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#000] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] 
                        ${filter === cat 
                            ? 'bg-[#FDE047] text-black translate-x-[-2px] translate-y-[-2px] shadow-[6px_6px_0_0_#000] dark:shadow-[6px_6px_0_0_#000]' 
                            : 'bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700'
                        }
                    `}
                 >
                    {cat}
                 </button>
             ))}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
        {filteredProjects.map((project) => (
          <motion.div 
            layoutId={`card-${project.id}`}
            key={project.id} 
            onClick={() => setSelectedId(project.id)}
            // Hide the grid item when selected so the layoutId transition works seamlessly to the overlay
            style={{ opacity: selectedId === project.id ? 0 : 1 }}
            className="flex flex-col bg-white dark:bg-slate-900 border-4 border-black dark:border-white shadow-[8px_8px_0_0_#000] dark:shadow-[8px_8px_0_0_#000] hover:shadow-[12px_12px_0_0_#000] dark:hover:shadow-[12px_12px_0_0_#000] hover:-translate-y-1 transition-all h-full cursor-pointer group"
          >
            {/* Image Frame */}
            <div className="relative h-48 border-b-4 border-black dark:border-white overflow-hidden">
              <motion.img 
                layoutId={`image-${project.id}`}
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
              />
              <div className="absolute top-0 right-0 p-2">
                 <span className="bg-[#FDE047] text-black text-xs font-black uppercase px-2 py-1 border-2 border-black shadow-[2px_2px_0_0_#000]">
                    {project.category}
                 </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-3">
                  <motion.h3 layoutId={`title-${project.id}`} className="text-2xl font-black uppercase leading-none">{project.title}</motion.h3>
                  {project.featured && <Star size={24} className="text-[#FDE047] fill-current stroke-black stroke-2" />}
              </div>
              
              <p className="text-base font-medium text-gray-700 dark:text-gray-300 mb-6 leading-relaxed flex-1 border-l-4 border-[#A78BFA] pl-3 line-clamp-3">
                {project.description}
              </p>

              {/* Tech Stack Preview */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.slice(0, 3).map((tech, i) => (
                  <span key={i} className="bg-black dark:bg-slate-700 text-white px-2 py-1 text-xs font-bold uppercase">
                    {tech}
                  </span>
                ))}
                {project.tech.length > 3 && (
                    <span className="text-xs font-bold uppercase self-center opacity-60">+{project.tech.length - 3} more</span>
                )}
              </div>

              <div className="mt-auto pt-4 border-t-2 border-dashed border-gray-300 dark:border-gray-700 text-center">
                  <span className="font-bold uppercase text-sm hover:underline">Click for Details</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Expanded View Overlay */}
      <AnimatePresence>
        {selectedId && selectedProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedId(null)}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
                />
                
                <motion.div 
                    layoutId={`card-${selectedId}`}
                    className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 border-4 border-black dark:border-white shadow-[16px_16px_0_0_#000] dark:shadow-[16px_16px_0_0_#000] overflow-hidden flex flex-col relative z-10"
                >
                    <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedId(null); }}
                        className="absolute top-4 right-4 z-20 bg-black text-white p-2 rounded-full hover:bg-red-500 transition-colors border-2 border-white shadow-lg"
                    >
                        <X size={24} strokeWidth={3} />
                    </button>

                    <div className="h-64 md:h-80 w-full border-b-4 border-black dark:border-white relative shrink-0">
                        <motion.img 
                            layoutId={`image-${selectedId}`}
                            src={selectedProject.image} 
                            className="w-full h-full object-cover"
                        />
                         <div className="absolute bottom-4 left-4">
                            <span className="bg-[#FDE047] text-black text-sm font-black uppercase px-3 py-1 border-2 border-black shadow-[4px_4px_0_0_#000]">
                                {selectedProject.category}
                            </span>
                        </div>
                    </div>

                    <div className="p-6 md:p-8 overflow-y-auto bg-white dark:bg-slate-900">
                        <div className="flex justify-between items-start gap-4 mb-6">
                            <motion.h3 layoutId={`title-${selectedId}`} className="text-3xl md:text-5xl font-black uppercase leading-none text-black dark:text-white">
                                {selectedProject.title}
                            </motion.h3>
                            {selectedProject.featured && (
                                <div className="hidden sm:flex items-center gap-1 text-[#FDE047] bg-black px-2 py-1 rounded border border-white/20">
                                    <Star size={16} fill="currentColor" />
                                    <span className="text-xs font-bold uppercase text-white">Featured</span>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-2 space-y-8">
                                <div>
                                    <h4 className="font-black uppercase text-lg mb-2 border-l-4 border-[#A78BFA] pl-2 text-black dark:text-white">Overview</h4>
                                    <p className="text-lg font-medium text-gray-800 dark:text-gray-200 leading-relaxed">
                                        {selectedProject.description}
                                    </p>
                                </div>
                                
                                <div>
                                    <h4 className="font-black uppercase text-lg mb-3 border-l-4 border-[#6EE7B7] pl-2 text-black dark:text-white">Tech Stack</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedProject.tech.map(t => (
                                            <span key={t} className="px-3 py-1 bg-gray-100 dark:bg-slate-800 border-2 border-black dark:border-white font-bold text-sm uppercase shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_#fff] text-black dark:text-white">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-[#F3F4F6] dark:bg-slate-800 p-4 border-2 border-black dark:border-white shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#fff]">
                                    <h4 className="font-black uppercase text-sm mb-4 text-black dark:text-white">Actions</h4>
                                    <div className="space-y-3">
                                        <a 
                                          href={selectedProject.live} 
                                          target="_blank" 
                                          rel="noreferrer"
                                          className="flex items-center justify-center gap-2 bg-[#6EE7B7] text-black border-2 border-black w-full py-3 font-bold uppercase hover:bg-white transition-all shadow-[2px_2px_0_0_#000] active:translate-y-1 active:shadow-none"
                                        >
                                          <ExternalLink size={18} strokeWidth={2.5} /> Live Demo
                                        </a>
                                        <a 
                                          href={selectedProject.github} 
                                          target="_blank" 
                                          rel="noreferrer"
                                          className="flex items-center justify-center gap-2 bg-white dark:bg-slate-700 text-black dark:text-white border-2 border-black dark:border-white w-full py-3 font-bold uppercase hover:bg-gray-100 dark:hover:bg-slate-600 transition-all shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_#fff] active:translate-y-1 active:shadow-none"
                                        >
                                          <Github size={18} strokeWidth={2.5} /> Source Code
                                        </a>
                                    </div>
                                </div>
                                
                                <div className="p-4 border-2 border-dashed border-gray-400 dark:border-gray-600 opacity-70">
                                     <p className="text-xs font-bold uppercase text-center text-gray-500 dark:text-gray-400">
                                        Project ID: #{selectedProject.id} <br/>
                                        Status: Deployed
                                     </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectsApp;