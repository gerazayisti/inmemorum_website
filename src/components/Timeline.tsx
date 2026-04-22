'use client';

import { motion } from 'framer-motion';

interface TimelineEntry {
  id: string;
  annee: string;
  titre: string;
  description: string;
}

interface TimelineProps {
  entries: TimelineEntry[];
}

export function Timeline({ entries }: TimelineProps) {
  return (
    <div className="relative border-l border-farewell-stone ml-4 py-8 space-y-16">
      {entries.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: index * 0.1 }}
          className="relative pl-10"
        >
          {/* Dot */}
          <div className="absolute -left-[7px] top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-farewell-gold shadow-sm" />
          
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-[0.3em] text-farewell-gold font-bold">
              {item.annee}
            </span>
            <h3 className="text-2xl font-serif text-farewell-charcoal leading-tight tracking-wide">
              {item.titre}
            </h3>
            <div className="h-[1px] w-8 bg-farewell-stone" />
            <p className="text-stone-500 leading-relaxed font-light mt-1 text-lg">
              {item.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
