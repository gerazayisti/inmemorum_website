'use client';

import { useEffect, useState } from 'react';
import { Users, UserSquare2 } from 'lucide-react';
import { FarewellSeparator } from '@/components/FarewellSeparator';

export default function PublicArbre() {
  const [membres, setMembres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/arbre')
      .then(res => res.json())
      .then(data => {
        setMembres(data || []);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  // Helper pour regrouper l'arbre
  const patriarches = membres.filter(m => !m.parent_id && !m.conjoint_id);

  return (
    <div className="py-32 px-8 space-y-24 bg-farewell-cream min-h-screen">
      <header className="text-center space-y-6 max-w-2xl mx-auto">
        <div className="flex justify-center mb-4">
            <div className="p-1 bg-farewell-gold/20 rounded-full">
               <div className="p-4 bg-white rounded-full shadow-sm border border-farewell-stone">
                  <Users className="text-farewell-gold" size={32} strokeWidth={1.5} />
               </div>
            </div>
        </div>
        <h2 className="text-4xl md:text-5xl font-serif text-farewell-charcoal uppercase tracking-widest leading-tight">Arbre Généalogique</h2>
        <div className="w-12 h-[1px] bg-farewell-gold/40 mx-auto" />
        <p className="text-stone-500 font-serif italic text-lg leading-relaxed max-w-sm mx-auto">
          "Les racines d'une famille unie, l'héritage d'une lignée."
        </p>
      </header>

      <FarewellSeparator />

      <div className="max-w-5xl mx-auto pb-32">
        {loading ? (
          <div className="space-y-4 animate-pulse">
             <div className="h-24 w-64 bg-white rounded-2xl mx-auto" />
             <div className="flex justify-center gap-8">
               <div className="h-24 w-48 bg-white rounded-2xl" />
               <div className="h-24 w-48 bg-white rounded-2xl" />
             </div>
          </div>
        ) : membres.length > 0 ? (
          <div className="flex flex-col items-center space-y-12">
            {patriarches.map(patriarche => (
              <ArbreNode key={patriarche.id} membre={patriarche} allMembres={membres} />
            ))}
          </div>
        ) : (
          <div className="py-32 text-center bg-white/50 rounded-[3rem] border border-farewell-stone shadow-inner">
               <p className="text-stone-400 font-serif italic text-xl">L'arbre de la famille est en cours de modélisation.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Composant récursif pour afficher un membre, ses conjoints et ses descendants
function ArbreNode({ membre, allMembres }: { membre: any, allMembres: any[] }) {
  const conjoints = allMembres.filter(m => m.conjoint_id === membre.id);
  const enfants = allMembres.filter(m => m.parent_id === membre.id);

  return (
    <div className="flex flex-col items-center">
      {/* Le membre et ses conjoints sur la même ligne */}
      <div className="flex flex-wrap justify-center gap-6 relative z-10">
        <MembreCard membre={membre} isMain />
        {conjoints.map(c => (
          <div key={c.id} className="flex items-center gap-6">
            <div className="h-[2px] w-6 bg-farewell-gold/30" />
            <MembreCard membre={c} />
          </div>
        ))}
      </div>

      {/* Les enfants en dessous */}
      {enfants.length > 0 && (
        <div className="flex flex-col items-center mt-8 relative">
          <div className="w-[2px] h-8 bg-farewell-gold/30 absolute -top-8" />
          <div className="flex flex-wrap justify-center gap-8 pt-8 border-t-2 border-farewell-gold/30 relative">
            {enfants.map(enfant => (
              <div key={enfant.id} className="relative pt-4 flex flex-col items-center">
                <div className="w-[2px] h-4 bg-farewell-gold/30 absolute top-0" />
                <ArbreNode membre={enfant} allMembres={allMembres} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MembreCard({ membre, isMain = false }: { membre: any, isMain?: boolean }) {
  return (
    <div className={`flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border ${isMain ? 'border-farewell-gold/50' : 'border-stone-100'} w-64`}>
      {membre.photo_url ? (
        <img src={membre.photo_url} alt={membre.nom} className="w-14 h-14 rounded-full object-cover border-2 border-farewell-cream shrink-0" />
      ) : (
        <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center border-2 border-farewell-cream shrink-0">
          <UserSquare2 size={20} className="text-stone-300" />
        </div>
      )}
      <div className="overflow-hidden">
        <h4 className="font-bold text-farewell-charcoal text-sm truncate">{membre.prenoms}</h4>
        <h4 className="font-bold text-farewell-charcoal text-sm truncate">{membre.nom}</h4>
        <p className="text-[9px] uppercase text-farewell-gold tracking-widest mt-1 truncate">{membre.role}</p>
        <p className="text-[9px] text-stone-400 mt-0.5">
          {membre.date_naissance} {membre.date_deces ? `- ${membre.date_deces}` : ''}
        </p>
      </div>
    </div>
  );
}
