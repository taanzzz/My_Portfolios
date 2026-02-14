import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { FlaskConical, Atom, Binary, Move, Maximize, X, Play, RefreshCcw, MousePointer2, ArrowDown, BarChart3, Layers, Circle, Wind, Grid, Hexagon } from 'lucide-react';

// --- Types ---
type ExperimentType = 'PHYSICS' | 'ALGO' | 'UI/UX' | 'SHADER';

interface Experiment {
  id: string;
  title: string;
  description: string;
  type: ExperimentType;
  component: React.FC;
  params: string[]; // List of technical parameters used
}

// --- Experiment 1: Kinetic Grid (Physics/Canvas) ---
const KineticGrid: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [mouse, setMouse] = useState({ x: -1000, y: -1000 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;
        const gap = 30;
        let cols = 0;
        let rows = 0;

        const resize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
                cols = Math.ceil(canvas.width / gap);
                rows = Math.ceil(canvas.height / gap);
            }
        };
        resize();
        window.addEventListener('resize', resize);

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const x = i * gap + gap/2;
                    const y = j * gap + gap/2;
                    
                    const dx = mouse.x - x;
                    const dy = mouse.y - y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    // Interaction Radius
                    const maxDist = 200;
                    const angle = Math.atan2(dy, dx);
                    
                    // Calculate displacement based on distance
                    let size = 2;
                    let color = 'rgba(0,0,0,0.2)';
                    
                    if (dist < maxDist) {
                        const force = (maxDist - dist) / maxDist;
                        const length = force * 15; // Max displacement
                        
                        ctx.save();
                        ctx.translate(x, y);
                        ctx.rotate(angle);
                        
                        // Draw Arrow
                        ctx.beginPath();
                        ctx.moveTo(-size, -size);
                        ctx.lineTo(length, 0);
                        ctx.lineTo(-size, size);
                        ctx.strokeStyle = `rgba(0,0,0,${force})`;
                        ctx.lineWidth = 1 + force * 2;
                        ctx.stroke();
                        
                        ctx.restore();
                    } else {
                        // Static Dot
                        ctx.beginPath();
                        ctx.arc(x, y, size, 0, Math.PI * 2);
                        ctx.fillStyle = color;
                        ctx.fill();
                    }
                }
            }
            animationId = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationId);
        };
    }, [mouse]);

    return (
        <div 
            className="w-full h-full bg-[#F3F4F6] relative overflow-hidden cursor-crosshair group"
            onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            }}
            onMouseLeave={() => setMouse({ x: -1000, y: -1000 })}
        >
            <canvas ref={canvasRef} className="block" />
            <div className="absolute bottom-4 left-4 bg-white/80 p-2 text-[10px] font-mono pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                X: {mouse.x.toFixed(0)} Y: {mouse.y.toFixed(0)}
            </div>
        </div>
    );
};

// --- Experiment 2: Recursive Tree (Algorithms) ---
const FractalTree: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [depth, setDepth] = useState(9);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // High DPI scaling
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const drawTree = (startX: number, startY: number, len: number, angle: number, branchWidth: number, depthLeft: number) => {
            ctx.beginPath();
            ctx.save();
            ctx.strokeStyle = depthLeft < 3 ? '#10B981' : '#000'; // Leaves are green
            ctx.lineWidth = branchWidth;
            ctx.translate(startX, startY);
            ctx.rotate(angle * Math.PI / 180);
            ctx.moveTo(0, 0);
            ctx.lineTo(0, -len);
            ctx.stroke();

            if (depthLeft > 0) {
                // Randomness for organic feel
                const randomAngle = Math.random() * 10; 
                drawTree(0, -len, len * 0.75, angle - 15 + randomAngle, branchWidth * 0.7, depthLeft - 1);
                drawTree(0, -len, len * 0.75, -angle - 15 + randomAngle, branchWidth * 0.7, depthLeft - 1);
            }
            ctx.restore();
        };

        const render = () => {
            ctx.clearRect(0, 0, rect.width, rect.height);
            // Dynamic angle based on prop or animation could go here
            drawTree(rect.width / 2, rect.height, rect.height / 4, 0, 8, depth);
        };

        render();
    }, [depth]);

    return (
        <div className="w-full h-full bg-white relative flex flex-col">
            <div className="absolute top-2 right-2 flex flex-col gap-2 z-10 bg-white/90 p-2 border border-black shadow-sm">
                <label className="text-[10px] font-bold uppercase">Recursion Depth: {depth}</label>
                <input 
                    type="range" min="4" max="11" step="1" 
                    value={depth} onChange={(e) => setDepth(Number(e.target.value))}
                    className="w-32 accent-black" 
                />
            </div>
            <canvas ref={canvasRef} className="w-full h-full" style={{ width: '100%', height: '100%' }} />
        </div>
    );
};

