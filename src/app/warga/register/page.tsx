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
        // Success: Redirect to login without auto-login
        router.push('/warga/login?registered=true');
      }
    } catch {
      setErrorMsg('Terjadi kesalahan koneksi jaringan.');
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
            Bergabunglah Bersama Kami.
          </h2>
          <p className="text-text-muted text-lg max-w-md">
            Jadilah bagian dari komunitas cerdas yang tanggap lingkungan. Laporkan dan pantau langsung dari genggaman Anda.
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
            <p className="text-text-muted text-sm mt-2">Pendaftaran Warga Baru</p>
          </div>

          <div className="hidden lg:block mb-10">
            <h2 className="text-3xl font-bold text-text-main mb-2">Buat Akun</h2>
            <p className="text-text-muted">Lengkapi data diri Anda untuk memulai pengalaman pelaporan.</p>
          </div>

          <form onSubmit={handleRegister} className="flex flex-col gap-5">
            
            {errorMsg && (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 text-red-600 dark:text-red-400 rounded-2xl border border-red-500/20 text-sm font-medium animate-in fade-in">
                <span className="material-symbols-outlined text-[20px]">error</span>
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-sm font-semibold text-text-main ml-1">Nama Lengkap</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">badge</span>
                <input
                  type="text"
                  id="name"
                  className="w-full pl-12 pr-4 py-3.5 bg-surface border border-border rounded-xl text-text-main outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                  placeholder="Contoh: Budi Santoso"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-5">
              <div className="flex flex-col gap-1.5 flex-1">
                <label htmlFor="nik" className="text-sm font-semibold text-text-main ml-1">NIK (16 Digit)</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">pin</span>
                  <input
                    type="text"
                    id="nik"
                    className="w-full pl-12 pr-4 py-3.5 bg-surface border border-border rounded-xl text-text-main outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                    placeholder="Masukkan NIK"
                    value={nik}
                    onChange={(e) => setNik(e.target.value.replace(/[^0-9]/g, '').substring(0, 16))}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 flex-1">
                <label htmlFor="phone" className="text-sm font-semibold text-text-main ml-1">Nomor HP</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">phone_iphone</span>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full pl-12 pr-4 py-3.5 bg-surface border border-border rounded-xl text-text-main outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                    placeholder="0812..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-semibold text-text-main ml-1">Kata Sandi Baru</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">lock</span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="w-full pl-12 pr-12 py-3.5 bg-surface border border-border rounded-xl text-text-main outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                  placeholder="Minimal 6 karakter"
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

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 mt-6 bg-primary text-on-primary font-semibold rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 scale-[0.98]' : 'active:scale-[0.98]'}`}
            >
              {isLoading ? (
                <>
                  <span className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
                  <span>Memproses...</span>
                </>
              ) : (
                <span>Daftar Sekarang</span>
              )}
            </button>

            <div className="mt-8 text-center text-sm text-text-muted">
              Sudah punya akun?{' '}
              <Link href="/warga/login" className="font-semibold text-primary hover:text-primary-hover transition-colors">
                Masuk di sini
              </Link>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
