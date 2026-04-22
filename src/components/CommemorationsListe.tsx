'use client';

import { format, differenceInYears } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

interface Commemoration {
  id: string;
  titre: string;
  date: string;
  description?: string;
  recurrent: boolean;
}

interface CommemorationsListeProps {
  items: Commemoration[];
}

export function CommemorationsListe({ items }: CommemorationsListeProps) {
  if (!Array.isArray(items)) {
    return (
      <div className="py-20 text-center text-stone-400 font-serif italic">
        Chargement des dates...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {items.map((item, index) => {
        const dateObj = new Date(item.date);
        const yearsAlready = differenceInYears(new Date(), dateObj);
        
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          className="bg-white p-8 rounded-[2rem] shadow-sm border border-farewell-stone flex gap-6 items-start group hover:border-farewell-gold/40 hover:shadow-md transition-all duration-500"
          >
            <div className="p-4 bg-farewell-cream rounded-2xl group-hover:bg-farewell-gold/10 transition-colors shrink-0">
              <Calendar className="text-farewell-gold" size={24} strokeWidth={1.5} />
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-serif text-farewell-charcoal leading-tight tracking-wide group-hover:text-farewell-gold transition-colors">
                  {item.titre}
                </h3>
                {item.recurrent && (
                  <span className="text-[10px] uppercase bg-stone-100 px-2 py-1 rounded-full text-stone-500 font-bold tracking-tighter">
                    Annuel
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-farewell-gold font-bold text-[10px] uppercase tracking-[0.3em]">
                <span>{format(dateObj, 'd MMMM', { locale: fr })}</span>
                <span>•</span>
                <span>{yearsAlready} ans déjà</span>
              </div>
              
              {item.description && (
                <p className="text-stone-500 font-light text-sm leading-relaxed pt-2">
                  {item.description}
                </p>
              )}
            </div>
          </motion.div>
        );
      })}

      {items.length === 0 && (
        <div className="py-32 text-center bg-white/50 rounded-[3rem] border border-farewell-stone shadow-inner">
          <p className="text-stone-400 font-serif italic text-lg">
            Aucun événement de commémoration n'est prévu pour le moment.
          </p>
        </div>
      )}
    </div>
  );
}
