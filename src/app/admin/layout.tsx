'use client';

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, MessageSquare, Images, Settings, Users, ChevronLeft, ChevronRight, CalendarDays, Network, Phone, MapPin } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Vue d'ensemble" },
  { href: "/admin/hommage", icon: Settings, label: "Hommage" },
  { href: "/admin/personnes", icon: Users, label: "Famille & Contacts" },
  { href: "/admin/arbre", icon: Network, label: "Arbre Généalogique" },
  { href: "/admin/contact", icon: Phone, label: "Contacts Famille" },
  { href: "/admin/commemorations", icon: CalendarDays, label: "Agenda" },
  { href: "/admin/biographie", icon: BookOpen, label: "Biographie" },
  { href: "/admin/moderation", icon: MessageSquare, label: "Modération" },
  { href: "/admin/galerie", icon: Images, label: "Médiathèque" },
  { href: "/admin/localisation", icon: MapPin, label: "Localisation" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-stone-50 font-sans pb-20 md:pb-0">
      {/* Sidebar Desktop */}
      <aside className={`hidden md:flex flex-col bg-ivoire-chaud border-r border-gris-noble text-noir-encre transition-all duration-300 relative ${isCollapsed ? 'w-20' : 'w-64'}`}>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-8 bg-white border border-gris-noble rounded-full p-1 text-or-noble hover:text-noir-encre z-10 shadow-sm"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        <div className="p-6 h-20 flex items-center justify-center">
          <h1 className={`font-cinzel text-or-noble tracking-wider font-bold transition-all ${isCollapsed ? 'text-xs' : 'text-xl'}`}>
            {isCollapsed ? 'ADM' : 'ADMINISTRATEUR'}
          </h1>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto overflow-x-hidden">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
            const Icon = link.icon;
            
            return (
              <Link 
                key={link.href}
                href={link.href} 
                className={`flex items-center p-3 rounded-xl transition border ${
                  isActive 
                    ? 'bg-white text-noir-encre shadow-sm border-gris-noble' 
                    : 'border-transparent text-stone-500 hover:bg-white hover:text-noir-encre hover:shadow-sm hover:border-gris-noble'
                } ${isCollapsed ? 'justify-center' : 'gap-3'}`}
                title={link.label}
              >
                <Icon size={20} className={isActive ? "text-or-noble" : "shrink-0"} />
                {!isCollapsed && <span className="font-bold text-sm truncate">{link.label}</span>}
              </Link>
            )
          })}
        </nav>

        <div className={`p-4 border-t border-gris-noble flex items-center bg-white text-noir-encre ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <UserButton />
          {!isCollapsed && (
            <Link href="/accueil" className="text-xs text-stone-400 hover:text-noir-encre uppercase transition font-bold">
              Voir le site
            </Link>
          )}
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gris-noble z-50 flex justify-around items-center p-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {navLinks.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
          const Icon = link.icon;
          
          return (
            <Link 
              key={link.href}
              href={link.href} 
              className={`flex flex-col items-center p-2 rounded-xl transition ${
                isActive ? 'text-or-noble' : 'text-stone-400'
              }`}
            >
              <Icon size={24} className={isActive ? 'mb-1' : 'mb-1 opacity-70'} />
              <span className="text-[9px] font-medium tracking-wide">{link.label.split(' ')[0]}</span>
            </Link>
          )
        })}
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gris-noble">
          <h1 className="font-cinzel text-or-noble font-bold tracking-wider">ADMIN</h1>
          <div className="flex items-center gap-4">
             <Link href="/accueil" className="text-[10px] text-stone-500 hover:text-noir-encre uppercase font-bold tracking-widest">Le site</Link>
             <UserButton />
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
