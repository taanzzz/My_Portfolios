import React from 'react';

interface IconProps {
  id: string;
  title: string;
  icon: React.FC<any>;
  onDoubleClick: () => void;
  onSingleClick: () => void;
}

const Icon: React.FC<IconProps> = ({ title, icon: IconComponent, onDoubleClick, onSingleClick }) => {
  return (
    <div 
      className="flex flex-col items-center gap-3 w-[120px] cursor-pointer group select-none"
      onClick={onSingleClick}
      onDoubleClick={onDoubleClick}
      onTouchEnd={(e) => {
        const now = Date.now();
        if ((e.target as any).lastTouch && now - (e.target as any).lastTouch < 300) {
            onDoubleClick();
        } else {
            onSingleClick();
        }
        (e.target as any).lastTouch = now;
      }}
    >
      <div className="w-20 h-20 flex items-center justify-center bg-white dark:bg-slate-800 border-[3px] border-black dark:border-white shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#000] group-hover:translate-x-[4px] group-hover:translate-y-[4px] group-hover:shadow-none transition-all duration-150 relative">
         <IconComponent size={48} className="text-black dark:text-white relative z-10" strokeWidth={2.5} />
         {/* Subtle corner accent */}
         <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-black/10 dark:border-t-white/10" />
      </div>
      <span className="text-black dark:text-white font-bold text-sm bg-white dark:bg-slate-800 px-2 py-0.5 border-[3px] border-black dark:border-white shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#000] group-hover:bg-[#FDE047] dark:group-hover:bg-slate-700 group-hover:translate-x-[4px] group-hover:translate-y-[4px] group-hover:shadow-none transition-all duration-150 text-center leading-tight">
        {title}
      </span>
    </div>
  );
};

export default Icon;