import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gamepad2, 
  Brain, 
  Calculator, 
  Zap, 
  Grid, 
  ArrowLeft, 
  Trophy, 
  Ghost, 
  Heart, 
  Star, 
  Sun, 
  Moon, 
  Cloud,
  Check,
  X as XIcon
} from 'lucide-react';

// --- Shared Components ---

const NeoButton = ({ children, onClick, className = "", disabled = false }: any) => (
  <motion.button 
    whileHover={!disabled ? { scale: 1.05, x: -2, y: -2, boxShadow: "6px 6px 0 0 #000" } : {}}
    whileTap={!disabled ? { scale: 0.95, x: 2, y: 2, boxShadow: "0px 0px 0 0 #000" } : {}}
    onClick={onClick}
    disabled={disabled}
    className={`border-4 border-black bg-white px-6 py-3 font-black uppercase hover:bg-[#FDE047] transition-all shadow-[4px_4px_0_0_#000] disabled:opacity-50 disabled:cursor-not-allowed select-none ${className}`}
  >
    {children}
  </motion.button>
);

const GameHeader = ({ title, onBack, score, highScore, color = "bg-white" }: { title: string, onBack: () => void, score?: number, highScore?: number, color?: string }) => (
  <div className={`flex items-center justify-between mb-4 p-4 ${color} border-b-4 border-black shrink-0 shadow-sm text-black relative z-10`}>
    <div className="flex items-center gap-4">
      <motion.button 
        whileHover={{ scale: 1.1, rotate: -10 }}
        whileTap={{ scale: 0.9 }}
        onClick={onBack}
        className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0_0_#000]"
      >
        <ArrowLeft size={24} strokeWidth={3} />
      </motion.button>
      <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">{title}</h2>
    </div>
    <div className="flex items-center gap-6 font-mono">
      {score !== undefined && (
        <div className="flex flex-col items-end">
          <span className="text-xs font-bold uppercase bg-black text-white px-1">Score</span>
          <motion.span 
            key={score}
            initial={{ scale: 1.5, color: '#10B981' }}
            animate={{ scale: 1, color: '#000000' }}
            className="text-2xl font-black"
          >
            {score.toString().padStart(6, '0')}
          </motion.span>
        </div>
      )}
      {highScore !== undefined && (
        <div className="flex flex-col items-end hidden sm:flex">
          <span className="text-xs font-bold uppercase bg-[#FDE047] text-black border border-black px-1">Best</span>
          <span className="text-2xl font-black">{highScore.toString().padStart(6, '0')}</span>
        </div>
      )}
    </div>
  </div>
);

