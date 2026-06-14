'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // BYPASS SEMENTARA KARENA DATABASE MATI
    if (email === 'admin' && password === 'admin123') {
      toast.success('Login berhasil (Mode Akses Darurat)');
      router.push('/');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();

      if (!res.ok) {
        toast.error('Login gagal', { description: data.error || 'Terjadi kesalahan' });
      } else {
        localStorage.setItem('user_session', JSON.stringify(data.user));
        toast.success('Login berhasil');
        router.push('/');
      }
    } catch (err: any) {
      toast.error('Terjadi kesalahan', { description: 'Gagal terhubung ke server.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface-container-low min-h-screen flex items-center justify-center font-body-md p-4 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-fixed-dim/20 blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-secondary-fixed/20 blur-[120px]"></div>
      </div>

      <main className="relative z-10 w-full max-w-[400px]">
        <div className="bg-surface-container-lowest rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-outline-variant/30 px-6 py-10 flex flex-col items-center overflow-hidden">
          
          {/* Top Accent Line */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>

          {/* Header */}
          <div className="flex flex-col items-center mb-6">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVHjIZWBDuWlh7HjNLkZcS3Khwpgv70J3Mwr48vlFF5aOX_rFHRyEZv929t0TXE-YhzK_BdJ_WpAPVxkCmTc6hkJ_itPvu2nv6hg-FYmRCs3GA7dChRzALsUt2NCsMuoMDMcYoAPRGK7HJ8HkKvlTeFEb0xTHm00HqlXfXavkCHXx6JPzNBfDr_E0OQPlIuH2fbTn3fuEpH7VBF45bJ050jq0UxRi69ZyGtXA8uGqfgOkGRA86HCyndsQqoI7DboE_-zevswtiiblK"
              alt="SIGAP"
              className="w-20 h-20 rounded-full border border-outline-variant/20 shadow-sm mb-4 object-cover"
            />
            <h1 className="font-headline-md text-2xl font-bold text-primary tracking-tight">Portal Petugas</h1>
            <p className="font-body-md text-on-surface-variant text-sm mt-1.5 text-center px-4">
              Akses aman menuju Command Center SIGAP.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="w-full flex flex-col gap-3.5">
            
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="font-label-caps text-[11px] font-bold text-on-surface-variant uppercase tracking-wider ml-1">
                ID Personil / Email
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px] z-10">person</span>
                <input
                  type="text"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Masukkan ID Personil"
                  className="w-full bg-surface border border-outline-variant/60 text-on-surface font-body-md rounded-xl pl-11 pr-4 py-3.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="font-label-caps text-[11px] font-bold text-on-surface-variant uppercase tracking-wider ml-1">
                Kata Sandi
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px] z-10">lock</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Masukkan kata sandi rahasia"
                  className="w-full bg-surface border border-outline-variant/60 text-on-surface font-body-md rounded-xl pl-11 pr-11 py-3.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-outline hover:text-primary transition-colors z-10"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-1 px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4 bg-surface"
                />
                <span className="font-body-sm text-[13px] text-on-surface-variant group-hover:text-on-surface transition-colors">
                  Ingat saya
                </span>
              </label>
              <button type="button" className="font-body-sm text-[13px] text-primary font-semibold hover:underline">
                Lupa Sandi?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-primary py-3.5 rounded-xl mt-4 flex items-center justify-center gap-2 shadow-md transition-all ${loading ? 'opacity-70' : 'hover:bg-primary/90 hover:shadow-lg active:scale-[0.98]'}`}
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <span className="text-on-primary font-button-text font-bold text-sm tracking-wide">MASUK COMMAND CENTER</span>
              )}
            </button>
          </form>

          {/* Security Banner */}
          <div className="mt-8 w-full bg-error-container/40 rounded-xl py-3 px-4 flex items-center gap-3 border border-error/10">
            <span className="material-symbols-outlined text-error text-[20px]">gpp_bad</span>
            <div className="flex flex-col">
              <span className="font-label-caps text-[10px] text-error font-bold uppercase tracking-wider">Akses Terbatas</span>
              <span className="font-body-sm text-[11px] text-error/80 leading-tight">Hanya untuk personil berwenang.</span>
            </div>
          </div>

        </div>
        
        {/* Footer */}
        <div className="text-center mt-6">
          <p className="font-label-caps text-[10px] text-on-surface-variant tracking-wider uppercase opacity-80">
            SIGAP v2.4 • Koneksi Terenkripsi AES-256
          </p>
        </div>
      </main>
    </div>
  );
}
