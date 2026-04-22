'use client';

import { useEffect, useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { CommemorationsListe } from '@/components/CommemorationsListe';
import { FarewellSeparator } from '@/components/FarewellSeparator';

export default function PublicCommemorations() {
  const [commemorations, setCommemorations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommemorations();
  }, []);

  const fetchCommemorations = async () => {
    try {
      const res = await fetch('/api/commemorations');
      const data = await res.json();
      setCommemorations(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des commémorations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20 px-8 space-y-24 bg-farewell-cream min-h-screen pb-40">
      {/* Header */}
      <header className="text-center space-y-6 max-w-2xl mx-auto">
        <div className="flex justify-center mb-4">
            <div className="p-1 bg-farewell-gold/20 rounded-full">
               <div className="p-4 bg-white rounded-full shadow-sm border border-farewell-stone">
                  <CalendarDays className="text-farewell-gold" size={32} strokeWidth={1.5} />
               </div>
            </div>
        </div>
        <h2 className="text-4xl md:text-5xl font-serif text-farewell-charcoal uppercase tracking-widest leading-tight">Agenda Familial</h2>
        <div className="w-12 h-[1px] bg-farewell-gold/40 mx-auto" />
        <p className="text-stone-500 font-serif italic text-lg leading-relaxed max-w-sm mx-auto">
          "Les dates qui nous réunissent pour honorer une présence qui ne s'efface jamais."
        </p>
      </header>

      <FarewellSeparator />

      {/* Main List */}
      <div className="max-w-2xl mx-auto pb-32">
        {loading ? (
          <div className="space-y-6 animate-pulse">
            <div className="h-32 w-full bg-white rounded-[2rem] border border-farewell-stone" />
            <div className="h-32 w-full bg-white rounded-[2rem] border border-farewell-stone" />
          </div>
        ) : (
          <CommemorationsListe items={commemorations} />
        )}
      </div>

      <FarewellSeparator />
    </div>
  );
}
