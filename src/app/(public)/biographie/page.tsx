import { createClient } from '@supabase/supabase-js';
import { Timeline } from '@/components/Timeline';
import { BookOpen } from 'lucide-react';
import { FarewellSeparator } from '@/components/FarewellSeparator';

export const dynamic = 'force-dynamic';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getSettings() {
  const { data } = await supabaseAdmin.from('settings').select('*').single();
  return data;
}

async function getBiographie() {
  const { data } = await supabaseAdmin
    .from('biographie')
    .select('*')
    .order('annee', { ascending: true });
  return data || [];
}

export default async function PublicBiographie() {
  const [bioEntries, settings] = await Promise.all([getBiographie(), getSettings()]);

  if (settings?.show_biographie === false) {
    const { redirect } = await import('next/navigation');
    redirect('/accueil');
  }

  return (
    <div className="py-20 px-8 space-y-24 bg-farewell-cream min-h-screen">
      {/* Header */}
      <header className="text-center space-y-6 max-w-2xl mx-auto">
        <div className="flex justify-center mb-4">
            <div className="p-1 bg-farewell-gold/20 rounded-full">
               <div className="p-4 bg-white rounded-full shadow-sm border border-farewell-stone">
                  <BookOpen className="text-farewell-gold" size={32} strokeWidth={1.5} />
               </div>
            </div>
        </div>
        <h2 className="text-4xl md:text-5xl font-serif text-farewell-charcoal uppercase tracking-widest leading-tight">Son Parcours de Vie</h2>
        <div className="w-12 h-[1px] bg-farewell-gold/40 mx-auto" />
        <p className="text-stone-500 font-serif italic text-lg leading-relaxed max-w-sm mx-auto">
          "Le récit d'une existence qui continue d'inspirer par ses actes et ses valeurs."
        </p>
      </header>

      <FarewellSeparator />

      {/* Timeline Section */}
      <div className="max-w-2xl mx-auto pb-32">
        <Timeline entries={bioEntries} />
        
        {bioEntries.length === 0 && (
          <div className="py-32 text-center bg-white/50 rounded-[3rem] border border-farewell-stone shadow-inner">
             <p className="text-stone-400 font-serif italic text-xl">Le récit de vie est en cours de rédaction par la famille.</p>
          </div>
        )}
      </div>

      <FarewellSeparator />
    </div>
  );
}
