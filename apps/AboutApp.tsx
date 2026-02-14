import React, { useState } from 'react';
import { portfolioData } from '../data/portfolioData';
import { Github, Linkedin, Mail, MapPin, Briefcase, Code, Award, ExternalLink, User, ChevronDown, ChevronUp } from 'lucide-react';
import { useWindowStore } from '../store/useWindowStore';

const AboutApp: React.FC = () => {
  const { personal, skills, experience } = portfolioData;
  const { theme } = useWindowStore();
  const [showFullBio, setShowFullBio] = useState(false);

  // Truncate logic for mobile "Personal File"
  const bioLimit = 350;
  const isBioLong = personal.me.length > bioLimit;
  const displayBio = showFullBio ? personal.me : `${personal.me.slice(0, bioLimit)}...`;

  return (
    <div className="h-full w-full overflow-y-auto bg-[#FFF7ED] dark:bg-slate-950 p-4 md:p-8 text-black dark:text-white font-sans">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Hero Profile Section */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start bg-white dark:bg-slate-900 p-6 md:p-10 border-4 border-black dark:border-white shadow-[8px_8px_0_0_#000] dark:shadow-[8px_8px_0_0_#000]">
             {/* Avatar Box */}
             <div className="relative group shrink-0">
                 <div className="w-48 h-48 md:w-64 md:h-64 border-4 border-black dark:border-white overflow-hidden bg-[#FFC107] relative">
                     {/* Professional Lighting Gradient Background */}
                     <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.4),_transparent),radial-gradient(circle_at_80%_80%,_rgba(0,0,0,0.1),_transparent)]" />
                     
                     <img 
                        src={personal.image} 
                        alt={personal.name} 
                        className="w-full h-full object-cover relative z-10 transition-transform duration-500 group-hover:scale-105 drop-shadow-xl" 
                     />
                 </div>
                 {/* Decorative elements */}
                 <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-black border-4 border-white dark:border-black dark:bg-white z-20 flex items-center justify-center shadow-[4px_4px_0_0_rgba(0,0,0,0.2)]">
                    <Award size={24} className="text-white dark:text-black" />
                 </div>
             </div>
             
             {/* Text Content */}
             <div className="flex-1 w-full space-y-4">
                 <div className="text-center md:text-left">
                    <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-2">{personal.name}</h1>
                    <div 
                        className="inline-block px-4 py-2 border-2 border-black dark:border-white font-bold text-lg uppercase tracking-wide shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#fff]"
                        style={{ backgroundColor: theme.accentColor }}
                    >
                        {personal.tagline}
                    </div>
                 </div>
                 
                 {/* Address & Contact - Mobile Optimized (Stacked & Left Aligned container, effectively centered by parent but items close) */}
                 <div className="flex flex-col md:flex-row gap-2 md:gap-6 justify-center md:justify-start text-sm font-bold uppercase text-gray-600 dark:text-gray-400 mt-4">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                        <MapPin size={18} className="text-black dark:text-white shrink-0" /> 
                        <span>{personal.location}</span>
                    </div>
                    
                    {/* Divider only on desktop */}
                    <div className="hidden md:block w-px h-5 bg-gray-400"></div>
                    
                    <div className="flex items-center justify-center md:justify-start gap-2">
                        <Mail size={18} className="text-black dark:text-white shrink-0" /> 
                        <span className="normal-case">{personal.email}</span>
                    </div>
                 </div>

                 {/* Short Bio - Left aligned on mobile for readability */}
                 <p className="text-lg md:text-xl font-medium leading-relaxed text-gray-800 dark:text-gray-200 max-w-2xl text-left mx-auto md:mx-0">
                    {personal.bio}
                 </p>

                 <div className="flex gap-4 justify-center md:justify-start pt-2">
                     <a href={portfolioData.social.github} target="_blank" rel="noreferrer" className="neo-button px-6 py-3 bg-black text-white font-bold border-2 border-transparent hover:bg-gray-800 flex items-center gap-2 shadow-[4px_4px_0_0_#A78BFA]">
                        <Github size={20} /> GitHub
                     </a>
                     <a href={portfolioData.social.linkedin} target="_blank" rel="noreferrer" className="neo-button px-6 py-3 bg-white text-black font-bold border-2 border-black hover:bg-gray-100 flex items-center gap-2 shadow-[4px_4px_0_0_#000]">
                        <Linkedin size={20} /> LinkedIn
                     </a>
                 </div>
             </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Biography / About */}
            <div className="lg:col-span-7 space-y-8">
                <div className="bg-white dark:bg-slate-900 border-4 border-black dark:border-white p-8 shadow-[8px_8px_0_0_#000] dark:shadow-[8px_8px_0_0_#000]">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-[#F87171] p-2 border-2 border-black text-white">
                            <User size={24} strokeWidth={3} />
                        </div>
                        <h2 className="text-3xl font-black uppercase tracking-tight">Personal File</h2>
                    </div>
                    
                    {/* Collapsible Content */}
                    <div>
                        <p className="text-lg leading-loose font-medium text-justify text-gray-800 dark:text-gray-300">
                            {displayBio}
                        </p>
                        
                        {isBioLong && (
                            <button 
                                onClick={() => setShowFullBio(!showFullBio)}
                                className="mt-4 flex items-center gap-2 font-black uppercase text-sm border-2 border-black dark:border-white px-4 py-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_#fff]"
                            >
                                {showFullBio ? 'Show Less' : 'View More Details'}
                                {showFullBio ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                        )}
                    </div>
                </div>

                {/* Experience / Career Log */}
                <div className="bg-white dark:bg-slate-900 border-4 border-black dark:border-white p-8 shadow-[8px_8px_0_0_#000] dark:shadow-[8px_8px_0_0_#000]">
                     <div className="flex items-center gap-3 mb-8">
                        <div className="bg-[#60A5FA] p-2 border-2 border-black text-white">
                            <Briefcase size={24} strokeWidth={3} />
                        </div>
                        <h2 className="text-3xl font-black uppercase tracking-tight">Career Log</h2>
                    </div>

                    <div className="relative pl-4 md:pl-8 space-y-8 border-l-4 border-gray-200 dark:border-gray-700 ml-3">
                        {experience.map((exp, i) => (
                            <div key={i} className="relative pl-6 md:pl-8 group">
                                {/* Timeline Dot */}
                                <div className="absolute -left-[27px] md:-left-[43px] top-0 w-8 h-8 bg-black dark:bg-white border-4 border-white dark:border-slate-900 rounded-full flex items-center justify-center z-10 group-hover:scale-110 transition-transform">
                                    <span className="text-[10px]">{exp.logo}</span>
                                </div>
                                
                                <div className="bg-[#F3F4F6] dark:bg-slate-800 p-5 border-2 border-black dark:border-white shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#000] transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000] dark:hover:shadow-[6px_6px_0_0_#fff]">
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2 gap-1">
                                        <h3 className="font-black text-xl uppercase text-black dark:text-white">{exp.position}</h3>
                                        <span className="text-xs font-bold uppercase bg-black text-white px-2 py-1">{exp.duration}</span>
                                    </div>
                                    <div className="text-sm font-bold text-[#F59E0B] uppercase mb-3 flex items-center gap-1">
                                        <Briefcase size={14} /> {exp.company}
                                    </div>
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed">
                                        {exp.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Skills / Tech Arsenal */}
            <div className="lg:col-span-5 space-y-8">
                <div 
                    className="border-4 border-black dark:border-white p-8 shadow-[8px_8px_0_0_#000] dark:shadow-[8px_8px_0_0_#000]"
                    style={{ backgroundColor: theme.accentColor }}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-black p-2 border-2 border-white text-white">
                            <Code size={24} strokeWidth={3} />
                        </div>
                        <h2 className="text-3xl font-black uppercase tracking-tight text-black">Tech Arsenal</h2>
                    </div>

                    <div className="space-y-4">
                        {skills.map((skill, idx) => (
                            <div key={idx} className="bg-white border-2 border-black p-3 shadow-[4px_4px_0_0_rgba(0,0,0,0.2)]">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="font-black uppercase text-sm text-black tracking-wide">{skill.name}</span>
                                    <span className="font-mono text-xs font-bold text-gray-500">{skill.level}%</span>
                                </div>
                                <div className="flex gap-1 h-3">
                                    {Array.from({ length: 10 }).map((_, i) => {
                                        const filled = (i + 1) * 10 <= skill.level;
                                        return (
                                            <div 
                                                key={i} 
                                                className={`flex-1 border border-black ${filled ? 'bg-black' : 'bg-gray-100'}`}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tech Stack Cloud */}
                <div className="bg-white dark:bg-slate-900 border-4 border-black dark:border-white p-8 shadow-[8px_8px_0_0_#000] dark:shadow-[8px_8px_0_0_#000]">
                    <h3 className="text-xl font-black uppercase mb-4 border-b-2 border-black dark:border-white pb-2">Technologies</h3>
                    <div className="flex flex-wrap gap-2">
                        {portfolioData.techStack.map((tech) => (
                            <span 
                                key={tech.name} 
                                className="px-3 py-1.5 border-2 border-black dark:border-white font-bold text-xs uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors cursor-default"
                                style={{ boxShadow: "2px 2px 0 0 rgba(0,0,0,1)" }}
                            >
                                {tech.name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

        </div>
        
        {/* Footer CTA */}
        <div className="bg-black text-white p-10 text-center border-4 border-black dark:border-white shadow-[8px_8px_0_0_#FDE047] relative overflow-hidden">
            <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-black uppercase mb-4">Ready to Collaborate?</h2>
                <p className="text-gray-400 font-bold text-lg mb-8 max-w-2xl mx-auto">
                    I'm currently available for freelance projects and full-time opportunities. Let's build something extraordinary together.
                </p>
                <a 
                    href={`mailto:${personal.email}`}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#FDE047] text-black font-black text-xl uppercase border-4 border-transparent hover:bg-white hover:border-white transition-all transform hover:scale-105"
                >
                    Initiate Contact <ExternalLink size={20} strokeWidth={3} />
                </a>
            </div>
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        </div>

      </div>
    </div>
  );
};

export default AboutApp;