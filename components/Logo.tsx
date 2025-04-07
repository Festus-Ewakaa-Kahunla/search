import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  animate?: boolean;
}

export function Logo({ className, animate = false }: LogoProps) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width="52"
      height="52"
      viewBox="0 0 24 24"
      fill="none"
      className={cn("w-[52px] h-[52px]", className)}
      initial={animate ? { rotate: 0 } : undefined}
      animate={animate ? { rotate: 360 } : undefined}
      transition={animate ? {
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      } : undefined}
    >
      <motion.g
        initial={!animate ? { scale: 0.8, opacity: 0 } : undefined}
        animate={!animate ? { scale: 1, opacity: 1 } : undefined}
        transition={!animate ? {
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1]
        } : undefined}
      >
        {/* Magnifying glass circle */}
        <motion.circle 
          cx="11" 
          cy="11" 
          r="8" 
          strokeWidth="2" 
          stroke="url(#paint0_linear_search)" 
          fill="none"
        />
        {/* Magnifying glass handle */}
        <motion.line 
          x1="17" 
          y1="17" 
          x2="21" 
          y2="21" 
          strokeWidth="2.5" 
          stroke="url(#paint0_linear_search)" 
          strokeLinecap="round" 
        />
      </motion.g>
      <defs>
        <motion.linearGradient
          id="paint0_linear_search"
          gradientUnits="userSpaceOnUse"
          x1="2"
          y1="22"
          x2="22"
          y2="2"
        >
          <stop stopColor="#14B850" />
          <stop offset="0.524208" stopColor="#2BD975" />
          <stop offset="1" stopColor="#14B850" />
        </motion.linearGradient>
      </defs>
    </motion.svg>
  );
}