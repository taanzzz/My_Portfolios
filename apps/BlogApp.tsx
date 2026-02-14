import React, { useState, useEffect } from 'react';
import { useWindowStore } from '../store/useWindowStore';
import { PenTool, User, Calendar, Tag, ChevronDown, ChevronUp, Send, BookOpen } from 'lucide-react';

interface BlogPost {
  id: number;
  author: string;
  email: string;
  title: string;
  category: string;
  content: string;
  date: string;
}

const CATEGORIES = [
  { label: 'Technology', color: 'bg-blue-300' },
  { label: 'Lifestyle', color: 'bg-pink-300' },
  { label: 'Travel', color: 'bg-green-300' },
  { label: 'Education', color: 'bg-yellow-300' },
  { label: 'Design', color: 'bg-purple-300' },
];

const DEMO_POSTS: BlogPost[] = [
    {
      id: 1,
      author: "Porosh Islam Tarek",
      email: "poroshislamtarek123@gmail.com",
      title: "Mastering React Server Components",
      category: "Technology",
      content: "React Server Components represent a paradigm shift in how we build React applications. By moving logic to the server, we reduce bundle size and improve initial page load performance significantly. In this deep dive, I explore the architectural benefits and trade-offs.",
      date: new Date(Date.now() - 86400000 * 1).toLocaleDateString()
    },
    {
      id: 2,
      author: "Porosh Islam Tarek",
      email: "poroshislamtarek123@gmail.com",
      title: "The Art of Minimalist UI Design",
      category: "Design",
      content: "Minimalism isn't just about using less; it's about making every element count. In Neo-Brutalism, we strip away the unnecessary polish to reveal the raw structure, creating interfaces that are honest, bold, and functionally precise.",
      date: new Date(Date.now() - 86400000 * 3).toLocaleDateString()
    },
    {
      id: 3,
      author: "Porosh Islam Tarek",
      email: "poroshislamtarek123@gmail.com",
      title: "Why I Switched to Linux for Dev Work",
      category: "Technology",
      content: "After years on other platforms, the control and customization offered by Linux became irresistible. From custom window managers to bash scripting automations, the productivity gains have been measurable and substantial.",
      date: new Date(Date.now() - 86400000 * 5).toLocaleDateString()
    },
    {
      id: 4,
      author: "Porosh Islam Tarek",
      email: "poroshislamtarek123@gmail.com",
      title: "Balancing Code and Mental Health",
      category: "Lifestyle",
      content: "Burnout is real in the tech industry. It is crucial to find hobbies outside of the screen. For me, that's exploring astrophysics and writing. Disconnecting allows the brain to reset and often leads to better problem-solving upon return.",
      date: new Date(Date.now() - 86400000 * 10).toLocaleDateString()
    },
    {
      id: 5,
      author: "Porosh Islam Tarek",
      email: "poroshislamtarek123@gmail.com",
      title: "Continuous Learning in a Fast-Paced Industry",
      category: "Education",
      content: "The half-life of a learned tech skill is about 5 years. To stay relevant, one must cultivate a habit of continuous learning. I dedicate 5 hours a week to reading documentation and building experimental side projects.",
      date: new Date(Date.now() - 86400000 * 15).toLocaleDateString()
    },
    {
      id: 6,
      author: "Porosh Islam Tarek",
      email: "poroshislamtarek123@gmail.com",
      title: "Traveling Digital Nomad Style",
      category: "Travel",
      content: "Working remotely from the mountains of Bandarban taught me the importance of reliable 4G and offline-first workflows. Nature provides the best backdrop for deep work sessions.",
      date: new Date(Date.now() - 86400000 * 20).toLocaleDateString()
    }
];

