import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import crypto from 'crypto';

export async function GET() {
  try {
    const [rows] = await db.execute("SELECT id, name, nik_hash, phone, avatar_url, role, created_at FROM users WHERE role = 'babinsa' ORDER BY name ASC");
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: 'Gagal mengambil data: ' + error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, nik_hash, phone, avatar_url } = await request.json();

    if (!name || !nik_hash) {
      return NextResponse.json({ error: 'Nama dan NIK wajib diisi' }, { status: 400 });
    }

    const id = crypto.randomUUID();

    await db.execute(
      "INSERT INTO users (id, name, nik_hash, phone, avatar_url, role, password_hash) VALUES (?, ?, ?, ?, ?, 'babinsa', 'password123')",
      [id, name, nik_hash, phone, avatar_url]
    );

    return NextResponse.json({ message: 'Personil berhasil ditambahkan' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Gagal menambah personil: ' + error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, name, nik_hash, phone, avatar_url } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID wajib diisi' }, { status: 400 });
    }

    await db.execute(
      'UPDATE users SET name=?, nik_hash=?, phone=?, avatar_url=? WHERE id=?',
      [name, nik_hash, phone, avatar_url, id]
    );

    return NextResponse.json({ message: 'Data personil diperbarui' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Gagal update: ' + error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID wajib diisi' }, { status: 400 });
    }

    await db.execute('DELETE FROM users WHERE id=?', [id]);
    return NextResponse.json({ message: 'Personil dihapus' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Gagal menghapus: ' + error.message }, { status: 500 });
  }
}
