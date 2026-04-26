'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Images, MessageSquare, ShieldCheck, Calendar, Star, Trees, Users, MapPin } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';

export function Navbar() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => {});
  }, []);

  const navLinks = [
    { href: '/accueil', icon: Home, label: 'Hommage', show: true },
    { href: '/celebres', icon: Star, label: 'Célébrés', show: settings?.show_celebres ?? true },
    { href: '/biographie', icon: BookOpen, label: 'Sa Vie', show: settings?.show_biographie ?? true },
    { href: '/mediatheque', icon: Images, label: 'Média', show: settings?.show_mediatheque ?? true },
    { href: '/livre-dor', icon: MessageSquare, label: 'Livre d\'or', show: settings?.show_livredor ?? true },
    { href: '/commemorations', icon: Calendar, label: 'Dates', show: settings?.show_commemorations ?? true },
    { href: '/arbre', icon: Trees, label: 'Arbre', show: settings?.show_arbre ?? true },
    { href: '/localisation', icon: MapPin, label: 'Lieux', show: settings?.show_localisation ?? true },
    { href: '/contact', icon: Users, label: 'Famille', show: settings?.show_contact ?? true },
  ].filter(link => link.show);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-ivoire-chaud/95 backdrop-blur-md border-t border-gris-noble safe-area-pb">
      <div className="max-w-md mx-auto flex justify-around items-center h-16 px-4">
        {navLinks.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                isActive ? 'text-noir-encre scale-105' : 'text-stone-400 hover:text-or-noble'
              }`}
            >
              <Icon size={isActive ? 22 : 20} strokeWidth={isActive ? 2 : 1.5} />
              <span className={`text-[9px] uppercase tracking-[0.2em] font-cinzel ${isActive ? 'font-bold' : 'font-medium'}`}>
                {label}
              </span>
            </Link>
          );
        })}
        
        {/* Lien Admin flottant pour les admins connectés */}
        {isSignedIn && (
          <Link 
            href="/admin/dashboard" 
            className="flex flex-col items-center gap-1 text-or-noble/60 hover:text-or-noble transition-colors"
          >
            <ShieldCheck size={20} strokeWidth={1.5} />
            <span className="text-[9px] uppercase font-bold tracking-[0.2em] font-cinzel">Admin</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
