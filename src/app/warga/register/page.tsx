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
    } catch {
      setErrorMsg('Terjadi kesalahan koneksi jaringan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-[#f0f4f9] min-h-screen flex flex-col justify-center items-center p-4 sm:p-8 font-body-md">
      
      <div className="w-full max-w-[1040px] bg-white rounded-[28px] flex flex-col md:flex-row overflow-hidden min-h-[500px] p-8 sm:p-10 shadow-sm border border-gray-100">
        
        {/* Left Column: Branding */}
        <div className="flex-1 flex flex-col md:pr-12 mb-10 md:mb-0">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVHjIZWBDuWlh7HjNLkZcS3Khwpgv70J3Mwr48vlFF5aOX_rFHRyEZv929t0TXE-YhzK_BdJ_WpAPVxkCmTc6hkJ_itPvu2nv6hg-FYmRCs3GA7dChRzALsUt2NCsMuoMDMcYoAPRGK7HJ8HkKvlTeFEb0xTHm00HqlXfXavkCHXx6JPzNBfDr_E0OQPlIuH2fbTn3fuEpH7VBF45bJ050jq0UxRi69ZyGtXA8uGqfgOkGRA86HCyndsQqoI7DboE_-zevswtiiblK" 
            alt="SIGAP Logo"
            className="w-14 h-14 rounded-full border border-gray-100 mb-6 object-cover"
          />
          <h1 className="text-3xl md:text-4xl text-[#1f1f1f] tracking-tight mb-4 font-medium" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>Buat Akun</h1>
          <p className="text-base text-[#444746] mb-8 leading-relaxed">
            Daftarkan identitas Anda untuk mendapatkan akses ke layanan pelaporan keamanan SIGAP.
          </p>

          <div className="hidden md:block mt-auto text-sm text-[#444746] leading-relaxed max-w-[350px]">
            Sistem Informasi Keamanan dan Pelaporan dirancang untuk memberikan respons cepat terhadap kejadian di lingkungan Anda.
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="flex-1 w-full max-w-[450px] md:max-w-none md:ml-auto flex flex-col justify-between pt-2">
          
          <form onSubmit={handleRegister} className="flex flex-col w-full h-full">
            
            {errorMsg ? (
              <div className="flex items-center gap-2 mb-6 p-3 bg-red-50 text-[#d93025] rounded-xl border border-red-100 text-sm">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>{errorMsg}</span>
              </div>
            ) : null}

            <div className="flex flex-col md:flex-row gap-4 mb-4">
              {/* Name Input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  id="name"
                  className="peer block w-full rounded-[4px] border border-[#747775] bg-transparent px-4 py-4 text-base text-[#1f1f1f] focus:border-2 focus:border-[#0b57d0] focus:px-[15px] focus:py-[15px] focus:outline-none appearance-none"
                  placeholder=" "
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                />
                <label
                  htmlFor="name"
                  className="absolute left-3 top-4 z-10 origin-left -translate-y-7 scale-75 transform bg-white px-1 text-base text-[#444746] duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-[#0b57d0] pointer-events-none whitespace-nowrap"
                >
                  Nama Lengkap
                </label>
              </div>

              {/* NIK Input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  id="nik"
                  className="peer block w-full rounded-[4px] border border-[#747775] bg-transparent px-4 py-4 text-base text-[#1f1f1f] focus:border-2 focus:border-[#0b57d0] focus:px-[15px] focus:py-[15px] focus:outline-none appearance-none"
                  placeholder=" "
                  value={nik}
                  onChange={(e) => setNik(e.target.value.replace(/[^0-9]/g, '').substring(0, 16))}
                  disabled={isLoading}
                />
                <label
                  htmlFor="nik"
                  className="absolute left-3 top-4 z-10 origin-left -translate-y-7 scale-75 transform bg-white px-1 text-base text-[#444746] duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-[#0b57d0] pointer-events-none whitespace-nowrap"
                >
                  NIK
                </label>
              </div>
            </div>

            {/* Phone Input */}
            <div className="mb-4 relative">
              <input
                type="tel"
                id="phone"
                className="peer block w-full rounded-[4px] border border-[#747775] bg-transparent px-4 py-4 text-base text-[#1f1f1f] focus:border-2 focus:border-[#0b57d0] focus:px-[15px] focus:py-[15px] focus:outline-none appearance-none"
                placeholder=" "
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isLoading}
              />
              <label
                htmlFor="phone"
                className="absolute left-3 top-4 z-10 origin-left -translate-y-7 scale-75 transform bg-white px-1 text-base text-[#444746] duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-[#0b57d0] pointer-events-none whitespace-nowrap"
              >
                Nomor Handphone Aktif
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
                disabled={isLoading}
              />
              <label
                htmlFor="password"
                className="absolute left-3 top-4 z-10 origin-left -translate-y-7 scale-75 transform bg-white px-1 text-base text-[#444746] duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-[#0b57d0] pointer-events-none whitespace-nowrap"
              >
                Buat Kata Sandi Baru
              </label>
            </div>

            <div className="flex items-center gap-2 mb-6 mt-2 cursor-pointer w-fit group">
              <input 
                type="checkbox" 
                id="show-password"
                className="w-4 h-4 rounded-[2px] border-[#747775] text-[#0b57d0] focus:ring-[#0b57d0] cursor-pointer"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              />
              <label htmlFor="show-password" className="text-sm text-[#1f1f1f] cursor-pointer select-none">Tampilkan sandi</label>
            </div>

            <p className="text-sm text-[#444746] mb-8 leading-relaxed">
              Dengan membuat akun, Anda menyetujui <a href="#" className="text-[#0b57d0] hover:underline font-medium">Persyaratan Layanan</a> dan <a href="#" className="text-[#0b57d0] hover:underline font-medium">Kebijakan Privasi</a> SIGAP.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto">
              <Link 
                href="/warga/login" 
                className="text-[#0b57d0] font-medium text-sm hover:bg-blue-50 px-3 py-2 rounded-full -ml-3 transition-colors text-left"
              >
                Masuk saja
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

      <div className="w-full max-w-[1040px] flex justify-between items-center mt-6 px-2 text-xs text-[#444746]">
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