const GameOver = ({ score, onRestart, onExit, title = "Game Over" }: { score: number | string, onRestart: () => void, onExit: () => void, title?: string }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
  >
    <motion.div 
      initial={{ scale: 0.8, y: 50, rotate: -5 }}
      animate={{ scale: 1, y: 0, rotate: 0 }}
      className="flex flex-col items-center gap-6 p-8 bg-[#F87171] border-4 border-black shadow-[16px_16px_0_0_#000] max-w-sm w-full text-black relative"
    >
      <motion.div
        animate={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Trophy size={80} className="text-[#FDE047] fill-white stroke-black stroke-[3]" />
      </motion.div>
      
      <div className="text-center">
        <h3 className="text-4xl font-black uppercase tracking-tight mb-2">{title}</h3>
        <div className="text-2xl font-bold bg-white border-2 border-black inline-block px-6 py-2 shadow-[4px_4px_0_0_#000] transform -rotate-2">
            Result: {score}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 w-full mt-4">
        <NeoButton onClick={onExit} className="flex-1">Exit</NeoButton>
        <NeoButton onClick={onRestart} className="flex-1 bg-black text-white hover:bg-gray-800">Retry</NeoButton>
      </div>
    </motion.div>
  </motion.div>
);

// --- 1. Memory Game ---
const MEMORY_ICONS = [Ghost, Heart, Star, Sun, Moon, Cloud, Zap, Brain];

const MemoryGame = ({ onBack }: { onBack: () => void }) => {
  const [cards, setCards] = useState<any[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [solved, setSolved] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  
  const initGame = useCallback(() => {
      const deck = [...MEMORY_ICONS, ...MEMORY_ICONS]
        .sort(() => Math.random() - 0.5)
        .map((Icon, id) => ({ id, Icon }));
      setCards(deck);
      setFlipped([]);
      setSolved([]);
      setMoves(0);
      setIsGameOver(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleCardClick = (id: number) => {
    if (flipped.length === 2 || flipped.includes(id) || solved.includes(id)) return;
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      if (cards[first].Icon === cards[second].Icon) {
        setSolved(prev => {
            const newSolved = [...prev, first, second];
            if (newSolved.length === cards.length) setIsGameOver(true);
            return newSolved;
        });
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  return (
    <div className="relative h-full flex flex-col bg-[#E0E7FF] dark:bg-slate-900">
      <GameHeader title="Memory" onBack={onBack} score={moves} color="bg-[#C7D2FE]" />
      <div className="flex-1 flex items-center justify-center p-4 overflow-y-auto">
        <div className="grid grid-cols-4 gap-3 w-full max-w-md aspect-square content-center">
          <AnimatePresence>
            {cards.map((card, index) => {
                const isFlipped = flipped.includes(index);
                const isSolved = solved.includes(index);
                const isRevealed = isFlipped || isSolved;

                return (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="w-full h-full perspective-1000"
                >
                    <motion.button 
                        className={`w-full h-full relative preserve-3d transition-shadow duration-300 rounded-xl
                            ${!isRevealed ? 'hover:shadow-[0_8px_0_0_#A78BFA] hover:-translate-y-1' : ''}
                        `}
                        onClick={() => handleCardClick(index)}
                        disabled={isSolved || isGameOver}
                        animate={{ rotateY: isRevealed ? 180 : 0 }}
                        transition={{ duration: 0.4 }}
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        {/* Front (Hidden state) */}
                        <div className="absolute inset-0 backface-hidden bg-black border-4 border-black rounded-xl flex items-center justify-center shadow-[4px_4px_0_0_rgba(0,0,0,0.2)]">
                            <div className="text-[#FDE047] font-black text-2xl">?</div>
                        </div>

                        {/* Back (Revealed state) */}
                        <div className={`absolute inset-0 backface-hidden bg-white border-4 border-black rounded-xl flex items-center justify-center shadow-[4px_4px_0_0_rgba(0,0,0,0.2)] ${isSolved ? 'bg-[#6EE7B7]' : ''}`} style={{ transform: 'rotateY(180deg)' }}>
                            <card.Icon size={32} className={`w-8 h-8 md:w-10 md:h-10 text-black`} strokeWidth={3} />
                            {isSolved && (
                                <motion.div 
                                    initial={{ scale: 0 }} 
                                    animate={{ scale: 1 }} 
                                    className="absolute inset-0 flex items-center justify-center bg-[#6EE7B7]/80"
                                >
                                    <Check className="text-black w-8 h-8" strokeWidth={4} />
                                </motion.div>
                            )}
                        </div>
                    </motion.button>
                </motion.div>
                );
            })}
          </AnimatePresence>
        </div>
      </div>
      {isGameOver && <GameOver score={`${moves} Moves`} onRestart={initGame} onExit={onBack} />}
    </div>
  );
};

// --- 2. Math Game ---
const MathGame = ({ onBack }: { onBack: () => void }) => {
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [isPlaying, setIsPlaying] = useState(false);
    const [problem, setProblem] = useState<{q: string, a: number, options: number[]}>({ q: '', a: 0, options: [] });
    const [gameOver, setGameOver] = useState(false);
    const [lastResult, setLastResult] = useState<'correct' | 'wrong' | null>(null);

    const generateProblem = useCallback(() => {
        const ops = ['+', '-', '*'];
        const op = ops[Math.floor(Math.random() * ops.length)];
        let a = Math.floor(Math.random() * 20) + 1;
        let b = Math.floor(Math.random() * 20) + 1;
        
        if (op === '*') { a = Math.floor(Math.random() * 10) + 1; b = Math.floor(Math.random() * 9) + 1; }
        if (op === '-') { if (a < b) [a, b] = [b, a]; }

        const ans = op === '+' ? a + b : op === '-' ? a - b : a * b;
        
        const opts = new Set<number>([ans]);
        while(opts.size < 4) {
            const offset = Math.floor(Math.random() * 10) - 5;
            const val = ans + offset;
            if (val >= 0 && val !== ans) opts.add(val);
            else opts.add(ans + Math.floor(Math.random() * 10) + 1);
        }

        setProblem({
            q: `${a} ${op} ${b}`,
            a: ans,
            options: Array.from(opts).sort(() => Math.random() - 0.5)
        });
    }, []);

    const startGame = () => {
        setScore(0);
        setTimeLeft(30);
        setIsPlaying(true);
        setGameOver(false);
        setLastResult(null);
        generateProblem();
    };

    useEffect(() => {
        if (!isPlaying) return;
        if (timeLeft <= 0) {
            setIsPlaying(false);
            setGameOver(true);
            return;
        }
        const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
        return () => clearInterval(timer);
    }, [isPlaying, timeLeft]);

    const handleAnswer = (val: number) => {
        if (val === problem.a) {
            setScore(s => s + 10);
            setLastResult('correct');
            setTimeout(() => setLastResult(null), 500);
            generateProblem();
        } else {
            setScore(s => Math.max(0, s - 5));
            setLastResult('wrong');
            setTimeout(() => setLastResult(null), 500);
        }
    };

    return (
        <div className="relative h-full flex flex-col bg-[#DCFCE7] dark:bg-slate-900 text-black">
            <GameHeader title="Speed Math" onBack={onBack} score={score} color="bg-[#86EFAC]" />
            
            <div className="flex-1 flex flex-col items-center justify-center p-6 gap-8 text-black dark:text-white relative overflow-hidden">
                {/* Result Flash Overlay */}
                <AnimatePresence>
                    {lastResult && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1.5 }}
                            exit={{ opacity: 0 }}
                            className={`absolute inset-0 z-0 flex items-center justify-center pointer-events-none`}
                        >
                            {lastResult === 'correct' ? (
                                <Check size={200} className="text-green-500/20" />
                            ) : (
                                <XIcon size={200} className="text-red-500/20" />
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {!isPlaying && !gameOver ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="text-center space-y-6 z-10"
                    >
                        <motion.div 
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 4, repeatDelay: 1 }}
                        >
                            <Calculator size={80} className="mx-auto text-black dark:text-white stroke-[1.5]" />
                        </motion.div>
                        <h3 className="text-3xl font-black uppercase">Ready?</h3>
                        <p className="font-bold">Solve as many equations as you can in 30 seconds.</p>
                        <NeoButton onClick={startGame} className="w-full text-xl bg-[#FDE047] text-black">Start Game</NeoButton>
                    </motion.div>
                ) : (
                    <>
                        {/* Timer Bar */}
                        <div className="w-full max-w-md h-4 bg-white border-2 border-black rounded-full overflow-hidden">
                            <motion.div 
                                className="h-full bg-red-500"
                                initial={{ width: "100%" }}
                                animate={{ width: `${(timeLeft / 30) * 100}%` }}
                                transition={{ ease: "linear", duration: 1 }}
                            />
                        </div>
                        
                        <AnimatePresence mode='wait'>
                            <motion.div 
                                key={problem.q}
                                initial={{ x: 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -50, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                className="bg-white border-4 border-black p-12 shadow-[8px_8px_0_0_#000] w-full max-w-md text-center z-10 relative"
                            >
                                <span className="text-6xl font-black tracking-widest text-black">{problem.q}</span>
                            </motion.div>
                        </AnimatePresence>

                        <div className="grid grid-cols-2 gap-4 w-full max-w-md z-10">
                            {problem.options.map((opt, i) => (
                                <motion.button
                                    key={`${problem.q}-${i}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ scale: 1.05, backgroundColor: "#6EE7B7" }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleAnswer(opt)}
                                    className="bg-white border-4 border-black py-6 text-3xl font-black shadow-[4px_4px_0_0_#000] active:shadow-none transition-colors text-black"
                                >
                                    {opt}
                                </motion.button>
                            ))}
                        </div>
                    </>
                )}
            </div>
            {gameOver && <GameOver score={score} onRestart={startGame} onExit={onBack} title="Time's Up!" />}
        </div>
    );
};

// --- 3. Reaction Game ---
const ReactionGame = ({ onBack }: { onBack: () => void }) => {
    const [state, setState] = useState<'idle' | 'waiting' | 'ready' | 'result'>('idle');
    const [message, setMessage] = useState("Click to Start");
    const [startTime, setStartTime] = useState(0);
    const [reactionTime, setReactionTime] = useState<number | null>(null);
    const timeoutRef = useRef<number | null>(null);

    const startWait = () => {
        setState('waiting');
        setMessage("Wait for Green...");
        const randomDelay = 2000 + Math.random() * 3000;
        timeoutRef.current = window.setTimeout(() => {
            setState('ready');
            setMessage("CLICK NOW!");
            setStartTime(Date.now());
        }, randomDelay);
    };

    const handleClick = () => {
        if (state === 'idle') {
            startWait();
        } else if (state === 'waiting') {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setState('result');
            setMessage("Too Early!");
            setReactionTime(null);
        } else if (state === 'ready') {
            const time = Date.now() - startTime;
            setReactionTime(time);
            setState('result');
            setMessage(`${time} ms`);
        } else if (state === 'result') {
            startWait();
        }
    };

    useEffect(() => {
        return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }
    }, []);

    const getBgColor = () => {
        switch(state) {
            case 'waiting': return '#FCA5A5'; // Reddish wait
            case 'ready': return '#6EE7B7'; // Green Go
            case 'result': return '#FFFFFF';
            default: return '#E5E7EB';
        }
    };

    return (
        <div className="relative h-full flex flex-col bg-[#F3F4F6] dark:bg-slate-900">
            <GameHeader title="Reflex" onBack={onBack} color="bg-white" />
            
            <div className="flex-1 p-6 flex flex-col">
                <motion.div 
                    animate={{ backgroundColor: getBgColor() }}
                    onClick={handleClick}
                    className={`flex-1 w-full border-4 border-black dark:border-white shadow-[12px_12px_0_0_#000] dark:shadow-[12px_12px_0_0_#fff] flex flex-col items-center justify-center cursor-pointer select-none relative overflow-hidden`}
                    whileTap={{ scale: 0.98 }}
                >
                    {state === 'idle' && (
                        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                            <Zap size={80} className="mb-4 text-black dark:text-black" />
                        </motion.div>
                    )}
                    
                    <motion.h1 
                        key={message}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-black uppercase text-center pointer-events-none text-black z-10"
                    >
                        {message}
                    </motion.h1>

                    {state === 'result' && (
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-4 font-bold text-xl uppercase animate-pulse text-black z-10"
                        >
                            Click to try again
                        </motion.p>
                    )}
                    
                    {/* Heartbeat for waiting */}
                    {state === 'waiting' && (
                        <motion.div
                            className="absolute inset-0 bg-red-500/10"
                            animate={{ opacity: [0.2, 0.5, 0.2] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                        />
                    )}

                    {/* Ripple for ready */}
                    {state === 'ready' && (
                        <motion.div
                            className="absolute inset-0 bg-green-400"
                            initial={{ scale: 0, borderRadius: "100%" }}
                            animate={{ scale: 2, borderRadius: "0%" }}
                            transition={{ duration: 0.3 }}
                        />
                    )}
                </motion.div>
            </div>
        </div>
    );
};

// --- 4. Pattern Game (Simon) ---
const PatternGame = ({ onBack }: { onBack: () => void }) => {
    const [sequence, setSequence] = useState<number[]>([]);
    const [userStep, setUserStep] = useState(0);
    const [isPlayingSequence, setIsPlayingSequence] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [activeBtn, setActiveBtn] = useState<number | null>(null);
    const [gameActive, setGameActive] = useState(false);

    const colors = [
        { id: 0, base: 'bg-red-500', active: 'bg-red-300', ring: 'ring-red-300' },
        { id: 1, base: 'bg-blue-500', active: 'bg-blue-300', ring: 'ring-blue-300' },
        { id: 2, base: 'bg-green-500', active: 'bg-green-300', ring: 'ring-green-300' },
        { id: 3, base: 'bg-yellow-400', active: 'bg-yellow-200', ring: 'ring-yellow-200' },
    ];

    const nextRound = useCallback(() => {
        const nextColor = Math.floor(Math.random() * 4);
        setSequence(prev => [...prev, nextColor]);
        setUserStep(0);
        setIsPlayingSequence(true);
    }, []);

    const startGame = () => {
        setSequence([]);
        setScore(0);
        setGameOver(false);
        setGameActive(true);
        setTimeout(() => nextRound(), 500);
    };

    // Play Sequence Effect
    useEffect(() => {
        if (isPlayingSequence && sequence.length > 0) {
            let i = 0;
            const interval = setInterval(() => {
                if (i >= sequence.length) {
                    clearInterval(interval);
                    setActiveBtn(null);
                    setIsPlayingSequence(false);
                    return;
                }
                setActiveBtn(sequence[i]);
                
                setTimeout(() => {
                    setActiveBtn(null);
                }, 500); 

                i++;
            }, 800); 
            return () => clearInterval(interval);
        }
    }, [isPlayingSequence, sequence]);

    const handleBtnClick = (id: number) => {
        if (!gameActive || isPlayingSequence) return;

        setActiveBtn(id);
        setTimeout(() => setActiveBtn(null), 200);

        if (id === sequence[userStep]) {
            if (userStep === sequence.length - 1) {
                setScore(s => s + 1);
                setIsPlayingSequence(true);
                setTimeout(() => nextRound(), 1000);
            } else {
                setUserStep(s => s + 1);
            }
        } else {
            setGameOver(true);
            setGameActive(false);
        }
    };

    return (
        <div className="relative h-full flex flex-col bg-[#F3F4F6] dark:bg-slate-900">
            <GameHeader title="Pattern" onBack={onBack} score={score} color="bg-white" />

            <div className="flex-1 flex flex-col items-center justify-center p-6 text-black dark:text-white">
                {!gameActive && !gameOver ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }} 
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-6"
                    >
                        <Grid size={80} className="mx-auto text-black dark:text-white stroke-[1.5]" />
                        <h3 className="text-3xl font-black uppercase">Memorize It</h3>
                        <p className="font-bold">Watch the pattern and repeat it.</p>
                        <NeoButton onClick={startGame} className="w-full text-xl bg-[#A78BFA] text-black">Start Game</NeoButton>
                    </motion.div>
                ) : (
                   <div className="grid grid-cols-2 gap-6 w-full max-w-sm aspect-square relative">
                       {/* Center overlay for feedback */}
                       <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                           <div className="bg-black/80 text-white px-4 py-2 rounded-full font-black uppercase text-sm backdrop-blur-sm border border-white/20">
                                {isPlayingSequence ? "Watch" : "Repeat"}
                           </div>
                       </div>

                       {colors.map((btn) => (
                           <motion.button
                                key={btn.id}
                                className={`border-8 border-black dark:border-white rounded-2xl shadow-[8px_8px_0_0_#000] dark:shadow-[8px_8px_0_0_#fff] transition-colors duration-100 ${btn.base}`}
                                animate={{ 
                                    scale: activeBtn === btn.id ? 0.95 : 1,
                                    backgroundColor: activeBtn === btn.id ? '#ffffff' : undefined, // Flash white
                                    boxShadow: activeBtn === btn.id ? "0px 0px 0 0 #000" : undefined
                                }}
                                onClick={() => handleBtnClick(btn.id)}
                           />
                       ))}
                   </div>
                )}
            </div>
            {gameOver && <GameOver score={score} onRestart={startGame} onExit={onBack} />}
        </div>
    );
};

// --- Main App Component ---

const GamesApp: React.FC = () => {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const GAMES = [
    { id: 'memory', title: 'Memory', desc: 'Find Pairs', icon: Ghost, color: 'bg-[#FCA5A5]' },
    { id: 'math', title: 'Math', desc: 'Solve Fast', icon: Calculator, color: 'bg-[#6EE7B7]' },
    { id: 'reaction', title: 'Reflex', desc: 'Click Fast', icon: Zap, color: 'bg-[#FDE047]' },
    { id: 'pattern', title: 'Simon', desc: 'Memorize', icon: Grid, color: 'bg-[#A78BFA]' },
  ];

  return (
    <div className="h-full w-full bg-[#E5E5E5] dark:bg-slate-950 text-black dark:text-white overflow-hidden font-sans">
      <AnimatePresence mode='wait'>
        {activeGame ? (
            <motion.div 
                key="game-view"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="h-full w-full"
            >
                {activeGame === 'memory' && <MemoryGame onBack={() => setActiveGame(null)} />}
                {activeGame === 'math' && <MathGame onBack={() => setActiveGame(null)} />}
                {activeGame === 'reaction' && <ReactionGame onBack={() => setActiveGame(null)} />}
                {activeGame === 'pattern' && <PatternGame onBack={() => setActiveGame(null)} />}
            </motion.div>
        ) : (
          <motion.div 
            key="menu-view"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="h-full w-full p-6 md:p-12 overflow-y-auto"
          >
             <header className="mb-12">
                <motion.h1 
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-6xl md:text-8xl font-black uppercase mb-4 tracking-tighter"
                >
                    Arcade
                </motion.h1>
                <div className="h-6 w-1/3 bg-black dark:bg-white"></div>
             </header>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 pb-10">
                {GAMES.map((game, i) => (
                    <motion.button
                        key={game.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => setActiveGame(game.id)}
                        whileHover={{ scale: 1.02, x: -4, y: -4, boxShadow: "12px 12px 0 0 #000" }}
                        whileTap={{ scale: 0.98, x: 4, y: 4, boxShadow: "0px 0px 0 0 #000" }}
                        className={`flex flex-col items-start p-8 border-4 border-black dark:border-white shadow-[8px_8px_0_0_#000] dark:shadow-[8px_8px_0_0_#000] transition-all duration-200 group ${game.color} text-black w-full`}
                    >
                        <game.icon size={64} className="mb-6 text-black stroke-[2] group-hover:scale-110 transition-transform" />
                        <h3 className="text-4xl font-black uppercase tracking-tight mb-2">{game.title}</h3>
                        <p className="font-bold uppercase tracking-widest text-sm bg-white border-2 border-black px-2 py-1">{game.desc}</p>
                    </motion.button>
                ))}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GamesApp;