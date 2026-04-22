"use client";

import { Header } from '@/components/Header';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-farewell-cream">
      {/* En-tête avec navigation intégrée */}
      <Header />

      {/* Contenu principal */}
      <main className="w-full min-h-screen">
        {children}
      </main>
    </div>
  );
}
