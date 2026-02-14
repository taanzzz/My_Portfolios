import { create } from 'zustand';
import { WindowState } from '../types';

interface PortfolioStore {
  windows: WindowState[];
  activeWindowId: string | null;
  isStartMenuOpen: boolean;
  isMobile: boolean;
  isShuttingDown: boolean;
  theme: {
    background: string;
    accentColor: string;
    isDarkMode: boolean;
  };
  
  // Actions
  toggleStartMenu: (isOpen?: boolean) => void;
  openWindow: (appId: string, title: string) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (id: string, x: number, y: number) => void;
  updateWindowSize: (id: string, width: number | string, height: number | string) => void;
  setIsMobile: (isMobile: boolean) => void;
  setTheme: (theme: Partial<PortfolioStore['theme']>) => void;
  setShuttingDown: (value: boolean) => void;
}

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

export const useWindowStore = create<PortfolioStore>((set, get) => ({
  windows: [],
  activeWindowId: null,
  isStartMenuOpen: false,
  isMobile: false,
  isShuttingDown: false,
  theme: {
    // Solid raw color or simple pattern for Neo-Brutalism
    background: "#FEF3C7", // Cream/Yellowish base
    accentColor: "#A78BFA", // Soft Purple
    isDarkMode: false, // Neo-Brutalism often works best in "Day" mode initially
  },

  setIsMobile: (isMobile) => set({ isMobile }),

  toggleStartMenu: (isOpen) => set((state) => ({ 
    isStartMenuOpen: isOpen !== undefined ? isOpen : !state.isStartMenuOpen,
  })),

  openWindow: (appId, title) => {
    const { windows, isMobile } = get();
    const existingWindow = windows.find(w => w.appId === appId);
    const highestZ = Math.max(...windows.map(w => w.zIndex), 0);
    
    if (existingWindow) {
      if (existingWindow.isMinimized) {
        set(state => ({
          windows: state.windows.map(w => w.id === existingWindow.id ? { ...w, isMinimized: false, zIndex: highestZ + 1 } : w),
          activeWindowId: existingWindow.id,
          isStartMenuOpen: false
        }));
      } else {
        get().focusWindow(existingWindow.id);
      }
      return;
    }

    const newWindow: WindowState = {
      id: generateId(),
      appId,
      title,
      isMinimized: false,
      isMaximized: isMobile, 
      zIndex: highestZ + 1,
      position: { x: isMobile ? 0 : 50 + (windows.length * 40), y: isMobile ? 0 : 50 + (windows.length * 40) },
      size: { width: isMobile ? '100%' : 900, height: isMobile ? '100%' : 700 }
    };

    set(state => ({
      windows: [...state.windows, newWindow],
      activeWindowId: newWindow.id,
      isStartMenuOpen: false
    }));
  },

  closeWindow: (id) => set(state => ({
    windows: state.windows.filter(w => w.id !== id),
    activeWindowId: state.activeWindowId === id ? null : state.activeWindowId
  })),

  minimizeWindow: (id) => set(state => ({
    windows: state.windows.map(w => w.id === id ? { ...w, isMinimized: true } : w),
    activeWindowId: null
  })),

  maximizeWindow: (id) => set(state => ({
    windows: state.windows.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w),
    activeWindowId: id
  })),

  focusWindow: (id) => set(state => {
    const highestZ = Math.max(...state.windows.map(w => w.zIndex), 0);
    return {
      activeWindowId: id,
      windows: state.windows.map(w => w.id === id ? { ...w, zIndex: highestZ + 1, isMinimized: false } : w),
      isStartMenuOpen: false
    };
  }),

  updateWindowPosition: (id, x, y) => set(state => ({
    windows: state.windows.map(w => w.id === id ? { ...w, position: { x, y } } : w)
  })),

  updateWindowSize: (id, width, height) => set(state => ({
    windows: state.windows.map(w => w.id === id ? { ...w, size: { width, height } } : w)
  })),

  setTheme: (newTheme) => set(state => {
    const updatedTheme = { ...state.theme, ...newTheme };
    localStorage.setItem('neo-theme', JSON.stringify(updatedTheme));
    return { theme: updatedTheme };
  }),

  setShuttingDown: (isShuttingDown) => set({ isShuttingDown, isStartMenuOpen: false })
}));