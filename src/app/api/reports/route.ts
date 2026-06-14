import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import crypto from 'crypto';

export async function GET() {
  try {
    const [rows] = await db.execute('SELECT * FROM reports ORDER BY created_at DESC');
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: 'Gagal mengambil data: ' + error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const description = body.description || '';
    const lat = body.lat || 0;
    const lng = body.lng || 0;
    const category = body.category || 'Lainnya';
    const reporter_id = body.reporter_id || null;
    
    // In a real app, you would process the file (image) here and upload to S3/Cloudinary/Hostinger
    // For now, we simulate success
    const image_url = 'https://via.placeholder.com/600x400.png?text=Simulasi+Upload';
    
    const id = crypto.randomUUID();

    await db.execute(
      'INSERT INTO reports (id, description, lat, lng, image_url, category, reporter_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, description, lat, lng, image_url, category, reporter_id]
    );

    return NextResponse.json({ message: 'Laporan berhasil dikirim', id }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Gagal mengirim laporan: ' + error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'ID dan Status wajib diisi' }, { status: 400 });
    }

    await db.execute('UPDATE reports SET status = ? WHERE id = ?', [status, id]);
    return NextResponse.json({ message: 'Status diperbarui' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Gagal update: ' + error.message }, { status: 500 });
  }
}
