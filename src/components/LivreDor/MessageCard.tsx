'use client';

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Heart, Flame, Flower2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Message {
  id: string;
  auteur: string;
  contenu: string;
  created_at: string;
  reactions?: {
    coeur: number;
    bougie: number;
    fleur: number;
  };
}

interface MessageCardProps {
  message: Message;
  onReact?: (id: string, type: string) => void;
}

export function MessageCard({ message, onReact }: MessageCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 space-y-4"
    >
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-sawa-blue text-lg">{message.auteur}</h3>
        <span className="text-xs text-stone-400 font-light">
          {format(new Date(message.created_at), 'd MMMM yyyy', { locale: fr })}
        </span>
      </div>
      
      <p className="text-stone-600 leading-relaxed italic font-light">
        "{message.contenu}"
      </p>

      <div className="flex items-center gap-4 pt-2 border-t border-stone-50">
        <button 
          onClick={() => onReact?.(message.id, 'coeur')}
          className="flex items-center gap-1.5 text-stone-400 hover:text-red-400 transition group"
        >
          <Heart size={16} className="group-hover:fill-current" />
          <span className="text-xs">{message.reactions?.coeur || 0}</span>
        </button>
        <button 
          onClick={() => onReact?.(message.id, 'bougie')}
          className="flex items-center gap-1.5 text-stone-400 hover:text-orange-400 transition group"
        >
          <Flame size={16} className="group-hover:fill-current" />
          <span className="text-xs">{message.reactions?.bougie || 0}</span>
        </button>
        <button 
          onClick={() => onReact?.(message.id, 'fleur')}
          className="flex items-center gap-1.5 text-stone-400 hover:text-pink-400 transition group"
        >
          <Flower2 size={16} className="group-hover:fill-current" />
          <span className="text-xs">{message.reactions?.fleur || 0}</span>
        </button>
      </div>
    </motion.div>
  );
}
