import { NextResponse } from 'next/server';
import { getVideoInfo, detectPlatform } from '@/lib/downloader';
import { db } from '@/lib/db';
import { logs } from '@/lib/schema';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const url: string = body.url;

    if (!url) {
      return NextResponse.json({ error: 'URL diperlukan' }, { status: 400 });
    }

    const platform = detectPlatform(url);
    
    // Log to database
    try {
      await db.insert(logs).values({ url, platform });
    } catch (dbErr) {
      console.error('DB Log Error:', dbErr);
      // Lanjutkan walau DB gagal
    }

    const info = await getVideoInfo(url);
    
    return NextResponse.json(info);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
