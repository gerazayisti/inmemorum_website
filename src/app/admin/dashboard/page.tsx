'use client';

import { useEffect, useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  Images, 
  BookOpen, 
  Settings, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Erreur stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 animate-pulse text-stone-400">Initialisation du centre de contrôle...</div>;

  return (
    <div className="max-w-5xl space-y-10 pb-20">
      <header>
        <div className="flex items-center gap-3 text-farewell-gold mb-2">
          <ShieldCheck size={20} />
          <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Espace Administrateur</span>
        </div>
        <h1 className="text-4xl font-serif text-farewell-charcoal">Tableau de Bord</h1>
        <p className="text-stone-500 font-light mt-2 italic">Bienvenue dans l'interface de gestion de la mémoire familiale.</p>
      </header>

      {/* Alerte Modération */}
      {stats?.messages?.pending > 0 && (
        <Link 
          href="/admin/moderation"
          className="flex items-center justify-between p-6 bg-red-50 border-2 border-red-100 rounded-3xl group hover:border-red-200 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-2xl text-red-500 shadow-sm shadow-red-100">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-red-800 font-bold">Action requise : Modération</p>
              <p className="text-red-600/70 text-sm">{stats.messages.pending} message(s) en attente de validation.</p>
            </div>
          </div>
          <ArrowRight className="text-red-300 group-hover:translate-x-1 transition-transform" />
        </Link>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={MessageSquare} 
          label="Témoignages" 
          value={stats?.messages?.total || 0} 
          color="blue" 
          href="/admin/moderation"
        />
        <StatCard 
          icon={Images} 
          label="Médias" 
          value={stats?.medias || 0} 
          color="gold" 
          href="/admin/galerie"
        />
        <StatCard 
          icon={BookOpen} 
          label="Étapes Bio" 
          value={stats?.biographie || 0} 
          color="stone" 
          href="/admin/biographie"
        />
        <StatCard 
          icon={Calendar} 
          label="Dates Commém." 
          value={0} // À connecter si besoin de stats précises
          color="gray" 
          href="/admin/commemorations"
        />
      </div>

      {/* Quick Menu */}
      <section className="space-y-6">
        <h2 className="text-sm font-bold uppercase tracking-widest text-stone-400">Accès Rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MenuLink 
            href="/admin/hommage" 
            title="Éditer le Portrait" 
            desc="Nom, dates et texte d'intro"
            icon={Users}
          />
          <MenuLink 
            href="/admin/settings" 
            title="Configuration" 
            desc="Visibilité des rubriques"
            icon={Settings}
          />
          <MenuLink 
            href="/accueil" 
            title="Voir le site public" 
            desc="Aperçu pour les visiteurs"
            icon={ArrowRight}
            external
          />
        </div>
      </section>

      {/* Sawa Decor */}
      <div className="pt-10 opacity-5">
        <div className="h-16 w-full  bg-farewell-charcoal" />
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, href }: any) {
  return (
    <Link href={href} className="bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl bg-stone-50 group-hover:bg-stone-100 transition-colors`}>
          <Icon className="text-stone-400 group-hover:text-farewell-gold transition-colors" size={20} />
        </div>
        <span className="text-2xl font-serif text-farewell-charcoal">{value}</span>
      </div>
      <p className="text-[10px] uppercase font-bold text-stone-400 tracking-widest">{label}</p>
    </Link>
  );
}

function MenuLink({ href, title, desc, icon: Icon, external = false }: any) {
  return (
    <Link 
      href={href} 
      target={external ? "_blank" : undefined}
      className="flex items-center gap-4 p-6 bg-white rounded-3xl border border-stone-100 hover:border-farewell-gold/30 hover:shadow-lg hover:shadow-stone-100 transition-all group"
    >
      <div className="p-3 bg-stone-50 rounded-2xl text-stone-400 group-hover:text-farewell-charcoal group-hover:bg-stone-100 transition-colors">
        <Icon size={24} />
      </div>
      <div>
        <h3 className="font-bold text-farewell-charcoal text-sm">{title}</h3>
        <p className="text-stone-400 text-xs font-light">{desc}</p>
      </div>
    </Link>
  );
}
