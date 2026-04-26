'use client';

import { useEffect, useState } from 'react';
import { MapPin, Plus, X, Trash2, Edit2, Save, Navigation, MousePointer2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import dynamic from 'next/dynamic';

const LocationPickerMap = dynamic(() => import('@/components/Map/LocationPickerMap'), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-stone-100 animate-pulse flex items-center justify-center text-stone-400">Chargement de la carte...</div>
});

const LIEU_TYPES = [
  { value: 'residence', label: 'Résidence' },
  { value: 'ceremonie', label: 'Lieu de Cérémonie' },
  { value: 'reception', label: 'Lieu de Réception' },
  { value: 'autre', label: 'Autre' },
];

export default function AdminLocalisation() {
  const [lieux, setLieux] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    nom: '', description: '', adresse: '', latitude: '', longitude: '', type: 'residence', ordre: 0
  });

  useEffect(() => { 
    fetchLieux();
  }, []);

  const fetchLieux = async () => {
    try {
      const res = await fetch('/api/lieux');
      const data = await res.json();
      setLieux(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ nom: '', description: '', adresse: '', latitude: '', longitude: '', type: 'residence', ordre: 0 });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!form.nom.trim()) { toast.error('Le nom est requis'); return; }
    try {
      const payload = {
        ...form,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
        ordre: form.ordre || 0,
      };

      if (editingId) {
        const res = await fetch('/api/lieux', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...payload }),
        });
        if (!res.ok) throw new Error('Erreur');
        toast.success('Lieu modifié');
      } else {
        const res = await fetch('/api/lieux', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Erreur');
        toast.success('Lieu ajouté');
      }
      resetForm();
      fetchLieux();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleEdit = (lieu: any) => {
    setForm({
      nom: lieu.nom || '',
      description: lieu.description || '',
      adresse: lieu.adresse || '',
      latitude: lieu.latitude?.toString() || '',
      longitude: lieu.longitude?.toString() || '',
      type: lieu.type || 'residence',
      ordre: lieu.ordre || 0,
    });
    setEditingId(lieu.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce lieu ?')) return;
    try {
      const res = await fetch('/api/lieux', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        toast.success('Lieu supprimé');
        fetchLieux();
      }
    } catch (e) { toast.error('Erreur'); }
  };

  const getTypeLabel = (type: string) => LIEU_TYPES.find(t => t.value === type)?.label || type;

  if (loading) return <div className="p-8 animate-pulse text-stone-400">Chargement des lieux...</div>;

  return (
    <div className="max-w-5xl space-y-8 pb-20">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif text-farewell-charcoal">Plan de Localisation</h1>
          <p className="text-stone-500 font-light">Gérez les lieux importants pour les visiteurs.</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsAdding(true); }}
          className="flex items-center gap-2 bg-farewell-charcoal text-white px-6 py-2.5 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-stone-800 transition"
        >
          <Plus size={16} />
          Ajouter un lieu
        </button>
      </header>

      {/* Formulaire */}
      {isAdding && (
        <div className="bg-white p-8 rounded-[2rem] shadow-xl border-2 border-farewell-charcoal/10 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-farewell-charcoal text-lg">
              {editingId ? 'Modifier le lieu' : 'Nouveau Lieu'}
            </h3>
            <button onClick={resetForm}><X size={20} className="text-stone-400" /></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-stone-400">Nom du lieu *</label>
              <input
                className="w-full bg-stone-50 p-3 rounded-xl border-none font-light"
                value={form.nom}
                onChange={e => setForm({ ...form, nom: e.target.value })}
                placeholder="Ex: Domicile Familial"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-stone-400">Type</label>
              <select
                className="w-full bg-stone-50 p-3 rounded-xl border-none font-light"
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value })}
              >
                {LIEU_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] uppercase font-bold text-stone-400">Adresse complète</label>
              <input
                className="w-full bg-stone-50 p-3 rounded-xl border-none font-light"
                value={form.adresse}
                onChange={e => setForm({ ...form, adresse: e.target.value })}
                placeholder="123 Rue Exemple, Ville, Pays"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-stone-400">Latitude</label>
              <input
                type="number"
                step="any"
                className="w-full bg-stone-50 p-3 rounded-xl border-none font-light"
                value={form.latitude}
                onChange={e => setForm({ ...form, latitude: e.target.value })}
                placeholder="Ex: 5.9631"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-stone-400">Longitude</label>
              <input
                type="number"
                step="any"
                className="w-full bg-stone-50 p-3 rounded-xl border-none font-light"
                value={form.longitude}
                onChange={e => setForm({ ...form, longitude: e.target.value })}
                placeholder="Ex: 10.1591"
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] uppercase font-bold text-stone-400">Description</label>
              <textarea
                className="w-full bg-stone-50 p-3 rounded-xl border-none font-light resize-none h-24"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Description du lieu (optionnel)"
              />
            </div>
            </div>
            
            <div className="space-y-3">
              <label className="text-[10px] uppercase font-bold text-stone-400 flex items-center gap-2">
                <MousePointer2 size={12} />
                Ou choisissez sur la carte (cliquez pour placer le marqueur)
              </label>
              <div className="h-[300px] rounded-2xl overflow-hidden border border-stone-200">
                <LocationPickerMap 
                  lat={form.latitude ? parseFloat(form.latitude) : null}
                  lng={form.longitude ? parseFloat(form.longitude) : null}
                  onLocationSelect={(lat, lng) => setForm(f => ({ ...f, latitude: lat.toFixed(7), longitude: lng.toFixed(7) }))}
                />
              </div>
            </div>


          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-farewell-gold text-white px-8 py-3 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-yellow-600 transition"
          >
            <Save size={16} />
            {editingId ? 'Enregistrer les modifications' : 'Ajouter le lieu'}
          </button>
        </div>
      )}

      {/* Liste des lieux */}
      <div className="space-y-4">
        {lieux.map(lieu => (
          <div key={lieu.id} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex items-start gap-6 group hover:shadow-md transition">
            <div className="p-3 bg-farewell-cream rounded-xl shrink-0">
              <MapPin size={24} className="text-farewell-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-bold text-farewell-charcoal text-lg">{lieu.nom}</h3>
                <span className="text-[9px] uppercase tracking-widest font-bold text-farewell-gold bg-farewell-gold/10 px-2 py-0.5 rounded-full">
                  {getTypeLabel(lieu.type)}
                </span>
              </div>
              {lieu.adresse && <p className="text-stone-500 text-sm font-light">{lieu.adresse}</p>}
              {lieu.description && <p className="text-stone-400 text-sm font-light mt-1">{lieu.description}</p>}
              {lieu.latitude && lieu.longitude && (
                <p className="text-[10px] text-stone-300 mt-2 font-mono">
                  {lieu.latitude}, {lieu.longitude}
                </p>
              )}
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition shrink-0">
              <button
                onClick={() => handleEdit(lieu)}
                className="p-2 bg-stone-100 text-stone-500 rounded-lg hover:bg-stone-200 transition"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => handleDelete(lieu.id)}
                className="p-2 bg-red-50 text-red-400 rounded-lg hover:bg-red-100 transition"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        {lieux.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed border-stone-100 rounded-[3rem]">
            <Navigation className="mx-auto text-stone-200 mb-4" size={48} />
            <p className="text-stone-400 font-serif italic text-lg">Aucun lieu ajouté pour le moment.</p>
            <p className="text-stone-300 text-sm mt-2">Ajoutez des résidences, lieux de cérémonie, etc.</p>
          </div>
        )}
      </div>
    </div>
  );
}
