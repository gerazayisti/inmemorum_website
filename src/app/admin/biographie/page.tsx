'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2, Save, X, BookOpen } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminBiographie() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ annee: '', titre: '', description: '' });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    const res = await fetch('/api/biographie');
    const data = await res.json();
    setEntries(data || []);
    setLoading(false);
  };

  const startEdit = (entry: any) => {
    setEditingId(entry.id);
    setEditForm({ 
      annee: entry.annee || '', 
      titre: entry.titre || '', 
      description: entry.description || '' 
    });
  };

  const handleSaveEdit = async () => {
    try {
      const res = await fetch('/api/biographie', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingId, ...editForm }),
      });
      if (res.ok) {
        toast.success('Entrée mise à jour');
        setEditingId(null);
        fetchEntries();
      }
    } catch (e) { toast.error('Erreur'); }
  };

  const handleAdd = async () => {
    try {
      const res = await fetch('/api/biographie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        toast.success('Événement ajouté');
        setIsAdding(false);
        setEditForm({ annee: '', titre: '', description: '' });
        fetchEntries();
      }
    } catch (e) { toast.error('Erreur'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet événement ?')) return;
    try {
      const res = await fetch('/api/biographie', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        toast.success('Événement supprimé');
        fetchEntries();
      }
    } catch (e) { toast.error('Erreur'); }
  };

  if (loading) return <div className="p-8 animate-pulse text-stone-400">Chargement de la chronologie...</div>;

  return (
    <div className="max-w-4xl space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif text-farewell-charcoal">Gestion de la Biographie</h1>
          <p className="text-stone-500 font-light">Gérez les étapes marquantes de la vie.</p>
        </div>
        <button
          onClick={() => { setIsAdding(true); setEditForm({ annee: '', titre: '', description: '' }); }}
          className="flex items-center gap-2 bg-farewell-gold text-white px-6 py-2.5 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-stone-800 transition"
        >
          <Plus size={16} />
          Ajouter une étape
        </button>
      </header>

      {/* Formulaire d'ajout */}
      {isAdding && (
        <div className="bg-white p-8 rounded-[2rem] shadow-lg border-2 border-farewell-gold/20 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-farewell-charcoal text-lg">Nouvelle Étape</h3>
            <button onClick={() => setIsAdding(false)}><X size={20} className="text-stone-400" /></button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <input 
              placeholder="Année" 
              className="bg-stone-50 p-3 rounded-xl border-none font-light"
              value={editForm.annee}
              onChange={e => setEditForm({ ...editForm, annee: e.target.value })}
            />
            <input 
              placeholder="Titre" 
              className="col-span-3 bg-stone-50 p-3 rounded-xl border-none font-light"
              value={editForm.titre}
              onChange={e => setEditForm({ ...editForm, titre: e.target.value })}
            />
          </div>
          <textarea 
            placeholder="Description détaillée..." 
            rows={3}
            className="w-full bg-stone-50 p-4 rounded-xl border-none font-light"
            value={editForm.description}
            onChange={e => setEditForm({ ...editForm, description: e.target.value })}
          />
          <button 
            onClick={handleAdd}
            className="w-full bg-farewell-charcoal text-white py-3 rounded-xl font-bold uppercase text-xs tracking-widest"
          >
            Enregistrer l'étape
          </button>
        </div>
      )}

      {/* Liste des entrées */}
      <div className="space-y-4">
        {entries.map((entry) => (
          <div key={entry.id} className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-stone-100 group">
            {editingId === entry.id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <input value={editForm.annee || ''} onChange={e => setEditForm({ ...editForm, annee: e.target.value })} className="bg-stone-50 p-2 rounded-lg border-none" />
                  <input value={editForm.titre || ''} onChange={e => setEditForm({ ...editForm, titre: e.target.value })} className="col-span-3 bg-stone-50 p-2 rounded-lg border-none" />
                </div>
                <textarea value={editForm.description || ''} onChange={e => setEditForm({ ...editForm, description: e.target.value })} className="w-full bg-stone-50 p-2 rounded-lg border-none" />
                <div className="flex gap-2">
                  <button onClick={handleSaveEdit} className="bg-green-500 text-white px-4 py-2 rounded-lg text-xs font-bold">Sauvegarder</button>
                  <button onClick={() => setEditingId(null)} className="bg-stone-200 text-stone-600 px-4 py-2 rounded-lg text-xs font-bold">Annuler</button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4">
                   <div className="bg-stone-50 p-3 rounded-xl">
                      <BookOpen className="text-stone-300" size={20} />
                   </div>
                   <div>
                      <span className="text-xs font-mono text-farewell-gold font-bold">{entry.annee}</span>
                      <h3 className="text-lg font-serif text-farewell-charcoal">{entry.titre}</h3>
                      <p className="text-stone-500 text-sm font-light mt-1 line-clamp-2">{entry.description}</p>
                   </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => startEdit(entry)} className="p-2 hover:bg-stone-100 rounded-lg text-stone-400 hover:text-farewell-charcoal"><Edit2 size={16} /></button>
                   <button onClick={() => handleDelete(entry.id)} className="p-2 hover:bg-red-50 rounded-lg text-stone-400 hover:text-red-500"><Trash2 size={16} /></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
