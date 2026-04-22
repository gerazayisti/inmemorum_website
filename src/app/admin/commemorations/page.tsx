'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Calendar, Save, X, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function AdminCommemorations() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ titre: '', date: '', description: '', recurrent: true });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const res = await fetch('/api/commemorations');
    const data = await res.json();
    setItems(data || []);
    setLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/commemorations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success('Date ajoutée');
        setIsAdding(false);
        setForm({ titre: '', date: '', description: '', recurrent: true });
        fetchItems();
      }
    } catch (e) { toast.error('Erreur'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette date ?')) return;
    try {
      const res = await fetch('/api/commemorations', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        toast.success('Date supprimée');
        fetchItems();
      }
    } catch (e) { toast.error('Erreur'); }
  };

  if (loading) return <div className="p-8 animate-pulse text-stone-400">Chargement de l'agenda...</div>;

  return (
    <div className="max-w-4xl space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif text-sawa-blue">Agenda des Commémorations</h1>
          <p className="text-stone-500 font-light">Gérez les dates anniversaire et moments de recueillement.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-sawa-gold text-white px-6 py-2.5 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-stone-800 transition"
        >
          <Plus size={16} />
          Ajouter une date
        </button>
      </header>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-white p-8 rounded-[2rem] shadow-xl border-2 border-sawa-gold/20 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-sawa-blue text-lg">Nouvel Événement</h3>
            <button type="button" onClick={() => setIsAdding(false)}><X size={20} className="text-stone-400" /></button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-stone-400">Titre de l'événement</label>
              <input 
                required
                className="w-full bg-stone-50 p-3 rounded-xl border-none font-light"
                value={form.titre || ''}
                onChange={e => setForm({ ...form, titre: e.target.value })}
                placeholder="Ex: Messe anniversaire"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-stone-400">Date</label>
              <input 
                type="date"
                required
                className="w-full bg-stone-50 p-3 rounded-xl border-none font-light"
                value={form.date || ''}
                onChange={e => setForm({ ...form, date: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-stone-400">Description / Message</label>
            <textarea 
              rows={2}
              className="w-full bg-stone-50 p-4 rounded-xl border-none font-light"
              value={form.description || ''}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Ex: Une prière sera dite en sa mémoire..."
            />
          </div>

          <div className="flex items-center gap-3">
             <input 
               type="checkbox" 
               id="recurrent"
               checked={form.recurrent}
               onChange={e => setForm({ ...form, recurrent: e.target.checked })}
               className="w-5 h-5 rounded border-stone-300 text-sawa-gold focus:ring-sawa-gold"
             />
             <label htmlFor="recurrent" className="text-sm text-stone-600 font-medium flex items-center gap-2">
                Événement annuel
                <RefreshCw size={14} className="text-stone-400" />
             </label>
          </div>

          <button 
            type="submit"
            className="w-full bg-sawa-blue text-white py-4 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-stone-800 transition"
          >
            Enregistrer dans l'agenda
          </button>
        </form>
      )}

      <div className="grid gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-stone-100 flex justify-between items-center group">
            <div className="flex items-center gap-6">
               <div className="p-4 bg-stone-50 rounded-2xl group-hover:bg-sawa-foam transition-colors">
                  <Calendar className="text-sawa-gold" size={24} />
               </div>
               <div>
                  <h3 className="text-lg font-serif text-sawa-blue">{item.titre}</h3>
                  <div className="flex items-center gap-3 text-xs text-stone-400 font-medium">
                     <span className="uppercase tracking-widest">{format(new Date(item.date), 'd MMMM', { locale: fr })}</span>
                     {item.recurrent && <span className="bg-stone-100 px-2 py-0.5 rounded-full text-[9px] uppercase">Annuel</span>}
                  </div>
                  {item.description && <p className="text-stone-400 text-sm font-light mt-1 italic">"{item.description}"</p>}
               </div>
            </div>
            <button 
              onClick={() => handleDelete(item.id)}
              className="opacity-0 group-hover:opacity-100 p-3 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}

        {items.length === 0 && !isAdding && (
          <div className="py-20 text-center border-2 border-dashed border-stone-100 rounded-[3rem]">
            <p className="text-stone-400 font-serif italic">L'agenda est vide.</p>
          </div>
        )}
      </div>
    </div>
  );
}
