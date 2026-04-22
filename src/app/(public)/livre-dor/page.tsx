import { useEffect, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { MessageCard } from '@/components/LivreDor/MessageCard';
import { MessageForm } from '@/components/LivreDor/MessageForm';
import { FarewellSeparator } from '@/components/FarewellSeparator';

export default function PublicLivreDor() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();
      setMessages(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostMessage = async (formData: { auteur: string; contenu: string }) => {
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Erreur lors de la soumission');
    }
    // Refresh after post
    fetchMessages();
  };

  const handleReact = async (id: string, type: string) => {
    const res = await fetch('/api/messages', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, type }),
    });

    if (res.ok) {
      const updatedMessage = await res.json();
      setMessages(messages.map(m => m.id === id ? updatedMessage : m));
    }
  };

  return (
    <div className="py-20 px-8 space-y-24 bg-farewell-cream min-h-screen pb-40">
      {/* Header */}
      <header className="text-center space-y-6 max-w-2xl mx-auto">
        <div className="flex justify-center mb-4">
            <div className="p-1 bg-farewell-gold/20 rounded-full">
               <div className="p-4 bg-white rounded-full shadow-sm border border-farewell-stone">
                  <MessageSquare className="text-farewell-gold" size={32} strokeWidth={1.5} />
               </div>
            </div>
        </div>
        <h2 className="text-4xl md:text-5xl font-serif text-farewell-charcoal uppercase tracking-widest leading-tight">Livre d'Honneur</h2>
        <div className="w-12 h-[1px] bg-farewell-gold/40 mx-auto" />
        <p className="text-stone-500 font-serif italic text-lg leading-relaxed max-w-sm mx-auto">
          "Un espace dédié aux témoignages, prières et souvenirs de ceux qui l'ont côtoyé."
        </p>
      </header>

      <FarewellSeparator />

      {/* Form Section */}
      <div className="max-w-2xl mx-auto">
        <MessageForm onSubmit={handlePostMessage} />
      </div>

      <FarewellSeparator />

      {/* Messages List */}
      <div className="max-w-2xl mx-auto space-y-12 pb-32">
        <div className="flex items-center gap-6">
          <div className="h-[1px] flex-1 bg-farewell-stone" />
          <h3 className="text-farewell-gold text-[10px] uppercase tracking-[0.4em] font-bold">Mots de Réconfort</h3>
          <div className="h-[1px] flex-1 bg-farewell-stone" />
        </div>

        {loading ? (
          <div className="py-20 text-center animate-pulse space-y-8">
            <div className="h-4 w-32 bg-stone-200 mx-auto rounded" />
            <div className="h-44 w-full bg-white rounded-[2.5rem] border border-farewell-stone" />
          </div>
        ) : (
          <div className="space-y-8">
            {messages.map((msg) => (
              <MessageCard 
                key={msg.id} 
                message={msg} 
                onReact={handleReact}
              />
            ))}
            
            {messages.length === 0 && (
              <div className="py-32 text-center bg-white/50 rounded-[3rem] border border-farewell-stone shadow-inner">
                <p className="text-stone-400 font-serif italic text-xl">Soyez le premier à laisser un témoignage en l'honneur de sa mémoire.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <FarewellSeparator />
    </div>
  );
}
