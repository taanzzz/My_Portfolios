import React from 'react';
import { portfolioData } from '../data/portfolioData';
import { Download, FileText, ExternalLink, Printer, Eye, CheckCircle } from 'lucide-react';
import { useWindowStore } from '../store/useWindowStore';

const ResumeApp: React.FC = () => {
  const { theme } = useWindowStore();
  
  // Extract ID from Google Drive URL to construct preview URL
  // URL format: https://drive.google.com/file/d/[ID]/view...
  const getPreviewUrl = (url: string) => {
      const match = url.match(/\/d\/(.+?)\//);
      if (match && match[1]) {
          return `https://drive.google.com/file/d/${match[1]}/preview`;
      }
      return url;
  };

  const previewUrl = getPreviewUrl(portfolioData.personal.resume);

  return (
    <div className="h-full w-full bg-[#E5E5E5] dark:bg-slate-950 flex flex-col font-sans">
      
      {/* Toolbar / Header */}
      <div className="flex-none bg-white dark:bg-slate-900 border-b-4 border-black dark:border-white p-4 flex flex-wrap gap-4 justify-between items-center z-10 shadow-sm">
        <div className="flex items-center gap-3">
            <div className="bg-red-500 text-white p-2 border-2 border-black dark:border-white shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_#fff]">
                <FileText size={20} strokeWidth={3} />
            </div>
            <div>
                <h1 className="font-black text-xl uppercase tracking-tight leading-none text-black dark:text-white">Resume_Final.pdf</h1>
                <div className="flex items-center gap-1 text-xs font-bold text-gray-500 dark:text-gray-400 mt-1 uppercase">
                    <CheckCircle size={10} className="text-green-500" />
                    <span>Verified • Last Updated: Today</span>
                </div>
            </div>
        </div>

        <div className="flex items-center gap-3">
             <a 
                href={portfolioData.personal.resume} 
                target="_blank" 
                rel="noreferrer"
                className="hidden md:flex items-center gap-2 px-4 py-2 border-2 border-black dark:border-white font-bold uppercase hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-black dark:text-white text-sm"
             >
                <Printer size={16} /> Print
             </a>
             <a 
                href={portfolioData.personal.resume} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-6 py-2 border-2 border-transparent hover:border-black dark:hover:border-white font-bold uppercase hover:bg-[#FDE047] hover:text-black transition-all shadow-[4px_4px_0_0_#A78BFA] active:translate-y-1 active:shadow-none"
             >
                <Download size={18} strokeWidth={3} /> <span className="hidden sm:inline">Download PDF</span>
             </a>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
         
         {/* Sidebar (Desktop Only) */}
         <div className="hidden md:block w-64 bg-[#F3F4F6] dark:bg-slate-900 border-r-4 border-black dark:border-white p-6 overflow-y-auto shrink-0">
             <h3 className="font-black uppercase mb-4 text-black dark:text-white border-b-2 border-black dark:border-white pb-2">Quick Stats</h3>
             
             <div className="space-y-6">
                 <div>
                     <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">Core Skills</h4>
                     <div className="flex flex-wrap gap-2">
                        {portfolioData.skills.slice(0,5).map(skill => (
                            <span key={skill.name} className="bg-white dark:bg-slate-800 border border-black dark:border-white px-2 py-1 text-xs font-bold uppercase shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_#fff] text-black dark:text-white">
                                {skill.name}
                            </span>
                        ))}
                     </div>
                 </div>

                 <div>
                     <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">Education</h4>
                     <div className="bg-white dark:bg-slate-800 p-3 border-2 border-black dark:border-white text-xs">
                         <p className="font-black text-black dark:text-white uppercase">University of Tech</p>
                         <p className="text-gray-600 dark:text-gray-300">B.Sc Computer Science</p>
                         <p className="text-gray-400 mt-1">2018 - 2022</p>
                     </div>
                 </div>

                 <div>
                     <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">Contact</h4>
                     <a href={`mailto:${portfolioData.personal.email}`} className="block w-full text-center py-2 bg-[#6EE7B7] border-2 border-black font-bold text-xs uppercase hover:bg-[#34D399] transition-colors text-black shadow-[2px_2px_0_0_#000]">
                         Hire Me
                     </a>
                 </div>
             </div>
         </div>

         {/* PDF Viewer */}
         <div className="flex-1 bg-[#525252] dark:bg-slate-800 p-4 md:p-8 flex justify-center overflow-y-auto relative">
             <div className="relative w-full max-w-4xl h-full min-h-[500px] shadow-[8px_8px_0_0_rgba(0,0,0,0.5)] bg-white">
                 <iframe 
                    src={previewUrl}
                    className="w-full h-full border-4 border-black dark:border-white"
                    title="Resume Preview"
                    allow="autoplay"
                 ></iframe>
                 
                 {/* Fallback overlay if iframe fails visually or loads slowly */}
                 <div className="absolute inset-0 -z-10 flex flex-col items-center justify-center bg-white dark:bg-gray-100">
                     <p className="font-bold text-gray-400 animate-pulse">Loading Document...</p>
                 </div>
             </div>
         </div>
      </div>
    </div>
  );
};

export default ResumeApp;