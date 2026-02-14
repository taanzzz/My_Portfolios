import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Layers, Rocket, Smartphone, CheckCircle, ArrowRight, Clock, Star, Sparkles, Bot, Briefcase } from 'lucide-react';
import { useWindowStore } from '../store/useWindowStore';

const TIMELINES = [
  {
    time: "24 Hours",
    title: "Rapid Launch",
    description: "Perfect for validating ideas or capturing leads immediately.",
    icon: Zap,
    color: "bg-[#FDE047]", // Yellow
    accent: "border-black",
    features: [
      "High-Conversion Landing Page",
      "SEO Optimized Structure",
      "Secure Backend Connection",
      "Lead Capture Integration",
      "Responsive Deployment"
    ]
  },
  {
    time: "3 Days",
    title: "Core Application",
    description: "A fully functional web application with data management.",
    icon: Layers,
    color: "bg-[#6EE7B7]", // Green
    accent: "border-black",
    features: [
      "Full CRUD Operations",
      "Database Design (SQL/NoSQL)",
      "User Authentication (Auth0/Firebase)",
      "Admin Dashboard",
      "API Integration"
    ]
  },
  {
    time: "7 Days",
    title: "MVP / SaaS Prototype",
    description: "Market-ready product with scalable architecture.",
    icon: Rocket,
    color: "bg-[#A78BFA]", // Purple
    accent: "border-black",
    features: [
      "Payment Gateway (Stripe/LemonSqueezy)",
      "Scalable Cloud Architecture",
      "Advanced Security Rules",
      "Email/Notification System",
      "Analytics Integration"
    ]
  }
];

const SPECIAL_SERVICES = [
  {
    id: 'chatbot',
    title: 'Custom AI Chatbots',
    subtitle: 'Intelligent Automation',
    description: 'I build smart, conversational agents trained on your specific data. From customer support to lead generation, these bots run 24/7 and speak your brand\'s language.',
    icon: Bot,
    img: "https://res.cloudinary.com/dnatiwtcj/image/upload/v1767826072/love_1_s8nyi9.png",
    color: "bg-pink-100 dark:bg-pink-900/40",
    tags: ["Gemini / OpenAI", "Context Aware", "Vector Search"]
  },
  {
    id: 'portfolio',
    title: 'Custom Portfolios',
    subtitle: 'Personal Branding',
    description: 'Stand out in the crowded market. I craft interactive, high-impact portfolios (like this OS one!) that tell your professional story through unique visuals and motion.',
    icon: Briefcase,
    img: "https://res.cloudinary.com/dnatiwtcj/image/upload/v1767826073/portfolio_plq2h0.png",
    color: "bg-blue-100 dark:bg-blue-900/40",
    tags: ["3D Visuals", "Interactive", "SEO Ready"]
  }
];

