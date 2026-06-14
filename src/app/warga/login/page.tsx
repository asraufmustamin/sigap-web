'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
    } catch (err) {
      setErrorMsg('Gagal terhubung ke server. Periksa koneksi internet Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-background min-h-screen flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-[400px] bg-surface-container-lowest rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-outline-variant/30 px-6 py-10 flex flex-col items-center relative overflow-hidden">
        
        {/* Subtle Accent Line */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>

        {/* Brand Logo */}
        <div className="mb-6 flex flex-col items-center">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVHjIZWBDuWlh7HjNLkZcS3Khwpgv70J3Mwr48vlFF5aOX_rFHRyEZv929t0TXE-YhzK_BdJ_WpAPVxkCmTc6hkJ_itPvu2nv6hg-FYmRCs3GA7dChRzALsUt2NCsMuoMDMcYoAPRGK7HJ8HkKvlTeFEb0xTHm00HqlXfXavkCHXx6JPzNBfDr_E0OQPlIuH2fbTn3fuEpH7VBF45bJ050jq0UxRi69ZyGtXA8uGqfgOkGRA86HCyndsQqoI7DboE_-zevswtiiblK" 
            alt="SIGAP Logo"
            className="w-20 h-20 rounded-full shadow-sm border border-outline-variant/20 mb-4 object-cover"
          />
          <h1 className="font-headline-md text-2xl font-bold text-primary tracking-tight">Akses Pelapor</h1>
          <p className="font-body-md text-on-surface-variant mt-1.5 text-center px-4 leading-relaxed">
            Sistem Tanggap Insiden Terpadu Warga.
          </p>
        </div>

        {errorMsg ? (
          <div className="w-full bg-error-container/50 border border-error/20 rounded-xl p-3 mb-5">
            <p className="text-error font-body-sm text-center text-sm">{errorMsg}</p>
          </div>
        ) : null}

        {/* Form */}
        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          
          <div className="flex flex-col gap-1.5">
            <label className="font-label-caps text-[11px] font-bold text-on-surface-variant uppercase tracking-wider ml-1">Nomor Handphone / NIK</label>
            <div className="relative justify-center flex flex-col">
              <span className="material-symbols-outlined absolute left-3.5 z-10 text-outline text-[20px]">person</span>
              <input 
                type="text"
                className="w-full bg-surface border border-outline-variant/60 text-on-surface font-body-md rounded-xl pl-11 pr-4 py-3.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                placeholder="Contoh: 081234567890"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-label-caps text-[11px] font-bold text-on-surface-variant uppercase tracking-wider ml-1">Kata Sandi</label>
            <div className="relative justify-center flex flex-col">
              <span className="material-symbols-outlined absolute left-3.5 z-10 text-outline text-[20px]">lock</span>
              <input 
                type={showPassword ? "text" : "password"}
                className="w-full bg-surface border border-outline-variant/60 text-on-surface font-body-md rounded-xl pl-11 pr-11 py-3.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                placeholder="Masukkan kata sandi Anda"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <button 
                type="button"
                className="absolute right-3.5 z-10 flex items-center justify-center text-outline hover:text-primary transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-symbols-outlined text-[20px]">{showPassword ? "visibility" : "visibility_off"}</span>
              </button>
            </div>
          </div>

          <div className="flex justify-end mt-[-4px]">
            <button type="button" className="font-body-sm text-primary text-[13px] font-semibold hover:underline">Lupa kata sandi?</button>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full bg-primary py-3.5 rounded-xl mt-2 flex items-center justify-center shadow-md transition-all ${isLoading ? 'opacity-70' : 'hover:bg-primary/90 hover:shadow-lg active:scale-[0.98]'}`}
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <span className="text-on-primary font-button-text font-bold text-sm tracking-wide">MASUK SISTEM</span>
            )}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center bg-surface w-full py-3 rounded-xl border border-outline-variant/20">
          <span className="font-body-sm text-on-surface-variant text-[13px]">Belum memiliki akun pelapor? </span>
          <Link href="/warga/register" className="text-primary text-[13px] font-bold ml-1 hover:underline">
            Daftar Sekarang
          </Link>
        </div>

      </div>
    </div>
  );
}
