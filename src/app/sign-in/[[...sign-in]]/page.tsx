import { SignIn } from "@clerk/nextjs";
import { Anchor } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-sawa-foam flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-sawa-blue/5 rounded-full blur-3xl -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sawa-gold/5 rounded-full blur-3xl -ml-48 -mb-48" />
      
      {/* Logo/Icon */}
      <div className="mb-8 flex flex-col items-center space-y-4 relative z-10">
        <div className="p-4 bg-white rounded-full shadow-lg ring-1 ring-stone-100">
          <Anchor size={32} className="text-sawa-blue" />
        </div>
        <h1 className="text-3xl font-serif text-sawa-blue uppercase tracking-widest text-center">
          Mémorial Familial
        </h1>
        <div className="w-12 h-1 bg-sawa-gold/30 rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <SignIn 
          path="/sign-in" 
          routing="path" 
          signUpUrl="/sign-up" 
        />
      </div>

      <p className="mt-8 text-stone-400 text-xs font-light uppercase tracking-widest relative z-10">
        Espace de Recueillement Privé
      </p>
    </div>
  );
}
