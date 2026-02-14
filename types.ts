import React from 'react';

export interface AppConfig {
  id: string;
  title: string;
  icon: React.FC<any>; // Lucide icon or similar
  component: React.FC<any>;
  width?: number;
  height?: number;
  canMaximize?: boolean;
}

export interface WindowState {
  id: string;
  appId: string;
  title: string;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number | string; height: number | string };
}

export interface CaseStudy {
  id: number;
  title: string;
  problem: string;
  process: string[]; // Steps taken
  constraints: string[];
  tradeOffs: { optionA: string; optionB: string; decision: string };
  solution: string;
  outcome: string;
}

export interface PortfolioData {
  personal: {
    name: string;
    initials: string;
    tagline: string;
    bio: string;
    email: string;
    location: string;
    image: string;
    image2: string;
    resume: string;
    me: string;
  };
  skills: Array<{ name: string; level: number; category: string }>;
  techStack: Array<{ name: string; icon: string; color: string; level: number; category: string }>;
  projects: Array<{
    id: number;
    title: string;
    description: string;
    tech: string[];
    category: string;
    image: string;
    github: string;
    live: string;
    featured: boolean;
  }>;
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
    logo: string;
  }>;
  testimonials: Array<{
    name: string;
    position: string;
    content: string;
    avatar: string;
  }>;
  social: {
    github: string;
    linkedin: string;
    twitter: string;
    email: string;
    facebook: string;
  };
  caseStudies: CaseStudy[];
}