// --- Experiment 3: Elastic UI (Framer Motion Physics) ---
const ElasticUI: React.FC = () => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    
    // Spring physics configuration
    const springConfig = { damping: 15, stiffness: 150, mass: 0.5 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Calculate distance from center
        const dx = mouseX - centerX;
        const dy = mouseY - centerY;
        
        // Magnetic effect area
        if (Math.abs(dx) < 150 && Math.abs(dy) < 150) {
            x.set(dx * 0.5); // Move 50% of mouse distance
            y.set(dy * 0.5);
        } else {
            x.set(0);
            y.set(0);
        }
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <div 
            className="w-full h-full bg-[#E0E7FF] flex items-center justify-center relative overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-10 pointer-events-none">
                 {Array.from({length: 36}).map((_, i) => (
                     <div key={i} className="border border-black/20" />
                 ))}
            </div>

            <motion.div 
                style={{ x: springX, y: springY }}
                className="relative z-10"
            >
                <button className="bg-black text-white px-8 py-6 text-xl font-black uppercase tracking-wider border-4 border-transparent hover:border-[#FDE047] hover:bg-gray-900 transition-colors shadow-[8px_8px_0_0_#A78BFA]">
                    Magnetic
                </button>
            </motion.div>
            
            <div className="absolute bottom-4 text-center text-[10px] font-mono uppercase text-gray-500">
                Physics: Damping(15) Stiffness(150) Mass(0.5)
            </div>
        </div>
    );
};

// --- Experiment 4: Gravity Physics ---
const GravityPhysics: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const balls = useRef<any[]>([]);
    const [gravity, setGravity] = useState(0.5);
    const [friction, setFriction] = useState(0.8);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Init balls
        if(balls.current.length === 0) {
            for(let i=0; i<10; i++) {
                balls.current.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height/2,
                    vx: (Math.random() - 0.5) * 10,
                    vy: (Math.random() - 0.5) * 10,
                    radius: 10 + Math.random() * 20,
                    color: `hsl(${Math.random() * 360}, 70%, 50%)`
                });
            }
        }

        let animId: number;
        const update = () => {
            const width = canvas.parentElement?.clientWidth || 300;
            const height = canvas.parentElement?.clientHeight || 300;
            canvas.width = width;
            canvas.height = height;

            ctx.clearRect(0, 0, width, height);

            balls.current.forEach(ball => {
                // Physics
                ball.vy += gravity;
                ball.x += ball.vx;
                ball.y += ball.vy;

                // Floor Bounce
                if (ball.y + ball.radius > height) {
                    ball.y = height - ball.radius;
                    ball.vy *= -friction;
                }
                // Ceiling Bounce
                if (ball.y - ball.radius < 0) {
                    ball.y = ball.radius;
                    ball.vy *= -friction;
                }
                // Wall Bounce
                if (ball.x + ball.radius > width) {
                    ball.x = width - ball.radius;
                    ball.vx *= -friction;
                }
                if (ball.x - ball.radius < 0) {
                    ball.x = ball.radius;
                    ball.vx *= -friction;
                }

                // Draw
                ctx.beginPath();
                ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
                ctx.fillStyle = ball.color;
                ctx.fill();
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 2;
                ctx.stroke();
            });

            animId = requestAnimationFrame(update);
        };
        update();

        return () => cancelAnimationFrame(animId);
    }, [gravity, friction]);

    const addBall = () => {
        balls.current.push({
            x: Math.random() * (canvasRef.current?.width || 300),
            y: 50,
            vx: (Math.random() - 0.5) * 15,
            vy: Math.random() * 5,
            radius: 15 + Math.random() * 15,
            color: '#FDE047'
        });
    };

    return (
        <div className="w-full h-full bg-white relative">
            <canvas ref={canvasRef} className="block w-full h-full" onClick={addBall} />
            <div className="absolute top-4 left-4 bg-white/90 p-3 border-2 border-black shadow-[4px_4px_0_0_#000] flex flex-col gap-2 pointer-events-auto">
                <h4 className="text-xs font-black uppercase">Physics Settings</h4>
                <div className="flex gap-2 text-[10px] font-bold items-center">
                    <span>Gravity: {gravity.toFixed(1)}</span>
                    <input type="range" min="0" max="2" step="0.1" value={gravity} onChange={e => setGravity(parseFloat(e.target.value))} className="w-20 accent-black" />
                </div>
                <div className="flex gap-2 text-[10px] font-bold items-center">
                    <span>Bounce: {friction.toFixed(1)}</span>
                    <input type="range" min="0.1" max="1.2" step="0.1" value={friction} onChange={e => setFriction(parseFloat(e.target.value))} className="w-20 accent-black" />
                </div>
                <div className="text-[10px] text-gray-500 mt-1">Tap canvas to spawn</div>
            </div>
        </div>
    );
};

