import React from 'react';
import { useWindowStore } from '../store/useWindowStore';
import { Moon, Sun, Check, Monitor } from 'lucide-react';

const wallpapers = [
  "#FEF3C7", // Cream
  "#E0E7FF", // Lavender
  "#DCFCE7", // Mint
  "#F3F4F6", // Gray
  "#FCA5A5", // Red
  "#BAE6FD", // Sky
  "#FFEDD5", // Pale Orange
  "#FAE8FF", // Light Fuchsia
  "#CCFBF1", // Light Teal
  "#FECACA", // Light Red
  "#E9D5FF", // Light Purple
  "#C7D2FE", // Soft Indigo
  "#D1FAE5", // Light Emerald
  "#F5F5F4", // Warm Gray
];

const accents = [
  { name: 'Purple', value: '#A78BFA' },
  { name: 'Yellow', value: '#FDE047' },
  { name: 'Mint', value: '#6EE7B7' },
  { name: 'Red', value: '#F87171' },
  { name: 'Blue', value: '#60A5FA' },
  { name: 'Pink', value: '#F472B6' },
  { name: 'Lime', value: '#A3E635' },
  { name: 'Orange', value: '#FB923C' },
  { name: 'Cyan', value: '#22D3EE' },
  { name: 'Teal', value: '#2DD4BF' },
  { name: 'Indigo', value: '#818CF8' },
  { name: 'Fuchsia', value: '#E879F9' },
];

const SettingsApp: React.FC = () => {
  const { theme, setTheme } = useWindowStore();

  return (
    <div className="h-full w-full bg-white dark:bg-slate-900 p-6 md:p-10 font-sans overflow-y-auto text-black dark:text-white">
      <div className="max-w-3xl mx-auto space-y-12">
          
          <div className="border-b-4 border-black dark:border-white pb-4">
              <h1 className="text-4xl font-black uppercase">Preferences</h1>
          </div>

          <section>
            <h3 className="text-xl font-black uppercase mb-4 flex items-center gap-2">
                <Monitor className="bg-black dark:bg-white text-white dark:text-black p-1 w-8 h-8" /> 
                System Theme
            </h3>
            <div className="flex gap-4">
                <button 
                    onClick={() => setTheme({ isDarkMode: false })}
                    className={`flex-1 p-6 border-4 border-black dark:border-white flex flex-col items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000] dark:hover:shadow-[6px_6px_0_0_#000]
                        ${!theme.isDarkMode ? 'bg-[#FDE047] shadow-[6px_6px_0_0_#000]' : 'bg-white dark:bg-slate-800'}
                    `}
                >
                    <Sun size={32} strokeWidth={3} className={!theme.isDarkMode ? 'text-black' : 'text-black dark:text-white'} />
                    <span className={`font-bold text-lg uppercase ${!theme.isDarkMode ? 'text-black' : 'text-black dark:text-white'}`}>Light</span>
                </button>
                <button 
                    onClick={() => setTheme({ isDarkMode: true })}
                    className={`flex-1 p-6 border-4 border-black dark:border-white flex flex-col items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000] dark:hover:shadow-[6px_6px_0_0_#000]
                        ${theme.isDarkMode ? 'bg-black text-white shadow-[6px_6px_0_0_#A78BFA]' : 'bg-white dark:bg-slate-800'}
                    `}
                >
                    <Moon size={32} strokeWidth={3} className={theme.isDarkMode ? 'text-white' : 'text-black dark:text-white'} />
                    <span className="font-bold text-lg uppercase">Dark</span>
                </button>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-black uppercase mb-4">Accent Color</h3>
            <div className="flex flex-wrap gap-4">
                {accents.map((accent) => (
                    <button
                        key={accent.value}
                        onClick={() => setTheme({ accentColor: accent.value })}
                        title={accent.name}
                        className={`w-14 h-14 md:w-16 md:h-16 border-4 border-black dark:border-white flex items-center justify-center transition-transform hover:scale-110 shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#000] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]`}
                        style={{ backgroundColor: accent.value }}
                    >
                        {theme.accentColor === accent.value && <Check className="text-black stroke-[4]" size={32} />}
                    </button>
                ))}
            </div>
          </section>

          <section className={`${theme.isDarkMode ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-black uppercase">Background</h3>
                {theme.isDarkMode && <span className="text-xs font-bold uppercase bg-black text-white px-2 py-1">Disabled in Dark Mode</span>}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {wallpapers.map((color, i) => (
                    <button 
                        key={i}
                        onClick={() => setTheme({ background: color })}
                        className={`h-24 border-4 border-black p-2 flex items-center justify-center transition-all hover:-translate-y-1 shadow-[4px_4px_0_0_#000] active:shadow-none active:translate-y-[4px] active:translate-x-[4px]`}
                        style={{ backgroundColor: color }}
                    >
                         {theme.background === color && <span className="bg-black text-white px-2 py-1 font-bold text-xs uppercase">Selected</span>}
                    </button>
                ))}
            </div>
          </section>
      </div>
    </div>
  );
};

export default SettingsApp;