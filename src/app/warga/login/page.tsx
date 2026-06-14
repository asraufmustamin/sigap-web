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
    } catch {
      setErrorMsg('Gagal terhubung ke server. Periksa koneksi internet Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-[#f0f4f9] min-h-screen flex flex-col justify-center items-center p-4 font-body-md">
      
      <div className="w-full max-w-[450px] bg-white rounded-[32px] flex flex-col overflow-hidden p-6 md:p-8 shadow-sm">
        
        {/* Branding */}
        <div className="flex flex-col mb-6">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVHjIZWBDuWlh7HjNLkZcS3Khwpgv70J3Mwr48vlFF5aOX_rFHRyEZv929t0TXE-YhzK_BdJ_WpAPVxkCmTc6hkJ_itPvu2nv6hg-FYmRCs3GA7dChRzALsUt2NCsMuoMDMcYoAPRGK7HJ8HkKvlTeFEb0xTHm00HqlXfXavkCHXx6JPzNBfDr_E0OQPlIuH2fbTn3fuEpH7VBF45bJ050jq0UxRi69ZyGtXA8uGqfgOkGRA86HCyndsQqoI7DboE_-zevswtiiblK" 
            alt="SIGAP Logo"
            className="w-12 h-12 rounded-full border border-gray-100 mb-4 object-cover"
          />
          <h1 className="text-2xl text-[#1f1f1f] tracking-tight mb-2" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>Login</h1>
          <p className="text-sm text-[#444746]">
            Lanjutkan ke Aplikasi Pelaporan Warga SIGAP
          </p>
        </div>

        {/* Form */}
        <div className="w-full flex flex-col pt-2">
          
          <form onSubmit={handleLogin} className="flex flex-col w-full">
            
            {errorMsg ? (
              <div className="flex items-center gap-2 mb-6 text-[#d93025]">
                <span className="material-symbols-outlined text-[20px]">error</span>
                <span className="text-sm">{errorMsg}</span>
              </div>
            ) : null}

            {/* Identifier Input */}
            <div className="mb-6 relative">
              <input
                type="text"
                className="peer w-full h-[56px] px-4 pt-4 pb-1 text-base text-[#1f1f1f] bg-transparent border border-[#747775] rounded-[4px] outline-none focus:border-2 focus:border-[#0b57d0] transition-colors"
                placeholder=" "
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                disabled={isLoading}
              />
              <label className="absolute left-4 top-[18px] text-[#444746] text-base pointer-events-none transition-all peer-focus:text-[12px] peer-focus:top-[8px] peer-focus:text-[#0b57d0] peer-[:not(:placeholder-shown)]:text-[12px] peer-[:not(:placeholder-shown)]:top-[8px]">
                Nomor Handphone atau NIK
              </label>
            </div>

            {/* Password Input */}
            <div className="mb-2 relative">
              <input
                type={showPassword ? "text" : "password"}
                className="peer w-full h-[56px] px-4 pt-4 pb-1 text-base text-[#1f1f1f] bg-transparent border border-[#747775] rounded-[4px] outline-none focus:border-2 focus:border-[#0b57d0] transition-colors"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <label className="absolute left-4 top-[18px] text-[#444746] text-base pointer-events-none transition-all peer-focus:text-[12px] peer-focus:top-[8px] peer-focus:text-[#0b57d0] peer-[:not(:placeholder-shown)]:text-[12px] peer-[:not(:placeholder-shown)]:top-[8px]">
                Kata Sandi
              </label>
            </div>

            <div className="flex items-center gap-2 mb-8 mt-2 cursor-pointer w-fit group" onClick={() => setShowPassword(!showPassword)}>
              <div className={`w-4 h-4 rounded-[2px] border ${showPassword ? 'bg-[#0b57d0] border-[#0b57d0]' : 'border-[#444746]'} flex items-center justify-center transition-colors`}>
                {showPassword && <span className="material-symbols-outlined text-white text-[14px]">check</span>}
              </div>
              <span className="text-sm text-[#1f1f1f] group-hover:text-[#0b57d0] transition-colors">Tampilkan sandi</span>
            </div>

            <div className="flex justify-start mb-8">
              <button type="button" className="text-sm text-[#0b57d0] font-medium hover:bg-blue-50 px-2 py-1.5 rounded-[4px] -ml-2 transition-colors">
                Lupa sandi?
              </button>
            </div>

            <p className="text-sm text-[#444746] mb-10 leading-relaxed">
              Bukan perangkat Anda? Gunakan mode Tamu untuk login secara rahasia.{' '}
              <a href="#" className="text-[#0b57d0] font-medium hover:underline">Pelajari lebih lanjut tentang menggunakan Mode tamu</a>
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto">
              <Link 
                href="/warga/register" 
                className="text-[#0b57d0] font-medium text-sm px-4 py-2.5 rounded-full hover:bg-blue-50 transition-colors text-center"
              >
                Buat akun
              </Link>
              <button 
                type="submit"
                disabled={isLoading}
                className={`bg-[#0b57d0] text-white font-medium text-sm px-6 py-2.5 rounded-full hover:bg-[#0842a0] transition-colors flex items-center justify-center min-w-[100px] ${isLoading ? 'opacity-70' : ''}`}
              >
                {isLoading ? (
                   <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  'Selanjutnya'
                )}
              </button>
            </div>
          </form>

        </div>
      </div>

      <div className="w-full max-w-[450px] flex justify-between items-center mt-4 px-2 text-xs text-[#444746]">
        <div>
          <span className="cursor-pointer hover:bg-gray-200 px-2 py-1 rounded">Indonesia <span className="material-symbols-outlined text-[12px] align-middle ml-1">arrow_drop_down</span></span>
        </div>
        <div className="flex gap-4">
          <a href="#" className="hover:bg-gray-200 px-2 py-1 rounded transition-colors">Bantuan</a>
          <a href="#" className="hover:bg-gray-200 px-2 py-1 rounded transition-colors">Privasi</a>
          <a href="#" className="hover:bg-gray-200 px-2 py-1 rounded transition-colors">Persyaratan</a>
        </div>
      </div>

    </div>
  );
}
