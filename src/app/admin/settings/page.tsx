'use client';

import { useEffect, useState } from 'react';
import { Settings, Eye, EyeOff, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function AdminSettings() {
  const [settings, setSettings] = useState<any>({
    site_title: '',
    show_biographie: true,
    show_galerie: true,
    show_livredor: true,
    show_commemorations: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data) {
        setSettings({
          ...data,
          site_title: data.site_title || ''
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key: string) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        toast.success('Paramètres enregistrés');
      } else {
        toast.error('Erreur lors de l\'enregistrement');
      }
    } catch (error) {
      toast.error('Erreur réseau');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 animate-pulse text-stone-400">Chargement des paramètres...</div>;

  return (
    <div className="max-w-4xl space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif text-farewell-charcoal">Paramètres du Site</h1>
          <p className="text-stone-500 font-light">Contrôlez la visibilité des rubriques publiques.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-farewell-charcoal text-white px-6 py-2.5 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-stone-800 transition disabled:opacity-50"
        >
          {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
          Enregistrer les modifications
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card: Visibilité */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100 space-y-6">
          <h2 className="text-xl font-serif text-farewell-charcoal flex items-center gap-2">
            <Eye size={20} className="text-farewell-gold" />
            Visibilité des Rubriques
          </h2>
          
          <div className="space-y-4">
            <VisibilityToggle 
              label="Biographie / Ligne de vie" 
              active={settings.show_biographie} 
              onToggle={() => handleToggle('show_biographie')} 
            />
            <VisibilityToggle 
              label="Galerie Photos & Vidéos" 
              active={settings.show_galerie} 
              onToggle={() => handleToggle('show_galerie')} 
            />
            <VisibilityToggle 
              label="Livre d'Or (Témoignages)" 
              active={settings.show_livredor} 
              onToggle={() => handleToggle('show_livredor')} 
            />
            <VisibilityToggle 
              label="Agenda & Commémorations" 
              active={settings.show_commemorations} 
              onToggle={() => handleToggle('show_commemorations')} 
            />
          </div>
        </div>

        {/* Card: Informations Générales */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100 space-y-6">
          <h2 className="text-xl font-serif text-farewell-charcoal flex items-center gap-2">
            <Settings size={20} className="text-farewell-gold" />
            Configuration Générale
          </h2>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-stone-400">Titre du Site</label>
              <input 
                type="text" 
                value={settings.site_title}
                onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
                className="w-full bg-stone-50 border-none rounded-xl px-4 py-2 font-light"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VisibilityToggle({ label, active, onToggle }: { label: string; active: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl">
      <span className="text-sm text-stone-600 font-medium">{label}</span>
      <button
        onClick={onToggle}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
          active 
          ? 'bg-green-100 text-green-700' 
          : 'bg-stone-200 text-stone-500'
        }`}
      >
        {active ? <Eye size={14} /> : <EyeOff size={14} />}
        {active ? 'Visible' : 'Masqué'}
      </button>
    </div>
  );
}
