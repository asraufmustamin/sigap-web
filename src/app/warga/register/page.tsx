'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function WargaRegister() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', phone: '', nik: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/mobile/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'signUp', 
          name: formData.name, 
          phone: formData.phone, 
          nik_hash: formData.nik 
        }),
      });

      const data = await res.json();
      
      if (!res.ok || data.error) {
        setError(data.error || 'Pendaftaran gagal.');
      } else {
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
    <div className="flex-1 flex flex-col p-6 bg-surface-container-lowest min-h-screen">
      <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center bg-surface-container rounded-full mb-6 hover:bg-surface-container-high transition-colors">
        <span className="material-symbols-outlined text-on-surface">arrow_back</span>
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-headline-md font-bold text-on-surface mb-2">Daftar Akun</h1>
        <p className="text-on-surface-variant font-body-lg">
          Bergabung dengan SIGAP untuk pelaporan insiden terpadu.
        </p>
      </div>

      <form onSubmit={handleRegister} className="w-full space-y-5">
        {error && (
          <div className="bg-error-container text-on-error-container p-4 rounded-xl text-sm font-body-md shadow-sm border border-error/20">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-2 ml-1">Nama Lengkap</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">person</span>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full pl-12 pr-4 py-4 bg-surface-container border border-outline-variant rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-body-lg"
              placeholder="Nama sesuai KTP"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-2 ml-1">NIK (Nomor Induk Kependudukan)</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">badge</span>
            <input
              type="number"
              required
              value={formData.nik}
              onChange={(e) => setFormData({...formData, nik: e.target.value})}
              className="w-full pl-12 pr-4 py-4 bg-surface-container border border-outline-variant rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-body-lg"
              placeholder="16 Digit NIK"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-2 ml-1">Nomor Handphone (WhatsApp)</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">phone_iphone</span>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full pl-12 pr-4 py-4 bg-surface-container border border-outline-variant rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all font-body-lg"
              placeholder="Contoh: 081234567890"
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading || !formData.phone || !formData.name || !formData.nik}
            className="w-full bg-primary hover:bg-primary/90 text-on-primary py-4 rounded-2xl font-bold font-body-lg shadow-md disabled:opacity-70 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
          >
            {loading ? (
              <span className="w-6 h-6 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                Daftar Sekarang
                <span className="material-symbols-outlined">arrow_forward</span>
              </>
            )}
          </button>
        </div>

        <div className="text-center pt-4 pb-8">
          <p className="text-on-surface-variant font-body-md mb-2">Sudah punya akun?</p>
          <Link href="/warga/login" className="text-primary font-bold font-body-lg hover:underline inline-flex items-center gap-1">
            Masuk Disini
          </Link>
        </div>
      </form>
    </div>
  );
}