// --- Experiment 5: Sorting Visualization ---
const SortingVis: React.FC = () => {
    const [array, setArray] = useState<number[]>([]);
    const [sorting, setSorting] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const resetArray = () => {
        const arr = [];
        for(let i=0; i<30; i++) arr.push(Math.floor(Math.random() * 100) + 10);
        setArray(arr);
        setSorting(false);
        setActiveIndex(null);
    };

    useEffect(() => { resetArray(); }, []);

    const bubbleSort = async () => {
        setSorting(true);
        const arr = [...array];
        for(let i=0; i<arr.length; i++) {
            for(let j=0; j<arr.length-i-1; j++) {
                setActiveIndex(j);
                if(arr[j] > arr[j+1]) {
                    let temp = arr[j];
                    arr[j] = arr[j+1];
                    arr[j+1] = temp;
                    setArray([...arr]);
                    await new Promise(r => setTimeout(r, 30));
                }
            }
        }
        setActiveIndex(null);
        setSorting(false);
    };

    return (
        <div className="w-full h-full bg-[#111] flex flex-col p-4 md:p-8">
            <div className="flex justify-between items-end mb-4 border-b border-white/20 pb-4">
                <h3 className="text-white font-mono text-xl md:text-2xl font-bold flex items-center gap-2"><Binary size={20} /> BUBBLE_SORT.EXE</h3>
                <div className="flex gap-2">
                    <button onClick={resetArray} disabled={sorting} className="px-3 py-1 border border-white text-white text-xs hover:bg-white hover:text-black transition-colors disabled:opacity-50">RESET</button>
                    <button onClick={bubbleSort} disabled={sorting} className="px-3 py-1 bg-[#10B981] text-black font-bold text-xs hover:bg-[#34D399] transition-colors disabled:opacity-50">RUN</button>
                </div>
            </div>
            <div className="flex-1 flex items-end justify-center gap-1">
                {array.map((val, idx) => (
                    <div 
                        key={idx} 
                        className={`w-full max-w-[20px] transition-colors duration-100 ${idx === activeIndex || idx === activeIndex! + 1 ? 'bg-[#FDE047]' : 'bg-white'}`}
                        style={{ height: `${val}%` }}
                    />
                ))}
            </div>
        </div>
    );
};

