'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function WargaLogin() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/mobile/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'signIn', phone }),
      });

      const data = await res.json();
      
      if (!res.ok || data.error) {
        setError(data.error || 'Login gagal.');
      } else {
        // Simpan sesi warga sederhana di localStorage
        localStorage.setItem('warga_session', JSON.stringify(data.user));
        router.push('/warga/lapor');
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi jaringan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-surface-container-lowest">
      {/* Header Logo */}
      <div className="mb-12 flex flex-col items-center">
        <div className="w-24 h-24 bg-primary-container rounded-full flex items-center justify-center shadow-lg mb-4">
          <span className="material-symbols-outlined text-primary text-5xl">shield_person</span>
        </div>
        <h1 className="text-3xl font-headline-md font-bold text-primary tracking-tight">SIGAP</h1>
        <p className="text-on-surface-variant font-body-lg text-center mt-2 px-4">
          Layanan Pelaporan Cepat Tanggap Warga & Babinsa
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleLogin} className="w-full space-y-6">
        {error && (
          <div className="bg-error-container text-on-error-container p-4 rounded-xl text-sm font-body-md shadow-sm border border-error/20">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-2 ml-1">Nomor Handphone</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">phone_iphone</span>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-surface-container border border-outline-variant rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-body-lg"
              placeholder="Contoh: 081234567890"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !phone}
          className="w-full bg-primary hover:bg-primary/90 text-on-primary py-4 rounded-2xl font-bold font-body-lg shadow-md disabled:opacity-70 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
        >
          {loading ? (
            <span className="w-6 h-6 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <>
              Masuk Sekarang
              <span className="material-symbols-outlined">arrow_forward</span>
            </>
          )}
        </button>

        <div className="text-center pt-6">
          <p className="text-on-surface-variant font-body-md mb-2">Belum punya akun pelapor?</p>
          <Link href="/warga/register" className="text-primary font-bold font-body-lg hover:underline inline-flex items-center gap-1">
            Daftar Disini
          </Link>
        </div>
      </form>
    </div>
  );
}
