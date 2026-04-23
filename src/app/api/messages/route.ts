import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

// Utilisation de la clé service role pour contourner le RLS en toute sécurité côté serveur
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/messages - Récupérer les messages approuvés
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('messages')
      .select('*')
      .eq('approuve', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/messages - Déposer un nouveau message
export async function POST(req: Request) {
  try {
    const { auteur, contenu } = await req.json();

    if (!auteur || !contenu) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('messages')
      .insert([{ auteur, contenu, approuve: false }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Erreur API POST messages:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH /api/messages - Gérer les réactions OU l'approbation admin
export async function PATCH(req: Request) {
  try {
    const { id, type, approuve } = await req.json();

    let updates: any = {};
    
    if (approuve !== undefined) {
      // Cas : Modération (Approbation) - Doit être admin
      const { userId } = await auth();
      if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      updates = { approuve };
    } else if (type) {
      // Cas : Réactions emoji
      const { data: message } = await supabaseAdmin
        .from('messages')
        .select('reactions')
        .eq('id', id)
        .single();
      
      const reactions = { ...message?.reactions };
      reactions[type] = (reactions[type] || 0) + 1;
      updates = { reactions };
    }

    const { data, error } = await supabaseAdmin
      .from('messages')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/messages - Supprimer un message (Admin)
export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await req.json();
    const { error } = await supabaseAdmin
      .from('messages')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
