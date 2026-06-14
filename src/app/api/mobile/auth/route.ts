import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { action, phone, name, nik_hash } = await request.json();

    if (action === 'signIn') {
      const [rows]: any = await db.execute('SELECT * FROM users WHERE phone = ? OR nik_hash = ?', [phone, phone]);
      if (rows.length > 0) {
        const user = rows[0];
        const response = NextResponse.json({ user });
        response.cookies.set('warga_token', JSON.stringify(user), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/'
        });
        return response;
      }
      return NextResponse.json({ error: 'Nomor HP/NIK tidak ditemukan. Silakan daftar.' }, { status: 404 });
    }

    if (action === 'signUp') {
      const [existing]: any = await db.execute('SELECT id FROM users WHERE phone = ?', [phone]);
      if (existing.length > 0) {
        return NextResponse.json({ error: 'Nomor HP ini sudah terdaftar.' }, { status: 400 });
      }

      const id = crypto.randomUUID();
      await db.execute(
        "INSERT INTO users (id, name, phone, nik_hash, role) VALUES (?, ?, ?, ?, 'warga')",
        [id, name, phone, nik_hash]
      );

      const [newUser]: any = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
      return NextResponse.json({ user: newUser[0] });
    }

    if (action === 'getUser') {
      const { id } = await request.json();
      const [user]: any = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
      if (user.length > 0) return NextResponse.json({ user: user[0] });
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Terjadi kesalahan koneksi' }, { status: 500 });
  }
}
