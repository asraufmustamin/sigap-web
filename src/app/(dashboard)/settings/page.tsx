'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    // Mock user for Node.js backend
    const mockUser = { email: 'admin@sigap.id', user_metadata: { avatar_url: '' } };
    setUser(mockUser);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Str = reader.result as string;
      setAvatarUrl(base64Str);
      toast.success('Foto profil berhasil diperbarui (Lokal)');
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Kata sandi tidak cocok');
      return;
    }
    
    setLoading(true);
    // Mock API call
    setTimeout(() => {
      toast.success('Kata sandi berhasil diperbarui');
      setFormData({ password: '', confirmPassword: '' });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-surface">
      <div className="mb-8">
        <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">Pengaturan Komando</h1>
        <p className="text-on-surface-variant mt-1 text-body-lg">
          Konfigurasi akun dan preferensi sistem pusat komando.
        </p>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Profile Settings */}
        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-sm">
          <h2 className="font-label-caps text-label-caps text-on-surface-variant mb-4 flex items-center gap-2 uppercase tracking-wider">
            <span className="material-symbols-outlined text-[18px]">person</span> Profil Administrator
          </h2>
          
          <div className="flex items-center gap-5 mb-6">
            <div className="relative group cursor-pointer">
              <div 
                className="w-20 h-20 rounded-full bg-primary-container border-2 border-outline-variant flex items-center justify-center text-on-primary-container font-bold text-3xl overflow-hidden bg-cover bg-center shadow-sm"
                style={{ backgroundImage: avatarUrl ? `url(${avatarUrl})` : 'none' }}
              >
                {!avatarUrl && (user?.email?.charAt(0).toUpperCase() || 'A')}
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white text-[24px]">photo_camera</span>
              </div>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                title="Ganti Foto Profil"
              />
            </div>
            
            <div>
              <p className="font-headline-md text-headline-md text-on-surface font-bold">Komandan Admin</p>
              <p className="font-body-md text-on-surface-variant">{user?.email || 'admin@sigap.id'}</p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4 pt-4 border-t border-outline-variant">
            <h3 className="font-button-text text-button-text text-on-surface">Ubah Kata Sandi</h3>
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">Kata Sandi Baru</label>
              <input 
                type="password" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Biarkan kosong jika tidak ingin diubah"
                className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none font-body-md text-on-surface"
              />
            </div>
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">Konfirmasi Kata Sandi Baru</label>
              <input 
                type="password" 
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                placeholder="Konfirmasi kata sandi"
                className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none font-body-md text-on-surface"
              />
            </div>
            <div className="flex justify-end pt-2">
              <button 
                type="submit" 
                disabled={loading || !formData.password}
                className="px-6 py-2 bg-primary text-on-primary rounded-lg font-button-text text-button-text shadow-sm hover:bg-primary-container disabled:opacity-50 transition-colors"
              >
                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
        </section>

        {/* Notifications Settings */}
        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-sm">
          <h2 className="font-label-caps text-label-caps text-on-surface-variant mb-4 flex items-center gap-2 uppercase tracking-wider">
            <span className="material-symbols-outlined text-[18px]">notifications</span> Notifikasi (Segera Hadir)
          </h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between opacity-50 cursor-not-allowed">
              <div>
                <p className="font-button-text text-button-text text-on-surface">Peringatan Darurat</p>
                <p className="font-body-md text-[13px] text-on-surface-variant">Tampilkan notifikasi desktop saat ada laporan KRITIS</p>
              </div>
              <input type="checkbox" defaultChecked disabled className="w-5 h-5 rounded text-primary border-outline-variant focus:ring-primary" />
            </label>
          </div>
        </section>

        {/* System Info */}
        <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-sm">
          <h2 className="font-label-caps text-label-caps text-on-surface-variant mb-4 flex items-center gap-2 uppercase tracking-wider">
            <span className="material-symbols-outlined text-[18px]">shield</span> Informasi Sistem
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm font-body-md">
            <div>
              <p className="text-on-surface-variant text-xs font-medium uppercase tracking-wider">Versi Sistem</p>
              <p className="text-on-surface font-semibold">SIGAP v2.0.0-stitch</p>
            </div>
            <div>
              <p className="text-on-surface-variant text-xs font-medium uppercase tracking-wider">Database</p>
              <p className="text-on-surface font-semibold">MySQL (Node.js API)</p>
            </div>
            <div>
              <p className="text-on-surface-variant text-xs font-medium uppercase tracking-wider">Frontend</p>
              <p className="text-on-surface font-semibold">Next.js 15 + React</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}


