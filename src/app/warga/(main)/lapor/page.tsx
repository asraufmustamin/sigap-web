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
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  
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
          setLocationError('Gagal mendapatkan lokasi. Pastikan GPS aktif.');
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
      alert('Harap ambil foto kejadian sebagai bukti.');
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

      alert('Berhasil! Laporan Anda telah terkirim ke instansi terkait.');
      router.replace('/warga/home');
      
    } catch (err) {
      alert('Terjadi kesalahan saat mengirim laporan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-surface min-h-screen flex flex-col relative pb-32">
      {/* TopAppBar */}
      <div className="flex items-center justify-between px-5 w-full h-16 bg-surface z-10 border-b border-outline-variant/30 sticky top-0">
        <div className="flex items-center gap-3">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVHjIZWBDuWlh7HjNLkZcS3Khwpgv70J3Mwr48vlFF5aOX_rFHRyEZv929t0TXE-YhzK_BdJ_WpAPVxkCmTc6hkJ_itPvu2nv6hg-FYmRCs3GA7dChRzALsUt2NCsMuoMDMcYoAPRGK7HJ8HkKvlTeFEb0xTHm00HqlXfXavkCHXx6JPzNBfDr_E0OQPlIuH2fbTn3fuEpH7VBF45bJ050jq0UxRi69ZyGtXA8uGqfgOkGRA86HCyndsQqoI7DboE_-zevswtiiblK" 
            className="w-8 h-8 rounded-full object-cover"
            alt="SIGAP"
          />
          <h1 className="font-headline-md text-xl font-bold text-primary tracking-tight">SIGAP</h1>
        </div>
        <button 
          className="p-2 rounded-full hover:bg-surface-container-high transition-colors"
          onClick={() => router.back()}
        >
          <span className="material-symbols-outlined text-[24px] text-on-surface-variant">close</span>
        </button>
      </div>

      {/* Camera Section */}
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="w-full relative bg-black flex flex-col items-center justify-center cursor-pointer overflow-hidden group h-[280px]"
      >
        {imagePreview ? (
          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover opacity-90 group-hover:opacity-75 transition-opacity" />
        ) : (
          <div className="flex flex-col items-center justify-center text-white/70">
            <span className="material-symbols-outlined text-6xl mb-4">photo_camera</span>
            <span className="font-body-lg font-medium">Tap untuk Buka Kamera</span>
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
        {imagePreview && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
            <div className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm border border-white/30 flex items-center gap-2">
              <span className="material-symbols-outlined text-white text-sm">refresh</span>
              <span className="text-white text-sm font-bold tracking-wider">FOTO ULANG</span>
            </div>
          </div>
        )}
      </div>

      {/* Form Elements Area */}
      <div className="px-5 py-6 flex-col gap-6 flex-grow bg-surface rounded-t-2xl -mt-4 relative z-10">
        
        {/* Location Card */}
        <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-lg p-4 shadow-[0_4px_20px_0_rgba(0,42,22,0.03)] flex gap-4 items-start">
          <div className="p-2 bg-primary-container/10 rounded-full shrink-0 mt-1 flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px] text-primary">location_on</span>
          </div>
          <div className="flex-1">
            <h3 className="font-label-caps text-[12px] text-on-surface-variant font-bold mb-1 uppercase tracking-wider">LOKASI TERDETEKSI</h3>
            {locating ? (
              <p className="font-body-md text-on-surface">Mencari lokasi akurat...</p>
            ) : locationError ? (
              <div>
                <p className="text-error text-xs mb-2">{locationError}</p>
                <button onClick={getLocation} className="bg-error-container text-error font-bold text-xs px-3 py-1 rounded-md">
                  Coba Lagi
                </button>
              </div>
            ) : location ? (
              <div>
                <p className="font-body-md text-on-surface font-semibold mb-0.5">Titik Koordinat Terkunci</p>
                <p className="font-mono text-[11px] text-outline tracking-wider mt-1">
                  LAT: {location.lat.toFixed(4)} - LNG: {location.lng.toFixed(4)}
                </p>
              </div>
            ) : null}
          </div>
        </div>

        {/* Category Dropdown */}
        <div className="flex flex-col gap-1 z-20 relative">
          <label className="font-label-caps text-[12px] text-on-surface-variant font-bold uppercase tracking-wider">KATEGORI INSIDEN</label>
          <div 
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-3 pl-4 pr-4 flex justify-between items-center cursor-pointer hover:border-primary transition-colors"
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
          >
            <span className={`font-body-lg text-base ${category ? 'text-on-surface' : 'text-on-surface-variant'}`}>
              {category || 'Pilih kategori...'}
            </span>
            <span className="material-symbols-outlined text-[24px] text-outline">
              {showCategoryDropdown ? 'expand_less' : 'expand_more'}
            </span>
          </div>
          
          {showCategoryDropdown && (
            <div className="absolute top-full mt-1 left-0 w-full bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden shadow-sm z-30">
              {CATEGORIES.map((cat, index) => (
                <div 
                  key={cat} 
                  className={`px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-surface-container-low transition-colors ${index < CATEGORIES.length - 1 ? 'border-b border-outline-variant/30' : ''}`}
                  onClick={() => { setCategory(cat); setShowCategoryDropdown(false); }}
                >
                  <span className={`font-body-md ${category === cat ? 'text-primary font-bold' : 'text-on-surface'}`}>{cat}</span>
                  {category === cat && <span className="material-symbols-outlined text-[18px] text-primary">check</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Description Text Area */}
        <div className="flex flex-col gap-1 flex-grow mb-6 z-10">
          <label className="font-label-caps text-[12px] text-on-surface-variant font-bold uppercase tracking-wider">DESKRIPSI (OPSIONAL)</label>
          <textarea 
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-4 font-body-md text-on-surface text-base outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
            style={{ minHeight: '120px' }}
            placeholder="Jelaskan detail situasi..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>
      
      {/* Bottom Action Area */}
      <div className="bg-surface border-t border-outline-variant/30 p-5 shadow-[0_-4px_20px_0_rgba(0,42,22,0.08)] fixed bottom-0 w-full max-w-md z-50 pb-8">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full bg-secondary-container py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-secondary-container/90'}`}
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-on-secondary-container border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <span className="material-symbols-outlined text-[20px] text-on-secondary-container">send</span>
          )}
          <span className="text-on-secondary-container font-bold text-[16px] tracking-wide uppercase">
            {loading ? 'MENGIRIM...' : 'KIRIM LAPORAN'}
          </span>
        </button>
      </div>
    </div>
  );
}
