import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await supabase.from('hommage').select('nom').single();
  const personName = data?.nom || "Mémorial Familial";

  return {
    title: `${personName} — Espace de Souvenir`,
    description: `Un espace de recueillement et de partage privé en mémoire de ${personName}.`,
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title: `${personName} — Mémorial`,
      description: `Rejoignez la famille pour partager des souvenirs.`,
      images: ['/og-image.jpg'],
    },
    icons: {
      icon: '/favicon.svg',
    }
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#222222',
          colorTextBase: '#222222',
          fontFamily: 'var(--font-sans)',
        },
        elements: {
          card: 'bg-farewell-cream shadow-xl border border-farewell-stone rounded-[2rem]',
          headerTitle: 'font-serif text-2xl text-farewell-charcoal',
          headerSubtitle: 'text-stone-500 font-light',
          socialButtonsBlockButton: 'border-farewell-stone hover:bg-white',
          formButtonPrimary: 'bg-farewell-charcoal hover:bg-farewell-wood transition-all rounded-xl py-3',
          footerActionLink: 'text-farewell-gold hover:text-farewell-charcoal font-semibold',
        }
      }}
    >
      <html
        lang="fr"
        className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col font-sans">
          {children}
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: '#222222',
                color: '#F9F7F2',
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                borderRadius: '1rem',
                border: '1px solid rgba(166,139,91,0.2)',
              },
              success: { iconTheme: { primary: '#A68B5B', secondary: '#F9F7F2' } },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
