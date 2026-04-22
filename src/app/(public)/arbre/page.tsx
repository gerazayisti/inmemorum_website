import { Users } from 'lucide-react';
import { FarewellSeparator } from '@/components/FarewellSeparator';

export default function PublicArbre() {
  return (
    <div className="py-32 px-8 space-y-24 bg-farewell-cream min-h-screen flex flex-col justify-center items-center">
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

      <div className="max-w-2xl mx-auto pb-32 w-full">
        <div className="py-32 text-center bg-white/50 rounded-[3rem] border border-farewell-stone shadow-inner">
             <p className="text-stone-400 font-serif italic text-xl">L'arbre de la famille est en cours de modélisation.</p>
        </div>
      </div>
    </div>
  );
}
