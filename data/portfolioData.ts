import { PortfolioData } from '../types';

export const portfolioData: PortfolioData = {
  personal: {
    name: "Porosh Islam Tarek",
    initials: "PIT",
    tagline: "Crafting seamless digital experiences",
    bio: "Full-stack developer with over a year of hands-on experience designing and deploying scalable web applications. Specialized in React, Node.js, and cloud infrastructure, I focus on building robust solutions that balance performance with maintainability.",
    email: "poroshislamtarek123@gmail.com",
    location: "Bangladesh, Halishahar chittagong",
    image: "https://res.cloudinary.com/dnatiwtcj/image/upload/v1767872630/download__28_-removebg-preview_x4rqpf.svg",
    image2: "https://i.ibb.co/xqz06DRJ/my.png",
    resume: "https://drive.google.com/file/d/1kUgk7Wa1GxzI3HH6zoxidJHWtg5EoMZZ/view?usp=sharing",
    me: "From an early age, I found myself drawn to two seemingly disparate worlds: the infinite expanse of space and the precise logic of programming. While the cosmos continues to inspire wonder, I discovered my calling in the realm of technology—a field where creativity meets problem-solving, and abstract concepts transform into tangible solutions. My journey into software development is rooted in a deep appreciation for mathematical elegance, particularly calculus, where complex problems evolve into intellectual challenges that fuel my curiosity. This mathematical foundation has shaped my approach to programming—viewing each project as an opportunity to craft efficient, logical solutions to real-world problems. Beyond code and algorithms, I maintain a profound interest in astrophysics and find fulfillment in articulating intricate technical concepts through clear, purposeful writing."
  },
  
  skills: [
    { name: "React/Next.js", level: 95, category: "Frontend" },
    { name: "Frontend Development", level: 93, category: "Frontend" },
    { name: "TypeScript", level: 60, category: "Frontend" },
    { name: "UI/UX Design", level: 85, category: "Design" },
    { name: "Express.js", level: 75, category: "Backend" },
    { name: "Database Design", level: 72, category: "Backend" },
    { name: "MongoDB", level: 80, category: "Backend" },
    { name: "Cloud Architecture", level: 65, category: "DevOps" }
  ],

  techStack: [
    { name: "JavaScript", icon: "SiJavascript", color: "#F7DF1E", level: 90, category: "Languages" },
    { name: "TypeScript", icon: "SiTypescript", color: "#3178C6", level: 85, category: "Languages" },
    { name: "Python", icon: "SiPython", color: "#3776AB", level: 70, category: "Languages" },
    { name: "HTML5", icon: "SiHtml5", color: "#E34F26", level: 95, category: "Languages" },
    { name: "CSS3", icon: "SiCss3", color: "#1572B6", level: 92, category: "Languages" },
    { name: "React", icon: "SiReact", color: "#61DAFB", level: 95, category: "Frontend" },
    { name: "Next.js", icon: "SiNextdotjs", color: "#000000", level: 80, category: "Frontend" },
    { name: "Tailwind CSS", icon: "SiTailwindcss", color: "#06B6D4", level: 93, category: "Frontend" },
    { name: "Framer Motion", icon: "SiFramer", color: "#0055FF", level: 88, category: "Frontend" },
    { name: "TanStack Query", icon: "SiReactquery", color: "#FF4154", level: 82, category: "Frontend" },
    { name: "Node.js", icon: "SiNodedotjs", color: "#339933", level: 88, category: "Backend" },
    { name: "Express.js", icon: "SiExpress", color: "#000000", level: 85, category: "Backend" },
    { name: "Firebase", icon: "SiFirebase", color: "#FFCA28", level: 80, category: "Backend" },
    { name: "MongoDB", icon: "SiMongodb", color: "#47A248", level: 87, category: "Databases" },
    { name: "Git", icon: "SiGit", color: "#F05032", level: 90, category: "DevOps & Tools" },
    { name: "GitHub", icon: "SiGithub", color: "#181717", level: 92, category: "DevOps & Tools" },
    { name: "VS Code", icon: "SiVisualstudiocode", color: "#007ACC", level: 95, category: "DevOps & Tools" }
  ],

  projects: [
    {
      id: 1,
      title: "Mind Over Myth Platform",
      description: "A modern self-growth platform combining books, community, and mindfulness tools in one space. Mind Over Myth helps users expand their knowledge and practice mindfulness.",
      tech: ["React", "Node.js","Express.js", "MongoDB", "Firebase Auth", "Tailwind CSS"],
      category: "MERN",
      image: "https://i.ibb.co.com/tM9SSHLH/Screenshot-2025-10-13-124231.png",
      github: "https://github.com/taanzzz/My-Booking-Assignment",
      live: "https://mindvsmyth.web.app",
      featured: true
    },
    {
      id: 2,
      title: "Hotel Booking Platform",
      description: "A modern hotel booking web app with room listings, availability checking, booking management and a responsive UI.",
      tech: ["React", "Node.js","Express.js", "MongoDB", "Firebase Auth", "Tailwind CSS"],
      category: "MERN",
      image: "https://i.ibb.co/QFYVCGt4/Screenshot-2025-06-24-100259.png",
      github: "https://github.com/taanzzz/My-Booking-Assignment",
      live: "https://my-assignment-project-2a864.web.app/",
      featured: true
    },
    {
      id: 3,
      title: "Plant Care Tracker",
      description: "A full-stack web application to manage and monitor your plant collection with personalized care instructions.",
      tech: ["React", "Firebase", "Express.js", "MongoDB", "Tailwind CSS"],
      category: "React",
      image: "https://i.ibb.co/k6wfqrn7/Screenshot-2025-06-24-164822.png", 
      github: "https://github.com/taanzzz/my-plantcare-project",
      live: "https://my-login-auth-67067.web.app/",
      featured: true
    },
    {
      id: 4,
      title: "PayBill Platform",
      description: "A secure and responsive bill payment web application with user authentication, real-time balance updates, and payment history.",
      tech: ["React", "Firebase", "Express.js", "MongoDB", "Tailwind CSS"],
      category: "React",
      image: "https://i.ibb.co/hxwKNG89/Screenshot-2025-06-25-182720.png", 
      github: "https://github.com/taanzzz/my-paybill-project",
      live: "https://talented-song.surge.sh/",
      featured: true
    },
    {
      id: 5,
      title: "EduManage Platform",
      description: "A full-stack MERN educational platform featuring distinct dashboards for admins, teachers, and students. Includes role-based access control.",
      tech: ["React", "Node.js", "Express.js", "MongoDB", "Firebase", "JWT", "Tanstack Query"],
      category: "React",
      image: "https://i.ibb.co/BY1mbFT/Screenshot-2025-07-23-235246.png",
      github: "https://github.com/taanzzz/mi-12-assignment-edumanage",
      live: "https://chatbot-project-007.web.app",
      featured: true
    }
  ],

  experience: [
    {
      company: "TechCorp Inc.",
      position: "Junior Full-Stack Developer",
      duration: "2022 - Present",
      description: "Led development of microservices architecture serving 100k+ users. Mentored junior developers and implemented CI/CD pipelines.",
      logo: "🏢",
    },
    {
      company: "StartupXYZ",
      position: "Full-Stack Developer",
      duration: "2020 - 2022",
      description: "Built MVP from scratch using React and Node.js. Scaled application to handle 10k+ concurrent users.",
      logo: "🚀",
    },
    {
      company: "WebAgency",
      position: "Frontend Developer",
      duration: "2019 - 2020",
      description: "Developed responsive websites and web applications for various clients using modern frontend technologies.",
      logo: "💻",
    }
  ],

  testimonials: [
    {
      name: "Sarah Johnson",
      position: "Project Manager at TechCorp",
      content: "Porosh is an exceptional developer who consistently delivers high-quality solutions.",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      name: "Mike Chen",
      position: "CTO at StartupXYZ",
      content: "Working with Porosh was a game-changer for our startup.",
      avatar: "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=400"
    }
  ],

  social: {
    github: "https://github.com/taanzzz",
    linkedin: "http://www.linkedin.com/in/porosh-islam-tarek-567836367",
    twitter: "https://x.com/taaaanzzzzz",
    email: "poroshislamtarek123@gmail.com",
    facebook: "https://www.facebook.com/poroshislamtarek"
  },

  caseStudies: [
    {
      id: 1,
      title: "Optimizing High-Volume Data Tables",
      problem: "A client dashboard with 10,000+ rows was rendering at <20fps, causing browser freezes on low-end laptops.",
      process: [
        "Profiled performance using Chrome DevTools (Performance Tab).",
        "Identified DOM node count as the primary bottleneck.",
        "Implemented virtualization (TanStack Virtual) to render only visible rows.",
        "Memoized expensive row calculation components."
      ],
      constraints: [
        "Must support IE11 (Corporate Requirement).",
        "No pagination allowed by design (Infinite Scroll required)."
      ],
      tradeOffs: {
        optionA: "Client-side Pagination",
        optionB: "Virtualization",
        decision: "Chose Virtualization. It kept the 'infinite' feel required by design but drastically reduced DOM footprint."
      },
      solution: "Reduced initial load time by 60% and achieved stable 60fps scrolling by implementing windowing logic and debouncing scroll event listeners.",
      outcome: "Success"
    },
    {
      id: 2,
      title: "Scalable Real-Time Notification System",
      problem: "The existing polling mechanism (every 2s) was overloading the server as user base grew to 50k concurrent users.",
      process: [
        "Analyzed server logs to quantify redundant requests (90% were empty).",
        "Researched WebSocket vs. Server-Sent Events (SSE).",
        "Prototyped a WebSocket microservice using Node.js/Socket.io."
      ],
      constraints: [
        "Limited budget for new infrastructure.",
        "Strict firewall rules in some client environments blocking non-standard ports."
      ],
      tradeOffs: {
        optionA: "WebSockets (Bi-directional)",
        optionB: "Server-Sent Events (Uni-directional)",
        decision: "Chose SSE. We only needed server-to-client updates. SSE is simpler, runs over standard HTTP, and handles firewalls better."
      },
      solution: "Migrated to SSE for live notifications. Implemented a Redis Pub/Sub layer to distribute events across server instances.",
      outcome: "Success"
    },
    {
      id: 3,
      title: "Legacy Monolith to Microservices Migration",
      problem: "A monolithic e-commerce platform handling $5M/month was becoming unmaintainable with frequent deployment failures.",
      process: [
        "Identified bounded contexts using Domain-Driven Design (DDD).",
        "Implemented Strangler Fig pattern to peel off services.",
        "Set up API Gateway for routing traffic.",
        "Used Dark Launches to test with mirrored traffic."
      ],
      constraints: [
        "Zero downtime allowed (financial impact).",
        "Limited DevOps resources."
      ],
      tradeOffs: {
        optionA: "Big Bang Rewrite",
        optionB: "Strangler Fig Pattern",
        decision: "Chosen Strangler Fig. Slower but minimized risk and allowed continuous delivery."
      },
      solution: "Extracted 'Order Management' module first. Implemented CDC to sync legacy DB with new microservices.",
      outcome: "Success"
    },
    {
      id: 4,
      title: "React Native Performance Optimization",
      problem: "Logistics app crashing on low-end Android devices (<2GB RAM) due to memory leaks and JS thread blocking.",
      process: [
        "Profiled using Flipper and Android Studio Profiler.",
        "Identified heavy bridge serialization in lists.",
        "Moved complex calculations to JSI native modules.",
        "Implemented aggressive image caching."
      ],
      constraints: [
        "Must run on low-end hardware.",
        "Offline-first architecture."
      ],
      tradeOffs: {
        optionA: "Pure JS Logic",
        optionB: "Native Modules (C++/JSI)",
        decision: "Hybrid. Critical map/list interactions moved to JSI/Native, business logic kept in JS."
      },
      solution: "Replaced FlatList with FlashList. Used MMKV for storage. Offloaded image processing to Rust-based native module.",
      outcome: "Success"
    }
  ]
};