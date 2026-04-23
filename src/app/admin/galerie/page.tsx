'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Upload, Trash2, Camera, Video, Plus, X, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

export default function AdminGalerie() {
  const [medias, setMedias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ legende: '', type: 'photo' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchMedias();
  }, []);

  const fetchMedias = async () => {
    const res = await fetch('/api/galerie');
    const data = await res.json();
    setMedias(data || []);
    setLoading(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleValidate = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      // 1. Upload vers Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('path', filePath);
      formData.append('bucket', 'galerie-memorial');

      const uploadRes = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });

      if (!uploadRes.ok) {
        const error = await uploadRes.json();
        throw new Error(error.error || 'Erreur API Upload');
      }

      // 2. Enregistrement en base via notre API
      const res = await fetch('/api/galerie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedFile.type.startsWith('video') ? 'video' : selectedFile.type.includes('pdf') ? 'pdf' : 'photo',
          storage_path: filePath,
          legende: form.legende
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Erreur API Galerie');
      }

      toast.success('Fichier ajouté à la galerie');
      setIsAdding(false);
      setForm({ legende: '', type: 'photo' });
      setSelectedFile(null);
      setPreviewUrl(null);
      fetchMedias();
    } catch (error: any) {
      toast.error('Erreur upload: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, storagePath: string) => {
    if (!confirm('Supprimer définitivement ce média ?')) return;
    try {
      const res = await fetch('/api/galerie', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, storage_path: storagePath }),
      });
      if (res.ok) {
        toast.success('Média supprimé');
        fetchMedias();
      }
    } catch (e) { toast.error('Erreur'); }
  };

  if (loading) return <div className="p-8 animate-pulse text-stone-400">Chargement de la galerie...</div>;

  return (
    <div className="max-w-6xl space-y-8 pb-20">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif text-farewell-charcoal">Gestion de la Galerie</h1>
          <p className="text-stone-500 font-light">Ajoutez ou supprimez des photos et vidéos souvenirs.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-farewell-charcoal text-white px-6 py-2.5 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-stone-800 transition"
        >
          <Plus size={16} />
          Ajouter un média
        </button>
      </header>

      {/* Modal / Form d'ajout */}
      {isAdding && (
        <div className="bg-white p-8 rounded-[2rem] shadow-xl border-2 border-farewell-charcoal/10 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-farewell-charcoal text-lg">Nouveau Média</h3>
            <button onClick={() => setIsAdding(false)}><X size={20} className="text-stone-400" /></button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
             <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-stone-400">Légende (Optionnel)</label>
                  <input 
                    className="w-full bg-stone-50 p-3 rounded-xl border-none font-light"
                    value={form.legende}
                    onChange={e => setForm({ ...form, legende: e.target.value })}
                    placeholder="Ex: Vacances en famille 1995"
                  />
                </div>
                
                <div className="relative group">
                   <input 
                     type="file" 
                     accept="image/*,video/*,application/pdf"
                     onChange={handleFileSelect}
                     disabled={uploading}
                     className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                   />
                   <div className={`p-10 border-2 border-dashed rounded-3xl text-center space-y-2 transition-all ${uploading ? 'bg-stone-50 border-stone-200' : 'border-stone-200 group-hover:border-farewell-charcoal group-hover:bg-stone-100'}`}>
                      {uploading ? (
                         <div className="flex flex-col items-center gap-3 relative z-20">
                            <div className="w-8 h-8 border-4 border-farewell-charcoal/30 border-t-farewell-charcoal rounded-full animate-spin" />
                            <span className="text-xs font-bold text-farewell-charcoal animate-pulse">CHARGEMENT...</span>
                         </div>
                      ) : selectedFile ? (
                         <div className="flex flex-col items-center gap-2 relative z-20">
                            {selectedFile.type.startsWith('image/') ? (
                              <img src={previewUrl!} alt="Preview" className="w-24 h-24 object-cover rounded-xl border border-stone-200 shadow-sm" />
                            ) : selectedFile.type.startsWith('video/') ? (
                              <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-stone-200 shadow-sm bg-black">
                                <video src={previewUrl!} className="w-full h-full object-cover opacity-70" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Video className="text-white drop-shadow-md" size={24} />
                                </div>
                              </div>
                            ) : (
                              <div className="w-24 h-24 flex items-center justify-center bg-stone-100 rounded-xl border border-stone-200 shadow-sm">
                                <FileText className="text-farewell-charcoal/50" size={32} />
                              </div>
                            )}
                            <p className="text-stone-700 text-sm font-bold truncate max-w-full px-4 mt-2">{selectedFile.name}</p>
                            <p className="text-xs text-stone-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                            <p className="text-[10px] text-stone-400 mt-1">Cliquez pour changer de fichier</p>
                         </div>
                      ) : (
                         <div className="relative z-20">
                            <Upload className="mx-auto text-stone-300 group-hover:text-farewell-charcoal mb-2" size={32} />
                            <p className="text-stone-500 text-sm font-light">Cliquez pour choisir un fichier</p>
                            <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Images, Vidéos ou PDF</p>
                         </div>
                      )}
                   </div>
                </div>

                {selectedFile && (
                  <button 
                    onClick={handleValidate}
                    disabled={uploading}
                    className="w-full bg-farewell-gold text-white py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-yellow-600 transition disabled:opacity-50"
                  >
                    {uploading ? 'Ajout en cours...' : 'Valider l\'ajout'}
                  </button>
                )}
             </div>
             
             <div className="bg-stone-50 p-8 rounded-3xl border border-stone-100 flex flex-col items-center text-center space-y-3">
                <div className="p-4 bg-white rounded-full shadow-sm text-farewell-gold">
                   <Camera size={32} />
                </div>
                <h4 className="text-stone-600 font-serif lowercase italic">"Une image fige le temps, mais le souvenir reste vivant."</h4>
             </div>
          </div>
        </div>
      )}

      {/* Grid de gestion */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {medias.map((media) => (
          <div key={media.id} className="relative aspect-square group overflow-hidden rounded-2xl bg-stone-100 border border-stone-200">
            {media.type === 'video' ? (
              <div className="w-full h-full flex items-center justify-center bg-stone-800">
                <Video className="text-white/50" size={40} />
              </div>
            ) : media.type === 'pdf' ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-stone-50 border border-stone-100">
                <FileText className="text-farewell-charcoal/30" size={40} />
                <span className="text-[8px] font-bold text-stone-400 mt-2">DOCUMENT PDF</span>
              </div>
            ) : (
              <Image 
                src={media.url} 
                alt={media.legende || ''} 
                fill
                className="object-cover transition-transform group-hover:scale-105" 
              />
            )}
            
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
               <button 
                 onClick={() => handleDelete(media.id, media.storage_path)}
                 className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition shadow-xl"
               >
                 <Trash2 size={20} />
               </button>
            </div>

            {media.legende && (
               <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 backdrop-blur-sm">
                  <p className="text-[10px] text-white font-light truncate">{media.legende}</p>
               </div>
            )}
          </div>
        ))}

        {medias.length === 0 && !isAdding && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-stone-100 rounded-[3rem]">
            <p className="text-stone-400 font-serif italic text-lg">La galerie est vide.</p>
          </div>
        )}
      </div>
    </div>
  );
}
