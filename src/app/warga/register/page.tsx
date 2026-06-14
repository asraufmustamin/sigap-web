'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function WargaRegister() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [nik, setNik] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showNik, setShowNik] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!name.trim() || !nik.trim() || !phone.trim() || !password.trim()) {
      setErrorMsg('Semua kolom wajib diisi.');
      return;
    }
    if (nik.trim().length !== 16) {
      setErrorMsg('NIK harus terdiri dari 16 digit.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/mobile/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'signUp', 
          name: name.trim(), 
          phone: phone.trim(), 
          nik_hash: nik.trim() 
        }),
      });

      const data = await res.json();
      
      if (!res.ok || data.error) {
        setErrorMsg(data.error || 'Pendaftaran gagal. Silakan coba lagi.');
      } else {
        localStorage.setItem('warga_session', JSON.stringify(data.user));
        router.push('/warga/lapor');
      }
    } catch (err) {
      setErrorMsg('Terjadi kesalahan koneksi jaringan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-surface min-h-full flex flex-col justify-center p-5 items-center pb-12">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden relative">
        {/* Subtle Top Accent */}
        <div className="h-1 w-full bg-primary absolute top-0 left-0 z-10" />
        
        <div className="p-8">
          {/* Header Section */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface-container flex items-center justify-center mb-4 shadow-sm border border-outline-variant/20">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVHjIZWBDuWlh7HjNLkZcS3Khwpgv70J3Mwr48vlFF5aOX_rFHRyEZv929t0TXE-YhzK_BdJ_WpAPVxkCmTc6hkJ_itPvu2nv6hg-FYmRCs3GA7dChRzALsUt2NCsMuoMDMcYoAPRGK7HJ8HkKvlTeFEb0xTHm00HqlXfXavkCHXx6JPzNBfDr_E0OQPlIuH2fbTn3fuEpH7VBF45bJ050jq0UxRi69ZyGtXA8uGqfgOkGRA86HCyndsQqoI7DboE_-zevswtiiblK"
                alt="SIGAP"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="font-headline-lg-mobile text-2xl font-bold text-primary text-center tracking-tight mb-2">
              Daftar Akun
            </h1>
            <p className="font-body-md text-on-surface-variant text-center max-w-[250px]">
              Bergabung dengan SIGAP untuk pelaporan insiden terpadu dan respons cepat.
            </p>
          </div>

          {errorMsg ? (
            <p className="text-error font-body-md text-center w-full mb-4">{errorMsg}</p>
          ) : null}

          {/* Sign Up Form */}
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            
            {/* Nama Lengkap Input */}
            <div className="flex flex-col gap-2">
              <label className="font-label-caps text-xs font-bold text-on-surface uppercase">Nama Lengkap</label>
              <div className="relative justify-center flex flex-col">
                <span className="material-symbols-outlined absolute left-3 z-10 text-on-surface-variant text-[20px]">person</span>
                <input 
                  type="text"
                  className="w-full bg-background-pure border border-outline-variant rounded-lg pl-10 pr-4 py-3 font-body-lg text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Sesuai KTP"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* NIK Input */}
            <div className="flex flex-col gap-2">
              <label className="font-label-caps text-xs font-bold text-on-surface uppercase">NIK</label>
              <div className="relative justify-center flex flex-col">
                <span className="material-symbols-outlined absolute left-3 z-10 text-on-surface-variant text-[20px]">badge</span>
                <input 
                  type={showNik ? "text" : "password"}
                  className="w-full bg-background-pure border border-outline-variant rounded-lg pl-10 pr-12 py-3 font-body-lg text-on-surface tracking-widest outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="16 Digit NIK"
                  value={nik}
                  onChange={(e) => setNik(e.target.value.replace(/[^0-9]/g, '').substring(0, 16))}
                  disabled={isLoading}
                />
                <button 
                  type="button"
                  className="absolute right-3 z-10 flex items-center justify-center text-on-surface-variant"
                  onClick={() => setShowNik(!showNik)}
                >
                  <span className="material-symbols-outlined text-[20px]">{showNik ? "visibility" : "visibility_off"}</span>
                </button>
              </div>
            </div>

            {/* Nomor HP Input */}
            <div className="flex flex-col gap-2">
              <label className="font-label-caps text-xs font-bold text-on-surface uppercase">Nomor HP</label>
              <div className="relative justify-center flex flex-col">
                <span className="material-symbols-outlined absolute left-3 z-10 text-on-surface-variant text-[20px]">smartphone</span>
                <input 
                  type="tel"
                  className="w-full bg-background-pure border border-outline-variant rounded-lg pl-10 pr-4 py-3 font-body-lg text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="08xxxxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Kata Sandi Input */}
            <div className="flex flex-col gap-2">
              <label className="font-label-caps text-xs font-bold text-on-surface uppercase">Kata Sandi</label>
              <div className="relative justify-center flex flex-col">
                <span className="material-symbols-outlined absolute left-3 z-10 text-on-surface-variant text-[20px]">lock</span>
                <input 
                  type={showPassword ? "text" : "password"}
                  className="w-full bg-background-pure border border-outline-variant rounded-lg pl-10 pr-12 py-3 font-body-lg text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Minimal 8 karakter"
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

            {/* Action Area */}
            <div className="mt-2 pt-2">
              <button 
                type="submit"
                disabled={isLoading}
                className={`w-full bg-primary py-3 rounded-lg flex justify-center items-center gap-2 shadow-sm transition-opacity ${isLoading ? 'opacity-50' : 'hover:bg-primary/90'}`}
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span className="text-on-primary font-button-text font-semibold text-base">Daftar Sekarang</span>
                    <span className="material-symbols-outlined text-on-primary text-[20px]">arrow_forward</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer Link */}
          <div className="mt-6 text-center flex justify-center items-center">
            <span className="font-body-md text-on-surface-variant">Sudah punya akun? </span>
            <Link href="/warga/login" className="text-primary font-bold border-b border-transparent hover:border-primary ml-1">
              Masuk
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
