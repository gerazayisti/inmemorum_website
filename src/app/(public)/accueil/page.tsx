import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import { FarewellSeparator } from '@/components/FarewellSeparator';
import { Crown, Heart, Star, Users, Leaf, Trees } from 'lucide-react';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getHommage() {
  const { data: hommage } = await supabaseAdmin.from('hommage').select('*').single();
  
  if (hommage?.portrait_url && !hommage.portrait_url.startsWith('http')) {
     const { data } = await supabaseAdmin.storage
       .from('galerie-memorial')
       .createSignedUrl(hommage.portrait_url, 3600);
     
     if (data?.signedUrl) {
       hommage.portrait_url = data.signedUrl;
     } else {
       hommage.portrait_url = '';
     }
  }
  
  return hommage;
}

async function getSettings() {
  const { data } = await supabaseAdmin.from('settings').select('*').single();
  return data;
}

export default async function PublicAccueil() {
  const [data, settings] = await Promise.all([getHommage(), getSettings()]);

  if (!data) return <div className="p-20 text-center font-serif text-farewell-charcoal">Chargement...</div>;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section - Layout Farewell Exact */}
      <section className="relative w-full overflow-hidden flex flex-col justify-end min-h-[100svh]">
        
        {/* Image de fond */}
        <div className="absolute inset-0 z-0">
          {data.portrait_url ? (
            <Image 
              src={data.portrait_url} 
              alt={data.nom} 
              fill 
              className="object-cover object-center brightness-[0.7]"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-farewell-charcoal" />
          )}
        </div>

        {/* Gradient sombre vers la gauche (comme Farewell) */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        {/* Gradient sombre vers le bas pour les cartes */}
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Contenu texte — aligné en bas à gauche */}
        <div className="relative z-10 px-8 md:px-16 max-w-3xl space-y-4 md:space-y-6 pt-32 pb-12 md:pb-24 mt-auto">
          <p className="text-[10px] md:text-xs uppercase tracking-[0.5em] text-white/60 font-bold italic">
            En Mémoire — {data.date_naissance || '????'} — {data.date_deces || '????'}
          </p>

          {/* Titre style "Farewell" : une partie normale, une partie italique */}
          <h1 className="font-serif text-white leading-none">
            <span className="block text-3xl md:text-6xl lg:text-7xl font-light tracking-wide">En Hommage à</span>
            <span className="block text-5xl md:text-7xl lg:text-8xl italic text-farewell-gold py-1">
              {data.nom?.split(' ')[0] || ''}
            </span>
            {data.nom?.split(' ').slice(1).join(' ') && (
              <span className="block text-3xl md:text-6xl lg:text-7xl font-light tracking-wide">
                {data.nom.split(' ').slice(1).join(' ')}
              </span>
            )}
          </h1>

          {/* Paragraphe intro */}
          {data.introduction && (
            <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-xl font-light">
              <span className="text-2xl font-serif text-farewell-gold float-left mr-2 leading-none">
                {data.introduction.charAt(0)}
              </span>
              {data.introduction.substring(1, 200)}
              {data.introduction.length > 200 ? '…' : ''}
            </p>
          )}
        </div>
                  {/* 3 cartes flottantes en bas — style Farewell */}
        <div className="relative z-20 grid grid-cols-1 md:grid-cols-3 w-full border-t border-farewell-gold/20 md:border-none">
          {[
            settings?.show_biographie !== false && { href: '/biographie', label: 'Biographie', sub: 'Ligne de vie', desc: 'Le récit d\'un parcours exceptionnel, ses étapes et ses valeurs.' },
            settings?.show_galerie !== false && { href: '/galerie', label: 'Photos', sub: 'Galerie', desc: 'Instants capturés, sourires et images d\'une vie bien vécue.' },
            settings?.show_livredor !== false
              ? { href: '/livre-dor', label: "Livre d'or", sub: "Témoignages", desc: 'Partagez un message ou lisez des mots de réconfort.' }
              : settings?.show_commemorations !== false && { href: '/commemorations', label: 'Dates', sub: 'Agenda', desc: 'Les commémorations et dates importantes à retenir.' },
          ].filter(Boolean).slice(0, 3).map((card: any, i) => (
            <a
              key={card.href}
              href={card.href}
              className="group relative flex flex-col justify-between p-8 md:p-10 bg-farewell-wood/85 md:bg-farewell-wood/60 backdrop-blur-md md:backdrop-blur-sm border-b md:border-b-0 border-white/5 hover:bg-farewell-gold/20 transition-all duration-500 overflow-hidden"
              style={{ borderLeft: i > 0 ? '1px solid rgba(166,139,91,0.15)' : 'none' }}
            >
              {/* Icône en filigrane */}
              <div className="absolute top-4 right-4 opacity-10 text-farewell-gold hidden md:block">
                <svg width="48" height="60" viewBox="0 0 48 60" fill="none" stroke="currentColor" strokeWidth="1">
                  <line x1="24" y1="0" x2="24" y2="60" />
                  <line x1="12" y1="20" x2="36" y2="20" />
                </svg>
              </div>

              <div className="space-y-2 md:space-y-4">
                <p className="text-[9px] uppercase tracking-[0.4em] text-farewell-gold/70 font-bold italic">{card.label}</p>
                <h3 className="text-xl md:text-3xl font-serif text-white leading-tight group-hover:text-farewell-gold transition-colors duration-300">
                  {card.sub}
                </h3>
              </div>

              <div className="mt-4 md:mt-8 space-y-4">
                <p className="text-white/50 text-xs md:text-sm font-light leading-relaxed">
                  {card.desc}
                </p>
                <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-farewell-gold group-hover:gap-4 transition-all">
                  Découvrir <span>→</span>
                </span>
              </div>
            </a>
          ))}
        </div>

      </section>


      {/* Section "Faire-Part & Programme" — Design Farewell */}
      <section className="bg-white py-32 px-10 md:px-20">
        <div className="max-w-7xl mx-auto space-y-20">
          
          {/* Header de la section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="space-y-5 max-w-xl">
              <p className="text-farewell-gold/80 text-sm font-serif italic">Accompagner avec bienveillance et compréhension</p>
              <h2 className="text-4xl md:text-5xl font-serif text-farewell-charcoal leading-tight">
                Honorer la mémoire avec<br />dignité et compassion
              </h2>
            </div>
            
            {/* Petit séparateur visuel à droite (ailes ou ornement) */}
            <div className="hidden md:flex flex-1 items-center justify-center opacity-60">
               <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-farewell-gold/40 to-transparent max-w-xs" />
               <svg className="mx-4 text-farewell-charcoal w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M12 2C8 2 4 5 4 10C4 16 12 22 12 22C12 22 20 16 20 10C20 5 16 2 12 2ZM8 12C6.9 12 6 11.1 6 10C6 8.9 6.9 8 8 8C9.1 8 10 8.9 10 10C10 11.1 9.1 12 8 12ZM16 12C14.9 12 14 11.1 14 10C14 8.9 14.9 8 16 8C17.1 8 18 8.9 18 10C18 11.1 17.1 12 16 12Z" />
               </svg>
               <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-farewell-gold/40 to-transparent max-w-xs" />
            </div>
          </div>

          {/* Contenu structuré : Texte Faire-part (75%) + Cartes (25%) */}
          <div className="flex flex-col lg:flex-row gap-10 items-stretch">
            
            {/* Zone Texte Faire-Part + Familles (75%) */}
            <div className="lg:w-[75%] bg-farewell-cream/50 p-8 md:p-12 rounded-[2rem] border border-farewell-stone shadow-sm flex flex-col gap-10">
              
              {/* Texte du faire-part */}
              {data.faire_part ? (
                <div className="prose prose-stone prose-lg max-w-none text-stone-600 font-serif leading-relaxed">
                  {data.faire_part.split('\n').map((para: string, i: number) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              ) : (
                <p className="text-stone-400 font-serif italic text-center text-lg py-10">Le faire-part officiel est en attente de publication par la famille.</p>
              )}

              {/* Défunts & Familles (données saisies par l'admin) */}
              {data.defunts_familles && Object.values(data.defunts_familles).some((v: any) => v) && (
                <>
                  <div className="h-[1px] bg-gradient-to-r from-transparent via-farewell-gold/30 to-transparent" />
                  
                  <div className="space-y-8">
                    <h3 className="text-2xl font-serif text-farewell-charcoal text-center">La Famille</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {[
                        { key: 'patriarches', label: 'Les Patriarches', icon: <Crown size={18} /> },
                        { key: 'grands_parents', label: 'Grands-parents', icon: <Heart size={18} /> },
                        { key: 'epouse', label: 'Épouse(s)', icon: <Heart size={18} /> },
                        { key: 'freres_soeurs', label: 'Frères & Sœurs', icon: <Users size={18} /> },
                        { key: 'filles_fils', label: 'Filles & Fils', icon: <Users size={18} /> },
                        { key: 'belles_filles_beaux_fils', label: 'Belles-filles & Beaux-fils', icon: <Star size={18} /> },
                        { key: 'petits_fils_arriere_petits_fils', label: 'Petits-fils & Arrière Petits-fils', icon: <Leaf size={18} /> },
                        { key: 'grandes_familles', label: 'Les Grandes Familles', icon: <Trees size={18} /> },
                      ]
                        .filter(cat => data.defunts_familles?.[cat.key])
                        .map(cat => (
                          <div key={cat.key} className="bg-white/60 rounded-2xl p-6 border border-farewell-stone/50 space-y-3">
                            <div className="flex items-center gap-2 text-farewell-gold">
                              {cat.icon}
                              <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold">{cat.label}</h4>
                            </div>
                            <div className="text-stone-600 font-serif text-sm leading-relaxed whitespace-pre-line">
                              {data.defunts_familles[cat.key]}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Colonne latérale : Cartes de Services / Programme (25%) */}
            <div className="lg:w-[25%] flex flex-col gap-6">
              
              {/* Carte 1 : Veillée / Inhumation */}
              <div className="relative flex-1 min-h-[250px] rounded-[1.5rem] overflow-hidden group shadow-sm bg-stone-100">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523730205978-59fd1b2965e3?q=80&w=800')] bg-cover bg-center group-hover:scale-105 transition-transform duration-[1.5s]" />
                <div className="absolute inset-0 bg-gradient-to-t from-farewell-charcoal/90 via-farewell-charcoal/50 to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6 space-y-2">
                  <h3 className="text-2xl font-serif text-white leading-tight">La Veillée & l'Inhumation</h3>
                  <p className="text-white/70 font-serif italic text-sm leading-snug">Recueillement et prières.</p>
                  <div className="pt-3">
                    <a href="/commemorations" className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 text-white text-[8px] font-bold uppercase tracking-[0.2em] px-4 py-2 hover:bg-farewell-gold hover:border-transparent transition-colors duration-300">
                      Le programme →
                    </a>
                  </div>
                </div>
              </div>

              {/* Carte 2 : Collation / Grandes Deuil */}
              <div className="relative flex-1 min-h-[250px] rounded-[1.5rem] overflow-hidden group shadow-sm bg-stone-100">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544414167-27e10df2fa1b?q=80&w=800')] bg-cover bg-center group-hover:scale-105 transition-transform duration-[1.5s]" />
                <div className="absolute inset-0 bg-gradient-to-t from-farewell-charcoal/90 via-farewell-charcoal/50 to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6 space-y-2">
                  <h3 className="text-2xl font-serif text-white leading-tight">Obsèques</h3>
                  <p className="text-white/70 font-serif italic text-sm leading-snug">Célébration et danses.</p>
                  <div className="pt-3">
                    <a href="/commemorations" className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 text-white text-[8px] font-bold uppercase tracking-[0.2em] px-4 py-2 hover:bg-farewell-gold hover:border-transparent transition-colors duration-300">
                      Le programme →
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Section "Tradition" — Style Farewell (fond sombre, 2 colonnes + 4 piliers) */}
      <section className="bg-farewell-charcoal py-28 px-10 md:px-20">
        <div className="max-w-7xl mx-auto space-y-20">

          {/* Ligne du haut : titre à gauche, texte à droite */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            {/* Colonne gauche */}
            <div className="space-y-5">
              <p className="text-farewell-gold/60 text-sm font-serif italic">Traditions des Grassfields</p>
              <h2 className="text-4xl md:text-5xl font-serif text-white leading-tight">
                Le sens profond<br />des Deuil
              </h2>
            </div>

            {/* Colonne droite */}
            <div className="space-y-6 text-white/60 font-light leading-relaxed">
              <p className="text-base md:text-lg">
                Au-delà du deuil immédiat, il s'agit d'une célébration de la vie accomplie et du passage sacré vers l'ancestralité, garante de l'équilibre spirituel et social.
              </p>
              <p>
                Contrairement à la perception classique, le processus funéraire en pays Bamiléké (Cameroun) se déroule en deux temps forts : le deuil (lewhʉ̄), qui est le temps de la séparation douloureuse, et les Deuil grandioses (míɛ́ lewhʉ̄), une cérémonie structurante organisée parfois plusieurs années après.
              </p>
            </div>
          </div>

          {/* 4 Piliers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 border-t border-white/10 pt-16">
            {[
              {
                icon: (
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <path d="M20 30 C12 30 6 24 6 16 C6 10 10 6 16 6 C18 6 20 8 20 8 C20 8 22 6 24 6 C30 6 34 10 34 16 C34 24 28 30 20 30Z"/>
                  </svg>
                ),
                title: "LE DEUIL (LEWHɄ̄)",
                desc: "Le temps de la séparation, des pleurs et du recueillement. La famille et la communauté expriment la perte et accompagnent l'être cher."
              },
              {
                icon: (
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <circle cx="20" cy="20" r="14" />
                    <path d="M20 6 L20 12 M20 28 L20 34 M6 20 L12 20 M28 20 L34 20" />
                    <circle cx="20" cy="20" r="4" fill="currentColor" fillOpacity="0.2" />
                  </svg>
                ),
                title: "LE GRAND DEUIL",
                desc: "Organisé plus tard, ce moment prend la forme de grandes cérémonies rituelles, sociales et même festives au sein de la communauté."
              },
              {
                icon: (
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <path d="M20 4 L20 36 M12 12 L28 12 M12 28 L28 28" />
                    <circle cx="20" cy="20" r="3" />
                  </svg>
                ),
                title: "L'ANCESTRALITÉ",
                desc: "Une dimension spirituelle consacrant l'entrée définitive du défunt dans le monde des ancêtres, garants de l'ordre moral et protecteurs du clan."
              },
              {
                icon: (
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <circle cx="14" cy="14" r="5" />
                    <circle cx="26" cy="14" r="5" />
                    <circle cx="20" cy="26" r="6" />
                    <path d="M16 18 C16 18 20 20 24 18" />
                    <path d="M12 20 C12 20 16 26 20 26 C24 26 28 20 28 20" />
                  </svg>
                ),
                title: "LE LIEN SOCIAL",
                desc: "Un espace fondamental pour transmettre l'héritage aux jeunes générations, et permettre à la vaste diaspora de renouer symboliquement avec ses racines."
              },
            ].map((pillar, i) => (
              <div key={i} className="space-y-6">
                <div className="text-farewell-gold/70">{pillar.icon}</div>
                <div className="space-y-3">
                  <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/80">{pillar.title}</h4>
                  <p className="text-white/40 text-sm font-light leading-relaxed">{pillar.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FarewellSeparator />

      {/* Introduction nous celebrons...*/}


      <FarewellSeparator />

      {/* Exploration Section - Cards Style */}
      <section className="py-32 px-8">
        <div className="max-w-6xl mx-auto space-y-20">
          <div className="text-center space-y-3">
             <h2 className="text-4xl font-serif text-farewell-charcoal uppercase tracking-widest leading-none">Découvrir</h2>
             <p className="text-stone-400 font-serif italic text-lg">Parcourir les souvenirs et les messages</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {settings?.show_biographie && (
              <QuickLinkCard 
                href="/biographie" 
                title="Biographie" 
                desc="Le récit d'un parcours exceptionnel traversant les décennies." 
              />
            )}
            {settings?.show_galerie && (
              <QuickLinkCard 
                href="/galerie" 
                title="Galerie" 
                desc="Instants capturés, sourires et souvenirs en images et vidéos." 
              />
            )}
            {settings?.show_livredor && (
              <QuickLinkCard 
                href="/livre-dor" 
                title="Livre d'Or" 
                desc="L'espace de témoignages et d'hommages de la communauté." 
              />
            )}
            {settings?.show_commemorations && (
              <QuickLinkCard 
                href="/commemorations" 
                title="Agenda" 
                desc="Dates importantes de recueillement et commémorations familiales." 
              />
            )}
          </div>
        </div>
      </section>

      {/* Mini Footer - Farewell style */}
      <footer className="bg-farewell-charcoal text-white/50 py-24 px-8 border-t border-white/5 text-center space-y-8">
         <div className="space-y-2">
            <h4 className="text-2xl font-serif text-white tracking-widest uppercase">InMemorum</h4>
            <p className="text-[10px] tracking-[0.4em] uppercase text-farewell-gold font-bold">Dignité & Souvenir</p>
         </div>
         <p className="max-w-md mx-auto text-sm font-light leading-relaxed italic">
            "Honorer une vie, c'est s'assurer que ses valeurs et ses actes continuent d'éclairer notre chemin."
         </p>
         <div className="pt-8 border-t border-white/5 text-[10px] uppercase tracking-widest">
            © {new Date().getFullYear()} — Mémorial Familial Privé
         </div>
      </footer>
    </div>
  );
}

function QuickLinkCard({ href, title, desc }: any) {
  return (
    <a 
      href={href}
      className="group relative flex flex-col p-10 bg-white border border-farewell-stone rounded-[2rem] hover:border-farewell-gold/40 transition-all duration-700 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2"
    >
      <div className="absolute top-0 left-0 w-2 h-0 group-hover:h-full bg-farewell-gold transition-all duration-700" />
      <h3 className="text-2xl font-serif text-farewell-charcoal group-hover:text-farewell-gold transition-colors duration-300">
        {title}
      </h3>
      <div className="h-[1px] w-8 bg-stone-100 my-4 group-hover:w-16 group-hover:bg-farewell-gold/30 transition-all duration-500" />
      <p className="text-stone-500 font-light text-sm leading-relaxed mb-6 group-hover:text-stone-700 transition-colors">
        {desc}
      </p>
      <div className="mt-auto flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-bold text-stone-300 group-hover:text-farewell-charcoal group-hover:translate-x-2 transition-all duration-500">
        Explorer <span className="text-farewell-gold">→</span>
      </div>
    </a>
  );
}
