'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SuccessMessage() {
  const searchParams = useSearchParams();
  if (searchParams.get('registered') === 'true') {
    return (
      <div className="flex items-center gap-3 mb-6 p-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl border border-emerald-500/20 text-sm font-medium animate-in fade-in slide-in-from-top-4 duration-500">
        <span className="material-symbols-outlined text-[20px]">check_circle</span>
        <span>Pendaftaran berhasil! Silakan masuk dengan akun Anda.</span>
      </div>
    );
  }
  return null;
}

export default function WargaLogin() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!identifier.trim()) {
      setErrorMsg('Harap masukkan Nomor HP atau NIK Anda.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/mobile/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'signIn', phone: identifier.trim() }),
      });

      const data = await res.json();
      
      if (!res.ok || data.error) {
        setErrorMsg(data.error || 'Kredensial tidak valid. Silakan coba lagi.');
      } else {
        localStorage.setItem('warga_session', JSON.stringify(data.user));
        router.push('/warga/home');
      }
    } catch {
      setErrorMsg('Gagal terhubung ke server. Periksa koneksi internet Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f0f4f9] dark:bg-background font-body p-4">
      <div className="w-full max-w-[450px] bg-white dark:bg-surface border border-slate-200 dark:border-border rounded-3xl shadow-xl p-10 flex flex-col items-center">
        
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 ring-4 ring-primary/5">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVHjIZWBDuWlh7HjNLkZcS3Khwpgv70J3Mwr48vlFF5aOX_rFHRyEZv929t0TXE-YhzK_BdJ_WpAPVxkCmTc6hkJ_itPvu2nv6hg-FYmRCs3GA7dChRzALsUt2NCsMuoMDMcYoAPRGK7HJ8HkKvlTeFEb0xTHm00HqlXfXavkCHXx6JPzNBfDr_E0OQPlIuH2fbTn3fuEpH7VBF45bJ050jq0UxRi69ZyGtXA8uGqfgOkGRA86HCyndsQqoI7DboE_-zevswtiiblK" 
            alt="Logo" 
            className="h-12 w-12 rounded-full object-cover"
          />
        </div>

        <h1 className="text-2xl font-bold text-slate-800 dark:text-text-main mb-2">Masuk ke SIGAP</h1>
        <p className="text-slate-500 dark:text-text-muted text-center mb-8">
          Layanan Pelaporan & Keamanan Warga
        </p>

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          
          <Suspense fallback={null}>
            <SuccessMessage />
          </Suspense>

          {errorMsg && (
            <div className="flex items-center gap-3 p-3.5 bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-500/20 text-sm font-medium">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <div className="relative">
              <input
                type="text"
                id="identifier"
                className="w-full px-5 py-4 bg-transparent border border-slate-300 dark:border-border rounded-xl text-slate-800 dark:text-text-main outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder-transparent peer"
                placeholder="Nomor HP atau NIK"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                disabled={isLoading}
              />
              <label 
                htmlFor="identifier" 
                className="absolute left-5 -top-2.5 bg-white dark:bg-surface px-1 text-xs font-medium text-slate-500 dark:text-text-muted transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary"
              >
                Nomor HP atau NIK
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mt-2">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full px-5 py-4 bg-transparent border border-slate-300 dark:border-border rounded-xl text-slate-800 dark:text-text-main outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder-transparent peer"
                placeholder="Kata Sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <label 
                htmlFor="password" 
                className="absolute left-5 -top-2.5 bg-white dark:bg-surface px-1 text-xs font-medium text-slate-500 dark:text-text-muted transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary"
              >
                Kata Sandi
              </label>
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-text-main transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <button type="button" className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors">
              Lupa kata sandi?
            </button>
          </div>

          <div className="mt-6 flex justify-between items-center w-full">
            <Link href="/warga/register" className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors">
              Buat akun
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover hover:shadow-lg transition-all flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 scale-[0.98]' : 'active:scale-[0.98]'}`}
            >
              {isLoading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Memeriksa</span>
                </>
              ) : (
                <span>Selanjutnya</span>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
