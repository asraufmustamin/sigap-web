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
    <div className="flex min-h-screen bg-background font-body">
      
      {/* Left Hero Section (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-surface overflow-hidden">
        <div className="absolute inset-0 bg-primary/10 mix-blend-multiply dark:mix-blend-color-burn z-10" />
        <img 
          src="https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=2000&auto=format&fit=crop" 
          alt="Keamanan dan Pelayanan Warga" 
          className="absolute inset-0 w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-[10s]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent z-20" />
        
        <div className="absolute bottom-0 left-0 p-12 z-30 w-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-on-primary text-[28px]">shield_person</span>
            </div>
            <h1 className="text-3xl font-bold text-text-main tracking-tight">SIGAP</h1>
          </div>
          <h2 className="text-4xl font-semibold text-text-main leading-tight mb-4 max-w-lg">
            Sistem Informasi Keamanan & Pelaporan Warga.
          </h2>
          <p className="text-text-muted text-lg max-w-md">
            Melindungi dan merespons keluhan Anda dengan cepat, akurat, dan transparan melalui ekosistem digital terpadu.
          </p>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-24">
        
        <div className="w-full max-w-md mx-auto">
          
          <div className="lg:hidden flex flex-col items-center mb-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg mb-4">
              <span className="material-symbols-outlined text-on-primary text-[32px]">shield_person</span>
            </div>
            <h1 className="text-3xl font-bold text-text-main tracking-tight">SIGAP</h1>
            <p className="text-text-muted text-sm mt-2">Layanan Pelaporan & Keamanan</p>
          </div>

          <div className="hidden lg:block mb-10">
            <h2 className="text-3xl font-bold text-text-main mb-2">Selamat Datang</h2>
            <p className="text-text-muted">Silakan masuk dengan akun Anda untuk membuat laporan kejadian.</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            
            <Suspense fallback={null}>
              <SuccessMessage />
            </Suspense>

            {errorMsg && (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 text-red-600 dark:text-red-400 rounded-2xl border border-red-500/20 text-sm font-medium animate-in fade-in">
                <span className="material-symbols-outlined text-[20px]">error</span>
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="identifier" className="text-sm font-semibold text-text-main ml-1">Nomor HP atau NIK</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">person</span>
                <input
                  type="text"
                  id="identifier"
                  className="w-full pl-12 pr-4 py-3.5 bg-surface border border-border rounded-xl text-text-main outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                  placeholder="Contoh: 08123456789"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-semibold text-text-main ml-1">Kata Sandi</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">lock</span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="w-full pl-12 pr-12 py-3.5 bg-surface border border-border rounded-xl text-text-main outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary bg-surface transition-colors cursor-pointer" />
                <span className="text-sm text-text-muted group-hover:text-text-main transition-colors">Ingat saya</span>
              </label>
              <button type="button" className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors">
                Lupa sandi?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 mt-4 bg-primary text-on-primary font-semibold rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 scale-[0.98]' : 'active:scale-[0.98]'}`}
            >
              {isLoading ? (
                <>
                  <span className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
                  <span>Memeriksa...</span>
                </>
              ) : (
                <span>Masuk Sekarang</span>
              )}
            </button>

            <div className="mt-8 text-center text-sm text-text-muted">
              Belum punya akun?{' '}
              <Link href="/warga/register" className="font-semibold text-primary hover:text-primary-hover transition-colors">
                Daftar sekarang
              </Link>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
