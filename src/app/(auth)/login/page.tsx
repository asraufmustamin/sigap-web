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
    } catch {
      toast.error('Terjadi kesalahan', { description: 'Gagal terhubung ke server.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-[#f0f4f9] min-h-screen flex flex-col justify-center items-center p-4 sm:p-8 font-body-md">
      
      <div className="w-full max-w-[450px] bg-white rounded-[28px] flex flex-col p-8 sm:p-10 shadow-sm border border-gray-100 min-h-[500px]">
        
        {/* Branding */}
        <div className="flex flex-col items-center mb-8 text-center">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVHjIZWBDuWlh7HjNLkZcS3Khwpgv70J3Mwr48vlFF5aOX_rFHRyEZv929t0TXE-YhzK_BdJ_WpAPVxkCmTc6hkJ_itPvu2nv6hg-FYmRCs3GA7dChRzALsUt2NCsMuoMDMcYoAPRGK7HJ8HkKvlTeFEb0xTHm00HqlXfXavkCHXx6JPzNBfDr_E0OQPlIuH2fbTn3fuEpH7VBF45bJ050jq0UxRi69ZyGtXA8uGqfgOkGRA86HCyndsQqoI7DboE_-zevswtiiblK" 
            alt="SIGAP Logo"
            className="w-14 h-14 rounded-full border border-gray-100 mb-4 object-cover"
          />
          <h1 className="text-2xl text-[#1f1f1f] tracking-tight mb-2 font-medium" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>Portal Komando</h1>
          <p className="text-sm text-[#444746]">
            Sistem Informasi Keamanan dan Pelaporan
          </p>
          <div className="mt-4 flex items-center gap-1.5 px-3 py-1 bg-red-50 rounded-full border border-red-100">
            <span className="material-symbols-outlined text-[#d93025] text-[14px]">gpp_bad</span>
            <span className="text-[10px] text-[#d93025] font-bold tracking-widest uppercase">Akses Terbatas</span>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 flex flex-col justify-between">
          <form onSubmit={handleLogin} className="flex flex-col w-full">
            
            {/* Email Input */}
            <div className="mb-6 relative">
              <input
                type="text"
                id="email"
                className="peer block w-full rounded-[4px] border border-[#747775] bg-transparent px-4 py-4 text-base text-[#1f1f1f] focus:border-2 focus:border-[#0b57d0] focus:px-[15px] focus:py-[15px] focus:outline-none appearance-none"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
              <label
                htmlFor="email"
                className="absolute left-3 top-4 z-10 origin-left -translate-y-7 scale-75 transform bg-white px-1 text-base text-[#444746] duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-[#0b57d0] pointer-events-none whitespace-nowrap"
              >
                ID Personil atau Email
              </label>
            </div>

            {/* Password Input */}
            <div className="mb-2 relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="peer block w-full rounded-[4px] border border-[#747775] bg-transparent px-4 py-4 text-base text-[#1f1f1f] focus:border-2 focus:border-[#0b57d0] focus:px-[15px] focus:py-[15px] focus:outline-none appearance-none"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
              <label
                htmlFor="password"
                className="absolute left-3 top-4 z-10 origin-left -translate-y-7 scale-75 transform bg-white px-1 text-base text-[#444746] duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-[#0b57d0] pointer-events-none whitespace-nowrap"
              >
                Kata Sandi
              </label>
            </div>

            <div className="flex items-center gap-2 mb-6 mt-2 cursor-pointer w-fit group">
              <input 
                type="checkbox" 
                id="show-password"
                className="w-4 h-4 rounded-[2px] border-[#747775] text-[#0b57d0] focus:ring-[#0b57d0] cursor-pointer"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                disabled={loading}
              />
              <label htmlFor="show-password" className="text-sm text-[#1f1f1f] cursor-pointer select-none">Tampilkan sandi</label>
            </div>

            <p className="text-sm text-[#444746] mb-8 leading-relaxed">
              Ini adalah sistem internal. Segala aktivitas akan dicatat dan diawasi oleh Administrator SIGAP.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto">
              <button type="button" className="text-sm text-[#0b57d0] font-medium hover:bg-blue-50 px-3 py-2 rounded-full -ml-3 transition-colors text-left">
                Lupa sandi?
              </button>
              <button 
                type="submit"
                disabled={loading}
                className={`bg-[#0b57d0] text-white font-medium text-sm px-6 py-2.5 rounded-full hover:bg-[#0842a0] transition-colors flex items-center justify-center min-w-[100px] ${loading ? 'opacity-70' : ''}`}
              >
                {loading ? (
                   <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  'Masuk'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="w-full max-w-[450px] flex justify-between items-center mt-6 px-2 text-xs text-[#444746]">
        <div>
          <span className="cursor-pointer hover:bg-gray-200 px-2 py-1 rounded">Indonesia <span className="material-symbols-outlined text-[12px] align-middle ml-1">arrow_drop_down</span></span>
        </div>
        <div className="flex gap-4">
          <a href="#" className="hover:bg-gray-200 px-2 py-1 rounded transition-colors">Bantuan</a>
          <a href="#" className="hover:bg-gray-200 px-2 py-1 rounded transition-colors">Privasi</a>
        </div>
      </div>

    </div>
  );
}
