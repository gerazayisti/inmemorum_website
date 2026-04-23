"use client";

import { useEffect, useState } from 'react';
import { Camera, FileText, Film, Images, Download } from 'lucide-react';
import { GalerieGrid } from '@/components/Galerie/GalerieGrid';
import { FarewellSeparator } from '@/components/FarewellSeparator';

type TabType = 'documents' | 'galerie' | 'videos';

const DOCUMENT_LABELS: Record<string, string> = {
  livret_programme: 'Livret Programme',
  livre_hommage: "Livre d'Hommage",
  faire_part: 'Faire-Part',
};

export default function PublicMediatheque() {
  const [medias, setMedias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('galerie');

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    fetchMedias();
  }, [activeTab]);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data?.show_mediatheque === false) {
        window.location.href = '/accueil';
      }
    } catch (e) {}
  };

  const fetchMedias = async () => {
    setLoading(true);
    try {
      let url = '/api/galerie';
      if (activeTab === 'galerie') url += '?type=photo';
      else if (activeTab === 'videos') url += '?type=video';
      else if (activeTab === 'documents') url += '?type=document';

      const res = await fetch(url);
      const data = await res.json();
      setMedias(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des médias:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs: { key: TabType; label: string; icon: any }[] = [
    { key: 'documents', label: 'Documents', icon: FileText },
    { key: 'galerie', label: 'Galerie Photos', icon: Images },
    { key: 'videos', label: 'Vidéos', icon: Film },
  ];

  // Grouper les documents par catégorie
  const documentsByCategory = medias.reduce((acc: Record<string, any[]>, media) => {
    const cat = media.categorie || 'autre';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(media);
    return acc;
  }, {});

  return (
    <div className="py-20 px-8 space-y-16 bg-farewell-cream min-h-screen pb-40">
      {/* Header */}
      <header className="text-center space-y-6 max-w-2xl mx-auto">
        <div className="flex justify-center mb-4">
            <div className="p-1 bg-farewell-gold/20 rounded-full">
               <div className="p-4 bg-white rounded-full shadow-sm border border-farewell-stone">
                  <Camera className="text-farewell-gold" size={32} strokeWidth={1.5} />
               </div>
            </div>
        </div>
        <h2 className="text-4xl md:text-5xl font-serif text-farewell-charcoal uppercase tracking-widest leading-tight">Médiathèque</h2>
        <div className="w-12 h-[1px] bg-farewell-gold/40 mx-auto" />
        <p className="text-stone-500 font-serif italic text-lg leading-relaxed max-w-sm mx-auto">
          "Documents, photos et vidéos pour honorer et partager les souvenirs."
        </p>
      </header>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="flex gap-1 bg-white p-1.5 rounded-2xl shadow-sm border border-farewell-stone w-fit">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                  activeTab === tab.key
                    ? 'bg-farewell-charcoal text-white shadow-sm'
                    : 'text-stone-400 hover:text-farewell-charcoal'
                }`}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <FarewellSeparator />

      {/* Content */}
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-white rounded-2xl border border-farewell-stone" />
            ))}
          </div>
        ) : activeTab === 'documents' ? (
          /* Documents Section */
          <div className="space-y-12">
            {Object.keys(documentsByCategory).length > 0 ? (
              Object.entries(documentsByCategory).map(([cat, docs]) => (
                <div key={cat} className="space-y-6">
                  <h3 className="text-2xl font-serif text-farewell-charcoal flex items-center gap-3">
                    <FileText size={20} className="text-farewell-gold" />
                    {DOCUMENT_LABELS[cat] || cat}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {docs.map((doc: any) => (
                      <a
                        key={doc.id}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group bg-white p-6 rounded-2xl border border-farewell-stone hover:border-farewell-gold/40 hover:shadow-lg transition-all duration-300 flex items-start gap-4"
                      >
                        <div className="p-3 bg-farewell-cream rounded-xl shrink-0 group-hover:bg-farewell-gold/10 transition-colors">
                          <FileText size={28} className="text-farewell-gold" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-farewell-charcoal text-sm group-hover:text-farewell-gold transition-colors truncate">
                            {doc.legende || DOCUMENT_LABELS[cat] || 'Document'}
                          </h4>
                          <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold mt-1">
                            {DOCUMENT_LABELS[cat] || 'Document PDF'}
                          </p>
                          <div className="flex items-center gap-1 mt-3 text-farewell-gold text-[10px] uppercase tracking-widest font-bold group-hover:gap-3 transition-all">
                            <Download size={12} />
                            Consulter
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-32 text-center bg-white/50 rounded-[3rem] border border-farewell-stone shadow-inner">
                <FileText className="mx-auto text-stone-200 mb-4" size={48} />
                <p className="text-stone-400 font-serif italic text-xl">Aucun document disponible pour le moment.</p>
              </div>
            )}
          </div>
        ) : activeTab === 'videos' ? (
          /* Videos Section */
          medias.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {medias.map((media: any) => (
                <div key={media.id} className="bg-white rounded-2xl overflow-hidden border border-farewell-stone shadow-sm hover:shadow-lg transition-shadow">
                  <div className="relative aspect-video bg-black">
                    <video
                      src={media.url}
                      controls
                      preload="metadata"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {media.legende && (
                    <div className="p-4">
                      <p className="text-stone-600 font-serif text-sm">{media.legende}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-32 text-center bg-white/50 rounded-[3rem] border border-farewell-stone shadow-inner">
              <Film className="mx-auto text-stone-200 mb-4" size={48} />
              <p className="text-stone-400 font-serif italic text-xl">Aucune vidéo disponible pour le moment.</p>
            </div>
          )
        ) : (
          /* Galerie Photos Section */
          <>
            <GalerieGrid medias={medias.filter(m => m.type === 'photo')} />
            {medias.filter(m => m.type === 'photo').length === 0 && (
              <div className="py-32 text-center bg-white/50 rounded-[3rem] border border-farewell-stone shadow-inner">
                <Images className="mx-auto text-stone-200 mb-4" size={48} />
                <p className="text-stone-400 font-serif italic text-xl">La galerie photo est en cours de constitution.</p>
              </div>
            )}
          </>
        )}
      </div>

      <FarewellSeparator />
    </div>
  );
}
