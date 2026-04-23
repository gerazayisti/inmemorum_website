'use client';

import { useEffect, useState } from 'react';
import { Phone, Plus, Trash2, Save, Upload, Edit } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Contact {
  id?: string;
  nom: string;
  role: string;
  telephone: string;
  email: string;
  adresse: string;
  photo_url: string;
  ordre: number;
}

const emptyContact: Contact = {
  nom: '', role: '', telephone: '', email: '', adresse: '', photo_url: '', ordre: 0
};

const ROLES = ['Patriarche', 'Matriarche', 'Représentant(e) de la famille', 'Chargé(e) de communication', 'Autre'];

export default function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Contact>({ ...emptyContact });

  useEffect(() => { fetchContacts(); }, []);

  const fetchContacts = async () => {
    try {
      const res = await fetch('/api/contacts');
      const data = await res.json();
      setContacts(data || []);
    } catch { toast.error('Erreur chargement'); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    if (!form.nom || !form.role) { 
      toast.error('Nom et rôle sont obligatoires'); 
      return; 
    }
    setSaving(true);
    try {
      const method = editId ? 'PATCH' : 'POST';
      const body = editId ? { ...form, id: editId } : form;
      const res = await fetch('/api/contacts', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      toast.success(editId ? 'Modifié' : 'Ajouté');
      setForm({ ...emptyContact });
      setEditId(null);
      fetchContacts();
    } catch (err: any) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce contact ?')) return;
    try {
      const res = await fetch('/api/contacts', { 
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (!res.ok) throw new Error();
      toast.success('Supprimé');
      fetchContacts();
    } catch { toast.error('Erreur suppression'); }
  };

  const handleUpload = async (file: File) => {
    const ext = file.name.split('.').pop();
    const path = `contacts/${Date.now()}.${ext}`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);
    formData.append('bucket', 'galerie-memorial');
    const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
    if (!res.ok) throw new Error('Upload échoué');
    return path;
  };

  const startEdit = (c: Contact) => {
    setEditId(c.id!);
    setForm({ ...c });
  };

  if (loading) return <div className="p-8 animate-pulse text-stone-400">Chargement...</div>;

  return (
    <div className="max-w-5xl space-y-10">
      <header>
        <h1 className="text-3xl font-serif text-farewell-charcoal">Contacts de la Famille</h1>
        <p className="text-stone-500 font-light">Gérez les personnes à contacter pour les condoléances ou informations.</p>
      </header>

      {/* Formulaire */}
      <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100 space-y-6">
        <h2 className="text-xl font-serif text-farewell-charcoal flex items-center gap-2">
          <Phone size={20} className="text-farewell-gold" />
          {editId ? 'Modifier le contact' : 'Ajouter un contact'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-stone-400">Nom Complet *</label>
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
            <label className="text-[10px] uppercase font-bold text-stone-400">Téléphone</label>
            <input type="text" value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} className="w-full bg-stone-50 border-none rounded-xl px-4 py-3 font-light" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-stone-400">Email</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full bg-stone-50 border-none rounded-xl px-4 py-3 font-light" />
          </div>
          
          <div className="space-y-1 md:col-span-2">
            <label className="text-[10px] uppercase font-bold text-stone-400">Adresse / Localisation</label>
            <input type="text" value={form.adresse} onChange={e => setForm({ ...form, adresse: e.target.value })} className="w-full bg-stone-50 border-none rounded-xl px-4 py-3 font-light" />
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-stone-400">Ordre d'affichage</label>
            <input type="number" value={form.ordre} onChange={e => setForm({ ...form, ordre: parseInt(e.target.value) || 0 })} className="w-full bg-stone-50 border-none rounded-xl px-4 py-3 font-light" />
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
            <button onClick={() => { setEditId(null); setForm({ ...emptyContact }); }} className="px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest text-stone-500 hover:text-stone-800 transition">Annuler</button>
          )}
        </div>
      </section>

      {/* Liste */}
      <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100">
        <h2 className="text-xl font-serif text-farewell-charcoal mb-6">Contacts Actuels</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map(c => (
            <div key={c.id} className="border border-stone-100 rounded-2xl p-6 relative group hover:border-farewell-gold/30 transition">
               <h3 className="font-bold text-farewell-charcoal">{c.nom}</h3>
               <p className="text-xs font-bold text-farewell-gold uppercase tracking-wider mb-3">{c.role}</p>
               
               <div className="space-y-1 text-sm text-stone-500">
                 {c.telephone && <p>📞 {c.telephone}</p>}
                 {c.email && <p>✉️ {c.email}</p>}
                 {c.adresse && <p>📍 {c.adresse}</p>}
               </div>

               <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={() => startEdit(c)} className="p-1.5 bg-stone-100 rounded-lg hover:text-farewell-gold transition"><Edit size={14} /></button>
                  <button onClick={() => handleDelete(c.id!)} className="p-1.5 bg-red-50 text-red-400 rounded-lg hover:bg-red-100 transition"><Trash2 size={14} /></button>
               </div>
            </div>
          ))}
          {contacts.length === 0 && <div className="col-span-full py-8 text-center text-stone-400 text-sm">Aucun contact n'a été ajouté.</div>}
        </div>
      </section>
    </div>
  );
}
