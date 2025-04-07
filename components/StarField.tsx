'use client';

import { motion } from 'framer-motion';

export const StarField = () => {
  const starCount = 30;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(starCount)].map((_, i) => {
        const size = Math.random() * 2 + 1;
        const animDuration = Math.random() * 15 + 10;
        const delay = Math.random() * 20;
        
        return (
          <motion.div 
            key={i}
            className="absolute bg-primary/30 rounded-full z-0"
            style={{
              width: size + 'px',
              height: size + 'px',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: animDuration,
              delay: delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        );
      })}
    </div>
  );
};
