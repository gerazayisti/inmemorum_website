import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { LayoutDashboard, BookOpen, MessageSquare, Images, Settings, Users } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-stone-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-farewell-charcoal text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-serif text-farewell-gold tracking-wider">
            ADMINISTRATEUR
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <Link href="/admin/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition">
            <LayoutDashboard size={20} />
            <span>Vue d'ensemble</span>
          </Link>
          <Link href="/admin/hommage" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition">
            <Settings size={20} />
            <span>Hommage</span>
          </Link>
          <Link href="/admin/personnes" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition">
            <Users size={20} />
            <span>Personnes</span>
          </Link>
          <Link href="/admin/biographie" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition">
            <BookOpen size={20} />
            <span>Biographie</span>
          </Link>
          <Link href="/admin/moderation" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition">
            <MessageSquare size={20} />
            <span>Modération</span>
          </Link>
          <Link href="/admin/galerie" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition">
            <Images size={20} />
            <span>Galerie</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10 flex items-center justify-between">
          <UserButton />
          <Link href="/accueil" className="text-xs text-stone-400 hover:text-white uppercase transition">
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
