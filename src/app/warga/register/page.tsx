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
        router.push('/warga/home');
      }
    } catch (err) {
      setErrorMsg('Terjadi kesalahan koneksi jaringan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-background min-h-screen flex flex-col justify-center items-center p-4 py-8">
      <div className="w-full max-w-[400px] bg-surface-container-lowest rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-outline-variant/30 px-6 py-8 flex flex-col items-center relative overflow-hidden">
        
        {/* Subtle Top Accent */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>
        
        {/* Header Section */}
        <div className="mb-6 flex flex-col items-center">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVHjIZWBDuWlh7HjNLkZcS3Khwpgv70J3Mwr48vlFF5aOX_rFHRyEZv929t0TXE-YhzK_BdJ_WpAPVxkCmTc6hkJ_itPvu2nv6hg-FYmRCs3GA7dChRzALsUt2NCsMuoMDMcYoAPRGK7HJ8HkKvlTeFEb0xTHm00HqlXfXavkCHXx6JPzNBfDr_E0OQPlIuH2fbTn3fuEpH7VBF45bJ050jq0UxRi69ZyGtXA8uGqfgOkGRA86HCyndsQqoI7DboE_-zevswtiiblK"
            alt="SIGAP"
            className="w-16 h-16 rounded-full shadow-sm border border-outline-variant/20 mb-3 object-cover"
          />
          <h1 className="font-headline-md text-2xl font-bold text-primary tracking-tight">
            Pendaftaran Warga
          </h1>
          <p className="font-body-md text-on-surface-variant mt-1.5 text-center text-sm px-2">
            Daftarkan identitas Anda untuk akses ke platform pelaporan insiden.
          </p>
        </div>

        {errorMsg ? (
          <div className="w-full bg-error-container/50 border border-error/20 rounded-xl p-3 mb-5">
            <p className="text-error font-body-sm text-center text-sm">{errorMsg}</p>
          </div>
        ) : null}

        {/* Sign Up Form */}
        <form onSubmit={handleRegister} className="w-full flex flex-col gap-3.5">
          
          <div className="flex flex-col gap-1.5">
            <label className="font-label-caps text-[11px] font-bold text-on-surface-variant uppercase tracking-wider ml-1">Nama Lengkap Sesuai KTP</label>
            <div className="relative justify-center flex flex-col">
              <span className="material-symbols-outlined absolute left-3.5 z-10 text-outline text-[18px]">person</span>
              <input 
                type="text"
                className="w-full bg-surface border border-outline-variant/60 text-on-surface font-body-md rounded-xl pl-10 pr-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm transition-all"
                placeholder="Contoh: Budi Santoso"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-label-caps text-[11px] font-bold text-on-surface-variant uppercase tracking-wider ml-1">Nomor Induk Kependudukan (NIK)</label>
            <div className="relative justify-center flex flex-col">
              <span className="material-symbols-outlined absolute left-3.5 z-10 text-outline text-[18px]">badge</span>
              <input 
                type={showNik ? "text" : "password"}
                className="w-full bg-surface border border-outline-variant/60 text-on-surface font-body-md rounded-xl pl-10 pr-10 py-3 tracking-widest outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm transition-all"
                placeholder="16 Digit NIK"
                value={nik}
                onChange={(e) => setNik(e.target.value.replace(/[^0-9]/g, '').substring(0, 16))}
                disabled={isLoading}
              />
              <button 
                type="button"
                className="absolute right-3.5 z-10 flex items-center justify-center text-outline hover:text-primary transition-colors"
                onClick={() => setShowNik(!showNik)}
              >
                <span className="material-symbols-outlined text-[18px]">{showNik ? "visibility" : "visibility_off"}</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-label-caps text-[11px] font-bold text-on-surface-variant uppercase tracking-wider ml-1">Nomor Handphone Aktif</label>
            <div className="relative justify-center flex flex-col">
              <span className="material-symbols-outlined absolute left-3.5 z-10 text-outline text-[18px]">smartphone</span>
              <input 
                type="tel"
                className="w-full bg-surface border border-outline-variant/60 text-on-surface font-body-md rounded-xl pl-10 pr-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm transition-all"
                placeholder="Contoh: 081234567890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-label-caps text-[11px] font-bold text-on-surface-variant uppercase tracking-wider ml-1">Buat Kata Sandi Baru</label>
            <div className="relative justify-center flex flex-col">
              <span className="material-symbols-outlined absolute left-3.5 z-10 text-outline text-[18px]">lock</span>
              <input 
                type={showPassword ? "text" : "password"}
                className="w-full bg-surface border border-outline-variant/60 text-on-surface font-body-md rounded-xl pl-10 pr-10 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm transition-all"
                placeholder="Minimal 8 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <button 
                type="button"
                className="absolute right-3.5 z-10 flex items-center justify-center text-outline hover:text-primary transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-symbols-outlined text-[18px]">{showPassword ? "visibility" : "visibility_off"}</span>
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full bg-primary py-3.5 rounded-xl mt-4 flex justify-center items-center gap-2 shadow-md transition-all ${isLoading ? 'opacity-70' : 'hover:bg-primary/90 hover:shadow-lg active:scale-[0.98]'}`}
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <span className="text-on-primary font-button-text font-bold text-sm tracking-wide">DAFTAR SEKARANG</span>
            )}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center w-full">
          <span className="font-body-sm text-on-surface-variant text-[13px]">Sudah memiliki akun? </span>
          <Link href="/warga/login" className="text-primary text-[13px] font-bold ml-1 hover:underline">
            Masuk
          </Link>
        </div>

      </div>
    </div>
  );
}
