'use client';

import { useEffect, useState } from 'react';
import { Network, Plus, Trash2, Save, Upload, Edit } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Membre {
  id?: string;
  nom: string;
  prenoms: string;
  date_naissance: string;
  date_deces: string;
  photo_url: string;
  role: string;
  parent_id: string | null;
  conjoint_id: string | null;
  ordre: number;
}

const emptyMembre: Membre = {
  nom: '', prenoms: '', date_naissance: '', date_deces: '',
  photo_url: '', role: '', parent_id: null, conjoint_id: null, ordre: 0
};

const ROLES = ['Patriarche', 'Matriarche', 'Épouse', 'Époux', 'Enfant', 'Petit-enfant', 'Autre'];

export default function AdminArbre() {
  const [membres, setMembres] = useState<Membre[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Membre>({ ...emptyMembre });

  useEffect(() => { fetchMembres(); }, []);

  const fetchMembres = async () => {
    try {
      const res = await fetch('/api/arbre');
      const data = await res.json();
      setMembres(data || []);
    } catch { toast.error('Erreur chargement'); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    if (!form.nom || !form.prenoms || !form.role) { 
      toast.error('Nom, prénoms et rôle sont obligatoires'); 
      return; 
    }
    setSaving(true);
    try {
      const method = editId ? 'PATCH' : 'POST';
      const body = editId ? { ...form, id: editId } : form;
      const res = await fetch('/api/arbre', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      toast.success(editId ? 'Modifié' : 'Ajouté');
      setForm({ ...emptyMembre });
      setEditId(null);
      fetchMembres();
    } catch (err: any) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce membre ? Attention, vérifiez qu\'aucun membre ne lui est rattaché.')) return;
    try {
      const res = await fetch('/api/arbre', { 
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (!res.ok) throw new Error();
      toast.success('Supprimé');
      fetchMembres();
    } catch { toast.error('Erreur suppression'); }
  };

  const handleUpload = async (file: File) => {
    const ext = file.name.split('.').pop();
    const path = `arbre/${Date.now()}.${ext}`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);
    formData.append('bucket', 'galerie-memorial');
    const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
    if (!res.ok) throw new Error('Upload échoué');
    return path;
  };

  const startEdit = (m: Membre) => {
    setEditId(m.id!);
    setForm({ ...m });
  };

  if (loading) return <div className="p-8 animate-pulse text-stone-400">Chargement...</div>;

  return (
    <div className="max-w-5xl space-y-10">
      <header>
        <h1 className="text-3xl font-serif text-farewell-charcoal">Arbre Généalogique</h1>
        <p className="text-stone-500 font-light">Gérez les membres de la famille pour construire l'arbre.</p>
      </header>

      {/* Formulaire */}
      <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100 space-y-6">
        <h2 className="text-xl font-serif text-farewell-charcoal flex items-center gap-2">
          <Network size={20} className="text-farewell-gold" />
          {editId ? 'Modifier un membre' : 'Ajouter un membre'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-stone-400">Prénoms *</label>
            <input type="text" value={form.prenoms} onChange={e => setForm({ ...form, prenoms: e.target.value })} className="w-full bg-stone-50 border-none rounded-xl px-4 py-3 font-light" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-stone-400">Nom de famille *</label>
            <input type="text" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} className="w-full bg-stone-50 border-none rounded-xl px-4 py-3 font-light" />
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-stone-400">Rôle *</label>
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="w-full bg-stone-50 border-none rounded-xl px-4 py-3 font-light">
              <option value="">— Sélectionner —</option>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-stone-400">Ordre d'affichage</label>
            <input type="number" value={form.ordre} onChange={e => setForm({ ...form, ordre: parseInt(e.target.value) || 0 })} className="w-full bg-stone-50 border-none rounded-xl px-4 py-3 font-light" />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-stone-400">Naissance</label>
            <input type="text" value={form.date_naissance} onChange={e => setForm({ ...form, date_naissance: e.target.value })} className="w-full bg-stone-50 border-none rounded-xl px-4 py-3 font-light" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-stone-400">Décès</label>
            <input type="text" value={form.date_deces} onChange={e => setForm({ ...form, date_deces: e.target.value })} className="w-full bg-stone-50 border-none rounded-xl px-4 py-3 font-light" />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-stone-400">Conjoint (Mari/Épouse)</label>
            <select value={form.conjoint_id || ''} onChange={e => setForm({ ...form, conjoint_id: e.target.value || null })} className="w-full bg-stone-50 border-none rounded-xl px-4 py-3 font-light">
              <option value="">— Aucun —</option>
              {membres.filter(m => m.id !== editId).map(m => (
                <option key={m.id} value={m.id}>{m.prenoms} {m.nom} ({m.role})</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-stone-400">Parent Direct</label>
            <select value={form.parent_id || ''} onChange={e => setForm({ ...form, parent_id: e.target.value || null })} className="w-full bg-stone-50 border-none rounded-xl px-4 py-3 font-light">
              <option value="">— Aucun (Racine) —</option>
              {membres.filter(m => m.id !== editId).map(m => (
                <option key={m.id} value={m.id}>{m.prenoms} {m.nom} ({m.role})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative group">
            <input type="file" accept="image/*"
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
              <Upload size={16} /> Photo (Optionnelle)
            </div>
          </div>
          {form.photo_url && <span className="text-xs text-stone-400 truncate max-w-[200px]">{form.photo_url}</span>}
        </div>

        <div className="flex gap-4">
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-farewell-charcoal text-white px-6 py-2.5 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-farewell-gold transition disabled:opacity-50">
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
            {editId ? 'Mettre à jour' : 'Ajouter'}
          </button>
          {editId && (
            <button onClick={() => { setEditId(null); setForm({ ...emptyMembre }); }} className="px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest text-stone-500 hover:text-stone-800 transition">Annuler</button>
          )}
        </div>
      </section>

      {/* Liste */}
      <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100">
        <h2 className="text-xl font-serif text-farewell-charcoal mb-6">Membres Actuels</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 text-[10px] uppercase tracking-widest text-stone-400">
                <th className="p-4 font-bold rounded-tl-xl">Identité</th>
                <th className="p-4 font-bold">Rôle</th>
                <th className="p-4 font-bold">Relations</th>
                <th className="p-4 font-bold rounded-tr-xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {membres.map(m => {
                const parent = membres.find(x => x.id === m.parent_id);
                const conjoint = membres.find(x => x.id === m.conjoint_id);
                return (
                  <tr key={m.id} className="border-b border-stone-50 hover:bg-stone-50 transition">
                    <td className="p-4">
                      <div className="font-bold text-farewell-charcoal">{m.prenoms} {m.nom}</div>
                      <div className="text-xs text-stone-400">{m.date_naissance} {m.date_deces ? `- ${m.date_deces}` : ''}</div>
                    </td>
                    <td className="p-4 text-sm text-stone-600">{m.role}</td>
                    <td className="p-4 text-xs text-stone-500">
                      {parent && <div>Enfant de: {parent.prenoms}</div>}
                      {conjoint && <div>Conjoint(e): {conjoint.prenoms}</div>}
                      {!parent && !conjoint && '-'}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => startEdit(m)} className="p-2 text-stone-400 hover:text-farewell-gold transition"><Edit size={16} /></button>
                        <button onClick={() => handleDelete(m.id!)} className="p-2 text-stone-400 hover:text-red-500 transition"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {membres.length === 0 && <div className="p-8 text-center text-stone-400 text-sm">Aucun membre</div>}
        </div>
      </section>
    </div>
  );
}
