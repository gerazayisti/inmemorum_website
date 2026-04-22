'use client';

import { useEffect, useState } from 'react';
import { Crown } from 'lucide-react';
import { FarewellSeparator } from '@/components/FarewellSeparator';

interface Personne {
  id: number;
  nom: string;
  lien_parente: string;
  date_naissance: string;
  date_deces: string;
  description: string;
  photo_url: string;
  is_principal: boolean;
  ordre: number;
}

// Tailles variées pour l'effet masonry
const GRID_SIZES = [
  'col-span-1 row-span-1',
  'col-span-1 row-span-2',
  'col-span-2 row-span-1',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
  'col-span-2 row-span-2',
  'col-span-1 row-span-1',
  'col-span-1 row-span-2',
];

export default function PublicPersonnesCelebrees() {
  const [personnes, setPersonnes] = useState<Personne[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/personnes')
      .then(r => r.json())
      .then(data => setPersonnes(data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-farewell-cream flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-farewell-gold/30 border-t-farewell-gold rounded-full animate-spin" />
      </div>
    );
  }

  const principal = personnes.find(p => p.is_principal);
  const autres = personnes.filter(p => !p.is_principal);

  return (
    <div className="bg-farewell-cream min-h-screen">

      {/* Hero — Personne Icône */}
      {principal ? (
        <section className="relative h-[80vh] md:h-[90vh] overflow-hidden">
          {/* Photo de fond */}
          {principal.photo_url && (
            <img
              src={principal.photo_url}
              alt={principal.nom}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          {/* Gradient sombre */}
          <div className="absolute inset-0 bg-gradient-to-t from-farewell-charcoal via-farewell-charcoal/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-farewell-charcoal/60 to-transparent" />

          {/* Texte en bas à gauche */}
          <div className="absolute bottom-16 md:bottom-24 left-8 md:left-16 z-10 max-w-xl space-y-5">
            {principal.lien_parente && (
              <p className="text-farewell-gold/80 text-sm font-serif italic flex items-center gap-2">
                <Crown size={18} /> {principal.lien_parente}
              </p>
            )}
            <h1 className="text-5xl md:text-7xl font-serif text-white leading-none tracking-wide">
              {principal.nom}
            </h1>
            <p className="text-white/50 text-lg font-serif">
              {principal.date_naissance}{principal.date_deces && ` — ${principal.date_deces}`}
            </p>
            {principal.description && (
              <p className="text-white/60 text-base leading-relaxed font-light max-w-md">
                {principal.description}
              </p>
            )}
          </div>
        </section>
      ) : (
        <section className="py-40 text-center bg-farewell-cream">
          <div className="space-y-4">
            <h1 className="text-5xl font-serif text-farewell-charcoal">Personnes Célébrées</h1>
            <p className="text-stone-400 font-serif italic text-lg">
              La personne principale sera bientôt mise en avant.
            </p>
          </div>
        </section>
      )}

      <FarewellSeparator />

      {/* Galerie masonry — Autres personnes */}
      {autres.length > 0 && (
        <section className="py-24 px-6 md:px-16">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center space-y-3">
              <p className="text-farewell-gold/70 text-sm font-serif italic">Ceux qui vivent dans nos cœurs</p>
              <h2 className="text-4xl md:text-5xl font-serif text-farewell-charcoal">En leur mémoire</h2>
            </div>

            {/* Grille masonry avec tailles variées */}
            <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] md:auto-rows-[250px] gap-4">
              {autres.map((p, i) => (
                <div
                  key={p.id}
                  className={`${GRID_SIZES[i % GRID_SIZES.length]} relative rounded-2xl overflow-hidden group cursor-pointer`}
                >
                  {/* Photo de fond */}
                  {p.photo_url ? (
                    <img
                      src={p.photo_url}
                      alt={p.nom}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-farewell-charcoal/10 flex items-center justify-center">
                      <span className="text-6xl font-serif text-farewell-charcoal/20">{p.nom[0]}</span>
                    </div>
                  )}

                  {/* Overlay au hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-farewell-charcoal via-farewell-charcoal/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

                  {/* Infos */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 space-y-1 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    {p.lien_parente && (
                      <p className="text-farewell-gold/70 text-[9px] uppercase tracking-[0.3em] font-bold">{p.lien_parente}</p>
                    )}
                    <h3 className="text-xl md:text-2xl font-serif text-white leading-tight">{p.nom}</h3>
                    <p className="text-white/40 text-xs font-light">
                      {p.date_naissance}{p.date_deces && ` — ${p.date_deces}`}
                    </p>
                    {p.description && (
                      <p className="text-white/50 text-sm font-light leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 pt-2 line-clamp-3">
                        {p.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {personnes.length === 0 && (
        <section className="py-40 text-center">
          <p className="text-stone-400 font-serif italic text-xl">Aucune personne célébrée pour le moment.</p>
        </section>
      )}
    </div>
  );
}
