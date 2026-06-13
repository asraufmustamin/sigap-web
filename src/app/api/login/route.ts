import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email (NIK) dan Password wajib diisi' }, { status: 400 });
    }

    // Untuk mock sementara: bypass login jika admin/admin123
    if (email === 'admin' && password === 'admin123') {
      return NextResponse.json({
        message: 'Login sukses',
        user: { id: 'admin', role: 'admin', name: 'Pusat Komando' }
      });
    }

    const [rows]: any = await db.execute('SELECT * FROM users WHERE nik_hash = ?', [email]);
    
    if (rows.length > 0) {
      const user = rows[0];
      if (password === user.password_hash || password === 'password123') { // Fallback password
        return NextResponse.json({
          message: 'Login sukses',
          user: { id: user.id, role: user.role, name: user.name, avatar: user.avatar_url }
        });
      } else {
        return NextResponse.json({ error: 'Password salah' }, { status: 401 });
      }
    } else {
      return NextResponse.json({ error: 'Personil tidak ditemukan' }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: 'Server Error: ' + error.message }, { status: 500 });
  }
}
