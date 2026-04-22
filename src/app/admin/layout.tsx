import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { LayoutDashboard, BookOpen, MessageSquare, Images, Settings, Users } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
          <Link href="/admin/dashboard" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white text-stone-500 hover:text-farewell-charcoal hover:shadow-sm border border-transparent hover:border-farewell-stone transition">
            <LayoutDashboard size={20} />
            <span className="font-bold text-sm">Vue d'ensemble</span>
          </Link>
          <Link href="/admin/hommage" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white text-stone-500 hover:text-farewell-charcoal hover:shadow-sm border border-transparent hover:border-farewell-stone transition">
            <Settings size={20} />
            <span className="font-bold text-sm">Hommage</span>
          </Link>
          <Link href="/admin/personnes" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white text-stone-500 hover:text-farewell-charcoal hover:shadow-sm border border-transparent hover:border-farewell-stone transition">
            <Users size={20} />
            <span className="font-bold text-sm">Personnes</span>
          </Link>
          <Link href="/admin/biographie" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white text-stone-500 hover:text-farewell-charcoal hover:shadow-sm border border-transparent hover:border-farewell-stone transition">
            <BookOpen size={20} />
            <span className="font-bold text-sm">Biographie</span>
          </Link>
          <Link href="/admin/moderation" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white text-stone-500 hover:text-farewell-charcoal hover:shadow-sm border border-transparent hover:border-farewell-stone transition">
            <MessageSquare size={20} />
            <span className="font-bold text-sm">Modération</span>
          </Link>
          <Link href="/admin/galerie" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white text-stone-500 hover:text-farewell-charcoal hover:shadow-sm border border-transparent hover:border-farewell-stone transition">
            <Images size={20} />
            <span className="font-bold text-sm">Galerie</span>
          </Link>
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