// --- Experiment 6: 3D Tilt Card ---
const TiltCard: React.FC = () => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [15, -15]);
    const rotateY = useTransform(x, [-100, 100], [-15, 15]);

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct * 200);
        y.set(yPct * 200);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <div 
            className="w-full h-full bg-grid-slate-100 flex items-center justify-center perspective-1000 bg-[#E5E7EB]"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div
                style={{
                    rotateX: rotateX,
                    rotateY: rotateY,
                    transformStyle: "preserve-3d",
                }}
                className="relative w-64 h-80 bg-black rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 border-white flex flex-col items-center justify-center p-6 text-center"
            >
                <div 
                    style={{ transform: "translateZ(50px)" }} 
                    className="absolute inset-4 border-2 border-white/20 rounded-lg pointer-events-none" 
                />
                
                <motion.div style={{ transform: "translateZ(30px)" }}>
                    <Layers size={48} className="text-[#FDE047] mx-auto mb-4" strokeWidth={1.5} />
                    <h2 className="text-3xl font-black text-white uppercase tracking-tight">Holographic</h2>
                    <p className="text-white/60 text-sm mt-2 font-medium">
                        Parallax Depth Effect using Framer Motion Transforms
                    </p>
                </motion.div>

                <motion.div 
                    style={{ transform: "translateZ(20px)" }}
                    className="mt-6"
                >
                    <span className="bg-white text-black px-4 py-1 text-xs font-bold uppercase rounded-full">Hover Me</span>
                </motion.div>
            </motion.div>
        </div>
    );
};

// --- Experiment 7: Fluid Field (Physics) ---
const FluidField: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particles = useRef<any[]>([]);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Resize
        const resize = () => {
            const parent = canvas.parentElement;
            if(parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
            }
        };
        resize();
        window.addEventListener('resize', resize);

        // Init Particles
        for(let i=0; i<100; i++) {
            particles.current.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: 0, vy: 0,
                size: Math.random() * 3 + 1,
                color: `rgba(0,0,0,${Math.random() * 0.5 + 0.1})`
            });
        }

        let animId: number;
        let mouseX = -1000, mouseY = -1000;

        const update = () => {
            ctx.clearRect(0,0,canvas.width, canvas.height);
            
            particles.current.forEach(p => {
                // Flow field logic (simple noise approx)
                const angle = (Math.cos(p.x * 0.01) + Math.sin(p.y * 0.01)) * Math.PI * 2;
                p.vx += Math.cos(angle) * 0.2;
                p.vy += Math.sin(angle) * 0.2;

                // Mouse influence
                const dx = mouseX - p.x;
                const dy = mouseY - p.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if(dist < 150) {
                    p.vx -= dx * 0.01;
                    p.vy -= dy * 0.01;
                }

                // Friction & Movement
                p.vx *= 0.95;
                p.vy *= 0.95;
                p.x += p.vx;
                p.y += p.vy;

                // Wrap
                if(p.x < 0) p.x = canvas.width;
                if(p.x > canvas.width) p.x = 0;
                if(p.y < 0) p.y = canvas.height;
                if(p.y > canvas.height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
                ctx.fillStyle = p.color;
                ctx.fill();
            });

            animId = requestAnimationFrame(update);
        };
        update();

        const handleMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        };
        canvas.addEventListener('mousemove', handleMove);

        return () => {
            window.removeEventListener('resize', resize);
            canvas.removeEventListener('mousemove', handleMove);
            cancelAnimationFrame(animId);
        };
    }, []);

    return <canvas ref={canvasRef} className="w-full h-full bg-[#E0F2FE]" />;
};

