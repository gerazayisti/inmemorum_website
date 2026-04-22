'use client';

import { motion } from 'framer-motion';

export function FarewellSeparator() {
  return (
    <div className="flex items-center justify-center py-12 gap-6 opacity-60">
      <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-farewell-gold/50" />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="text-farewell-gold"
      >
        <svg width="40" height="20" viewBox="0 0 40 20" fill="currentColor">
          <path d="M20,10 C15,0 0,0 0,10 C0,20 15,20 20,10 Z M20,10 C25,0 40,0 40,10 C40,20 25,20 20,10 Z" opacity="0.3" />
          <path d="M18,10 C14,4 4,4 4,10 C4,16 14,16 18,10 Z M22,10 C26,4 36,4 36,10 C36,16 26,16 22,10 Z" />
        </svg>
      </motion.div>
      <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-farewell-gold/50" />
    </div>
  );
}
