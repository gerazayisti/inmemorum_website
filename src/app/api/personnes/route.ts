import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET — Liste toutes les personnes célébrées
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('personnes_celebrees')
      .select('*')
      .order('is_principal', { ascending: false })
      .order('ordre', { ascending: true });

    if (error) throw error;

    // Générer URLs signées pour les photos
    const withSignedUrls = await Promise.all(
      (data || []).map(async (p: any) => {
        if (p.photo_url && !p.photo_url.startsWith('http')) {
          const { data: signed } = await supabaseAdmin.storage
            .from('galerie-memorial')
            .createSignedUrl(p.photo_url, 3600);
          return { ...p, photo_url: signed?.signedUrl || p.photo_url };
        }
        return p;
      })
    );

    return NextResponse.json(withSignedUrls);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST — Ajouter une personne
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    
    // Si is_principal = true, mettre les autres en false
    if (body.is_principal) {
      await supabaseAdmin
        .from('personnes_celebrees')
        .update({ is_principal: false })
        .neq('id', 0); // tous
    }

    const { data, error } = await supabaseAdmin
      .from('personnes_celebrees')
      .insert(body)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH — Modifier une personne
export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) return NextResponse.json({ error: 'ID requis' }, { status: 400 });

    // Nettoyer les URLs signées 
    if (updateData.photo_url?.startsWith('http')) {
      delete updateData.photo_url;
    }

    // Si is_principal = true, mettre les autres en false
    if (updateData.is_principal) {
      await supabaseAdmin
        .from('personnes_celebrees')
        .update({ is_principal: false })
        .neq('id', id);
    }

    const { data, error } = await supabaseAdmin
      .from('personnes_celebrees')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE — Supprimer une personne
export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID requis' }, { status: 400 });

    const { error } = await supabaseAdmin
      .from('personnes_celebrees')
      .delete()
      .eq('id', Number(id));

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