// --- Experiment 8: Maze Generator (Algo) ---
const MazeGen: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const cellSize = 20;
        let cols = 0, rows = 0;
        let grid: any[] = [];
        let current: any;
        let stack: any[] = [];

        const index = (i: number, j: number) => {
            if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) return -1;
            return j + i * rows;
        };

        class Cell {
            i: number; j: number; visited: boolean; walls: boolean[];
            constructor(i: number, j: number) {
                this.i = i; this.j = j;
                this.visited = false;
                this.walls = [true, true, true, true]; // T, R, B, L
            }
            show() {
                const x = this.i * cellSize;
                const y = this.j * cellSize;
                ctx!.strokeStyle = "#000";
                ctx!.lineWidth = 2;
                if (this.walls[0]) { ctx!.beginPath(); ctx!.moveTo(x, y); ctx!.lineTo(x + cellSize, y); ctx!.stroke(); }
                if (this.walls[1]) { ctx!.beginPath(); ctx!.moveTo(x + cellSize, y); ctx!.lineTo(x + cellSize, y + cellSize); ctx!.stroke(); }
                if (this.walls[2]) { ctx!.beginPath(); ctx!.moveTo(x + cellSize, y + cellSize); ctx!.lineTo(x, y + cellSize); ctx!.stroke(); }
                if (this.walls[3]) { ctx!.beginPath(); ctx!.moveTo(x, y + cellSize); ctx!.lineTo(x, y); ctx!.stroke(); }
                if (this.visited) {
                    ctx!.fillStyle = "#FDE047";
                    ctx!.fillRect(x, y, cellSize, cellSize);
                }
            }
            checkNeighbors() {
                const neighbors = [];
                const top = grid[index(this.i, this.j - 1)];
                const right = grid[index(this.i + 1, this.j)];
                const bottom = grid[index(this.i, this.j + 1)];
                const left = grid[index(this.i - 1, this.j)];

                if (top && !top.visited) neighbors.push(top);
                if (right && !right.visited) neighbors.push(right);
                if (bottom && !bottom.visited) neighbors.push(bottom);
                if (left && !left.visited) neighbors.push(left);

                if (neighbors.length > 0) {
                    const r = Math.floor(Math.random() * neighbors.length);
                    return neighbors[r];
                } else return undefined;
            }
        }

        const removeWalls = (a: Cell, b: Cell) => {
            const x = a.i - b.i;
            if (x === 1) { a.walls[3] = false; b.walls[1] = false; }
            else if (x === -1) { a.walls[1] = false; b.walls[3] = false; }
            const y = a.j - b.j;
            if (y === 1) { a.walls[0] = false; b.walls[2] = false; }
            else if (y === -1) { a.walls[2] = false; b.walls[0] = false; }
        };

        const setup = () => {
            const parent = canvas.parentElement;
            if(parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
                cols = Math.floor(canvas.width / cellSize);
                rows = Math.floor(canvas.height / cellSize);
                grid = [];
                stack = [];
                for(let i=0; i<cols; i++) {
                    for(let j=0; j<rows; j++) {
                        grid.push(new Cell(i, j));
                    }
                }
                current = grid[0];
                draw();
            }
        };

        const draw = () => {
            ctx.fillStyle = "#FFF";
            ctx.fillRect(0,0,canvas.width, canvas.height);
            for(let i=0; i<grid.length; i++) grid[i].show();
            
            current.visited = true;
            // Highlight current
            ctx.fillStyle = "#FF0000";
            ctx.fillRect(current.i * cellSize, current.j * cellSize, cellSize, cellSize);

            const next = current.checkNeighbors();
            if(next) {
                next.visited = true;
                stack.push(current);
                removeWalls(current, next);
                current = next;
            } else if(stack.length > 0) {
                current = stack.pop();
            }

            if(stack.length > 0 || !current.visited) requestAnimationFrame(draw);
        };

        setup();
        window.addEventListener('resize', setup);
        return () => window.removeEventListener('resize', setup);
    }, []);

    return <canvas ref={canvasRef} className="w-full h-full bg-white" />;
};

// --- Experiment 9: Morphing Blob (UI/UX) ---
const MorphBlob: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let time = 0;
        let points = 8;
        let radius = 100;

        const resize = () => {
            canvas.width = canvas.parentElement?.clientWidth || 300;
            canvas.height = canvas.parentElement?.clientHeight || 300;
        };
        resize();
        window.addEventListener('resize', resize);

        const draw = () => {
            time += 0.02;
            ctx.clearRect(0,0,canvas.width, canvas.height);
            const cx = canvas.width/2;
            const cy = canvas.height/2;

            ctx.beginPath();
            for(let i=0; i<=points; i++) {
                const angle = (i / points) * Math.PI * 2;
                // Noise simulation using sin/cos layers
                const offset = Math.sin(angle * 3 + time) * 20 + Math.cos(angle * 5 - time) * 10;
                const r = radius + offset;
                const x = cx + Math.cos(angle) * r;
                const y = cy + Math.sin(angle) * r;
                
                if(i===0) ctx.moveTo(x,y);
                else ctx.lineTo(x,y);
            }
            ctx.closePath();
            
            // Gradient fill
            const grd = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            grd.addColorStop(0, "#A78BFA");
            grd.addColorStop(1, "#F472B6");
            ctx.fillStyle = grd;
            ctx.fill();
            
            ctx.strokeStyle = "black";
            ctx.lineWidth = 4;
            ctx.stroke();

            requestAnimationFrame(draw);
        };
        draw();

        return () => window.removeEventListener('resize', resize);
    }, []);

    return <canvas ref={canvasRef} className="w-full h-full bg-[#1e1e1e]" />;
};

