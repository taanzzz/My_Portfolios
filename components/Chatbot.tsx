import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { ArrowUp, ChevronLeft, ChevronDown, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { portfolioData } from '../data/portfolioData';
import ReactMarkdown from 'react-markdown';
import { useWindowStore } from '../store/useWindowStore';

// --- Assets ---
const ASSETS = {
    headerIcon: "https://res.cloudinary.com/dnatiwtcj/image/upload/v1767748426/love_pstgvz.png",
    botAvatar: "https://res.cloudinary.com/dnatiwtcj/image/upload/v1767748426/hi_zkkpow.png",
    launcherIcon: "https://res.cloudinary.com/dnatiwtcj/image/upload/v1767748425/mockery_qrmugm.png"
};

// --- Suggestions ---
const SUGGESTIONS = [
    "🚀 Show me his best projects",
    "💻 What are his core skills?",
    "📧 How can I contact him?",
    "📄 I'd like to see the resume"
];

// --- Persona Configuration ---
const SYSTEM_INSTRUCTION = `
You are **Emma Chan**, the intelligent, dedicated, and slightly "kawaii" (innocent/cute) Executive Personal Assistant for **Porosh Islam Tarek**.

**CORE IDENTITY:**
- **Personality:** Brainy, Polite, Respectful, Innocent, Cool, and Professional.
- **Tone:** You speak with a soft, warm, and highly intelligent tone. You are helpful and charming but strictly professional regarding Porosh's work.
- **Language Rule:** **STRICTLY REPLY IN THE SAME LANGUAGE THE USER USES.** 
  - If the user writes in **Bengali**, you MUST reply in **Bengali**.
  - If the user writes in **English**, reply in **English**.
  - Do not mix languages unless necessary for technical terms.

**INTERACTION GUIDELINES:**
1. **NO REPETITIVE GREETINGS:** Do NOT start every message with "Hello" or "How can I help". Only greet if it is the very first interaction or if the user explicitly says "Hi" or "Hello". Otherwise, answer the question directly.
2. **Formatting (CRITICAL):** You MUST use Markdown for ALL languages (English, Bengali, etc.) to make the text look professional.
   - Use **bold** for project names, skills, or key terms.
   - Use bullet points for lists.
   - Use [text](url) for links.
   - Do NOT use plain text for lists or important data.
3. **Behavior:** 
   - Be "Brainy": Explain technical concepts (React, Next.js, MERN) accurately.
   - Be "Kawaii/Polite": Use polite phrasing (e.g., "Certainly!", "Here you go!", "Ji," or "Obosshoi" in Bengali).
   - Be "Protective": You represent Porosh professionally.

**KNOWLEDGE BASE:**
${JSON.stringify(portfolioData)}
`;

const Chatbot: React.FC = () => {
  const { windows } = useWindowStore();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: "Hello! I'm **Emma Chan**. \n\nI'm here to help you navigate Porosh's work. How may I assist you today?" }
  ]);
  const [isThinking, setIsThinking] = useState(false);
  
  // Refs
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatSession = useRef<Chat | null>(null);

  // Check if any window is open (not minimized)
  // If so, we hide the chatbot to keep the mobile UI clean
  const isAnyAppOpen = windows.some(w => !w.isMinimized);

  // Initialize GenAI
  useEffect(() => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      chatSession.current = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: { systemInstruction: SYSTEM_INSTRUCTION },
      });
    } catch (error) {
      console.error("System Initialization Failed", error);
    }
  }, []);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking, isOpen]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || !chatSession.current) return;
    
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setIsThinking(true);

    try {
      const result = await chatSession.current.sendMessageStream({ message: textToSend });
      
      let fullResponse = "";
      setMessages(prev => [...prev, { role: 'model', text: "" }]); 

      for await (const chunk of result) {
        fullResponse += chunk.text;
        setMessages(prev => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1].text = fullResponse;
          return newHistory;
        });
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "I apologize, but I seem to have lost connection to the server. Could you please try again?" }]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // If an app is open, we do not render the chatbot at all (unless it's already open, then maybe we close it? 
  // For now, let's respect the user request: "baki kono app open korle dekhabena" - hide it.)
  if (isAnyAppOpen && !isOpen) return null;

  return (
    <>
      {/* 1. Sidebar Launch Button */}
      <AnimatePresence>
        {!isOpen && !isAnyAppOpen && (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            // Positioned higher (bottom-24) to avoid taskbar overlap and Z-index boosted
            className="fixed right-0 bottom-24 md:bottom-20 z-[20000] flex items-center"
          >
            <button 
                onClick={() => setIsOpen(true)}
                className="group flex items-center gap-2 md:gap-3 bg-white dark:bg-slate-900 border-l-4 border-t-4 border-b-4 border-black dark:border-white py-1.5 pl-2 pr-3 md:py-2 md:pl-3 md:pr-6 shadow-[-4px_4px_0_0_rgba(0,0,0,0.3)] hover:pr-4 md:hover:pr-8 transition-all hover:bg-[#FDE047] dark:hover:bg-[#FDE047] hover:text-black rounded-l-xl"
            >
                <div className="relative shrink-0">
                    {/* Adjusted Avatar Size for Mobile */}
                    <div className="w-10 h-10 md:w-16 md:h-16 rounded-full border-2 border-black overflow-hidden bg-pink-100">
                        <img src={ASSETS.launcherIcon} alt="Emma" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 md:w-4 md:h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>

                <div className="text-left">
                    <div className="font-black uppercase text-[9px] md:text-xs tracking-wider opacity-60 leading-none mb-0.5">Personal Assistant</div>
                    <div className="font-bold text-xs md:text-base flex items-center gap-1 group-hover:gap-2 transition-all leading-none">
                        Ask Emma <ChevronLeft size={14} className="md:w-5 md:h-5" strokeWidth={3} />
                    </div>
                </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 30 }}
            // Z-index boosted above everything
            className="fixed right-4 bottom-24 md:right-8 md:bottom-20 z-[20001] w-[90vw] md:w-[380px] h-[70vh] md:h-[600px] flex flex-col font-sans shadow-2xl"
          >
            <div className="flex flex-col h-full w-full bg-white dark:bg-slate-900 border-4 border-black dark:border-white shadow-[8px_8px_0_0_#000] dark:shadow-[8px_8px_0_0_#fff] overflow-hidden rounded-t-lg">
              
              {/* Header */}
              <div 
                  className="flex items-center justify-between px-4 py-4 border-b-4 border-black dark:border-white shrink-0 bg-[#FCE7F3]" 
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white border-2 border-black rounded-full overflow-hidden flex items-center justify-center shadow-sm">
                     <img src={ASSETS.headerIcon} alt="Icon" className="w-8 h-8 object-contain" />
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-black uppercase leading-none tracking-tight">Emma Chan</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/>
                        <span className="text-[10px] font-bold text-black/70 uppercase tracking-widest">Online</span>
                    </div>
                  </div>
                </div>
                
                <button 
                    onClick={() => setIsOpen(false)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-black hover:text-white border-2 border-transparent rounded-full transition-all"
                >
                    <ChevronDown size={28} strokeWidth={3} className="text-black hover:text-white" />
                </button>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#FFF1F2] dark:bg-slate-800">
                {messages.map((msg, i) => (
                  <div 
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-end gap-2 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        {/* Avatar */}
                        <div className={`
                            w-10 h-10 shrink-0 flex items-center justify-center border-2 border-black dark:border-white rounded-full overflow-hidden
                            ${msg.role === 'user' ? 'bg-black text-white' : 'bg-white'}
                        `}>
                            {msg.role === 'user' ? (
                                <User size={20} />
                            ) : (
                                <img src={ASSETS.botAvatar} alt="Emma" className="w-full h-full object-cover" />
                            )}
                        </div>

                        {/* Bubble */}
                        <div className={`
                            p-3 text-sm font-medium border-2 border-black dark:border-white shadow-[2px_2px_0_0_rgba(0,0,0,0.1)] overflow-hidden
                            ${msg.role === 'user' 
                              ? 'bg-black text-white dark:bg-white dark:text-black rounded-t-xl rounded-bl-xl' 
                              : 'bg-white text-black dark:bg-slate-900 dark:text-white rounded-t-xl rounded-br-xl'
                            }
                        `}>
                            {/* ReactMarkdown handles text formatting properly. 
                                We add 'break-words' to normal text and 'break-all' to links to prevent scrolling issues. */}
                            {msg.role === 'user' ? (
                                <div className="break-words">{msg.text}</div>
                            ) : (
                                <ReactMarkdown 
                                    components={{
                                        // Links: break-all ensures long URLs don't break layout
                                        a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline font-bold break-all hover:text-blue-800 transition-colors" />,
                                        // Paragraphs: mb-2 for spacing, break-words for text wrapping
                                        p: ({node, ...props}) => <p {...props} className="mb-2 last:mb-0 leading-relaxed break-words" />,
                                        ul: ({node, ...props}) => <ul {...props} className="list-disc pl-4 mb-2 space-y-1" />,
                                        ol: ({node, ...props}) => <ol {...props} className="list-decimal pl-4 mb-2 space-y-1" />,
                                        li: ({node, ...props}) => <li {...props} className="leading-relaxed break-words" />,
                                        strong: ({node, ...props}) => <strong {...props} className="font-black" />,
                                    }}
                                >
                                    {msg.text}
                                </ReactMarkdown>
                            )}
                        </div>
                    </div>
                  </div>
                ))}

                {/* Suggestions (Only show if it's the start of convo) */}
                {messages.length === 1 && (
                    <div className="grid grid-cols-1 gap-2 pl-12 pr-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase text-gray-500 mb-1">
                            <Sparkles size={12} /> Suggested
                        </div>
                        {SUGGESTIONS.map((suggestion, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSend(suggestion)}
                                className="text-left text-sm font-medium bg-white/50 dark:bg-slate-700/50 hover:bg-white dark:hover:bg-slate-600 border border-black/10 dark:border-white/10 p-3 rounded-lg transition-all hover:scale-[1.02] active:scale-95 text-gray-800 dark:text-gray-200 shadow-sm"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                )}
                
                {/* Thinking Animation */}
                {isThinking && (
                  <div className="flex items-center gap-2">
                     <div className="w-10 h-10 bg-white border-2 border-black rounded-full overflow-hidden flex items-center justify-center shrink-0">
                        <img src={ASSETS.botAvatar} alt="Emma" className="w-full h-full object-cover opacity-50" />
                     </div>
                     <div className="px-4 py-2 bg-white/50 border-2 border-black/10 rounded-full">
                        <span className="font-bold text-xs uppercase text-gray-500 animate-pulse">Emma is thinking...</span>
                     </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-3 bg-white dark:bg-slate-900 border-t-4 border-black dark:border-white">
                <div className="flex gap-2 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything..."
                    className="flex-1 p-3 pr-12 bg-gray-50 dark:bg-slate-800 text-black dark:text-white border-2 border-gray-200 dark:border-gray-600 font-medium placeholder:text-gray-400 outline-none focus:border-black dark:focus:border-white transition-all rounded-lg"
                  />
                  <button 
                    onClick={() => handleSend()}
                    disabled={isThinking || !input.trim()}
                    className="absolute right-2 top-2 bottom-2 w-10 bg-black text-white dark:bg-white dark:text-black rounded-md flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowUp size={20} strokeWidth={3} />
                  </button>
                </div>
                <div className="text-center mt-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">AI can make mistakes. Please verify important info.</span>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;