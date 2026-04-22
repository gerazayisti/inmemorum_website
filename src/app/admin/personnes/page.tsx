'use client';

import { useEffect, useState } from 'react';
import { Crown, Plus, Trash2, Save, Star, Upload } from 'lucide-react';
import { toast } from 'react-hot-toast';

const LIENS = ['Patriarche', 'Grand-parent', 'Épouse', 'Époux', 'Frère', 'Sœur', 'Fils', 'Fille', 'Belle-fille', 'Beau-fils', 'Petit-fils', 'Petite-fille', 'Autre'];

interface Personne {
  id?: number;
  nom: string;
  lien_parente: string;
  date_naissance: string;
  date_deces: string;
  description: string;
  photo_url: string;
  is_principal: boolean;
  ordre: number;
}

const emptyPersonne: Personne = {
  nom: '', lien_parente: '', date_naissance: '', date_deces: '',
  description: '', photo_url: '', is_principal: false, ordre: 0
};

export default function AdminPersonnes() {
  const [personnes, setPersonnes] = useState<Personne[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<Personne>({ ...emptyPersonne });
  const [previews, setPreviews] = useState<Record<number, string>>({});

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const res = await fetch('/api/personnes');
      const data = await res.json();
      setPersonnes(data || []);
      // Sauvegarder les previews
      const p: Record<number, string> = {};
      (data || []).forEach((d: any) => { if (d.photo_url?.startsWith('http')) p[d.id] = d.photo_url; });
      setPreviews(p);
    } catch { toast.error('Erreur chargement'); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    if (!form.nom) { toast.error('Le nom est obligatoire'); return; }
    setSaving(true);
    try {
      const method = editId ? 'PATCH' : 'POST';
      const body = editId ? { ...form, id: editId } : form;
      const res = await fetch('/api/personnes', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      toast.success(editId ? 'Modifié' : 'Ajouté');
      setForm({ ...emptyPersonne });
      setEditId(null);
      fetchAll();
    } catch (err: any) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette personne ?')) return;
    try {
      const res = await fetch(`/api/personnes?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success('Supprimé');
      fetchAll();
    } catch { toast.error('Erreur suppression'); }
  };

  const handleUpload = async (file: File) => {
    const ext = file.name.split('.').pop();
    const path = `personnes/${Date.now()}.${ext}`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);
    formData.append('bucket', 'galerie-memorial');
    const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
    if (!res.ok) throw new Error('Upload échoué');
    return path;
  };

  const startEdit = (p: Personne) => {
    setEditId(p.id!);
    setForm({ ...p });
  };

  if (loading) return <div className="p-8 animate-pulse text-stone-400">Chargement...</div>;

  const principal = personnes.find(p => p.is_principal);
  const autres = personnes.filter(p => !p.is_principal);

  return (
    <div className="max-w-5xl space-y-10">
      <header>
        <h1 className="text-3xl font-serif text-farewell-charcoal">Personnes Célébrées</h1>
        <p className="text-stone-500 font-light">Gérez les personnes honorées dans ce mémorial.</p>
      </header>

      {/* Formulaire d'ajout/modification */}
      <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100 space-y-6">
        <h2 className="text-xl font-serif text-farewell-charcoal flex items-center gap-2">
          <Crown size={20} className="text-farewell-gold" />
          {editId ? 'Modifier la personne' : 'Ajouter une personne'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-stone-400">Nom Complet *</label>
            <input
              type="text" value={form.nom}
              onChange={e => setForm({ ...form, nom: e.target.value })}
              className="w-full bg-stone-50 border-none rounded-xl px-4 py-3 font-light"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-stone-400">Lien de Parenté</label>
            <select
              value={form.lien_parente}
              onChange={e => setForm({ ...form, lien_parente: e.target.value })}
              className="w-full bg-stone-50 border-none rounded-xl px-4 py-3 font-light"
            >
              <option value="">— Sélectionner —</option>
              {LIENS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-stone-400">Naissance</label>
            <input type="text" value={form.date_naissance} placeholder="Ex: 1940"
              onChange={e => setForm({ ...form, date_naissance: e.target.value })}
              className="w-full bg-stone-50 border-none rounded-xl px-4 py-3 font-light" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-stone-400">Décès</label>
            <input type="text" value={form.date_deces} placeholder="Ex: 2024"
              onChange={e => setForm({ ...form, date_deces: e.target.value })}
              className="w-full bg-stone-50 border-none rounded-xl px-4 py-3 font-light" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-stone-400">Description</label>
          <textarea rows={3} value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            className="w-full bg-stone-50 border-none rounded-xl px-4 py-3 font-light resize-none" />
        </div>

        {/* Upload photo */}
        <div className="flex items-center gap-6">
          <div className="relative group">
            <input
              type="file" accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setSaving(true);
                try {
                  const path = await handleUpload(file);
                  setForm({ ...form, photo_url: path });
                  toast.success('Photo chargée');
                } catch (err: any) { toast.error(err.message); }
                finally { setSaving(false); }
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex items-center gap-2 px-5 py-3 border-2 border-dashed border-stone-200 rounded-2xl text-stone-500 text-sm hover:border-farewell-gold transition-colors">
              <Upload size={16} /> Choisir une photo
            </div>
          </div>
          {form.photo_url && <span className="text-xs text-stone-400 truncate max-w-[200px]">{form.photo_url}</span>}
        </div>

        {/* Principal toggle */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_principal}
              onChange={e => setForm({ ...form, is_principal: e.target.checked })}
              className="w-4 h-4 rounded border-stone-300" />
            <span className="text-sm text-stone-600 flex items-center gap-1">
              <Star size={14} className="text-farewell-gold" /> Personne principale (vue icône)
            </span>
          </label>
        </div>

        <div className="flex gap-4">
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 bg-farewell-charcoal text-white px-6 py-2.5 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-farewell-gold transition disabled:opacity-50">
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
            {editId ? 'Mettre à jour' : 'Ajouter'}
          </button>
          {editId && (
            <button onClick={() => { setEditId(null); setForm({ ...emptyPersonne }); }}
              className="px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest text-stone-500 hover:text-stone-800 transition">
              Annuler
            </button>
          )}
        </div>
      </section>

      {/* Personne principale */}
      {principal && (
        <section className="bg-farewell-charcoal text-white p-8 rounded-[2rem] shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif flex items-center gap-2">
              <Crown size={20} className="text-farewell-gold" /> Personne Icône
            </h2>
            <div className="flex gap-2">
              <button onClick={() => startEdit(principal)} className="text-xs uppercase tracking-wider px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition">Modifier</button>
              <button onClick={() => handleDelete(principal.id!)} className="text-xs uppercase tracking-wider px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 transition"><Trash2 size={14} /></button>
            </div>
          </div>
          <div className="flex items-center gap-6">
            {previews[principal.id!] && (
              <img src={previews[principal.id!]} alt={principal.nom} className="w-24 h-24 rounded-2xl object-cover border-2 border-farewell-gold/30" />
            )}
            <div>
              <h3 className="text-2xl font-serif">{principal.nom}</h3>
              <p className="text-white/60 text-sm">{principal.lien_parente} {principal.date_naissance && `• ${principal.date_naissance}`} {principal.date_deces && `– ${principal.date_deces}`}</p>
              {principal.description && <p className="text-white/40 text-sm mt-2">{principal.description}</p>}
            </div>
          </div>
        </section>
      )}

      {/* Liste des autres */}
      {autres.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-serif text-farewell-charcoal">Autres personnes célébrées</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {autres.map(p => (
              <div key={p.id} className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm space-y-3 group">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {previews[p.id!] ? (
                      <img src={previews[p.id!]} alt={p.nom} className="w-14 h-14 rounded-xl object-cover" />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-stone-100 flex items-center justify-center text-stone-300 text-2xl font-serif">{p.nom[0]}</div>
                    )}
                    <div>
                      <h3 className="font-serif text-farewell-charcoal">{p.nom}</h3>
                      <p className="text-xs text-stone-400">{p.lien_parente}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button onClick={() => startEdit(p)} className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400"><Save size={14} /></button>
                    <button onClick={() => handleDelete(p.id!)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400"><Trash2 size={14} /></button>
                  </div>
                </div>
                {p.description && <p className="text-stone-500 text-sm font-light leading-relaxed">{p.description}</p>}
                <p className="text-[10px] text-stone-300 uppercase tracking-wider">
                  {p.date_naissance}{p.date_deces && ` — ${p.date_deces}`}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