const EXPERIMENTS: Experiment[] = [
    {
        id: 'kinetic',
        title: 'Kinetic Grid Field',
        description: 'Interactive particle system utilizing spatial hashing logic to render proximity-based vector fields.',
        type: 'PHYSICS',
        component: KineticGrid,
        params: ['Canvas API', 'Euclidean Distance', 'Vector Rotation']
    },
    {
        id: 'gravity',
        title: 'Gravity & Collision',
        description: 'Newtorian physics engine simulation with momentum conservation, friction, and boundary collision detection.',
        type: 'PHYSICS',
        component: GravityPhysics,
        params: ['Velocity', 'Acceleration', 'Collision Detection']
    },
    {
        id: 'fluid',
        title: 'Fluid Vortex Field',
        description: 'Simulating fluid dynamics with particle flow vectors influenced by mouse interaction and noise.',
        type: 'PHYSICS',
        component: FluidField,
        params: ['Flow Vectors', 'Particle Systems', 'Noise Fields']
    },
    {
        id: 'fractal',
        title: 'Recursive Structures',
        description: 'Visualizing algorithmic recursion through fractal tree generation. Demonstrates branching logic.',
        type: 'ALGO',
        component: FractalTree,
        params: ['Recursion', 'Trigonometry', 'HTML5 Canvas']
    },
    {
        id: 'sorting',
        title: 'Sorting Visualizer',
        description: 'Real-time visualization of the Bubble Sort algorithm, highlighting comparisons and swaps.',
        type: 'ALGO',
        component: SortingVis,
        params: ['Async/Await', 'State Management', 'O(n²) Complexity']
    },
    {
        id: 'maze',
        title: 'Maze Generator',
        description: 'Depth-First Search (Recursive Backtracker) algorithm visualizing graph traversal and stack operations.',
        type: 'ALGO',
        component: MazeGen,
        params: ['DFS Algorithm', 'Stack Data Structure', 'Graph Theory']
    },
    {
        id: 'elastic',
        title: 'Elastic UI Physics',
        description: 'Implementing hook-based spring physics for "magnetic" UI elements that respond to cursor velocity.',
        type: 'UI/UX',
        component: ElasticUI,
        params: ['Framer Motion', 'Spring Dynamics', 'Event Listeners']
    },
    {
        id: 'tilt',
        title: '3D Parallax Card',
        description: 'Mouse-aware 3D transform effect creating illusion of depth using CSS perspective and motion values.',
        type: 'UI/UX',
        component: TiltCard,
        params: ['Transform 3D', 'Motion Values', 'Perspective']
    },
    {
        id: 'morph',
        title: 'Morphing Gradient',
        description: 'Organic shape animation using trigonometric offsets to simulate liquid movement on HTML Canvas.',
        type: 'UI/UX',
        component: MorphBlob,
        params: ['Canvas Path2D', 'Trigonometry', 'Animation Loop']
    }
];

