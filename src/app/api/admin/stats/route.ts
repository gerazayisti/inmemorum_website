import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Récupération des compteurs en parallèle
    const [
      { count: totalMessages },
      { count: pendingMessages },
      { count: totalMedias },
      { count: totalBio }
    ] = await Promise.all([
      supabaseAdmin.from('messages').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('messages').select('*', { count: 'exact', head: true }).eq('approuve', false),
      supabaseAdmin.from('medias').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('biographie').select('*', { count: 'exact', head: true })
    ]);

    return NextResponse.json({
      messages: { total: totalMessages, pending: pendingMessages },
      medias: totalMedias,
      biographie: totalBio
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
