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
    <div className="flex-1 bg-[#f0f4f9] min-h-screen flex flex-col justify-center items-center p-4 md:p-8 font-body-md">
      
      <div className="w-full max-w-[1040px] bg-white rounded-[32px] flex flex-col md:flex-row overflow-hidden min-h-[400px] p-8 md:p-12 shadow-sm">
        
        {/* Left Column: Branding */}
        <div className="flex-1 flex flex-col md:pr-10 mb-10 md:mb-0">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVHjIZWBDuWlh7HjNLkZcS3Khwpgv70J3Mwr48vlFF5aOX_rFHRyEZv929t0TXE-YhzK_BdJ_WpAPVxkCmTc6hkJ_itPvu2nv6hg-FYmRCs3GA7dChRzALsUt2NCsMuoMDMcYoAPRGK7HJ8HkKvlTeFEb0xTHm00HqlXfXavkCHXx6JPzNBfDr_E0OQPlIuH2fbTn3fuEpH7VBF45bJ050jq0UxRi69ZyGtXA8uGqfgOkGRA86HCyndsQqoI7DboE_-zevswtiiblK" 
            alt="SIGAP Logo"
            className="w-12 h-12 rounded-full border border-gray-100 mb-6 object-cover"
          />
          <h1 className="text-4xl text-[#1f1f1f] tracking-tight mb-4" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>Buat Akun</h1>
          <p className="text-base text-[#444746]">
            Daftarkan identitas Anda untuk akses ke platform pelaporan insiden SIGAP.
          </p>
        </div>

        {/* Right Column: Form */}
        <div className="flex-1 w-full max-w-[450px] md:ml-auto flex flex-col justify-between pt-2">
          
          <form onSubmit={handleRegister} className="flex flex-col w-full">
            
            {errorMsg ? (
              <div className="flex items-center gap-2 mb-6 text-[#d93025]">
                <span className="material-symbols-outlined text-[20px]">error</span>
                <span className="text-sm">{errorMsg}</span>
              </div>
            ) : null}

            {/* Name Input */}
            <div className="mb-4 relative">
              <input
                type="text"
                className="peer w-full h-[56px] px-4 pt-4 pb-1 text-base text-[#1f1f1f] bg-transparent border border-[#747775] rounded-[4px] outline-none focus:border-[2px] focus:border-[#0b57d0] transition-colors"
                placeholder=" "
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
              <label className="absolute left-4 top-[18px] text-[#444746] text-base pointer-events-none transition-all peer-focus:text-[12px] peer-focus:top-[8px] peer-focus:text-[#0b57d0] peer-[:not(:placeholder-shown)]:text-[12px] peer-[:not(:placeholder-shown)]:top-[8px]">
                Nama Lengkap Sesuai KTP
              </label>
            </div>

            {/* NIK Input */}
            <div className="mb-4 relative">
              <input
                type="text"
                className="peer w-full h-[56px] px-4 pt-4 pb-1 text-base text-[#1f1f1f] bg-transparent border border-[#747775] rounded-[4px] outline-none focus:border-[2px] focus:border-[#0b57d0] transition-colors"
                placeholder=" "
                value={nik}
                onChange={(e) => setNik(e.target.value.replace(/[^0-9]/g, '').substring(0, 16))}
                disabled={isLoading}
              />
              <label className="absolute left-4 top-[18px] text-[#444746] text-base pointer-events-none transition-all peer-focus:text-[12px] peer-focus:top-[8px] peer-focus:text-[#0b57d0] peer-[:not(:placeholder-shown)]:text-[12px] peer-[:not(:placeholder-shown)]:top-[8px]">
                Nomor Induk Kependudukan (NIK)
              </label>
            </div>

            {/* Phone Input */}
            <div className="mb-4 relative">
              <input
                type="tel"
                className="peer w-full h-[56px] px-4 pt-4 pb-1 text-base text-[#1f1f1f] bg-transparent border border-[#747775] rounded-[4px] outline-none focus:border-[2px] focus:border-[#0b57d0] transition-colors"
                placeholder=" "
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isLoading}
              />
              <label className="absolute left-4 top-[18px] text-[#444746] text-base pointer-events-none transition-all peer-focus:text-[12px] peer-focus:top-[8px] peer-focus:text-[#0b57d0] peer-[:not(:placeholder-shown)]:text-[12px] peer-[:not(:placeholder-shown)]:top-[8px]">
                Nomor Handphone Aktif
              </label>
            </div>

            {/* Password Input */}
            <div className="mb-2 relative">
              <input
                type={showPassword ? "text" : "password"}
                className="peer w-full h-[56px] px-4 pt-4 pb-1 text-base text-[#1f1f1f] bg-transparent border border-[#747775] rounded-[4px] outline-none focus:border-[2px] focus:border-[#0b57d0] transition-colors"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <label className="absolute left-4 top-[18px] text-[#444746] text-base pointer-events-none transition-all peer-focus:text-[12px] peer-focus:top-[8px] peer-focus:text-[#0b57d0] peer-[:not(:placeholder-shown)]:text-[12px] peer-[:not(:placeholder-shown)]:top-[8px]">
                Buat Kata Sandi Baru
              </label>
            </div>

            <div className="flex items-center gap-2 mb-8 mt-2 cursor-pointer w-fit group" onClick={() => setShowPassword(!showPassword)}>
              <div className={`w-4 h-4 rounded-[2px] border ${showPassword ? 'bg-[#0b57d0] border-[#0b57d0]' : 'border-[#444746]'} flex items-center justify-center transition-colors`}>
                {showPassword && <span className="material-symbols-outlined text-white text-[14px]">check</span>}
              </div>
              <span className="text-sm text-[#1f1f1f] group-hover:text-[#0b57d0] transition-colors">Tampilkan sandi</span>
            </div>

            <p className="text-sm text-[#444746] mb-8 leading-relaxed">
              Dengan membuat akun, Anda menyetujui <a href="#" className="text-[#0b57d0] hover:underline">Persyaratan Layanan</a> dan <a href="#" className="text-[#0b57d0] hover:underline">Kebijakan Privasi</a> SIGAP.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto">
              <Link 
                href="/warga/login" 
                className="text-[#0b57d0] font-medium text-sm px-4 py-2.5 rounded-full hover:bg-blue-50 transition-colors text-center"
              >
                Sudah punya akun?
              </Link>
              <button 
                type="submit"
                disabled={isLoading}
                className={`bg-[#0b57d0] text-white font-medium text-sm px-6 py-2.5 rounded-full hover:bg-[#0842a0] transition-colors flex items-center justify-center min-w-[100px] ${isLoading ? 'opacity-70' : ''}`}
              >
                {isLoading ? (
                   <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  'Buat Akun'
                )}
              </button>
            </div>
          </form>

        </div>
      </div>

      <div className="w-full max-w-[1040px] flex justify-between items-center mt-4 px-2 text-xs text-[#444746]">
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
