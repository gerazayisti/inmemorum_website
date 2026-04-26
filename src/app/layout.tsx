import type { Metadata } from "next";
import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
import { createClient } from "@supabase/supabase-js";

const cinzel = localFont({
  src: [
    {
      path: "../../public/font/cinzel/Cinzel-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/font/cinzel/Cinzel-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/font/cinzel/Cinzel-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-cinzel",
});

const cormorant = localFont({
  src: [
    {
      path: "../../public/font/CormorantGaramond-VariableFont_wght.ttf",
      style: "normal",
    },
    {
      path: "../../public/font/CormorantGaramond-Italic-VariableFont_wght.ttf",
      style: "italic",
    },
  ],
  variable: "--font-serif",
});

const centuryGothic = localFont({
  src: [
    {
      path: "../../public/font/centurygothic.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/font/centurygothic_bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-sans",
});

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
          colorPrimary: '#0a0a08',
          colorTextBase: '#0a0a08',
          fontFamily: 'var(--font-sans)',
        },
        elements: {
          card: 'bg-ivoire-chaud shadow-xl border border-gris-noble rounded-[2rem]',
          headerTitle: 'font-cinzel text-2xl text-noir-encre',
          headerSubtitle: 'text-gris-noble font-light',
          socialButtonsBlockButton: 'border-gris-noble hover:bg-white',
          formButtonPrimary: 'bg-noir-encre hover:bg-gris-noble transition-all rounded-xl py-3',
          footerActionLink: 'text-or-noble hover:text-noir-encre font-semibold',
        }
      }}
    >
      <html
        lang="fr"
        className={`${cinzel.variable} ${cormorant.variable} ${centuryGothic.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col font-sans">
          {children}
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: '#0a0a08',
                color: '#f7f2e8',
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                borderRadius: '1rem',
                border: '1px solid rgba(201,168,76,0.2)',
              },
              success: { iconTheme: { primary: '#c9a84c', secondary: '#f7f2e8' } },
            }}
          />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