const ServicesApp: React.FC = () => {
  const { openWindow } = useWindowStore();

  return (
    <div className="h-full w-full bg-[#FAFAFA] dark:bg-slate-950 flex flex-col font-sans overflow-hidden text-black dark:text-white">
      
      {/* Header */}
      <div className="p-8 md:p-10 shrink-0 border-b-4 border-black dark:border-white bg-white dark:bg-slate-900 relative">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-2 flex items-center gap-3">
                    What I Can Build <span className="text-[#FDE047] text-6xl leading-none">.</span>
                </h1>
                <p className="text-lg font-bold text-gray-500 uppercase tracking-widest">
                    Speed meets Scalability. Result Oriented.
                </p>
            </div>
            <div className="bg-black text-white px-4 py-2 font-bold uppercase text-sm border-2 border-transparent shadow-[4px_4px_0_0_#FDE047]">
                Open for Contracts
            </div>
        </div>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
      </div>

      {/* Content Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-12 pb-12">
            
            {/* 1. Mobile App Highlight Section */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black text-white p-8 md:p-12 border-4 border-black dark:border-white shadow-[12px_12px_0_0_#FDE047] relative overflow-hidden group"
            >
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-16">
                    <div className="flex-1 space-y-6">
                        <div className="inline-flex items-center gap-2 bg-[#FDE047] text-black px-3 py-1 font-black uppercase text-xs tracking-wider">
                            <Star size={12} fill="black" /> Premium Service
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black uppercase leading-tight">
                            Production-Ready <br/> Mobile Apps
                        </h2>
                        <p className="text-lg md:text-xl text-gray-300 font-medium leading-relaxed max-w-xl">
                            I engineer high-performance, cross-platform applications for iOS and Android. Built with React Native, ready for the App Store & Play Store.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            {['Cross-Platform', 'Native Performance', 'Offline-First', 'Push Notifications'].map(tag => (
                                <span key={tag} className="px-3 py-1 border border-white/30 text-xs font-bold uppercase text-gray-300">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                    
                    {/* Visual Icon */}
                    <div className="w-48 h-48 md:w-64 md:h-64 bg-white/10 rounded-full flex items-center justify-center border-4 border-white/20 relative">
                        <Smartphone size={100} className="text-[#FDE047] relative z-10" strokeWidth={1.5} />
                        <motion.div 
                            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.2, 0.5] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute inset-0 bg-[#FDE047]/20 rounded-full blur-xl" 
                        />
                    </div>
                </div>
            </motion.div>

            {/* 2. Web Timelines Table */}
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <Clock size={28} className="text-black dark:text-white" strokeWidth={2.5} />
                    <h2 className="text-3xl font-black uppercase">Web Delivery Timelines</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {TIMELINES.map((item, i) => (
                        <motion.div
                            key={item.time}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`flex flex-col h-full bg-white dark:bg-slate-900 border-4 border-black dark:border-white shadow-[8px_8px_0_0_#000] dark:shadow-[8px_8px_0_0_#fff] hover:-translate-y-2 hover:shadow-[12px_12px_0_0_#000] dark:hover:shadow-[12px_12px_0_0_#fff] transition-all duration-300`}
                        >
                            {/* Card Header */}
                            <div className={`${item.color} p-6 border-b-4 border-black dark:border-white`}>
                                <div className="flex justify-between items-start mb-4">
                                    <item.icon size={32} className="text-black stroke-[2]" />
                                    <span className="bg-black text-white px-3 py-1 font-black text-xl uppercase shadow-[2px_2px_0_0_rgba(255,255,255,0.5)]">
                                        {item.time}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-black uppercase text-black leading-none mb-2">{item.title}</h3>
                                <p className="text-black font-bold text-sm opacity-80 leading-tight">
                                    {item.description}
                                </p>
                            </div>

                            {/* Features List */}
                            <div className="p-6 flex-1 flex flex-col">
                                <ul className="space-y-3 mb-8 flex-1">
                                    {item.features.map((feat, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                                            <CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" />
                                            <span>{feat}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button 
                                    onClick={() => openWindow('contact', 'Contact')}
                                    className="w-full py-3 border-2 border-black dark:border-white font-black uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors flex items-center justify-center gap-2 group"
                                >
                                    Start Project <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* 3. Specialized Solutions */}
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <Sparkles size={28} className="text-black dark:text-white text-[#FDE047] fill-current" strokeWidth={2.5} />
                    <h2 className="text-3xl font-black uppercase">Specialized Solutions</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {SPECIAL_SERVICES.map((service, i) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + (i * 0.1) }}
                            className={`relative border-4 border-black dark:border-white shadow-[8px_8px_0_0_#000] dark:shadow-[8px_8px_0_0_#fff] p-6 md:p-8 flex flex-col-reverse md:flex-row items-center gap-8 ${service.color} transition-transform hover:-translate-y-1 hover:shadow-[12px_12px_0_0_#000] dark:hover:shadow-[12px_12px_0_0_#fff]`}
                        >
                            <div className="flex-1 text-center md:text-left z-10">
                                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                    <service.icon size={18} className="text-black dark:text-white" />
                                    <span className="font-bold uppercase text-xs tracking-widest text-gray-600 dark:text-gray-300">{service.subtitle}</span>
                                </div>
                                <h3 className="text-3xl font-black uppercase leading-none mb-4 text-black dark:text-white">{service.title}</h3>
                                <p className="font-medium text-gray-800 dark:text-gray-200 mb-6 leading-relaxed">
                                    {service.description}
                                </p>
                                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                    {service.tags.map(tag => (
                                        <span key={tag} className="bg-white dark:bg-slate-900 border-2 border-black dark:border-white px-2 py-1 text-[10px] font-bold uppercase shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_#fff] text-black dark:text-white">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Visual Container */}
                            <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 bg-white dark:bg-slate-800 border-4 border-black dark:border-white rounded-full flex items-center justify-center shadow-[4px_4px_0_0_rgba(0,0,0,0.2)] dark:shadow-[4px_4px_0_0_#fff] overflow-hidden p-6 relative group">
                                <img src={service.img} alt={service.title} className="w-full h-full object-contain relative z-10 transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-tr from-black/5 to-transparent dark:from-white/10" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Bottom CTA */}
            <div className="bg-[#E5E5E5] dark:bg-slate-800 border-t-4 border-black dark:border-white p-8 text-center space-y-4">
                <h3 className="text-2xl font-black uppercase">Need something custom?</h3>
                <p className="text-gray-600 dark:text-gray-400 font-medium max-w-2xl mx-auto">
                    Complex SaaS platforms, Enterprise Dashboards, or AI Integrations. I can handle custom requirements with the same level of precision and speed.
                </p>
            </div>

        </div>
      </div>
    </div>
  );
};

export default ServicesApp;