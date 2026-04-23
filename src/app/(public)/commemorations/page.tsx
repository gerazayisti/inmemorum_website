'use client';

import { useEffect, useState } from 'react';
import { CalendarDays, LayoutList, Table } from 'lucide-react';
import { CommemorationsListe } from '@/components/CommemorationsListe';
import { FarewellSeparator } from '@/components/FarewellSeparator';

export default function PublicCommemorations() {
  const [commemorations, setCommemorations] = useState<any[]>([]);
  const [hommage, setHommage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');

  useEffect(() => {
    Promise.all([
      fetch('/api/commemorations').then(res => res.json()),
      fetch('/api/hommage').then(res => res.json())
    ]).then(([commData, hommageData]) => {
      setCommemorations(commData || []);
      setHommage(hommageData || null);
      setLoading(false);
    }).catch(console.error);
  }, []);

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

      {/* Main Content (30% Image / 70% Agenda) */}
      <div className="max-w-7xl mx-auto pb-32">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Left: 30% Image */}
          <div className="w-full lg:w-[30%] shrink-0 sticky top-8">
            {loading ? (
               <div className="w-full aspect-[3/4] bg-stone-100 rounded-[2rem] animate-pulse border-4 border-white shadow-xl" />
            ) : hommage?.portrait_url ? (
               <div className="relative w-full aspect-[3/4] rounded-[2rem] overflow-hidden shadow-xl border-4 border-white">
                  <img 
                    src={hommage.portrait_url} 
                    alt="Portrait"
                    className="w-full h-full object-cover"
                  />
                  {/* Subtle overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
               </div>
            ) : (
               <div className="w-full aspect-[3/4] bg-white rounded-[2rem] border-2 border-dashed border-stone-200 flex items-center justify-center">
                 <CalendarDays className="text-stone-300" size={48} />
               </div>
            )}
          </div>

          {/* Right: 70% Agenda Content */}
          <div className="w-full lg:w-[70%]">
             <div className="flex justify-end mb-6">
                <div className="bg-white p-1 rounded-xl shadow-sm border border-stone-100 flex items-center gap-1">
                   <button 
                     onClick={() => setViewMode('table')}
                     className={`p-2 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${viewMode === 'table' ? 'bg-farewell-cream text-farewell-gold' : 'text-stone-400 hover:text-stone-600'}`}
                   >
                      <Table size={16} /> Table
                   </button>
                   <button 
                     onClick={() => setViewMode('cards')}
                     className={`p-2 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${viewMode === 'cards' ? 'bg-farewell-cream text-farewell-gold' : 'text-stone-400 hover:text-stone-600'}`}
                   >
                      <LayoutList size={16} /> Liste
                   </button>
                </div>
             </div>

             {loading ? (
               <div className="space-y-6 animate-pulse">
                 <div className="h-32 w-full bg-white rounded-[2rem] border border-farewell-stone" />
                 <div className="h-32 w-full bg-white rounded-[2rem] border border-farewell-stone" />
               </div>
             ) : (
               <CommemorationsListe items={commemorations} viewMode={viewMode} />
             )}
          </div>

        </div>
      </div>

      <FarewellSeparator />
    </div>
  );
}
