import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Desktop from './components/Desktop';
import LoadingScreen from './components/LoadingScreen';
import ShutdownScreen from './components/ShutdownScreen';
import { AppConfig } from './types';
import AboutApp from './apps/AboutApp';
import ProjectsApp from './apps/ProjectsApp';
import ResumeApp from './apps/ResumeApp';
import ContactApp from './apps/ContactApp';
import TerminalApp from './apps/TerminalApp';
import SettingsApp from './apps/SettingsApp';
import GamesApp from './apps/GamesApp';
import UniverseApp from './apps/UniverseApp';
import BlogApp from './apps/BlogApp';
import MapApp from './apps/MapApp';
import ReasoningApp from './apps/ReasoningApp';
import ArchitectureApp from './apps/ArchitectureApp';
import LabApp from './apps/LabApp';
import PhilosophyApp from './apps/PhilosophyApp';
import ServicesApp from './apps/ServicesApp';
import FocusApp from './apps/FocusApp';
import Chatbot from './components/Chatbot';
import ConnectionHub from './components/ConnectionHub';
import { useWindowStore } from './store/useWindowStore';

// --- Custom Icon Components ---
const ImgIcon = ({ src, size, className }: { src: string, size?: number | string, className?: string }) => (
  <img 
    src={src} 
    alt="App Icon" 
    className={className} 
    style={{ width: size ?? 24, height: size ?? 24, objectFit: 'contain' }}
  />
);

const AboutIcon = (p: any) => <ImgIcon src="https://res.cloudinary.com/dnatiwtcj/image/upload/v1767744189/microscope_ucu2k7.png" {...p} />;
const ProjectsIcon = (p: any) => <ImgIcon src="https://res.cloudinary.com/dnatiwtcj/image/upload/v1767744189/scientist_2_mnfuzi.png" {...p} />;
const TerminalIcon = (p: any) => <ImgIcon src="https://res.cloudinary.com/dnatiwtcj/image/upload/v1767744188/maths_ogow8d.png" {...p} />;
const UniverseIcon = (p: any) => <ImgIcon src="https://res.cloudinary.com/dnatiwtcj/image/upload/v1767744189/astronomy_1_egigln.png" {...p} />;
const MapIcon = (p: any) => <ImgIcon src="https://res.cloudinary.com/dnatiwtcj/image/upload/v1767744189/astronomy_fvb7df.png" {...p} />;
const BlogIcon = (p: any) => <ImgIcon src="https://res.cloudinary.com/dnatiwtcj/image/upload/v1767744914/idea_ybnsoq.png" {...p} />;
const ResumeIcon = (p: any) => <ImgIcon src="https://res.cloudinary.com/dnatiwtcj/image/upload/v1767744914/idea_1_i0suyl.png" {...p} />;
const GamesIcon = (p: any) => <ImgIcon src="https://res.cloudinary.com/dnatiwtcj/image/upload/v1767744914/rocket_oysn3j.png" {...p} />;
const ContactIcon = (p: any) => <ImgIcon src="https://res.cloudinary.com/dnatiwtcj/image/upload/v1767744914/physics_uizdrp.png" {...p} />;
const SettingsIcon = (p: any) => <ImgIcon src="https://res.cloudinary.com/dnatiwtcj/image/upload/v1767744914/genetic-engineering_nyfuom.png" {...p} />;
const ReasoningIcon = (p: any) => <ImgIcon src="https://res.cloudinary.com/dnatiwtcj/image/upload/v1767821630/thinking_1_sj8nri.png" {...p} />;
const ArchIcon = (p: any) => <ImgIcon src="https://res.cloudinary.com/dnatiwtcj/image/upload/v1767822692/computer-engineer_xqwzbf.png" {...p} />;
const LabIcon = (p: any) => <ImgIcon src="https://res.cloudinary.com/dnatiwtcj/image/upload/v1767823342/science_cyj7bm.png" {...p} />;
const PhilIcon = (p: any) => <ImgIcon src="https://res.cloudinary.com/dnatiwtcj/image/upload/v1767824095/question_sozl5y.png" {...p} />;
const ServicesIcon = (p: any) => <ImgIcon src="https://res.cloudinary.com/dnatiwtcj/image/upload/v1767825147/vector_du0fyg.png" {...p} />;
const FocusIcon = (p: any) => <ImgIcon src="https://res.cloudinary.com/dnatiwtcj/image/upload/v1767827884/maths_1_poitwh.png" {...p} />;


// --- App Configuration ---
const apps: AppConfig[] = [
  { id: 'about', title: 'About Me', icon: AboutIcon, component: AboutApp },
  { id: 'projects', title: 'Projects', icon: ProjectsIcon, component: ProjectsApp },
  { id: 'services', title: 'What I Build', icon: ServicesIcon, component: ServicesApp }, 
  { id: 'focus', title: 'R&D Focus', icon: FocusIcon, component: FocusApp },
  { id: 'lab', title: 'Exp. Lab', icon: LabIcon, component: LabApp }, 
  { id: 'architecture', title: 'System Arch', icon: ArchIcon, component: ArchitectureApp }, 
  { id: 'reasoning', title: 'How I Think', icon: ReasoningIcon, component: ReasoningApp },
  { id: 'philosophy', title: 'My Philosophy', icon: PhilIcon, component: PhilosophyApp },
  { id: 'blog', title: 'Blog', icon: BlogIcon, component: BlogApp },
  { id: 'universe', title: 'Universe', icon: UniverseIcon, component: UniverseApp },
  { id: 'resume', title: 'Resume', icon: ResumeIcon, component: ResumeApp },
  { id: 'games', title: 'Games', icon: GamesIcon, component: GamesApp },
  { id: 'map', title: 'Map', icon: MapIcon, component: MapApp },
  { id: 'contact', title: 'Contact', icon: ContactIcon, component: ContactApp },
  { id: 'terminal', title: 'Terminal', icon: TerminalIcon, component: TerminalApp },
  { id: 'settings', title: 'Settings', icon: SettingsIcon, component: SettingsApp },
];

const App: React.FC = () => {
  const { theme, setIsMobile, isShuttingDown } = useWindowStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mobile detection handler
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    handleResize();

    // Listen
    window.addEventListener('resize', handleResize);

    // Apply dark mode class to html element
    if (theme.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Apply accent color variable
    document.documentElement.style.setProperty('--accent-color', theme.accentColor);
    
    // Attempt to load saved theme
    const savedTheme = localStorage.getItem('os-theme');
    if (savedTheme) {
        useWindowStore.getState().setTheme(JSON.parse(savedTheme));
    }

    // Simulate System Boot
    const bootTimer = setTimeout(() => {
        setIsLoading(false);
    }, 2500);

    return () => {
        clearTimeout(bootTimer);
        window.removeEventListener('resize', handleResize);
    };
  }, [theme.isDarkMode, theme.accentColor, setIsMobile]);

  return (
    <>
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    key="boot-screen"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[99999]"
                >
                    <LoadingScreen />
                </motion.div>
            )}
            
            {isShuttingDown && (
               <motion.div
                    key="shutdown-screen"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[100000]"
               >
                   <ShutdownScreen />
               </motion.div>
            )}
        </AnimatePresence>
        
        <Desktop apps={apps} />
        <Chatbot />
        <ConnectionHub />
    </>
  );
};

export default App;