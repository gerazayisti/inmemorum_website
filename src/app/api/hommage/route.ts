import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data: hommage, error } = await supabaseAdmin
      .from('hommage')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) throw error;

    // Générer URL signée si portrait_url ou logo_url sont des chemins Storage
    if (hommage?.portrait_url && !hommage.portrait_url.startsWith('http')) {
      const { data } = await supabaseAdmin.storage
        .from('galerie-memorial')
        .createSignedUrl(hommage.portrait_url, 3600);
      
      hommage.portrait_url = data?.signedUrl || hommage.portrait_url;
    }

    if (hommage?.logo_url && !hommage.logo_url.startsWith('http')) {
      const { data } = await supabaseAdmin.storage
        .from('galerie-memorial')
        .createSignedUrl(hommage.logo_url, 3600);
      
      hommage.logo_url = data?.signedUrl || hommage.logo_url;
    }

    return NextResponse.json(hommage);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();

    // On ne veut pas écraser portrait_url ou logo_url si le front envoie une URL signée temporaire (http...)
    const updateData: any = { ...body };
    if (updateData.portrait_url && updateData.portrait_url.startsWith('http')) {
      delete updateData.portrait_url;
    }
    if (updateData.logo_url && updateData.logo_url.startsWith('http')) {
      delete updateData.logo_url;
    }
    // Supprimer les champs qui ne sont pas dans la table hommage
    delete updateData.biographie;

    const { data, error } = await supabaseAdmin
      .from('hommage')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', 1)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
