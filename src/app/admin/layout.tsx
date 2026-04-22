'use client';

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, MessageSquare, Images, Settings, Users } from "lucide-react";

const navLinks = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Vue d'ensemble" },
  { href: "/admin/hommage", icon: Settings, label: "Hommage" },
  { href: "/admin/personnes", icon: Users, label: "Personnes" },
  { href: "/admin/biographie", icon: BookOpen, label: "Biographie" },
  { href: "/admin/moderation", icon: MessageSquare, label: "Modération" },
  { href: "/admin/galerie", icon: Images, label: "Galerie" }
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-stone-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-farewell-cream border-r border-farewell-stone text-farewell-charcoal flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-serif text-farewell-gold tracking-wider font-bold">
            ADMINISTRATEUR
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
            const Icon = link.icon;
            
            return (
              <Link 
                key={link.href}
                href={link.href} 
                className={`flex items-center gap-3 p-3 rounded-xl transition border ${
                  isActive 
                    ? 'bg-white text-farewell-charcoal shadow-sm border-farewell-stone' 
                    : 'border-transparent text-stone-500 hover:bg-white hover:text-farewell-charcoal hover:shadow-sm hover:border-farewell-stone'
                }`}
              >
                <Icon size={20} className={isActive ? "text-farewell-gold" : ""} />
                <span className="font-bold text-sm">{link.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-farewell-stone flex items-center justify-between bg-white text-farewell-charcoal">
          <UserButton />
          <Link href="/accueil" className="text-xs text-stone-400 hover:text-farewell-charcoal uppercase transition font-bold">
            Voir le site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
