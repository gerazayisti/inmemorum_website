'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Users, FileText, Quote, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminHommage() {
  const [data, setData] = useState<any>({
    nom: '',
    date_naissance: '',
    date_deces: '',
    citation: '',
    introduction: '',
    faire_part: '',
    portrait_url: '',
    defunts_familles: {
      grands_parents: '',
      freres_soeurs: '',
      epouse: '',
      filles_fils: '',
      belles_filles_beaux_fils: '',
      petits_fils_arriere_petits_fils: '',
      grandes_familles: '',
      patriarches: ''
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    fetchHommage();
  }, []);

  const fetchHommage = async () => {
    try {
      const res = await fetch('/api/hommage');
      const hommageData = await res.json();
      if (hommageData) {
        setData({
          ...hommageData,
          nom: hommageData.nom || '',
          date_naissance: hommageData.date_naissance || '',
          date_deces: hommageData.date_deces || '',
          citation: hommageData.citation || '',
          introduction: hommageData.introduction || '',
          faire_part: hommageData.faire_part || '',
          portrait_url: hommageData.portrait_url || '',
          defunts_familles: hommageData.defunts_familles || {
            grands_parents: '',
            freres_soeurs: '',
            epouse: '',
            filles_fils: '',
            belles_filles_beaux_fils: '',
            petits_fils_arriere_petits_fils: '',
            grandes_familles: '',
            patriarches: ''
          }
        });
        if (hommageData.portrait_url?.startsWith('http')) {
          setPreview(hommageData.portrait_url);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!data.nom) {
      toast.error('Le nom est obligatoire');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/hommage', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast.success('Modifications enregistrées');
      } else {
        const errorData = await res.json();
        toast.error(`Erreur: ${errorData.error || 'Inconnue'}`);
      }
    } catch (error) {
      toast.error('Erreur réseau');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 animate-pulse text-stone-400">Chargement de l'hommage...</div>;

  return (
    <div className="max-w-4xl space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif text-sawa-blue">Édition de l'Hommage</h1>
          <p className="text-stone-500 font-light">Modifiez les informations principales du mémorial.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-sawa-blue text-white px-6 py-2.5 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-stone-800 transition disabled:opacity-50"
        >
          {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
          Enregistrer
        </button>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {/* Identité */}
        <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100 space-y-6">
          <h2 className="text-xl font-serif text-sawa-blue flex items-center gap-2">
            <User size={20} className="text-sawa-gold" />
            Identité & Dates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-stone-400">Nom Complet</label>
              <input 
                type="text" 
                value={data.nom || ''}
                onChange={(e) => setData({ ...data, nom: e.target.value })}
                className="w-full bg-stone-50 border-none rounded-xl px-4 py-3 font-light"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-stone-400">Naissance</label>
                <input 
                  type="text" 
                  value={data.date_naissance || ''}
                  onChange={(e) => setData({ ...data, date_naissance: e.target.value })}
                  className="w-full bg-stone-50 border-none rounded-xl px-4 py-3 font-light"
                  placeholder="Ex: 1940"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-stone-400">Décès</label>
                <input 
                  type="text" 
                  value={data.date_deces || ''}
                  onChange={(e) => setData({ ...data, date_deces: e.target.value })}
                  className="w-full bg-stone-50 border-none rounded-xl px-4 py-3 font-light"
                  placeholder="Ex: 2024"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Textes */}
        <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100 space-y-6">
          <h2 className="text-xl font-serif text-sawa-blue flex items-center gap-2">
            <FileText size={20} className="text-sawa-gold" />
            Textes Spéciaux & Faire-part
          </h2>
          <div className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-stone-400">Citation (Mise en avant)</label>
              <textarea 
                rows={2}
                value={data.citation || ''}
                onChange={(e) => setData({ ...data, citation: e.target.value })}
                className="w-full bg-stone-50 border-none rounded-xl px-4 py-3 font-light resize-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-stone-400">Texte d'Introduction</label>
              <textarea 
                rows={8}
                value={data.introduction || ''}
                onChange={(e) => setData({ ...data, introduction: e.target.value })}
                className="w-full bg-stone-50 border-none rounded-xl px-4 py-4 font-light leading-relaxed"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-stone-400">Faire-part Officiel (Annonce, Programme...)</label>
              <textarea 
                rows={10}
                value={data.faire_part || ''}
                onChange={(e) => setData({ ...data, faire_part: e.target.value })}
                className="w-full bg-stone-50 border-none rounded-xl px-4 py-4 font-light leading-relaxed whitespace-pre-wrap"
                placeholder="Rédigez ici le faire-part..."
              />
            </div>
          </div>
        </section>

        {/* Défunts et Familles */}
        <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100 space-y-6">
          <h2 className="text-xl font-serif text-sawa-blue flex items-center gap-2">
            <Users size={20} className="text-sawa-gold" />
            Généalogie & Familles (Défunts)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { key: 'patriarches', label: 'Les Patriarches' },
              { key: 'grands_parents', label: 'Grands-parents' },
              { key: 'epouse', label: 'Épouse(s)' },
              { key: 'freres_soeurs', label: 'Frères et Sœurs' },
              { key: 'filles_fils', label: 'Filles et Fils' },
              { key: 'belles_filles_beaux_fils', label: 'Belles-filles et Beaux-fils' },
              { key: 'petits_fils_arriere_petits_fils', label: 'Petits-fils & Arrière Petits-fils' },
              { key: 'grandes_familles', label: 'Les Grandes Familles' },
            ].map((cat) => (
              <div key={cat.key} className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-stone-400">{cat.label}</label>
                <textarea 
                  rows={3}
                  value={data.defunts_familles?.[cat.key] || ''}
                  onChange={(e) => setData({ 
                    ...data, 
                    defunts_familles: { ...(data.defunts_familles || {}), [cat.key]: e.target.value } 
                  })}
                  className="w-full bg-stone-50 border-none rounded-xl px-4 py-3 font-light resize-none text-sm leading-relaxed"
                  placeholder={`Membres pour : ${cat.label}`}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Media Upload Portrait */}
        <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100 space-y-6">
          <h2 className="text-xl font-serif text-sawa-blue flex items-center gap-2">
            <Quote size={20} className="text-sawa-gold" />
            Photo de Portrait
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
             <div className="relative group">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setSaving(true);
                    try {
                      const fileExt = file.name.split('.').pop();
                      const filePath = `portraits/${Date.now()}.${fileExt}`;
                      
                      const formData = new FormData();
                      formData.append('file', file);
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
                      
                      setData({ ...data, portrait_url: filePath });
                      setPreview(URL.createObjectURL(file));
                      toast.success('Portrait chargé');
                    } catch (err: any) {
                      toast.error("Erreur upload: " + err.message);
                    } finally {
                      setSaving(false);
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="p-8 border-2 border-dashed border-stone-200 rounded-3xl text-center hover:bg-sawa-foam hover:border-sawa-blue transition-all">
                   <p className="text-stone-500 text-sm">Cliquez pour changer la photo</p>
                   <p className="text-[10px] text-stone-300 uppercase mt-1">Depuis votre téléphone ou PC</p>
                </div>
             </div>

             <div className="space-y-4">
                {preview && (
                  <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-sawa-gold/20 shadow-inner">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-stone-400">ID du Portrait (Storage)</label>
                  <input 
                    type="text" 
                    value={data.portrait_url || ''}
                    readOnly
                    className="w-full bg-stone-50 border-none rounded-xl px-4 py-3 font-light text-stone-400 text-xs"
                  />
                </div>
             </div>
          </div>
        </section>
      </div>
    </div>
  );
}
