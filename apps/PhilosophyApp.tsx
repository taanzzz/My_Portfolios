import React from 'react';
import { BookOpen, Puzzle, RefreshCw, Zap, Heart } from 'lucide-react';

const PhilosophyApp: React.FC = () => {
  return (
    <div className="h-full w-full bg-[#FAFAFA] dark:bg-slate-950 flex flex-col font-sans overflow-hidden text-black dark:text-white">
      {/* Header */}
      <div className="p-8 md:p-12 shrink-0 border-b-4 border-black dark:border-white bg-white dark:bg-slate-900">
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">The Human Side</h1>
        <p className="text-lg font-medium text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
           Beyond syntax and servers, engineering is about perspective. Here is how I navigate the abstract chaos of creation.
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-12">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            
            {/* 1. How I Learn */}
            <div className="space-y-4 group">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 border-2 border-black dark:border-white shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#fff] group-hover:-translate-y-1 transition-transform duration-300">
                        <BookOpen size={24} strokeWidth={2.5} />
                    </div>
                    <h2 className="text-2xl font-black uppercase">How I Learn</h2>
                </div>
                <p className="text-base leading-relaxed text-gray-800 dark:text-gray-300 border-l-2 border-gray-300 dark:border-gray-700 pl-4">
                    I believe in <strong>just-in-time learning</strong> fueled by deep curiosity. I don't memorize documentation; I build mental models. When I encounter a new technology, I deconstruct it: <em>What problem does this solve? What are the primitives?</em> Once I grasp the "why," the "how" follows naturally through hands-on experimentation.
                </p>
            </div>

            {/* 2. Problem Solving */}
            <div className="space-y-4 group">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900 border-2 border-black dark:border-white shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#fff] group-hover:-translate-y-1 transition-transform duration-300">
                        <Puzzle size={24} strokeWidth={2.5} />
                    </div>
                    <h2 className="text-2xl font-black uppercase">Approach</h2>
                </div>
                <p className="text-base leading-relaxed text-gray-800 dark:text-gray-300 border-l-2 border-gray-300 dark:border-gray-700 pl-4">
                    I treat code as a medium for logic, not magic. My process is <strong>iterative and reductive</strong>. I start by breaking complex problems into their smallest atomic units. If I can't explain the logic in plain English (or pseudo-code), I'm not ready to write it. Complexity is a cost; simplicity is the asset I optimize for.
                </p>
            </div>

            {/* 3. Handling Failure */}
            <div className="space-y-4 group">
                 <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-red-100 dark:bg-red-900 border-2 border-black dark:border-white shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#fff] group-hover:-translate-y-1 transition-transform duration-300">
                        <RefreshCw size={24} strokeWidth={2.5} />
                    </div>
                    <h2 className="text-2xl font-black uppercase">On Failure</h2>
                </div>
                <p className="text-base leading-relaxed text-gray-800 dark:text-gray-300 border-l-2 border-gray-300 dark:border-gray-700 pl-4">
                    Errors are just feedback loops. I don't fear breaking things; I fear not knowing <em>why</em> they broke. When a deployment fails or a bug persists, I detach my ego from the code. It’s not "I failed," it’s "the hypothesis was incorrect." This shift turns frustration into a detective game where the prize is understanding.
                </p>
            </div>

            {/* 4. What Excites Me */}
            <div className="space-y-4 group">
                 <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900 border-2 border-black dark:border-white shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#fff] group-hover:-translate-y-1 transition-transform duration-300">
                        <Zap size={24} strokeWidth={2.5} />
                    </div>
                    <h2 className="text-2xl font-black uppercase">Motivation</h2>
                </div>
                <p className="text-base leading-relaxed text-gray-800 dark:text-gray-300 border-l-2 border-gray-300 dark:border-gray-700 pl-4">
                    I thrive on <strong>ambiguity and impact</strong>. Projects where the path isn't clear, where user experience meets heavy engineering constraints—that's my playground. Whether it's optimizing a 60FPS interaction or designing a scalable schema, I get excited when the work feels less like assembly and more like craftsmanship.
                </p>
            </div>

        </div>

        {/* Footer Quote */}
        <div className="max-w-3xl mx-auto mt-16 pt-8 border-t-2 border-dashed border-gray-300 dark:border-gray-700 text-center opacity-70 pb-8">
            <Heart size={24} className="mx-auto mb-4 text-red-500 fill-current animate-pulse" />
            <p className="font-serif italic text-xl md:text-2xl">
                "Code is poetry written for machines, but read by humans."
            </p>
        </div>
      </div>
    </div>
  );
};

export default PhilosophyApp;