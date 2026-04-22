'use client';

import { useEffect, useState } from 'react';
import { ShieldCheck, CheckCircle, Trash2, Clock, User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function AdminModeration() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    // Note: On peut vouloir voir tous les messages pour pouvoir en supprimer des déjà approuvés
    const { data } = await (await fetch('/api/messages/admin')).json();
    // Attendre l'API admin ou utiliser un paramètre ?
    // Créons une route admin dédiée pour voir TOUS les messages
    const res = await fetch('/api/messages/admin');
    const allMessages = await res.json();
    setMessages(allMessages || []);
    setLoading(false);
  };

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch('/api/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, approuve: true }),
      });
      if (res.ok) {
        toast.success('Message approuvé');
        fetchMessages();
      }
    } catch (e) { toast.error('Erreur'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer définitivement ce message ?')) return;
    try {
      const res = await fetch('/api/messages', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        toast.success('Message supprimé');
        fetchMessages();
      }
    } catch (e) { toast.error('Erreur'); }
  };

  if (loading) return <div className="p-8 animate-pulse text-stone-400">Chargement des messages...</div>;

  const pending = messages.filter(m => !m.approuve);
  const approved = messages.filter(m => m.approuve);

  return (
    <div className="max-w-4xl space-y-12 pb-20">
      <header>
        <h1 className="text-3xl font-serif text-sawa-blue flex items-center gap-3">
          <ShieldCheck className="text-sawa-gold" size={32} />
          Modération du Livre d'Or
        </h1>
        <p className="text-stone-500 font-light mt-1">Gérez les témoignages déposés par les visiteurs.</p>
      </header>

      {/* Messages en attente */}
      <section className="space-y-6">
        <h2 className="text-sm font-bold uppercase tracking-widest text-stone-400 flex items-center gap-2">
          <Clock size={16} />
          Messages en attente ({pending.length})
        </h2>
        
        {pending.length === 0 ? (
          <div className="bg-stone-50 border border-stone-100 p-8 rounded-3xl text-center text-stone-400 italic">
            Aucun message en attente de modération.
          </div>
        ) : (
          <div className="grid gap-4">
            {pending.map(msg => (
              <div key={msg.id} className="bg-white p-6 rounded-[2rem] shadow-sm border-2 border-sawa-gold/20 flex justify-between items-start">
                <div className="space-y-2 flex-1 pr-8">
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-sawa-gold" />
                    <span className="font-bold text-sawa-blue">{msg.auteur}</span>
                    <span className="text-[10px] text-stone-300">• {format(new Date(msg.created_at), 'd MMM yyyy HH:mm', { locale: fr })}</span>
                  </div>
                  <p className="text-stone-600 font-light italic">"{msg.contenu}"</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleApprove(msg.id)}
                    className="p-3 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition shadow-lg shadow-green-100"
                    title="Approuver"
                  >
                    <CheckCircle size={20} />
                  </button>
                  <button 
                    onClick={() => handleDelete(msg.id)}
                    className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition"
                    title="Supprimer"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Archive des messages approuvés */}
      <section className="space-y-6">
        <h2 className="text-sm font-bold uppercase tracking-widest text-stone-400">Archive des Témoignages ({approved.length})</h2>
        <div className="grid gap-3">
          {approved.map(msg => (
            <div key={msg.id} className="bg-stone-50/50 p-4 rounded-2xl flex justify-between items-center group">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-stone-600">{msg.auteur}</span>
                  <span className="text-stone-300">{format(new Date(msg.created_at), 'd MMM', { locale: fr })}</span>
                </div>
                <p className="text-stone-400 text-sm italic truncate max-w-lg">"{msg.contenu}"</p>
              </div>
              <button 
                onClick={() => handleDelete(msg.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-stone-300 hover:text-red-500 transition"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
