import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Server, Database, Smartphone, Globe, Shield, Zap, Layers, 
  Cpu, Network, Lock, Box, ArrowRight, X, Cloud, HardDrive, 
  Settings, Radio, Activity 
} from 'lucide-react';

// --- Types & Data ---

type NodeType = 'frontend' | 'gateway' | 'service' | 'data' | 'infra';

interface ArchNode {
  id: string;
  label: string;
  type: NodeType;
  icon: React.FC<any>;
  basic: boolean; // Visible in basic mode?
  col: number; // Grid positioning logic
  description: string;
  specs: {
    tech: string[];
    scalability: string;
    security: string;
    performance: string;
  };
}

const NODES: ArchNode[] = [
  {
    id: 'client',
    label: 'Client Application',
    type: 'frontend',
    icon: Smartphone,
    basic: true,
    col: 1,
    description: "The user interface layer. It handles presentation logic, local state management, and user interactions before communicating with the backend.",
    specs: {
      tech: ["React / Next.js", "TypeScript", "Tailwind CSS", "Zustand"],
      scalability: "Served via CDN (Edge Locations). Static assets are cached globally.",
      security: "HTTPS (TLS 1.3), Content Security Policy (CSP), HttpOnly Cookies.",
      performance: "Code Splitting, Lazy Loading, Optimistic UI updates, Service Workers."
    }
  },
  {
    id: 'cdn',
    label: 'CDN / Edge',
    type: 'infra',
    icon: Globe,
    basic: false,
    col: 1,
    description: "Content Delivery Network. Caches static assets close to the user to minimize latency and offload traffic from the origin server.",
    specs: {
      tech: ["Cloudflare", "AWS CloudFront", "Vercel Edge"],
      scalability: "Global distribution network with automatic scaling.",
      security: "DDoS Protection, WAF (Web Application Firewall), Bot Management.",
      performance: "Edge Caching, Image Optimization, Geo-routing."
    }
  },
  {
    id: 'lb',
    label: 'Load Balancer',
    type: 'infra',
    icon: Network,
    basic: false,
    col: 2,
    description: "Distributes incoming network traffic across multiple servers to ensure no single server bears too much load.",
    specs: {
      tech: ["Nginx", "AWS ALB", "Traefik"],
      scalability: "Horizontal scaling support, Health checks for auto-recovery.",
      security: "SSL Termination, Private VPC entry point.",
      performance: "Round-robin / Least-connection algorithms, Compression (Gzip/Brotli)."
    }
  },
  {
    id: 'api',
    label: 'API Gateway',
    type: 'gateway',
    icon: Server,
    basic: true,
    col: 2,
    description: "The entry point for backend services. Aggregates responses, enforces rate limiting, and routes requests to appropriate microservices.",
    specs: {
      tech: ["Node.js / Express", "GraphQL (Apollo)", "NestJS"],
      scalability: "Stateless design allows infinite horizontal scaling (Containerized).",
      security: "JWT Authentication, Rate Limiting (Redis), Input Validation (Zod).",
      performance: "Request Batching, Response Caching, Non-blocking I/O."
    }
  },
  {
    id: 'workers',
    label: 'Async Workers',
    type: 'service',
    icon: Cpu,
    basic: false,
    col: 3,
    description: "Background processing units for heavy tasks (emails, video processing, report generation) to keep the main API responsive.",
    specs: {
      tech: ["BullMQ", "RabbitMQ", "Node.js Workers"],
      scalability: "Independent scaling based on queue depth.",
      security: "Internal VPC access only, Signed Job Payloads.",
      performance: "Parallel processing, Retry mechanisms, Dead Letter Queues."
    }
  },
  {
    id: 'cache',
    label: 'Distributed Cache',
    type: 'data',
    icon: Zap,
    basic: false,
    col: 3,
    description: "In-memory data store for frequently accessed data to reduce database load and latency.",
    specs: {
      tech: ["Redis", "Memcached"],
      scalability: "Redis Cluster / Sentinel for high availability.",
      security: "Encrypted at rest, Password protected, VPC peering.",
      performance: "Sub-millisecond latency, Eviction policies (LRU)."
    }
  },
  {
    id: 'db',
    label: 'Primary Database',
    type: 'data',
    icon: Database,
    basic: true,
    col: 4,
    description: "The source of truth. Persistent storage for transactional data, user profiles, and application state.",
    specs: {
      tech: ["PostgreSQL", "MongoDB", "Prisma ORM"],
      scalability: "Read Replicas, Connection Pooling (PgBouncer), Sharding (if needed).",
      security: "Encryption at rest (AES-256), VPC Isolation, Row-Level Security.",
      performance: "Indexing strategies, Query optimization, Normalized schema."
    }
  },
  {
    id: 'analytics',
    label: 'Analytics / Logs',
    type: 'infra',
    icon: Activity,
    basic: false,
    col: 4,
    description: "Observability stack for monitoring system health, tracking errors, and gathering user usage metrics.",
    specs: {
      tech: ["Elasticsearch (ELK)", "Prometheus", "Grafana", "PostHog"],
      scalability: "Time-series data retention policies, Sampling.",
      security: "PII masking, Role-based access control.",
      performance: "Async ingestion via log shippers (Fluentd)."
    }
  }
];