const BlogApp: React.FC = () => {
  const { theme, isMobile } = useWindowStore();
  const [mobileTab, setMobileTab] = useState<'feed' | 'write'>('feed');
  
  // Initialize state from LocalStorage or fall back to DEMO_POSTS
  const [posts, setPosts] = useState<BlogPost[]>(() => {
    try {
        const savedPosts = localStorage.getItem('portfolio_blog_posts');
        if (savedPosts) {
            return JSON.parse(savedPosts);
        }
    } catch (error) {
        console.error("Failed to load posts from storage", error);
    }
    return DEMO_POSTS;
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    category: 'Technology',
    content: ''
  });

  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Persist posts to LocalStorage whenever they change
  useEffect(() => {
    localStorage.setItem('portfolio_blog_posts', JSON.stringify(posts));
  }, [posts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPost: BlogPost = {
      id: Date.now(),
      author: formData.name,
      email: formData.email,
      title: formData.title,
      category: formData.category,
      content: formData.content,
      date: new Date().toLocaleDateString()
    };
    setPosts([newPost, ...posts]);
    setFormData({ name: '', email: '', title: '', category: 'Technology', content: '' });
    
    // Switch to feed on mobile after submission
    if (isMobile) {
        setMobileTab('feed');
    }
  };

  const getCategoryColor = (cat: string) => CATEGORIES.find(c => c.label === cat)?.color || 'bg-gray-200';

  return (
    <div className="h-full w-full bg-[#E5E7EB] dark:bg-slate-950 flex flex-col md:flex-row overflow-hidden text-black dark:text-white font-sans">
        
        {/* Mobile Tab Switcher */}
        <div className="md:hidden shrink-0 flex border-b-4 border-black dark:border-white bg-white dark:bg-slate-900 z-10 relative shadow-md">
            <button 
                onClick={() => setMobileTab('feed')}
                className={`flex-1 py-4 font-black uppercase text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors ${mobileTab === 'feed' ? 'bg-[#FDE047] text-black' : 'text-gray-500 dark:text-gray-400'}`}
            >
                <BookOpen size={16} strokeWidth={2.5}/> Community Feed
            </button>
            <div className="w-[4px] bg-black dark:bg-white"></div>
            <button 
                onClick={() => setMobileTab('write')}
                className={`flex-1 py-4 font-black uppercase text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors ${mobileTab === 'write' ? 'bg-[#FDE047] text-black' : 'text-gray-500 dark:text-gray-400'}`}
            >
                <PenTool size={16} strokeWidth={2.5}/> Write Post
            </button>
        </div>

        {/* Form Section (Sidebar) */}
        <div 
            className={`
                w-full md:w-[400px] shrink-0 border-r-0 md:border-r-4 border-black dark:border-white bg-[#F3F4F6] dark:bg-slate-900 overflow-y-auto transition-all
                ${isMobile ? (mobileTab === 'write' ? 'flex-1 block' : 'hidden') : 'block h-full'}
            `}
        >
            <div className="p-6 md:p-8">
                <div className="mb-6">
                    <h2 className="text-3xl font-black uppercase mb-2 flex items-center gap-2">
                        <PenTool className="stroke-[3]" /> Write
                    </h2>
                    <p className="font-bold opacity-60 text-sm uppercase">Share your thoughts with the world</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 pb-8">
                    <div>
                        <label className="block text-xs font-black uppercase mb-1">Author Name</label>
                        <input 
                            required
                            type="text"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            className="w-full p-3 border-4 border-black dark:border-white font-bold bg-white dark:bg-slate-800 focus:shadow-[4px_4px_0_0_#000] dark:focus:shadow-[4px_4px_0_0_#fff] outline-none transition-all"
                            placeholder="Porosh Islam Tarek"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-black uppercase mb-1">Email</label>
                        <input 
                            required
                            type="email"
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                            className="w-full p-3 border-4 border-black dark:border-white font-bold bg-white dark:bg-slate-800 focus:shadow-[4px_4px_0_0_#000] dark:focus:shadow-[4px_4px_0_0_#fff] outline-none transition-all"
                            placeholder="poroshislamtarek123@gmail.com"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-black uppercase mb-1">Blog Title</label>
                        <input 
                            required
                            maxLength={100}
                            type="text"
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                            className="w-full p-3 border-4 border-black dark:border-white font-bold bg-white dark:bg-slate-800 focus:shadow-[4px_4px_0_0_#000] dark:focus:shadow-[4px_4px_0_0_#fff] outline-none transition-all"
                            placeholder="My Awesome Story"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-black uppercase mb-1">Topic</label>
                        <select 
                            value={formData.category}
                            onChange={e => setFormData({...formData, category: e.target.value})}
                            className="w-full p-3 border-4 border-black dark:border-white font-bold bg-white dark:bg-slate-800 focus:shadow-[4px_4px_0_0_#000] dark:focus:shadow-[4px_4px_0_0_#fff] outline-none transition-all"
                        >
                            {CATEGORIES.map(cat => (
                                <option key={cat.label} value={cat.label}>{cat.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-black uppercase mb-1">Content</label>
                        <textarea 
                            required
                            rows={6}
                            value={formData.content}
                            onChange={e => setFormData({...formData, content: e.target.value})}
                            className="w-full p-3 border-4 border-black dark:border-white font-bold bg-white dark:bg-slate-800 focus:shadow-[4px_4px_0_0_#000] dark:focus:shadow-[4px_4px_0_0_#fff] outline-none transition-all resize-none"
                            placeholder="Start typing your masterpiece..."
                        />
                    </div>
                    
                    <button 
                        type="submit"
                        className="w-full py-4 bg-black dark:bg-white text-white dark:text-black font-black uppercase text-lg border-4 border-transparent hover:bg-[#FDE047] hover:text-black hover:border-black transition-all flex items-center justify-center gap-2 shadow-[4px_4px_0_0_rgba(0,0,0,0.2)] dark:shadow-[4px_4px_0_0_#fff]"
                    >
                        Publish Post <Send size={18} strokeWidth={3} />
                    </button>
                </form>
            </div>
        </div>

        {/* Display Section (Main) */}
        <div 
            className={`
                flex-1 bg-white dark:bg-slate-950 overflow-y-auto p-4 md:p-10 transition-all
                ${isMobile ? (mobileTab === 'feed' ? 'block' : 'hidden') : 'block h-full'}
            `}
        >
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-8 border-b-4 border-black dark:border-white pb-4 inline-block">
                Community Feed
            </h1>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-20 md:pb-0">
                {posts.map((post) => (
                    <div 
                        key={post.id}
                        className="border-4 border-black dark:border-white bg-[#FFF] dark:bg-slate-900 shadow-[8px_8px_0_0_#000] dark:shadow-[8px_8px_0_0_#000] flex flex-col transition-transform hover:-translate-y-1"
                    >
                        <div className="p-5 flex-1">
                            <div className="flex justify-between items-start gap-4 mb-4">
                                <span className={`px-3 py-1 text-[10px] md:text-xs font-black uppercase border-2 border-black text-black ${getCategoryColor(post.category)}`}>
                                    {post.category}
                                </span>
                                <span className="text-[10px] md:text-xs font-bold opacity-50 flex items-center gap-1">
                                    <Calendar size={12} /> {post.date}
                                </span>
                            </div>
                            
                            <h3 className="text-xl md:text-2xl font-black uppercase leading-tight mb-2">{post.title}</h3>
                            
                            <div className="mb-4 border-b-2 border-black/10 dark:border-white/10 pb-2">
                                <div className="flex items-center gap-2 text-sm font-bold">
                                    <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center shrink-0">
                                        <User size={12} />
                                    </div>
                                    <span>{post.author}</span>
                                </div>
                                {expandedId === post.id && (
                                    <div className="ml-8 mt-1 text-xs text-gray-500 dark:text-gray-400 font-mono select-all">
                                       {post.email}
                                    </div>
                                )}
                            </div>

                            <p className="font-medium text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                                {expandedId === post.id ? post.content : post.content.slice(0, 120) + (post.content.length > 120 ? '...' : '')}
                            </p>
                        </div>
                        
                        {post.content.length > 120 && (
                            <button 
                                onClick={() => setExpandedId(expandedId === post.id ? null : post.id)}
                                className="w-full py-3 border-t-4 border-black dark:border-white bg-[#F3F4F6] dark:bg-slate-800 font-bold uppercase text-xs flex items-center justify-center gap-1 hover:bg-[#E5E7EB] dark:hover:bg-slate-700 transition-colors"
                            >
                                {expandedId === post.id ? 'Read Less' : 'Read More'} 
                                {expandedId === post.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>
                        )}
                    </div>
                ))}

                {posts.length === 0 && (
                    <div className="col-span-full py-12 text-center opacity-50">
                        <p className="font-black text-xl uppercase">No posts yet. Be the first!</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default BlogApp;