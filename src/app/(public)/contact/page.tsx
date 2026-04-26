'use client';

import { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, UserSquare2 } from 'lucide-react';
import { FarewellSeparator } from '@/components/FarewellSeparator';

export default function PublicContact() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
    fetch('/api/contacts')
      .then(res => res.json())
      .then(data => {
        setContacts(data || []);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data?.show_contact === false) {
        window.location.href = '/accueil';
      }
    } catch (e) {}
  };

  return (
    <div className="py-32 px-8 space-y-24 bg-ivoire-chaud min-h-screen">
      <header className="text-center space-y-6 max-w-2xl mx-auto">
        <div className="flex justify-center mb-4">
            <div className="p-1 bg-or-noble/20 rounded-full">
               <div className="p-4 bg-white rounded-full shadow-sm border border-gris-noble">
                  <Mail className="text-or-noble" size={32} strokeWidth={1.5} />
               </div>
            </div>
        </div>
        <h2 className="text-4xl md:text-5xl font-cinzel text-noir-encre uppercase tracking-widest leading-tight">Famille & Contact</h2>
        <div className="w-12 h-[1px] bg-farewell-gold/40 mx-auto" />
        <p className="text-stone-500 font-cinzel italic text-lg leading-relaxed max-w-sm mx-auto">
          "Pour toute information, vous pouvez contacter les représentants de la famille."
        </p>
      </header>

      <FarewellSeparator />

      <div className="max-w-5xl mx-auto pb-32">
        {loading ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
              {[1, 2, 3].map(i => <div key={i} className="h-48 bg-white rounded-3xl" />)}
           </div>
        ) : contacts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {contacts.map(c => (
              <div key={c.id} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gris-noble flex flex-col items-center text-center group hover:shadow-md transition">
                 {c.photo_url ? (
                    <img src={c.photo_url} alt={c.nom} className="w-24 h-24 rounded-full object-cover border-4 border-farewell-cream shadow-sm mb-4" />
                 ) : (
                    <div className="w-24 h-24 rounded-full bg-stone-100 flex items-center justify-center border-4 border-farewell-cream shadow-sm mb-4">
                       <UserSquare2 size={32} className="text-stone-300" />
                    </div>
                 )}
                 <h3 className="text-xl font-cinzel text-noir-encre mb-1">{c.nom}</h3>
                 <p className="text-[10px] uppercase tracking-widest font-bold text-or-noble mb-6">{c.role}</p>
                 
                 <div className="space-y-3 w-full text-sm font-light text-stone-500">
                    {c.telephone && (
                       <a href={`tel:${c.telephone}`} className="flex items-center justify-center gap-3 hover:text-noir-encre transition">
                         <Phone size={16} className="text-stone-300" /> {c.telephone}
                       </a>
                    )}
                    {c.email && (
                       <a href={`mailto:${c.email}`} className="flex items-center justify-center gap-3 hover:text-noir-encre transition">
                         <Mail size={16} className="text-stone-300" /> {c.email}
                       </a>
                    )}
                    {c.adresse && (
                       <div className="flex items-start justify-center gap-3 pt-2">
                         <MapPin size={16} className="text-stone-300 shrink-0 mt-0.5" /> 
                         <span className="max-w-[200px] text-left">{c.adresse}</span>
                       </div>
                    )}
                 </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center bg-white/50 rounded-[3rem] border border-gris-noble shadow-inner">
               <p className="text-stone-400 font-cinzel italic text-xl">Aucun contact n'a été renseigné pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
