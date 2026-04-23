import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BUCKET_NAME = 'galerie-memorial';

// GET /api/galerie - Récupérer les médias avec URLs signées
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type'); // photo, video, document
    const categorie = searchParams.get('categorie'); // livret_programme, livre_hommage, faire_part

    let query = supabaseAdmin
      .from('medias')
      .select('*')
      .order('created_at', { ascending: false });

    if (type === 'photo') {
      query = query.eq('type', 'photo');
    } else if (type === 'video') {
      query = query.eq('type', 'video');
    } else if (type === 'document') {
      query = query.eq('type', 'pdf');
    }

    if (categorie) {
      query = query.eq('categorie', categorie);
    }

    const { data: medias, error } = await query;

    if (error) throw error;

    // Générer des URLs signées pour chaque média
    const mediasWithUrls = await Promise.all((medias || []).map(async (media) => {
      const storagePath = media.url;
      const { data, error: urlError } = await supabaseAdmin
        .storage
        .from(BUCKET_NAME)
        .createSignedUrl(storagePath, 3600);

      return {
        ...media,
        storage_path: storagePath,
        url: data?.signedUrl || null
      };
    }));

    return NextResponse.json(mediasWithUrls);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/galerie - Upload média (Section 10.2)
// Note: Le gros de l'upload se fait généralement via le SDK côté client pour le stream,
// mais ici on peut aussi gérer l'insertion en base après upload réussi.
// Pour rester simple et conforme : cette route pourra servir à enregistrer la métadonnée.
export async function POST(req: Request) {
   try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { type, storage_path, legende, categorie } = await req.json();

    const { data, error } = await supabaseAdmin
      .from('medias')
      .insert([{ type, url: storage_path, legende, categorie: categorie || type }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/galerie - Supprimer un média (Admin)
export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id, storage_path } = await req.json();

    // 1. Supprimer le fichier du storage
    const { error: storageError } = await supabaseAdmin
      .storage
      .from(BUCKET_NAME)
      .remove([storage_path]);

    if (storageError) throw storageError;

    // 2. Supprimer l'entrée en base
    const { error } = await supabaseAdmin
      .from('medias')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
