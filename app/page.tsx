'use client';

// app/page.tsx - matches search-main/client/src/pages/Home.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Star } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { motion } from 'framer-motion';
import { SettingsDialog } from '@/components/SettingsDialog';
import dynamic from 'next/dynamic';

// Import StarField with dynamic to prevent hydration errors
const StarField = dynamic(() => import('@/components/StarField').then(mod => ({ default: mod.StarField })), {
  ssr: false // This ensures the component only renders on the client
});

export default function Home() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  // StarField component is dynamically imported and will only render on the client side

  // Animated gradient effect for the border
  const GradientBorder = () => {
    return (
      <div className="absolute -inset-[1px] rounded-md bg-gradient-to-r from-primary/30 via-primary to-primary/30 opacity-70 blur-sm group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background overflow-hidden relative">
      <SettingsDialog />
      <StarField />
      
      {/* Main content container with a subtle glow */}
      <div className="relative w-full max-w-3xl px-6 py-12 z-10 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16 flex flex-col items-center"
        >
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, ease: "linear", repeat: Infinity }}
            className="relative mb-8 p-4"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-full blur-xl"></div>
            <Logo className="w-20 h-20 text-primary filter brightness-125 relative z-10" animate={true} />
          </motion.div>
          
          <motion.h1 
            className="text-3xl lg:text-5xl font-bold text-center text-white tracking-tight mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            What do you want to know?
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex items-center gap-2 mb-2"
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/50"></div>
            <Star className="h-4 w-4 text-primary/80" fill="currentColor" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/50"></div>
          </motion.div>
          
          <motion.p 
            className="text-base text-white/80 text-center max-w-lg font-inter tracking-wide italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            "Ask, and it will be given to you; <span className="text-primary font-bold not-italic">SEARCH</span>, and you will find"
            <span className="block text-sm text-primary/70 mt-1 font-normal">Matthew 7:7</span>
          </motion.p>
        </motion.div>
      </div>
      
      {/* Search input at the bottom */}
      <div className="w-full px-4 py-8 bg-gradient-to-t from-background via-background/95 to-transparent sticky bottom-0 left-0 right-0 z-20">
        <motion.form 
          onSubmit={handleSearch} 
          className="w-full max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <div className="relative group">
            <GradientBorder />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything..."
              className="w-full pl-6 pr-14 py-5 text-lg rounded-md border-0
                        bg-card/90 backdrop-blur-md
                        focus:outline-none relative z-10
                        shadow-[0_0_30px_rgba(20,184,80,0.15)]
                        group-hover:shadow-[0_0_40px_rgba(20,184,80,0.25)]
                        text-white transition-all duration-300"
              autoFocus
            />
            <div className="absolute right-0 top-0 bottom-0 w-16 flex items-center justify-center rounded-r-md z-10">
              <button 
                type="submit"
                disabled={!query.trim()}
                className="p-3 rounded-full bg-primary/10 hover:bg-primary/30 transition-all duration-300 
                          hover:scale-110 active:scale-95 disabled:opacity-40 disabled:hover:scale-100
                          disabled:hover:bg-transparent"
              >
                <Search className="w-5 h-5 text-primary" />
              </button>
            </div>
          </div>
        </motion.form>
        
        {/* Copyright notice */}
        <div className="mt-6 text-center opacity-50 text-xs">
          <p>&copy; 2025 All Rights Reserved. Festus Kahunla</p>
        </div>
      </div>
    </div>
  );
}