// --- Components ---

const DetailCard = ({ node, onClose }: { node: ArchNode; onClose: () => void }) => {
  return (
    <motion.div 
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="absolute top-0 right-0 bottom-0 w-full md:w-[400px] bg-white dark:bg-slate-900 border-l-4 border-black dark:border-white shadow-[-8px_0_15px_rgba(0,0,0,0.1)] z-20 overflow-y-auto"
    >
        <div className="p-6">
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                    <div className={`p-3 border-2 border-black dark:border-white rounded-lg shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#fff]
                        ${node.type === 'frontend' ? 'bg-blue-300' : 
                          node.type === 'gateway' ? 'bg-yellow-300' :
                          node.type === 'service' ? 'bg-purple-300' :
                          node.type === 'data' ? 'bg-green-300' : 'bg-gray-300'
                        }
                    `}>
                        <node.icon size={24} className="text-black" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black uppercase leading-none">{node.label}</h2>
                        <span className="text-xs font-bold uppercase text-gray-500 tracking-widest">{node.type} Layer</span>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <X size={24} />
                </button>
            </div>

            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-8 leading-relaxed border-l-4 border-gray-200 dark:border-gray-700 pl-4">
                {node.description}
            </p>

            <div className="space-y-6">
                <div className="bg-[#F3F4F6] dark:bg-slate-800 p-4 border-2 border-black dark:border-white shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#fff]">
                    <h3 className="font-black uppercase flex items-center gap-2 mb-3 text-black dark:text-white">
                        <Layers size={18} /> Tech Stack
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {node.specs.tech.map(t => (
                            <span key={t} className="px-2 py-1 bg-white dark:bg-slate-900 border border-black dark:border-gray-500 text-xs font-bold uppercase shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_#fff]">
                                {t}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                     <div className="group">
                         <h4 className="font-black uppercase text-sm mb-1 flex items-center gap-2 text-green-600 dark:text-green-400">
                             <Activity size={16} /> Scalability Strategy
                         </h4>
                         <p className="text-sm font-medium pl-6 text-gray-600 dark:text-gray-400">{node.specs.scalability}</p>
                     </div>
                     
                     <div className="group">
                         <h4 className="font-black uppercase text-sm mb-1 flex items-center gap-2 text-blue-600 dark:text-blue-400">
                             <Zap size={16} /> Performance
                         </h4>
                         <p className="text-sm font-medium pl-6 text-gray-600 dark:text-gray-400">{node.specs.performance}</p>
                     </div>

                     <div className="group">
                         <h4 className="font-black uppercase text-sm mb-1 flex items-center gap-2 text-red-600 dark:text-red-400">
                             <Lock size={16} /> Security Measures
                         </h4>
                         <p className="text-sm font-medium pl-6 text-gray-600 dark:text-gray-400">{node.specs.security}</p>
                     </div>
                </div>
            </div>
        </div>
    </motion.div>
  );
};

const ArchitectureApp: React.FC = () => {
  const [isProduction, setIsProduction] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const activeNodes = NODES.filter(n => isProduction || n.basic);
  const selectedNode = NODES.find(n => n.id === selectedNodeId);

  return (
    <div className="h-full w-full bg-[#E5E5E5] dark:bg-slate-950 flex flex-col font-sans overflow-hidden text-black dark:text-white relative">
        
        {/* Header */}
        <div className="p-6 bg-white dark:bg-slate-900 border-b-4 border-black dark:border-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0 z-10 shadow-sm">
            <div>
                <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter flex items-center gap-2">
                    <Cloud size={32} className="stroke-[3]" /> System Architecture
                </h1>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-1">
                    Interactive Stack Visualization
                </p>
            </div>

            <div className="flex items-center gap-3 bg-[#F3F4F6] dark:bg-slate-800 p-2 rounded-lg border-2 border-black dark:border-white">
                <span className={`text-xs font-black uppercase ${!isProduction ? 'text-black dark:text-white' : 'text-gray-400'}`}>MVP Mode</span>
                <button 
                    onClick={() => {
                        setIsProduction(!isProduction);
                        setSelectedNodeId(null);
                    }}
                    className={`relative w-14 h-8 rounded-full border-2 border-black dark:border-white transition-colors duration-300 ${isProduction ? 'bg-[#10B981]' : 'bg-gray-300'}`}
                >
                    <motion.div 
                        className="absolute top-1 left-1 w-5 h-5 bg-white border-2 border-black rounded-full shadow-sm"
                        animate={{ x: isProduction ? 24 : 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                </button>
                <span className={`text-xs font-black uppercase ${isProduction ? 'text-[#10B981]' : 'text-gray-400'}`}>Production</span>
            </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-auto p-4 md:p-8 relative">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                 style={{ 
                     backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', 
                     backgroundSize: '20px 20px' 
                 }} 
            />

            {/* Nodes Grid */}
            <div className="min-w-[800px] h-full flex items-center justify-center">
                <div className="grid grid-cols-4 gap-8 md:gap-16 relative">
                    {/* Connecting Lines (Simulated with absolute divs for grid alignment) */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-300 dark:bg-gray-700 -translate-y-1/2 -z-10" />

                    {/* Columns */}
                    {[1, 2, 3, 4].map(colNum => {
                        const colNodes = activeNodes.filter(n => n.col === colNum);
                        return (
                            <div key={colNum} className="flex flex-col gap-6 justify-center min-h-[400px]">
                                <AnimatePresence mode='popLayout'>
                                    {colNodes.map(node => (
                                        <motion.button
                                            layout
                                            key={node.id}
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.8, opacity: 0 }}
                                            onClick={() => setSelectedNodeId(node.id)}
                                            className={`
                                                relative p-4 md:p-6 w-48 md:w-56 text-left border-4 border-black dark:border-white shadow-[8px_8px_0_0_#000] dark:shadow-[8px_8px_0_0_#fff] transition-all
                                                ${selectedNodeId === node.id ? 'translate-x-[2px] translate-y-[2px] shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_#fff] ring-4 ring-yellow-400' : 'hover:-translate-y-1 hover:shadow-[12px_12px_0_0_#000] dark:hover:shadow-[12px_12px_0_0_#fff]'}
                                                ${node.type === 'frontend' ? 'bg-blue-100 dark:bg-blue-900/50' : 
                                                  node.type === 'gateway' ? 'bg-yellow-100 dark:bg-yellow-900/50' :
                                                  node.type === 'service' ? 'bg-purple-100 dark:bg-purple-900/50' :
                                                  node.type === 'data' ? 'bg-green-100 dark:bg-green-900/50' : 'bg-gray-100 dark:bg-gray-800'}
                                            `}
                                        >
                                            <div className="absolute -top-3 -right-3 bg-black text-white p-1 border-2 border-white rounded-full">
                                                {node.type === 'data' ? <Database size={12} /> : 
                                                 node.type === 'infra' ? <Settings size={12} /> :
                                                 <ArrowRight size={12} />}
                                            </div>

                                            <node.icon size={32} className="mb-3 text-black dark:text-white stroke-[1.5]" />
                                            <h3 className="font-black uppercase text-sm md:text-base leading-tight mb-1">{node.label}</h3>
                                            <span className="text-[10px] font-bold uppercase opacity-60 tracking-wider bg-white/50 px-1 rounded">{node.type}</span>
                                            
                                            {/* Connector Dot */}
                                            {colNum < 4 && (
                                                <div className="absolute top-1/2 -right-10 md:-right-20 w-8 md:w-16 h-1 bg-black dark:bg-white z-[-1]" />
                                            )}
                                        </motion.button>
                                    ))}
                                </AnimatePresence>
                                {colNodes.length === 0 && <div className="w-48 h-20 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-xs uppercase font-bold text-gray-400">Empty Layer</div>}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>

        {/* Legend Footer */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t-4 border-black dark:border-white flex gap-4 overflow-x-auto text-[10px] font-bold uppercase shrink-0">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-300 border border-black"></div> Frontend
            </div>
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-300 border border-black"></div> Gateway
            </div>
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-300 border border-black"></div> Services
            </div>
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-300 border border-black"></div> Data
            </div>
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 border border-black"></div> Infra
            </div>
            <div className="ml-auto flex items-center gap-2 text-gray-500">
                <Radio size={12} className="animate-pulse text-red-500" /> Live System View
            </div>
        </div>

        {/* Detail Overlay */}
        <AnimatePresence>
            {selectedNode && (
                <DetailCard node={selectedNode} onClose={() => setSelectedNodeId(null)} />
            )}
        </AnimatePresence>
    </div>
  );
};

export default ArchitectureApp;