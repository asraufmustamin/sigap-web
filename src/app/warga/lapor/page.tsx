'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function WargaLapor() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Form state
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Bencana Alam');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Location state
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationError, setLocationError] = useState('');
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    // Cek auth
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
          setLocationError('Gagal mendapatkan lokasi. Pastikan GPS aktif dan izin diberikan.');
          setLocating(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setLocationError('Browser Anda tidak mendukung deteksi lokasi.');
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
    if (!location) {
      setError('Lokasi GPS wajib diaktifkan sebelum melapor.');
      return;
    }
    if (!imagePreview) {
      setError('Mohon ambil foto kejadian.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          category,
          lat: location.lat,
          lng: location.lng,
          image_url: imagePreview, // Menggunakan base64 untuk demo, sebaiknya upload ke cloud storage di production
          reporter_id: user?.id,
          status: 'pending'
        }),
      });

      if (!res.ok) throw new Error('Gagal mengirim laporan');

      setSuccess(true);
      
    } catch (err) {
      setError('Terjadi kesalahan koneksi saat mengirim laporan.');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('warga_session');
    router.push('/warga/login');
  };

  if (success) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-surface-container-lowest min-h-screen text-center">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-5xl">check_circle</span>
        </div>
        <h1 className="text-3xl font-bold text-on-surface mb-4">Laporan Terkirim!</h1>
        <p className="text-on-surface-variant font-body-lg mb-8">
          Terima kasih. Laporan Anda telah masuk ke Pusat Komando dan akan segera diproses oleh Babinsa terdekat.
        </p>
        <button 
          onClick={() => {
            setSuccess(false);
            setDescription('');
            setImagePreview(null);
            setCategory('Bencana Alam');
          }}
          className="w-full bg-primary text-on-primary py-4 rounded-2xl font-bold mb-4"
        >
          Kirim Laporan Lain
        </button>
        <Link href="/warga/riwayat" className="w-full bg-surface-container text-on-surface py-4 rounded-2xl font-bold flex items-center justify-center">
          Lihat Riwayat Saya
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-surface-container-lowest pb-24">
      {/* App Bar */}
      <div className="bg-primary text-on-primary p-4 shadow-md sticky top-0 z-10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined">person</span>
          </div>
          <div>
            <h2 className="font-bold text-sm leading-tight">{user?.name || 'Warga'}</h2>
            <p className="text-xs opacity-80">Siap Lapor</p>
          </div>
        </div>
        <button onClick={handleLogout} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <span className="material-symbols-outlined">logout</span>
        </button>
      </div>

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-on-surface">Buat Laporan Baru</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-error-container text-on-error-container rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          {/* Camera Input */}
          <div>
            <label className="block text-sm font-medium mb-2 text-on-surface">Foto Kejadian (Wajib)</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`w-full aspect-video rounded-2xl overflow-hidden border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${imagePreview ? 'border-primary bg-black' : 'border-outline-variant bg-surface-container hover:bg-surface-container-high'}`}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
              ) : (
                <>
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">add_a_photo</span>
                  <p className="font-medium text-on-surface-variant">Tap untuk Buka Kamera</p>
                </>
              )}
            </div>
            {/* HTML5 Camera API: capture="environment" forces back camera on mobile */}
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" 
              ref={fileInputRef}
              onChange={handleImageCapture}
              className="hidden"
            />
          </div>

          {/* Location Status */}
          <div className="bg-surface-container rounded-2xl p-4 flex items-start gap-4">
            <div className={`p-2 rounded-full ${location ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
              <span className="material-symbols-outlined">{location ? 'location_on' : locating ? 'my_location' : 'location_off'}</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm text-on-surface mb-1">
                {location ? 'Lokasi Terdeteksi' : locating ? 'Mencari Lokasi GPS...' : 'Lokasi Belum Terdeteksi'}
              </h3>
              <p className="text-xs text-on-surface-variant">
                {location 
                  ? `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}` 
                  : locationError || 'Mohon izinkan akses lokasi GPS Anda agar bantuan akurat.'}
              </p>
              {!location && !locating && (
                <button type="button" onClick={getLocation} className="mt-2 text-xs font-bold text-primary px-3 py-1 bg-primary/10 rounded-full">
                  Coba Ulang Lokasi
                </button>
              )}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2 text-on-surface">Kategori Insiden</label>
            <div className="relative">
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full pl-4 pr-10 py-4 bg-surface-container border border-outline-variant rounded-2xl appearance-none outline-none focus:ring-2 focus:ring-primary text-on-surface font-body-lg font-medium"
              >
                <option value="Bencana Alam">Bencana Alam</option>
                <option value="Kriminalitas">Kriminalitas</option>
                <option value="Kecelakaan">Kecelakaan</option>
                <option value="Kedaruratan Medis">Kedaruratan Medis</option>
                <option value="Infrastruktur Rusak">Infrastruktur Rusak</option>
                <option value="Lainnya">Lainnya</option>
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2 text-on-surface">Detail Kejadian</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ceritakan detail singkat apa yang terjadi..."
              className="w-full p-4 bg-surface-container border border-outline-variant rounded-2xl outline-none focus:ring-2 focus:ring-primary text-on-surface resize-none font-body-lg"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !location || !imagePreview || !description}
            className="w-full bg-error hover:bg-error/90 text-on-error py-4 rounded-2xl font-bold font-body-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            {loading ? (
              <span className="w-6 h-6 border-2 border-on-error border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <span className="material-symbols-outlined">send</span>
                KIRIM LAPORAN DARURAT
              </>
            )}
          </button>
        </form>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 w-full max-w-md bg-surface-container-lowest border-t border-outline-variant pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center h-16">
          <Link href="/warga/lapor" className="flex flex-col items-center justify-center w-full h-full text-primary">
            <span className="material-symbols-outlined font-variation-fill">add_circle</span>
            <span className="text-[10px] font-bold mt-1">Lapor</span>
          </Link>
          <Link href="/warga/riwayat" className="flex flex-col items-center justify-center w-full h-full text-on-surface-variant hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined">history</span>
            <span className="text-[10px] font-medium mt-1">Riwayat</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
