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
      setErrorMsg('Masukkan nomor HP atau NIK Anda.');
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
        setErrorMsg(data.error || 'Nomor HP/NIK tidak ditemukan.');
      } else {
        localStorage.setItem('warga_session', JSON.stringify(data.user));
        router.push('/warga/lapor');
      }
    } catch (err) {
      setErrorMsg('Terjadi kesalahan koneksi. Periksa internet Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-background min-h-full flex flex-col justify-center p-5 items-center">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/30 p-8 flex flex-col items-center">
        
        {/* Brand Logo */}
        <div className="mb-8 flex flex-col items-center">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVHjIZWBDuWlh7HjNLkZcS3Khwpgv70J3Mwr48vlFF5aOX_rFHRyEZv929t0TXE-YhzK_BdJ_WpAPVxkCmTc6hkJ_itPvu2nv6hg-FYmRCs3GA7dChRzALsUt2NCsMuoMDMcYoAPRGK7HJ8HkKvlTeFEb0xTHm00HqlXfXavkCHXx6JPzNBfDr_E0OQPlIuH2fbTn3fuEpH7VBF45bJ050jq0UxRi69ZyGtXA8uGqfgOkGRA86HCyndsQqoI7DboE_-zevswtiiblK" 
            alt="SIGAP Logo"
            className="w-24 h-24 rounded-full border border-outline-variant/20 mb-4 object-cover"
          />
          <h1 className="font-headline-lg-mobile text-2xl font-bold text-on-surface">Masuk ke SIGAP</h1>
          <p className="font-body-md text-on-surface-variant mt-2 text-center">Platform Keamanan Terpadu. Integritas dan Kecepatan.</p>
        </div>

        {errorMsg ? (
          <p className="text-error font-body-md text-center w-full mb-4">{errorMsg}</p>
        ) : null}

        {/* Form */}
        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          {/* Input: Nomor HP/NIK */}
          <div className="flex flex-col gap-2">
            <label className="font-label-caps text-xs font-bold text-on-surface uppercase tracking-wider">Nomor HP/NIK</label>
            <div className="relative justify-center flex flex-col">
              <span className="material-symbols-outlined absolute left-3 z-10 text-on-surface-variant text-[20px]">person</span>
              <input 
                type="text"
                className="w-full bg-background-pure border border-outline text-on-surface font-body-lg rounded-lg pl-10 pr-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Masukkan nomor HP atau NIK"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Input: Kata Sandi */}
          <div className="flex flex-col gap-2">
            <label className="font-label-caps text-xs font-bold text-on-surface uppercase tracking-wider">Kata Sandi</label>
            <div className="relative justify-center flex flex-col">
              <span className="material-symbols-outlined absolute left-3 z-10 text-on-surface-variant text-[20px]">lock</span>
              <input 
                type={showPassword ? "text" : "password"}
                className="w-full bg-background-pure border border-outline text-on-surface font-body-lg rounded-lg pl-10 pr-10 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Masukkan kata sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <button 
                type="button"
                className="absolute right-3 z-10 flex items-center justify-center text-on-surface-variant"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-symbols-outlined text-[20px]">{showPassword ? "visibility" : "visibility_off"}</span>
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end mt-1">
            <button type="button" className="font-body-md text-primary font-semibold hover:underline">Lupa kata sandi?</button>
          </div>

          {/* Primary Action Button */}
          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full bg-primary py-3 rounded-lg mt-4 flex items-center justify-center gap-2 transition-opacity ${isLoading ? 'opacity-50' : 'hover:bg-primary/90'}`}
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <span className="text-on-primary font-button-text font-semibold text-base">Masuk</span>
                <span className="material-symbols-outlined text-on-primary text-[20px]">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        {/* Secondary Action */}
        <div className="mt-8 flex items-center justify-center">
          <span className="font-body-md text-on-surface-variant">Belum punya akun? </span>
          <Link href="/warga/register" className="text-primary font-semibold ml-1 hover:underline">
            Daftar
          </Link>
        </div>

      </div>
    </div>
  );
}
