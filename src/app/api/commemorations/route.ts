import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/commemorations - Récupérer l'agenda des dates importantes
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('commemorations')
      .select('*')
      .order('date', { ascending: true });

    if (error) throw error;

    // Générer des URLs signées pour les photos si nécessaire
    const items = await Promise.all((data || []).map(async (item: any) => {
      if (item.photo_url && !item.photo_url.startsWith('http')) {
        const { data: signedData } = await supabaseAdmin.storage
          .from('galerie-memorial')
          .createSignedUrl(item.photo_url, 3600);
        return { ...item, photo_url: signedData?.signedUrl || item.photo_url };
      }
      return item;
    }));

    return NextResponse.json(items);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/commemorations - Ajouter une date
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { data, error } = await supabaseAdmin
      .from('commemorations')
      .insert([body])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH /api/commemorations - Modifier une date
export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id, ...updates } = await req.json();
    const { data, error } = await supabaseAdmin
      .from('commemorations')
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

// DELETE /api/commemorations - Supprimer une date
export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await req.json();
    const { error } = await supabaseAdmin
      .from('commemorations')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
