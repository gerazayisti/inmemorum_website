'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface MessageFormProps {
  onSubmit: (data: { auteur: string; contenu: string }) => Promise<void>;
}

export function MessageForm({ onSubmit }: MessageFormProps) {
  const [auteur, setAuteur] = useState('');
  const [contenu, setContenu] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auteur || !contenu) return;

    setLoading(true);
    try {
      await onSubmit({ auteur, contenu });
      setSent(true);
      toast.success('Message envoyé ! Il sera visible après modération.');
    } catch (error) {
      console.error(error);
      toast.error('Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="bg-stone-50 border border-stone-200 p-8 rounded-3xl text-center space-y-3">
        <h3 className="text-xl font-serif text-sawa-blue">Merci pour votre message</h3>
        <p className="text-stone-500 text-sm font-light">
          Votre témoignage a été transmis à la famille et sera publié après validation.
        </p>
        <button 
          onClick={() => setSent(false)}
          className="text-sawa-gold uppercase text-xs tracking-widest font-bold pt-4 hover:underline"
        >
          Écrire un autre message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-xl border border-stone-100 space-y-6">
      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 ml-1">
            Votre Nom
          </label>
          <input 
            type="text" 
            required
            value={auteur}
            onChange={(e) => setAuteur(e.target.value)}
            className="w-full bg-stone-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-sawa-gold/30 transition-all font-light"
            placeholder="Ex: Jean Dupont"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 ml-1">
            Votre Témoignage
          </label>
          <textarea 
            required
            rows={4}
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            className="w-full bg-stone-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-sawa-gold/30 transition-all font-light resize-none"
            placeholder="Partagez un souvenir, un hommage..."
          />
        </div>
      </div>

      <button 
        type="submit"
        disabled={loading}
        className="w-full bg-sawa-blue text-white py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-black/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <Send size={18} />
            Envoyer mon message
          </>
        )}
      </button>

      <p className="text-center text-[10px] text-stone-400 italic">
        * Les messages sont modérés avant publication pour préserver l'intimité de la famille.
      </p>
    </form>
  );
}
