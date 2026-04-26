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
  photo_url?: string;
}

interface CommemorationsListeProps {
  items: Commemoration[];
  viewMode?: 'cards' | 'table';
}

export function CommemorationsListe({ items, viewMode = 'cards' }: CommemorationsListeProps) {
  if (!Array.isArray(items)) {
    return (
      <div className="py-20 text-center text-stone-400 font-serif italic">
        Chargement des dates...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-32 text-center bg-white/50 rounded-[3rem] border border-gris-noble shadow-inner">
        <p className="text-stone-400 font-serif italic text-lg">
          Aucun événement de commémoration n'est prévu pour le moment.
        </p>
      </div>
    );
  }

  if (viewMode === 'table') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gris-noble"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-ivoire-chaud border-b border-gris-noble text-[10px] uppercase tracking-widest text-stone-400">
                <th className="p-6 font-bold whitespace-nowrap">Date</th>
                <th className="p-6 font-bold">Événement</th>
                <th className="p-6 font-bold">Détails</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const dateObj = new Date(item.date);
                const yearsAlready = differenceInYears(new Date(), dateObj);
                return (
                  <tr key={item.id} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
                    <td className="p-6 whitespace-nowrap align-top">
                      <div className="flex items-center gap-4">
                        {item.photo_url && (
                          <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                            <img src={item.photo_url} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex flex-col gap-1 text-or-noble font-bold text-[10px] uppercase tracking-[0.2em]">
                          <span>{format(dateObj, 'd MMMM', { locale: fr })}</span>
                          <span className="text-stone-400 text-[9px]">{yearsAlready} ans déjà</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 align-top">
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-noir-encre text-lg leading-tight">{item.titre}</span>
                        {item.recurrent && (
                          <span className="text-[9px] uppercase bg-stone-100 px-2 py-0.5 rounded-full text-stone-500 font-bold tracking-tighter shrink-0">
                            Annuel
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-6 text-stone-500 text-sm font-light leading-relaxed align-top">
                      {item.description || <span className="text-stone-300 italic">Aucun détail</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
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
          className="bg-white p-8 rounded-[2rem] shadow-sm border border-gris-noble flex gap-6 items-start group hover:border-or-noble/40 hover:shadow-md transition-all duration-500"
          >
            {item.photo_url ? (
              <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-gris-noble shadow-sm group-hover:scale-105 transition-transform duration-500">
                <img src={item.photo_url} alt={item.titre} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="p-4 bg-ivoire-chaud rounded-2xl group-hover:bg-or-noble/10 transition-colors shrink-0">
                <Calendar className="text-or-noble" size={24} strokeWidth={1.5} />
              </div>
            )}
            
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-serif text-noir-encre leading-tight tracking-wide group-hover:text-or-noble transition-colors">
                  {item.titre}
                </h3>
                {item.recurrent && (
                  <span className="text-[10px] uppercase bg-stone-100 px-2 py-1 rounded-full text-stone-500 font-bold tracking-tighter">
                    Annuel
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-or-noble font-bold text-[10px] uppercase tracking-[0.3em]">
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
    </div>
  );
}
