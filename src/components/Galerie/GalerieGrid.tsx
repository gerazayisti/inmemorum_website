'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, PlayCircle, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Media {
  id: string;
  url: string;
  type: 'photo' | 'video' | 'pdf';
  legende?: string;
}

interface GalerieGridProps {
  medias: Media[];
}

export function GalerieGrid({ medias }: GalerieGridProps) {
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null);

  if (!Array.isArray(medias)) return null;

  const next = () => {
    if (selectedMediaIndex !== null) {
      setSelectedMediaIndex((selectedMediaIndex + 1) % medias.length);
    }
  };

  const prev = () => {
    if (selectedMediaIndex !== null) {
      setSelectedMediaIndex((selectedMediaIndex - 1 + medias.length) % medias.length);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[150px] md:auto-rows-[200px]">
        {medias.map((media, index) => {
          // Déterminer la taille basée sur l'index pour un look varié mais déterministe
          const spans = [
            'col-span-1 row-span-1',
            'col-span-1 row-span-2',
            'col-span-2 row-span-1',
            'col-span-1 row-span-1',
            'col-span-2 row-span-2',
            'col-span-1 row-span-1',
          ];
          const span = spans[index % spans.length];
          const rotations = ['rotate-1', '-rotate-1', 'rotate-2', '-rotate-2', 'rotate-0'];
          const rotation = rotations[index % rotations.length];

          return (
            <motion.div
              key={media.id}
              layoutId={media.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedMediaIndex(index)}
              className={`${span} ${rotation} relative group cursor-pointer overflow-hidden rounded-[2rem] bg-white shadow-md border border-stone-100 hover:z-20 hover:scale-105 hover:rotate-0 transition-all duration-500`}
            >
              <div className="w-full h-full">
                {media.type === 'pdf' ? (
                  <div className="w-full h-full bg-stone-50 flex flex-col items-center justify-center gap-2">
                    <FileText size={48} className="text-farewell-gold/20" strokeWidth={1} />
                    <span className="text-[10px] uppercase font-bold text-stone-400 tracking-widest px-4 text-center">Document PDF</span>
                  </div>
                ) : (
                  <Image
                    src={media.url}
                    alt={media.legende || 'Souvenir'}
                    fill
                    className="object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700"
                  />
                )}
                
                {/* Overlay au hover avec légende */}
                <div className="absolute inset-0 bg-gradient-to-t from-farewell-charcoal/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                  {media.legende && (
                    <p className="text-white text-xs font-serif italic truncate">{media.legende}</p>
                  )}
                  <span className="text-[8px] text-farewell-gold uppercase tracking-[0.3em] font-bold mt-1">Agrandir →</span>
                </div>

                {media.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-all">
                    <PlayCircle size={48} className="text-white/80" strokeWidth={1.5} />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Media Viewer Modal */}
      <AnimatePresence>
        {selectedMediaIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-10"
          >
            <button
              onClick={() => setSelectedMediaIndex(null)}
              className="absolute top-6 right-6 text-white/50 hover:text-white z-[110]"
            >
              <X size={32} />
            </button>

            <div className="relative w-full max-w-5xl aspect-video md:aspect-auto flex items-center justify-center">
              {medias[selectedMediaIndex].type === 'video' ? (
                <video
                  src={medias[selectedMediaIndex].url}
                  controls
                  autoPlay
                  className="max-h-[80vh] w-full rounded-lg"
                />
              ) : medias[selectedMediaIndex].type === 'pdf' ? (
                <div className="flex flex-col items-center gap-8">
                   <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
                      <FileText size={64} className="text-white/30" />
                   </div>
                   <div className="text-center">
                      <p className="text-white font-serif text-xl mb-6">{medias[selectedMediaIndex].legende || "Document PDF"}</p>
                      <a 
                        href={medias[selectedMediaIndex].url} 
                        target="_blank" 
                        className="bg-sawa-gold text-white px-8 py-3 rounded-xl font-bold uppercase text-xs tracking-widest hover:scale-105 transition-transform"
                      >
                        Ouvrir le document
                      </a>
                   </div>
                </div>
              ) : (
                <motion.div
                  key={medias[selectedMediaIndex].id}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="relative h-full w-full flex items-center justify-center"
                >
                  <Image
                    src={medias[selectedMediaIndex].url}
                    alt={medias[selectedMediaIndex].legende || ''}
                    width={1920}
                    height={1080}
                    className="max-h-[80vh] w-auto object-contain shadow-2xl rounded-sm"
                  />
                </motion.div>
              )}

              {/* Navigation */}
              <button 
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 hidden md:block text-white/30 hover:text-white text-4xl"
              >
                ‹
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 hidden md:block text-white/30 hover:text-white text-4xl"
              >
                ›
              </button>

              {/* Legende */}
              {medias[selectedMediaIndex].legende && (
                <div className="absolute -bottom-12 left-0 right-0 text-center">
                  <p className="text-white/80 font-light italic truncate px-4">
                    {medias[selectedMediaIndex].legende}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
