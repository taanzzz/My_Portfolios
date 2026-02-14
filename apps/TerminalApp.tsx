import React, { useState, useRef, useEffect, useCallback } from 'react';
import { portfolioData } from '../data/portfolioData';
import { useWindowStore } from '../store/useWindowStore';
import { Terminal, ShieldCheck, Wifi, Cpu, Clock, Gamepad2, AlertTriangle } from 'lucide-react';

// --- Types ---

interface TerminalLine {
  id: string;
  type: 'input' | 'output';
  content: React.ReactNode;
  timestamp?: string;
  path?: string;
}

const COMMANDS = [
  { cmd: 'help', desc: 'List available commands' },
  { cmd: 'about', desc: 'Display user biography' },
  { cmd: 'projects', desc: 'List portfolio projects' },
  { cmd: 'skills', desc: 'View technical skills' },
  { cmd: 'social', desc: 'Display social networks' },
  { cmd: 'contact', desc: 'Show contact information' },
  { cmd: 'game', desc: 'Launch Snake Protocol' },
  { cmd: 'clear', desc: 'Clear terminal history' },
  { cmd: 'whoami', desc: 'Display current user' },
  { cmd: 'date', desc: 'Show system time' },
];

// --- Snake Game Component ---

const GRID_W = 40;
const GRID_H = 20;
const SPEEDS = { EASY: 150, HARD: 80 };

const SnakeGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [snake, setSnake] = useState<{x: number, y: number}[]>([{x: 5, y: 10}, {x: 4, y: 10}, {x: 3, y: 10}]);
  const [food, setFood] = useState({x: 20, y: 10});
  const [dir, setDir] = useState({x: 1, y: 0});
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const dirRef = useRef({x: 1, y: 0});
  const gameLoopRef = useRef<number | null>(null);

  // Spawn food ensuring it doesn't overlap snake
  const spawnFood = useCallback((currentSnake: {x: number, y: number}[]) => {
      let newFood;
      while (true) {
          newFood = {
              x: Math.floor(Math.random() * (GRID_W - 2)) + 1,
              y: Math.floor(Math.random() * (GRID_H - 2)) + 1
          };
          // eslint-disable-next-line no-loop-func
          const collision = currentSnake.some(seg => seg.x === newFood.x && seg.y === newFood.y);
          if (!collision) break;
      }
      return newFood;
  }, []);

  const resetGame = () => {
      setSnake([{x: 5, y: 10}, {x: 4, y: 10}, {x: 3, y: 10}]);
      setDir({x: 1, y: 0});
      dirRef.current = {x: 1, y: 0};
      setScore(0);
      setGameOver(false);
      setGameStarted(true);
      setFood(spawnFood([{x: 5, y: 10}, {x: 4, y: 10}, {x: 3, y: 10}]));
  };

  // Input Handling
  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          if (!gameStarted && e.key === 'Enter') {
              resetGame();
              return;
          }
          if (gameOver && e.key === 'Enter') {
              resetGame();
              return;
          }
          if (e.key === 'Escape' || e.key === 'q') {
              onExit();
              return;
          }

          const currentDir = dirRef.current;
          switch(e.key) {
              case 'ArrowUp': 
                  if (currentDir.y === 0) dirRef.current = {x: 0, y: -1}; 
                  break;
              case 'ArrowDown': 
                  if (currentDir.y === 0) dirRef.current = {x: 0, y: 1}; 
                  break;
              case 'ArrowLeft': 
                  if (currentDir.x === 0) dirRef.current = {x: -1, y: 0}; 
                  break;
              case 'ArrowRight': 
                  if (currentDir.x === 0) dirRef.current = {x: 1, y: 0}; 
                  break;
          }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, gameOver, onExit]);

  // Game Loop
  useEffect(() => {
      if (!gameStarted || gameOver) return;

      const moveSnake = () => {
          setSnake(prevSnake => {
              const head = prevSnake[0];
              const newHead = { x: head.x + dirRef.current.x, y: head.y + dirRef.current.y };
              
              // Wall Collision
              if (newHead.x <= 0 || newHead.x >= GRID_W - 1 || newHead.y <= 0 || newHead.y >= GRID_H - 1) {
                  setGameOver(true);
                  return prevSnake;
              }

              // Self Collision
              if (prevSnake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
                  setGameOver(true);
                  return prevSnake;
              }

              const newSnake = [newHead, ...prevSnake];

              // Food Collision
              if (newHead.x === food.x && newHead.y === food.y) {
                  setScore(s => s + 10);
                  setFood(spawnFood(newSnake));
                  // Don't pop tail (grow)
              } else {
                  newSnake.pop();
              }

              return newSnake;
          });
          setDir(dirRef.current);
      };

      gameLoopRef.current = window.setInterval(moveSnake, score > 100 ? SPEEDS.HARD : SPEEDS.EASY);
      return () => {
          if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      };
  }, [gameStarted, gameOver, food, score, spawnFood]);

  // Render Grid
  const renderGrid = () => {
      let gridString = "";
      
      // Top Border
      gridString += "+" + "-".repeat(GRID_W - 2) + "+\n";

      for (let y = 1; y < GRID_H - 1; y++) {
          let row = "|";
          for (let x = 1; x < GRID_W - 1; x++) {
              let char = " ";
              // Check Snake
              const snakeIndex = snake.findIndex(s => s.x === x && s.y === y);
              if (snakeIndex === 0) char = "O"; // Head
              else if (snakeIndex > 0) char = "o"; // Body
              
              // Check Food
              if (food.x === x && food.y === y) char = "*";

              row += char;
          }
          row += "|\n";
          gridString += row;
      }

      // Bottom Border
      gridString += "+" + "-".repeat(GRID_W - 2) + "+";
      return gridString;
  };

  return (
      <div className="h-full w-full flex flex-col items-center justify-center font-mono bg-[#1e1e1e] text-emerald-500 select-none p-4">
          <div className="mb-4 text-center">
              <h2 className="text-xl font-bold uppercase tracking-widest flex items-center gap-2 justify-center">
                  <Gamepad2 size={24} /> PYTHON_PROTOCOL.EXE
              </h2>
              <div className="flex justify-between w-64 mx-auto mt-2 text-sm text-gray-400">
                  <span>SCORE: {score}</span>
                  <span>STATUS: {gameOver ? "TERMINATED" : gameStarted ? "RUNNING" : "STANDBY"}</span>
              </div>
          </div>

          <div className="bg-black border-4 border-emerald-900 p-2 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <pre className="text-base leading-none font-bold whitespace-pre">
                  {renderGrid()}
              </pre>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
              {!gameStarted && !gameOver && (
                  <div className="animate-pulse">
                      PRESS <span className="text-white font-bold">[ENTER]</span> TO INITIATE SEQUENCE
                  </div>
              )}
              {gameOver && (
                  <div className="text-red-500 font-bold">
                      MISSION FAILED. PRESS <span className="text-white">[ENTER]</span> TO RETRY
                  </div>
              )}
              {gameStarted && !gameOver && (
                  <div className="flex gap-4">
                      <span>USE ARROW KEYS TO NAVIGATE</span>
                  </div>
              )}
              <div className="mt-2">
                  PRESS <span className="text-white font-bold">[Q]</span> TO EXIT TO SHELL
              </div>
          </div>
      </div>
  );
};


