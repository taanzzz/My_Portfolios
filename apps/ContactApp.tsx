import React, { useState } from 'react';
import { Send, Mail, MapPin, Github, Linkedin, Facebook, Copy, Check, Map, AlertCircle, Loader2 } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';
import { useWindowStore } from '../store/useWindowStore';
import emailjs from '@emailjs/browser';

// --- EmailJS Configuration ---
const EMAILJS_SERVICE_ID = "service_xdhavpv";
const EMAILJS_PUBLIC_KEY = "5-4jiuhXIANlklxqP";
const EMAILJS_TEMPLATE_CONTACT = "template_jblccse";
const EMAILJS_TEMPLATE_AUTOREPLY = "template_e0jatjh";

const ContactApp: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const { theme, openWindow } = useWindowStore();

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(portfolioData.personal.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    const enhancedMessage = `
------------------------------------------------
New Contact Request
------------------------------------------------
Name:  ${formData.name}
Email: ${formData.email}
------------------------------------------------

Message:
${formData.message}
    `;

    // ✅ সব template variables এর সাথে match করানো
    const templateParams = {
        // Admin Template এর জন্য (template_jblccse)
        name: formData.name,              // {{name}}
        email: formData.email,            // {{email}}
        subject: 'New Contact Request',   // {{subject}}
        message: formData.message,        // {{message}}
        date: new Date().toLocaleString('en-US', { 
            dateStyle: 'medium', 
            timeStyle: 'short' 
        }), // {{date}}

        // Auto-Reply Template এর জন্য (template_e0jatjh)
        // name: formData.name — ইতিমধ্যে উপরে আছে
        user_email: formData.email,       // To field এর জন্য
        
        // Reply-to functionality এর জন্য
        reply_to: formData.email,
    };

    try {
        // 1. Admin কে notification পাঠান
        await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_CONTACT,
            templateParams,
            EMAILJS_PUBLIC_KEY
        );

        // 2. User কে auto-reply পাঠান
        try {
            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_AUTOREPLY,
                templateParams,
                EMAILJS_PUBLIC_KEY
            );
            console.log("✅ Auto-reply sent successfully");
        } catch (autoReplyError) {
            console.warn("❌ Auto-reply failed:", autoReplyError);
        }

        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);

    } catch (error: any) {
        console.error("EmailJS Error:", error);
        setStatus('error');
        const msg = error?.text || error?.message || "Failed to send message. Please check your connection.";
        setErrorMessage(msg);
        setTimeout(() => setStatus('idle'), 5000);
    }
};
  return (
    <div className="h-full w-full bg-[#F3F4F6] dark:bg-slate-950 flex flex-col md:flex-row overflow-hidden text-black dark:text-white font-sans">
      
      {/* Sidebar Info - Mobile: Top (max height constrained), Desktop: Left (full height) */}
      <div 
        className="w-full md:w-[320px] p-6 md:p-8 flex flex-col gap-6 shrink-0 border-b-4 md:border-b-0 md:border-r-4 border-black dark:border-white transition-colors duration-300 overflow-y-auto md:overflow-visible max-h-[35vh] md:max-h-full"
        style={{ backgroundColor: theme.accentColor }}
      >
        <div className="shrink-0">
            <h1 className="text-3xl md:text-4xl font-black uppercase mb-2 text-black leading-none">Contact</h1>
            <div className="w-12 md:w-16 h-2 bg-black mb-4"></div>
            <p className="font-bold text-base md:text-lg leading-tight text-black">
                Got a project? <br/> Let's talk.
            </p>
        </div>

        <div className="flex-1 flex flex-col gap-4">
            {/* Email Card */}
            <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0_0_#000] group relative shrink-0">
                <div className="flex gap-3 items-center mb-2 text-black">
                    <Mail size={20} className="stroke-2" />
                    <h4 className="font-black uppercase text-sm">Email</h4>
                </div>
                <p className="font-mono text-xs md:text-sm break-all font-bold text-black mb-2">{portfolioData.personal.email}</p>
                <button 
                  onClick={handleCopyEmail}
                  className="flex items-center gap-1 text-[10px] font-black uppercase bg-black text-white px-2 py-1 hover:bg-gray-800 transition-colors border-2 border-transparent hover:border-black"
                  type="button"
                >
                  {copied ? <Check size={10} /> : <Copy size={10} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
            </div>

            {/* Location Card */}
            <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0_0_#000] shrink-0">
                <div className="flex gap-3 items-center mb-2 text-black">
                    <MapPin size={20} className="stroke-2" />
                    <h4 className="font-black uppercase text-sm">Location</h4>
                </div>
                <p className="font-mono text-xs md:text-sm font-bold text-black mb-3">{portfolioData.personal.location}</p>
                
                <button 
                    onClick={() => openWindow('map', 'Mission Map')}
                    className="w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase bg-[#FDE047] text-black px-2 py-2 hover:bg-black hover:text-white transition-colors border-2 border-black shadow-[2px_2px_0_0_#000] active:shadow-none active:translate-y-[2px]"
                >
                    <Map size={14} /> View Mission Map
                </button>
            </div>
            
            {/* Socials */}
            <div className="mt-auto pt-4 shrink-0">
                <h4 className="font-black uppercase mb-3 text-lg text-black">Socials</h4>
                <div className="flex gap-3 flex-wrap">
                    <a href={portfolioData.social.github} target="_blank" rel="noreferrer" className="w-10 h-10 md:w-12 md:h-12 bg-black text-white flex items-center justify-center hover:bg-white hover:text-black border-2 border-black transition-colors shadow-[2px_2px_0_0_#fff]">
                        <Github size={20} />
                    </a>
                    <a href={portfolioData.social.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 md:w-12 md:h-12 bg-[#0A66C2] text-white flex items-center justify-center hover:bg-white hover:text-[#0A66C2] border-2 border-black transition-colors shadow-[2px_2px_0_0_#fff]">
                        <Linkedin size={20} />
                    </a>
                    <a href={portfolioData.social.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 md:w-12 md:h-12 bg-[#1877F2] text-white flex items-center justify-center hover:bg-white hover:text-[#1877F2] border-2 border-black transition-colors shadow-[2px_2px_0_0_#fff]">
                        <Facebook size={20} />
                    </a>
                </div>
            </div>
        </div>
      </div>

      {/* Main Form Area - Scrollable */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-900 relative">
        <div className="p-6 md:p-10 max-w-xl mx-auto min-h-full flex flex-col justify-center">
            <h3 className="text-2xl font-black uppercase mb-6 md:mb-8 border-l-8 pl-4" style={{ borderColor: theme.accentColor }}>Send Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 pb-6">
                <div className="space-y-1 md:space-y-2">
                    <label className="font-bold uppercase tracking-wide text-xs md:text-sm">Your Name</label>
                    <input 
                        required
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 border-4 border-black dark:border-white bg-[#F3F4F6] dark:bg-slate-800 text-black dark:text-white focus:bg-white dark:focus:bg-slate-700 focus:shadow-[6px_6px_0_0_#000] dark:focus:shadow-[6px_6px_0_0_#fff] focus:translate-x-[-2px] focus:translate-y-[-2px] outline-none transition-all font-bold text-base md:text-lg rounded-none"
                        placeholder="John Doe"
                        disabled={status === 'sending' || status === 'success'}
                    />
                </div>
                <div className="space-y-1 md:space-y-2">
                    <label className="font-bold uppercase tracking-wide text-xs md:text-sm">Email Address</label>
                    <input 
                        required
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 border-4 border-black dark:border-white bg-[#F3F4F6] dark:bg-slate-800 text-black dark:text-white focus:bg-white dark:focus:bg-slate-700 focus:shadow-[6px_6px_0_0_#000] dark:focus:shadow-[6px_6px_0_0_#fff] focus:translate-x-[-2px] focus:translate-y-[-2px] outline-none transition-all font-bold text-base md:text-lg rounded-none"
                        placeholder="john@example.com"
                        disabled={status === 'sending' || status === 'success'}
                    />
                </div>
                
                <div className="space-y-1 md:space-y-2">
                    <label className="font-bold uppercase tracking-wide text-xs md:text-sm">Message</label>
                    <textarea 
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full px-4 py-3 border-4 border-black dark:border-white bg-[#F3F4F6] dark:bg-slate-800 text-black dark:text-white focus:bg-white dark:focus:bg-slate-700 focus:shadow-[6px_6px_0_0_#000] dark:focus:shadow-[6px_6px_0_0_#fff] focus:translate-x-[-2px] focus:translate-y-[-2px] outline-none transition-all font-bold text-base md:text-lg resize-none rounded-none"
                        placeholder="Tell me about your project..."
                        disabled={status === 'sending' || status === 'success'}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={status === 'sending' || status === 'success'}
                    className={`w-full py-4 font-black uppercase text-base md:text-lg text-black border-4 border-black dark:border-white shadow-[6px_6px_0_0_#000] dark:shadow-[6px_6px_0_0_#fff] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 hover:bg-opacity-90 rounded-none disabled:opacity-70 disabled:cursor-not-allowed`}
                    style={{ backgroundColor: status === 'success' ? '#6EE7B7' : status === 'error' ? '#F87171' : theme.accentColor }}
                >
                    {status === 'sending' ? (
                         <>
                            <Loader2 className="animate-spin" size={20} strokeWidth={3} /> SENDING...
                         </>
                    ) : status === 'success' ? (
                        <>
                            <Check size={20} strokeWidth={3} /> SENT SUCCESSFULLY
                        </>
                    ) : status === 'error' ? (
                        <>
                            <AlertCircle size={20} strokeWidth={3} /> FAILED - RETRY
                        </>
                    ) : (
                        <>
                            SEND MESSAGE <Send size={20} strokeWidth={3} />
                        </>
                    )}
                </button>
                
                {status === 'success' && (
                    <div className="p-3 bg-green-100 border-2 border-green-500 text-green-800 font-bold text-sm text-center uppercase">
                        Message sent! Check your inbox for confirmation.
                    </div>
                )}
                
                {status === 'error' && (
                    <div className="p-3 bg-red-100 border-2 border-red-500 text-red-800 font-bold text-sm text-center uppercase break-all">
                        {errorMessage || "Something went wrong. Please check your connection."}
                    </div>
                )}
            </form>
            <div className="mt-4 text-center">
                <p className="text-[10px] md:text-xs font-bold opacity-50 uppercase">
                    We'll usually reply within 24 hours.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ContactApp;