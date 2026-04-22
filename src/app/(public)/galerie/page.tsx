import { useEffect, useState } from 'react';
import { Camera } from 'lucide-react';
import { GalerieGrid } from '@/components/Galerie/GalerieGrid';
import { FarewellSeparator } from '@/components/FarewellSeparator';

export default function PublicGalerie() {
  const [medias, setMedias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedias();
  }, []);

  const fetchMedias = async () => {
    try {
      const res = await fetch('/api/galerie');
      const data = await res.json();
      setMedias(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des médias:', error);
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
                  <Camera className="text-farewell-gold" size={32} strokeWidth={1.5} />
               </div>
            </div>
        </div>
        <h2 className="text-4xl md:text-5xl font-serif text-farewell-charcoal uppercase tracking-widest leading-tight">Souvenirs Précieux</h2>
        <div className="w-12 h-[1px] bg-farewell-gold/40 mx-auto" />
        <p className="text-stone-500 font-serif italic text-lg leading-relaxed max-w-sm mx-auto">
          "Chaque image raconte une histoire, chaque sourire un moment d'éternité figé dans le temps."
        </p>
      </header>

      <FarewellSeparator />

      {/* Galerie Section */}
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-white rounded-2xl border border-farewell-stone" />
            ))}
          </div>
        ) : (
          <GalerieGrid medias={medias} />
        )}
        
        {!loading && medias.length === 0 && (
          <div className="py-32 text-center bg-white/50 rounded-[3rem] border border-farewell-stone shadow-inner">
             <p className="text-stone-400 font-serif italic text-xl">La galerie est en cours de constitution par la famille.</p>
          </div>
        )}
      </div>

      <FarewellSeparator />
    </div>
  );
}