// --- Main Terminal App ---

const TerminalApp: React.FC = () => {
  const { setShuttingDown } = useWindowStore();
  const [history, setHistory] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isGameMode, setIsGameMode] = useState(false);
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // --- Initialization ---
  useEffect(() => {
    const welcomeId = Math.random().toString(36).substr(2, 9);
    setHistory([
      {
        id: welcomeId,
        type: 'output',
        content: (
          <div className="mb-4 animate-in fade-in duration-500">
             <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg mb-2">
                <Terminal size={20} />
                <span>Portfolio OS Shell [v3.0.1]</span>
             </div>
             <div className="text-gray-400 mb-2">
                Connected to session <span className="text-blue-400">guest@portfolio</span> via secure shell.
             </div>
             <div className="text-gray-400">
                Type <span className="text-yellow-400 font-bold">'help'</span> to view available commands.
             </div>
             <div className="w-full h-px bg-gray-700/50 my-3" />
          </div>
        )
      }
    ]);
  }, []);

  // --- Auto Scroll ---
  useEffect(() => {
    if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, isGameMode]);

  // --- Helpers ---
  const addToHistory = (type: 'input' | 'output', content: React.ReactNode, cmd?: string) => {
    setHistory(prev => [
      ...prev,
      {
        id: Math.random().toString(36).substr(2, 9),
        type,
        content,
        timestamp: new Date().toLocaleTimeString([], { hour12: false }),
        path: '~'
      }
    ]);

    if (cmd) {
        setCmdHistory(prev => [...prev, cmd]);
        setHistoryIndex(-1);
    }
  };

  // --- Command Logic ---
  const handleCommand = (cmdRaw: string) => {
    const cmd = cmdRaw.trim();
    
    // Add Input Line
    if (cmd) {
        addToHistory('input', cmd, cmd);
    } else {
        addToHistory('input', '');
        return;
    }

    const lowerCmd = cmd.toLowerCase().split(' ')[0];

    switch (lowerCmd) {
      case 'help':
        addToHistory('output', (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl">
            {COMMANDS.map(c => (
              <div key={c.cmd} className="flex items-center justify-between group">
                 <span className="text-yellow-400 font-bold min-w-[100px]">{c.cmd}</span>
                 <span className="text-gray-400 text-sm group-hover:text-gray-200 transition-colors">{c.desc}</span>
              </div>
            ))}
          </div>
        ));
        break;

      case 'clear':
        setHistory([]);
        break;

      case 'game':
        setIsGameMode(true);
        addToHistory('output', <span className="text-yellow-400">Launching interactive module...</span>);
        break;

      case 'about':
        addToHistory('output', (
          <div className="max-w-3xl space-y-2">
             <div className="flex items-center gap-2 text-blue-400 font-bold mb-1">
                <ShieldCheck size={16} />
                <span>USER_BIO_DUMP</span>
             </div>
             <p className="leading-relaxed text-gray-200 border-l-2 border-blue-400/50 pl-3">
                {portfolioData.personal.bio}
             </p>
          </div>
        ));
        break;

      case 'whoami':
        addToHistory('output', <span className="text-emerald-400 font-bold">guest_user</span>);
        break;

      case 'date':
        addToHistory('output', <span className="text-gray-300">{new Date().toString()}</span>);
        break;
      
      case 'sudo':
         addToHistory('output', <span className="text-red-400 font-bold italic">Permission denied: You are not in the sudoers file. This incident will be reported.</span>);
         break;

      case 'exit':
         addToHistory('output', <span className="text-red-400">Initiating system shutdown sequence...</span>);
         setTimeout(() => setShuttingDown(true), 1000);
         break;

      case 'skills':
        const maxLen = Math.max(...portfolioData.skills.map(s => s.name.length));
        addToHistory('output', (
          <div className="space-y-1 font-mono text-sm">
             <div className="mb-2 text-purple-400 font-bold uppercase tracking-wider">Skill Metrics</div>
             {portfolioData.skills.map(s => {
                const filled = Math.floor(s.level / 5);
                const empty = 20 - filled;
                const bar = '█'.repeat(filled) + '░'.repeat(empty);
                return (
                    <div key={s.name} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                        <span className="text-gray-300 w-32 shrink-0">{s.name}</span>
                        <div className="flex items-center gap-2">
                            <span className="text-emerald-500">{bar}</span>
                            <span className="text-gray-500 text-xs">[{s.level}%]</span>
                        </div>
                    </div>
                );
             })}
          </div>
        ));
        break;

      case 'projects':
        addToHistory('output', (
            <div className="space-y-4">
               {portfolioData.projects.map(p => (
                   <div key={p.id} className="border-l-2 border-gray-700 pl-3 hover:border-emerald-500 transition-colors">
                       <div className="flex flex-wrap items-center gap-2 mb-1">
                           <span className="text-emerald-400 font-bold text-lg">{p.title}</span>
                           <span className="text-xs bg-gray-800 text-gray-400 px-1 rounded border border-gray-700">{p.category}</span>
                           {p.featured && <span className="text-xs text-yellow-400">★ FEATURED</span>}
                       </div>
                       <div className="text-gray-300 mb-2 text-sm max-w-2xl">{p.description}</div>
                       <div className="text-xs text-gray-500 font-mono">
                           [{p.tech.join(', ')}]
                       </div>
                       <div className="mt-1 flex gap-3 text-sm">
                           {p.live && <a href={p.live} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline hover:text-blue-300 flex items-center gap-1">Live Demo ↗</a>}
                           {p.github && <a href={p.github} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline hover:text-blue-300 flex items-center gap-1">Source Code ↗</a>}
                       </div>
                   </div>
               ))}
            </div>
        ));
        break;

      case 'social':
      case 'contact':
        addToHistory('output', (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
                {Object.entries(portfolioData.social).map(([key, url]) => (
                    <a 
                        key={key} 
                        href={url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center justify-between bg-gray-800 p-2 rounded border border-gray-700 hover:border-emerald-500 hover:bg-gray-700 transition-all group text-sm"
                    >
                        <span className="text-gray-300 uppercase font-bold">{key}</span>
                        <span className="text-gray-500 group-hover:text-emerald-400">↗</span>
                    </a>
                ))}
                <div className="col-span-1 sm:col-span-2 bg-gray-800 p-2 rounded border border-gray-700 flex justify-between items-center text-sm">
                     <span className="text-gray-300 uppercase font-bold">Email</span>
                     <span className="text-gray-400 select-all">{portfolioData.personal.email}</span>
                </div>
            </div>
        ));
        break;

      default:
        addToHistory('output', (
            <div className="text-red-400">
                Command not found: <span className="font-bold">{cmd}</span>. Type <span className="text-yellow-400">'help'</span> for list.
            </div>
        ));
    }
  };

  // --- Keyboard Handling ---
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        handleCommand(input);
        setInput('');
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (cmdHistory.length > 0) {
            const newIndex = historyIndex < cmdHistory.length - 1 ? historyIndex + 1 : historyIndex;
            setHistoryIndex(newIndex);
            setInput(cmdHistory[cmdHistory.length - 1 - newIndex]);
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setInput(cmdHistory[cmdHistory.length - 1 - newIndex]);
        } else if (historyIndex === 0) {
            setHistoryIndex(-1);
            setInput('');
        }
    } else if (e.key === 'Tab') {
        e.preventDefault();
        const match = COMMANDS.find(c => c.cmd.startsWith(input.toLowerCase()));
        if (match) setInput(match.cmd);
    }
  };

  const focusInput = () => {
      // Small delay to ensure selection isn't messed up if copying text
      setTimeout(() => inputRef.current?.focus(), 10);
  };

  // Switch Render based on Mode
  if (isGameMode) {
      return <SnakeGame onExit={() => setIsGameMode(false)} />;
  }

  return (
    <div 
        className="h-full w-full bg-[#1e1e1e] text-gray-200 font-mono text-sm md:text-base flex flex-col overflow-hidden selection:bg-emerald-500/30 selection:text-white"
        onClick={focusInput}
    >
      {/* Visual Status Bar */}
      <div className="bg-[#252526] px-3 py-1.5 flex justify-between items-center border-b border-black select-none shrink-0">
          <div className="flex items-center gap-4 text-xs text-gray-400">
             <div className="flex items-center gap-1.5 hover:text-gray-200 transition-colors">
                 <Wifi size={12} className="text-emerald-500" />
                 <span>SSH-2.0-OpenSSH_8.9p1</span>
             </div>
             <div className="hidden sm:flex items-center gap-1.5">
                 <Cpu size={12} />
                 <span>x86_64-linux-gnu</span>
             </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock size={12} />
              <span>{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          </div>
      </div>

      {/* Terminal Content */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar scroll-smooth"
      >
        {history.map((line) => (
            <div key={line.id} className="break-words">
                {line.type === 'input' ? (
                    <div className="flex items-start mt-4 mb-1">
                         <span className="text-gray-500 mr-2 text-xs pt-1 select-none hidden sm:block">[{line.timestamp}]</span>
                         <div className="flex flex-wrap items-baseline gap-x-2">
                             <div className="flex items-center font-bold">
                                 <span className="text-emerald-400">guest</span>
                                 <span className="text-gray-400">@</span>
                                 <span className="text-purple-400">portfolio</span>
                             </div>
                             <span className="text-blue-400 font-bold">~</span>
                             <span className="text-emerald-400 font-bold">➜</span>
                             <span className="text-gray-100 font-medium">{line.content}</span>
                         </div>
                    </div>
                ) : (
                    <div className="mb-2 ml-0 sm:ml-2 pl-2 border-l-2 border-transparent hover:border-gray-800 transition-colors">
                        {line.content}
                    </div>
                )}
            </div>
        ))}

        {/* Active Input Line */}
        <div className="flex items-center mt-2">
            <div className="flex items-center font-bold mr-2 shrink-0 select-none">
                 <span className="text-emerald-400 hidden sm:inline">guest</span>
                 <span className="text-gray-400 hidden sm:inline">@</span>
                 <span className="text-purple-400 hidden sm:inline">portfolio</span>
                 <span className="text-blue-400 ml-0 sm:ml-2">~</span>
            </div>
            <span className="text-emerald-400 font-bold mr-2 shrink-0 select-none">➜</span>
            <div className="relative flex-1">
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-transparent outline-none border-none text-gray-100 font-medium caret-emerald-400"
                    autoFocus
                    spellCheck={false}
                    autoComplete="off"
                />
            </div>
        </div>
        <div ref={bottomRef} className="pb-4" />
      </div>
    </div>
  );
};

export default TerminalApp;