import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const response = NextResponse.json({ message: 'Logout sukses' });
  
  // Clear both cookies
  response.cookies.set('admin_token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/'
  });
  
  response.cookies.set('warga_token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/'
  });

  return response;
}
