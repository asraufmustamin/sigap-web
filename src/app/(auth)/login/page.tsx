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
        // Simpan sesi ke localStorage/cookie
        localStorage.setItem('user_session', JSON.stringify(data.user));
        toast.success('Login berhasil');
        router.push('/');
      }
    } catch (err: any) {
      toast.error('Terjadi kesalahan yang tidak terduga', { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface-container-low min-h-screen flex items-center justify-center font-body-md text-on-surface subtle-pattern relative overflow-hidden">
      {/* Ambient decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-fixed-dim/20 blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-secondary-fixed/20 blur-[120px]"></div>
      </div>

      {/* Login Container */}
      <main className="relative z-10 w-full max-w-md px-margin-mobile md:px-0">
        <div className="glass-panel rounded-xl shadow-lg border border-surface-variant overflow-hidden flex flex-col items-center pt-stack-lg pb-stack-lg px-stack-lg md:px-[2.5rem]">
          
          {/* Brand Header */}
          <div className="flex flex-col items-center mb-stack-lg">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVHjIZWBDuWlh7HjNLkZcS3Khwpgv70J3Mwr48vlFF5aOX_rFHRyEZv929t0TXE-YhzK_BdJ_WpAPVxkCmTc6hkJ_itPvu2nv6hg-FYmRCs3GA7dChRzALsUt2NCsMuoMDMcYoAPRGK7HJ8HkKvlTeFEb0xTHm00HqlXfXavkCHXx6JPzNBfDr_E0OQPlIuH2fbTn3fuEpH7VBF45bJ050jq0UxRi69ZyGtXA8uGqfgOkGRA86HCyndsQqoI7DboE_-zevswtiiblK"
              alt="SIGAP Logo"
              className="w-24 h-24 rounded-full border border-outline-variant/20 mb-4 object-cover"
            />
            <h1 className="font-headline-lg-mobile text-2xl font-bold text-on-surface mb-2">Masuk ke SIGAP</h1>
            <p className="font-body-md text-on-surface-variant text-center px-4">
              Platform Keamanan Terpadu. Integritas dan Kecepatan.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="w-full space-y-stack-md">
            
            {/* Username Field */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="email" className="font-label-caps text-xs font-bold text-on-surface uppercase tracking-wider">
                ID PERSONIL / NOMOR HP
              </label>
              <div className="relative flex items-center bg-surface-container-lowest rounded-lg border border-outline transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                <span className="material-symbols-outlined absolute left-3 text-on-surface-variant opacity-70">person</span>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Masukkan nomor HP atau ID"
                  className="w-full pl-10 pr-4 py-3 bg-transparent border-none focus:ring-0 font-body-md text-on-surface placeholder-outline outline-none rounded-lg"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="password" className="font-label-caps text-xs font-bold text-on-surface uppercase tracking-wider">
                Kata Sandi
              </label>
              <div className="relative flex items-center bg-surface-container-lowest rounded-lg border border-outline transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                <span className="material-symbols-outlined absolute left-3 text-on-surface-variant opacity-70">lock</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Masukkan kata sandi"
                  className="w-full pl-10 pr-10 py-3 bg-transparent border-none focus:ring-0 font-body-md text-on-surface placeholder-outline outline-none rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-on-surface-variant opacity-70 hover:opacity-100 transition-opacity"
                  aria-label="Toggle password visibility"
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="rounded border-outline-variant text-primary focus:ring-primary focus:ring-offset-0 w-4 h-4 bg-surface-container-lowest group-hover:border-primary transition-colors"
                />
                <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-on-surface transition-colors">
                  Ingat Sesi
                </span>
              </label>
              <a href="#" className="font-body-md text-body-md text-primary font-medium hover:text-primary-container transition-colors">
                Lupa Sandi?
              </a>
            </div>

            {/* Submit Button */}
            <div className="pt-stack-sm">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 bg-primary text-on-primary rounded font-button-text text-button-text hover:bg-primary-container transition-colors flex items-center justify-center space-x-2 group shadow-sm hover:shadow-md disabled:opacity-50"
              >
                <span>{loading ? 'MEMVERIFIKASI...' : 'MASUK SISTEM'}</span>
                {!loading && (
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Security Notice Footer */}
          <div className="mt-stack-lg pt-stack-md border-t border-outline-variant w-full text-center flex flex-col items-center justify-center opacity-80">
            <span className="material-symbols-outlined text-error mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>
              warning
            </span>
            <p className="font-label-caps text-label-caps text-error tracking-wider uppercase max-w-[200px] leading-relaxed">
              Akses Terbatas: Hanya untuk Personil Berwenang
            </p>
          </div>
        </div>

        {/* Versioning/System Info */}
        <div className="text-center mt-stack-md opacity-60">
          <p className="font-label-caps text-[10px] text-on-surface-variant tracking-wider uppercase">
            SIGAP Core v2.4.1 • Sambungan Terenkripsi
          </p>
        </div>
      </main>
    </div>
  );
}