const LabApp: React.FC = () => {
  const [activeExp, setActiveExp] = useState<string | null>(null);
  
  const selectedExperiment = EXPERIMENTS.find(e => e.id === activeExp);

  return (
    <div className="h-full w-full bg-[#FAFAFA] dark:bg-slate-950 flex flex-col font-sans text-black dark:text-white overflow-hidden">
      
      {/* Header */}
      <div className="p-6 md:p-8 bg-white dark:bg-slate-900 border-b-4 border-black dark:border-white shrink-0 flex justify-between items-center">
        <div>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter flex items-center gap-3">
                <FlaskConical size={32} className="stroke-[3]" /> Experimental Lab
            </h1>
            <p className="font-bold text-gray-500 uppercase tracking-widest mt-1 text-xs md:text-sm">
                Sandbox // Prototypes // Benchmarks
            </p>
        </div>
        <div className="hidden md:block">
            <div className="bg-black text-white px-3 py-1 font-mono text-xs uppercase">
                Build: v0.9.ALPHA
            </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* List Sidebar - Mobile Responsive Update: Added h-full to force scroll container height */}
        <div className={`
            w-full md:w-[350px] bg-[#F3F4F6] dark:bg-slate-900 border-r-0 md:border-r-4 border-black dark:border-white overflow-y-auto p-4 space-y-4 shrink-0 pb-24 md:pb-4 h-full
            ${activeExp ? 'hidden md:block' : 'block'}
        `}>
            {EXPERIMENTS.map((exp) => (
                <button
                    key={exp.id}
                    onClick={() => setActiveExp(exp.id)}
                    className={`w-full text-left p-4 border-4 transition-all group relative overflow-hidden
                        ${activeExp === exp.id 
                            ? 'bg-black text-white border-black dark:border-white' 
                            : 'bg-white dark:bg-slate-800 border-black dark:border-white hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000] dark:hover:shadow-[4px_4px_0_0_#fff]'
                        }
                    `}
                >
                    <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 border ${activeExp === exp.id ? 'border-white text-white' : 'border-black text-black dark:text-white dark:border-white'}`}>
                            {exp.type}
                        </span>
                        {exp.id === 'kinetic' && <Move size={16} />}
                        {exp.id === 'gravity' && <ArrowDown size={16} />}
                        {exp.id === 'fluid' && <Wind size={16} />}
                        {exp.id === 'fractal' && <Binary size={16} />}
                        {exp.id === 'sorting' && <BarChart3 size={16} />}
                        {exp.id === 'maze' && <Grid size={16} />}
                        {exp.id === 'elastic' && <MousePointer2 size={16} />}
                        {exp.id === 'tilt' && <Layers size={16} />}
                        {exp.id === 'morph' && <Hexagon size={16} />}
                    </div>
                    <h3 className="text-xl font-black uppercase leading-none mb-1">{exp.title}</h3>
                    <p className={`text-xs font-medium line-clamp-2 ${activeExp === exp.id ? 'opacity-80' : 'opacity-60'}`}>
                        {exp.description}
                    </p>
                </button>
            ))}

            <div className="mt-8 p-4 border-2 border-dashed border-gray-400 opacity-60 text-center">
                <Atom className="mx-auto mb-2" size={24} />
                <p className="text-xs font-bold uppercase">More experiments <br/> compiling soon...</p>
            </div>
        </div>

        {/* Experiment Display Area */}
        <div className={`flex-1 bg-gray-100 dark:bg-black relative ${!activeExp ? 'hidden md:block' : 'block'}`}>
            <AnimatePresence mode='wait'>
                {selectedExperiment ? (
                    <motion.div 
                        key={selectedExperiment.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="w-full h-full flex flex-col"
                    >
                        {/* Toolbar */}
                        <div className="h-12 bg-white dark:bg-slate-900 border-b-4 border-black dark:border-white flex items-center justify-between px-4 shrink-0">
                            <span className="font-bold text-xs uppercase tracking-wider md:hidden flex items-center gap-1 cursor-pointer" onClick={() => setActiveExp(null)}>
                                <X size={14} /> Back to List
                            </span>
                            <span className="font-mono text-xs text-gray-500 hidden md:block">
                                EXEC: {selectedExperiment.title}.ts
                            </span>
                            <div className="flex gap-2">
                                <button className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded"><RefreshCcw size={14} /></button>
                                <button className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded"><Maximize size={14} /></button>
                            </div>
                        </div>

                        {/* Interactive Canvas Container */}
                        <div className="flex-1 relative overflow-hidden bg-white">
                             <selectedExperiment.component />
                        </div>

                        {/* Info Footer */}
                        <div className="bg-black text-white p-4 shrink-0">
                            <div className="flex flex-wrap gap-2 mb-2">
                                {selectedExperiment.params.map(p => (
                                    <span key={p} className="text-[10px] font-bold uppercase bg-white/20 px-2 py-1 rounded">
                                        {p}
                                    </span>
                                ))}
                            </div>
                            <p className="text-sm opacity-80 font-mono">
                                {selectedExperiment.description}
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center opacity-30 select-none p-8 text-center">
                        <FlaskConical size={100} strokeWidth={1} />
                        <h2 className="text-2xl font-black uppercase mt-4">Select an Experiment</h2>
                        <p className="text-sm font-bold uppercase mt-2">Explore physics, algorithms & UI patterns</p>
                    </div>
                )}
            </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default LabApp;