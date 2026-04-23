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
    <div className="relative py-8 max-w-4xl mx-auto">
      {/* Ligne centrale (cachée sur mobile, centrée sur desktop) */}
      <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-farewell-gold/50 md:-translate-x-1/2" />

      <div className="space-y-12">
        {entries.map((item, index) => {
          const isEven = index % 2 === 0;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`relative flex items-center ${
                isEven ? 'md:flex-row-reverse' : 'md:flex-row'
              } flex-row`}
            >
              {/* Dot */}
              <div className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full bg-white border-4 border-farewell-gold shadow-sm transform -translate-x-1/2 z-10" />
              
              {/* Contenu (moitié de la largeur sur desktop) */}
              <div className={`ml-16 md:ml-0 md:w-1/2 ${isEven ? 'md:pl-12' : 'md:pr-12 md:text-right'}`}>
                <div className="flex flex-col gap-2 bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-farewell-stone/50 shadow-sm hover:shadow-md transition-shadow relative">
                  {/* Flèche pour la bulle (optionnel) */}
                  <div className={`hidden md:block absolute top-6 w-3 h-3 bg-white/60 border-t border-r border-farewell-stone/50 transform ${
                    isEven ? '-left-[6px] -rotate-[135deg]' : '-right-[6px] rotate-45'
                  }`} />
                  
                  <span className="text-xs uppercase tracking-[0.3em] text-farewell-gold font-bold">
                    {item.annee}
                  </span>
                  <h3 className="text-2xl font-serif text-farewell-charcoal leading-tight tracking-wide">
                    {item.titre}
                  </h3>
                  <div className={`h-[1px] w-8 bg-farewell-stone ${isEven ? '' : 'md:ml-auto'}`} />
                  <p className="text-stone-500 leading-relaxed font-light mt-1 text-base">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
