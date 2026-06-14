'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const CATEGORIES = [
  'Bencana Alam',
  'Kriminalitas',
  'Kebakaran',
  'Kecelakaan',
  'Gangguan Keamanan',
  'Lainnya',
];

export default function WargaLapor() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Location state
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationError, setLocationError] = useState('');
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem('warga_session');
    if (!session) {
      router.push('/warga/login');
    } else {
      setUser(JSON.parse(session));
      getLocation();
    }
  }, []);

  const getLocation = () => {
    setLocating(true);
    setLocationError('');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocating(false);
        },
        (err) => {
          console.error(err);
          setLocationError('Gagal mendapatkan lokasi. Pastikan izin GPS diberikan.');
          setLocating(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setLocationError('Browser tidak mendukung GPS.');
      setLocating(false);
    }
  };

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview) {
      alert('Harap ambil foto atau unggah gambar kejadian sebagai bukti.');
      return;
    }
    if (!location) {
      alert('Harap tunggu hingga lokasi GPS terkunci atau pastikan GPS Anda aktif.');
      return;
    }
    if (!category) {
      alert('Harap pilih kategori insiden.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          category,
          lat: location.lat,
          lng: location.lng,
          image_url: imagePreview, 
          reporter_id: user?.id,
          status: 'pending'
        }),
      });

      if (!res.ok) throw new Error('Gagal mengirim laporan');

      router.push('/warga/riwayat');
      
    } catch (err) {
      alert('Terjadi kesalahan saat mengirim laporan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-10 max-w-4xl mx-auto">
      
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Buat Laporan Baru</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side - Image Upload */}
        <div className="md:w-1/2 bg-gray-50 border-r border-gray-100 flex flex-col relative min-h-[300px]">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-gray-100 transition-colors group relative"
          >
            {imagePreview ? (
              <div className="absolute inset-0">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-white text-3xl">refresh</span>
                  <span className="text-white font-medium text-sm">Ganti Foto</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center text-gray-400 group-hover:text-[#0b57d0] transition-colors">
                <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-105 transition-transform border border-gray-100">
                  <span className="material-symbols-outlined text-4xl">add_a_photo</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Unggah Bukti Foto</h3>
                <p className="text-sm">Klik untuk mengambil foto atau memilih dari galeri</p>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" 
              ref={fileInputRef}
              onChange={handleImageCapture}
              className="hidden"
            />
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col">
          
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 h-full gap-6">
            
            {/* Location Alert */}
            <div className={`p-4 rounded-xl border flex gap-3 items-start ${
              location 
                ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
                : 'bg-amber-50 border-amber-100 text-amber-800'
            }`}>
              <span className="material-symbols-outlined text-[20px] mt-0.5 shrink-0">
                {location ? 'my_location' : 'location_searching'}
              </span>
              <div className="flex flex-col">
                <span className="font-semibold text-sm">
                  {locating ? 'Mencari lokasi...' : locationError ? 'Lokasi Tidak Ditemukan' : 'Lokasi Terkunci'}
                </span>
                {locationError ? (
                  <div className="mt-1 flex flex-col items-start gap-2">
                    <span className="text-xs">{locationError}</span>
                    <button type="button" onClick={getLocation} className="text-xs font-bold underline hover:text-amber-900">Coba Lagi</button>
                  </div>
                ) : location ? (
                  <span className="text-xs font-mono opacity-80 mt-1">
                    LAT: {location.lat.toFixed(5)} | LNG: {location.lng.toFixed(5)}
                  </span>
                ) : null}
              </div>
            </div>

            {/* Category Dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Kategori Insiden <span className="text-red-500">*</span></label>
              <div className="relative">
                <select 
                  className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 outline-none focus:border-[#0b57d0] focus:ring-1 focus:ring-[#0b57d0] cursor-pointer"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="" disabled>Pilih kategori...</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">expand_more</span>
              </div>
            </div>

            {/* Description Text Area */}
            <div className="flex flex-col gap-1.5 flex-1 min-h-[120px]">
              <label className="text-sm font-semibold text-gray-700">Deskripsi Tambahan <span className="text-gray-400 font-normal">(Opsional)</span></label>
              <textarea 
                className="w-full flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 outline-none focus:border-[#0b57d0] focus:ring-1 focus:ring-[#0b57d0] resize-none"
                placeholder="Tuliskan detail kejadian, ciri-ciri pelaku, atau informasi penting lainnya..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <div className="mt-auto pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-[#0b57d0] hover:bg-[#0842a0] text-white py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span className="material-symbols-outlined text-[20px]">send</span>
                )}
                {loading ? 'Mengirim Laporan...' : 'Kirim Laporan Sekarang'}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}
