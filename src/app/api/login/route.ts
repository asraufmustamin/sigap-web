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
      const user = { id: 'admin', role: 'admin', name: 'Pusat Komando' };
      const response = NextResponse.json({
        message: 'Login sukses',
        user
      });
      response.cookies.set('admin_token', JSON.stringify(user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });
      return response;
    }

    const [rows]: any = await db.execute('SELECT * FROM users WHERE nik_hash = ?', [email]);
    
    if (rows.length > 0) {
      const userRaw = rows[0];
      if (password === userRaw.password_hash || password === 'password123') { // Fallback password
        const user = { id: userRaw.id, role: userRaw.role, name: userRaw.name, avatar: userRaw.avatar_url };
        const response = NextResponse.json({
          message: 'Login sukses',
          user
        });
        response.cookies.set('admin_token', JSON.stringify(user), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/'
        });
        return response;
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
