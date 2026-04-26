'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { Menu, X, ShieldCheck } from 'lucide-react';

export function Header() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const [settings, setSettings] = useState<any>(null);
  const [hommage, setHommage] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => {});

    fetch('/api/hommage')
      .then(res => res.json())
      .then(data => setHommage(data))
      .catch(() => {});
  }, []);

  const navLinks = [
    { href: '/accueil', label: 'Accueil', show: true },
    { href: '/celebres', label: 'Célébrés', show: settings?.show_celebres ?? true },
    { href: '/biographie', label: 'Ligne de vie', show: settings?.show_biographie ?? true },
    { href: '/mediatheque', label: 'Médiathèque', show: settings?.show_mediatheque ?? true },
    { href: '/livre-dor', label: 'Témoignages', show: settings?.show_livredor ?? true },
    { href: '/commemorations', label: 'Agenda', show: settings?.show_commemorations ?? true },
    { href: '/arbre', label: 'Arbre', show: settings?.show_arbre ?? true },
    { href: '/localisation', label: 'Localisation', show: settings?.show_localisation ?? true },
    { href: '/contact', label: 'Famille', show: settings?.show_contact ?? true },
  ].filter(l => l.show);

  return (
    <header className="w-full bg-ivoire-chaud/95 backdrop-blur-md sticky top-0 z-[100] border-b border-gris-noble">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-5">

        {/* Logo */}
        <Link href="/accueil" className="group flex flex-col">
          {hommage?.logo_url ? (
            <img src={hommage.logo_url} alt="Logo" className="h-10 md:h-12 w-auto object-contain" />
          ) : (
            <>
              <span className="text-xl md:text-2xl font-cinzel text-noir-encre tracking-wide group-hover:text-or-noble transition-colors duration-300">
                {(() => {
                  const parts = hommage?.nom?.trim().split(/\s+/) || [];
                  if (parts.length <= 1) return hommage?.nom || 'Hommage';
                  return (
                    <>
                      <span className="capitalize">{parts[0]}</span>{' '}
                      <span className="font-bold uppercase">{parts.slice(1).join(' ')}</span>
                    </>
                  );
                })()}
              </span>
              <span className="text-[7px] uppercase tracking-[0.3em] text-or-noble font-bold">
                Mémorial Éternel
              </span>
            </>
          )}
        </Link>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`text-[11px] uppercase tracking-[0.25em] font-bold transition-colors duration-300 pb-1 border-b-2 ${
                  isActive
                    ? 'text-noir-encre border-or-noble'
                    : 'text-stone-400 border-transparent hover:text-noir-encre hover:border-or-noble/40'
                }`}
              >
                {label}
              </Link>
            );
          })}
          {isSignedIn && (
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2 ml-4 text-[11px] uppercase tracking-[0.25em] font-bold text-or-noble/70 hover:text-or-noble transition-colors border-b-2 border-transparent hover:border-or-noble/40 pb-1"
            >
              <ShieldCheck size={14} strokeWidth={2} />
              Admin
            </Link>
          )}
        </nav>

        {/* Burger – Mobile */}
        <button
          className="md:hidden p-2 text-noir-encre"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
        </button>
      </div>

      {/* Menu Mobile déroulant */}
      {menuOpen && (
        <div className="md:hidden bg-ivoire-chaud border-t border-gris-noble px-8 py-6 space-y-5 animate-in slide-in-from-top-2 duration-200">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`block text-sm uppercase tracking-[0.3em] font-bold transition-colors pb-3 border-b border-gris-noble ${
                  isActive ? 'text-noir-encre' : 'text-stone-400 hover:text-noir-encre'
                }`}
              >
                {label}
              </Link>
            );
          })}
          {isSignedIn && (
            <Link
              href="/admin/dashboard"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 text-sm uppercase tracking-[0.3em] font-bold text-farewell-gold/70 hover:text-farewell-gold transition-colors"
            >
              <ShieldCheck size={16} strokeWidth={1.5} />
              Admin
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
