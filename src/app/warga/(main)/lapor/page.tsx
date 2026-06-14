'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api';

const CATEGORIES = [
  { id: 'bencana', name: 'Bencana Alam', icon: 'flood' },
  { id: 'kriminal', name: 'Kriminalitas', icon: 'local_police' },
  { id: 'kebakaran', name: 'Kebakaran', icon: 'local_fire_department' },
  { id: 'kecelakaan', name: 'Kecelakaan', icon: 'car_crash' },
  { id: 'keamanan', name: 'Gangguan Keamanan', icon: 'gpp_bad' },
  { id: 'lainnya', name: 'Lainnya', icon: 'error' },
];

const containerStyle = { width: '100%', height: '100%' };

export default function WargaLapor() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [user, setUser] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Step 1: Kategori & Deskripsi
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  
  // Step 2: Lokasi (Google Maps)
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationError, setLocationError] = useState('');
  
  // Step 3: Foto
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const session = localStorage.getItem('warga_session');
    if (!session) {
      router.push('/warga/login');
    } else {
      setUser(JSON.parse(session));
      // Try to get current location immediately for step 2
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        });
      }
    }
  }, []);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  });

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    }
  }, []);

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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!category || !location || !imagePreview) return;
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
      setLoading(false);
    }
  };

  const canGoNext = () => {
    if (step === 1) return category !== '';
    if (step === 2) return location !== null;
    if (step === 3) return imagePreview !== null;
    return false;
  };

  return (
    <div className="flex-1 bg-background min-h-screen py-8 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        
        {/* Header & Progress */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-surface-hover transition-colors text-text-muted">
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <h1 className="text-2xl font-bold text-text-main">Lapor Insiden</h1>
          </div>
          
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-border rounded-full z-0"></div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full z-0 transition-all duration-500" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
            
            {[1, 2, 3].map((num) => (
              <div key={num} className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step >= num ? 'bg-primary text-on-primary shadow-lg shadow-primary/30' : 'bg-surface border-2 border-border text-text-muted'}`}>
                {step > num ? <span className="material-symbols-outlined text-[20px]">check</span> : num}
              </div>
            ))}
          </div>
        </div>

        {/* Wizard Content */}
        <div className="bg-surface rounded-3xl shadow-sm border border-border p-6 sm:p-8 min-h-[450px] flex flex-col relative overflow-hidden transition-colors">
          
          {/* STEP 1: Category & Description */}
          {step === 1 && (
            <div className="flex flex-col flex-1 animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-xl font-bold text-text-main mb-6">Pilih Kategori Insiden</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.name)}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2 ${category === cat.name ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-surface hover:border-primary/30 text-text-muted hover:text-text-main'}`}
                  >
                    <span className="material-symbols-outlined text-[32px]">{cat.icon}</span>
                    <span className="text-xs font-semibold text-center">{cat.name}</span>
                  </button>
                ))}
              </div>

              <h2 className="text-lg font-bold text-text-main mb-3">Deskripsi <span className="text-text-muted font-normal text-sm">(Opsional)</span></h2>
              <textarea 
                className="w-full flex-1 bg-background border border-border rounded-xl px-4 py-3 text-text-main outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none transition-colors"
                placeholder="Jelaskan detail kejadian secara singkat..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          )}

          {/* STEP 2: Location (Maps) */}
          {step === 2 && (
            <div className="flex flex-col flex-1 animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-xl font-bold text-text-main mb-2">Tentukan Lokasi Akurat</h2>
              <p className="text-text-muted text-sm mb-4">Geser peta atau klik pada titik yang sesuai dengan lokasi kejadian. Pastikan lokasi seakurat mungkin.</p>
              
              <div className="flex-1 rounded-2xl overflow-hidden border border-border bg-surface-hover relative min-h-[300px]">
                {isLoaded ? (
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={location || { lat: -6.200000, lng: 106.816666 }} // Default Jakarta
                    zoom={location ? 16 : 12}
                    onClick={handleMapClick}
                    options={{ disableDefaultUI: true, zoomControl: true }}
                  >
                    {location && <Marker position={location} animation={google.maps.Animation.DROP} />}
                  </GoogleMap>
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-text-muted">
                    Memuat Peta...
                  </div>
                )}

                {/* Overlays */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between gap-2 pointer-events-none">
                  <div className="bg-surface/90 backdrop-blur-md border border-border px-4 py-2 rounded-full shadow-lg pointer-events-auto flex items-center gap-2">
                     <span className="material-symbols-outlined text-primary text-[18px]">my_location</span>
                     <span className="text-xs font-bold text-text-main">
                       {location ? 'Lokasi Ditandai' : 'Pilih Lokasi'}
                     </span>
                  </div>
                  <button 
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition((pos) => {
                          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                        });
                      }
                    }}
                    className="w-10 h-10 bg-primary text-on-primary rounded-full shadow-lg pointer-events-auto flex items-center justify-center hover:bg-primary-hover transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">gps_fixed</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Photo Upload */}
          {step === 3 && (
            <div className="flex flex-col flex-1 animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-xl font-bold text-text-main mb-2">Unggah Bukti Foto</h2>
              <p className="text-text-muted text-sm mb-6">Foto kejadian sangat membantu tim pusat komando untuk memberikan respons yang tepat.</p>

              <div 
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-3xl bg-background hover:bg-surface-hover hover:border-primary/50 transition-all cursor-pointer group relative overflow-hidden min-h-[250px]"
              >
                {imagePreview ? (
                  <div className="absolute inset-0 p-2">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-2xl shadow-sm" />
                    <div className="absolute inset-2 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-white text-[40px]">sync</span>
                      <span className="text-white font-semibold">Ganti Foto</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center p-6">
                    <div className="w-20 h-20 bg-surface rounded-full shadow-sm border border-border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <span className="material-symbols-outlined text-[36px] text-primary">add_photo_alternate</span>
                    </div>
                    <h3 className="text-lg font-bold text-text-main">Tarik & Lepas Foto</h3>
                    <p className="text-sm text-text-muted mt-1">atau klik untuk menelusuri file Anda</p>
                  </div>
                )}
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageCapture} className="hidden" />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex items-center justify-between pt-4 border-t border-border">
            {step > 1 ? (
              <button 
                onClick={() => setStep(step - 1)}
                className="px-6 py-2.5 rounded-xl font-semibold text-text-main bg-surface-hover hover:bg-border transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Kembali
              </button>
            ) : <div></div>}
            
            {step < 3 ? (
              <button 
                onClick={() => setStep(step + 1)}
                disabled={!canGoNext()}
                className={`px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all ${canGoNext() ? 'bg-primary text-on-primary hover:bg-primary-hover shadow-md shadow-primary/20' : 'bg-surface-hover text-text-muted cursor-not-allowed'}`}
              >
                Lanjut
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                disabled={!canGoNext() || loading}
                className={`px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${canGoNext() && !loading ? 'bg-primary text-on-primary hover:bg-primary-hover shadow-lg shadow-primary/30 hover:scale-105' : 'bg-surface-hover text-text-muted cursor-not-allowed'}`}
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
                )}
                {loading ? 'Mengirim...' : 'Kirim Laporan'}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
