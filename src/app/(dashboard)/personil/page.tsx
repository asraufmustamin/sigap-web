'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function PersonnelPage() {
  const [personnel, setPersonnel] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    phone: '',
    nik: '',
    avatar_url: ''
  });

  useEffect(() => {
    fetchPersonnel();
  }, []);

  const fetchPersonnel = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPersonnel(data || []);
    } catch (err) {
      toast.error('Gagal memuat personil');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (person?: any) => {
    if (person) {
      setIsEditing(true);
      setFormData({
        id: person.id,
        name: person.name || '',
        phone: person.phone || '',
        nik: person.nik_hash || '',
        avatar_url: person.avatar_url || ''
      });
    } else {
      setIsEditing(false);
      setFormData({ id: '', name: '', phone: '', nik: '', avatar_url: '' });
    }
    setShowModal(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, avatar_url: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
        const res = await fetch('/api/users', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        toast.success('Berhasil diperbarui');
      } else {
        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, nik_hash: formData.nik })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        toast.success('Personil berhasil ditambahkan');
      }
      setShowModal(false);
      fetchPersonnel();
    } catch (err: any) {
      toast.error('Gagal menyimpan: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Yakin ingin menghapus personil ini?')) {
      try {
        const res = await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        toast.success('Berhasil dihapus');
        fetchPersonnel();
      } catch (err: any) {
        toast.error('Gagal menghapus: ' + err.message);
      }
    }
  };

  const filteredPersonnel = personnel.filter(p => 
    p.name?.toLowerCase().includes(search.toLowerCase()) || 
    p.nik_hash?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-surface relative h-full">
      {/* Page Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">Manajemen Babinsa</h1>
          <p className="text-on-surface-variant mt-1 text-body-lg">
            Kelola penugasan dan pantau status personil Bintara Pembina Desa.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-surface-container-lowest border border-outline-variant text-primary font-button-text text-button-text px-4 py-2 rounded-lg hover:bg-surface-container-low transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined">download</span>
            Ekspor Data
          </button>
          <button onClick={() => handleOpenModal()} className="bg-primary text-on-primary font-button-text text-button-text px-4 py-2 rounded-lg hover:bg-primary-container transition-colors flex items-center gap-2 shadow-sm">
            <span className="material-symbols-outlined">add</span>
            Tambah Personil
          </button>
        </div>
      </div>

      {/* Filters & Controls */}
      <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant mb-6 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 w-full md:w-auto gap-4">
          <div className="flex-1 md:max-w-xs relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input
              type="text"
              placeholder="Cari nama atau NIK..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-body-md transition-all outline-none"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors" title="Grid View">
            <span className="material-symbols-outlined">grid_view</span>
          </button>
          <button className="p-2 border border-outline-variant rounded-lg bg-surface-container-low text-primary transition-colors" title="List View">
            <span className="material-symbols-outlined">view_list</span>
          </button>
        </div>
      </div>

      {/* Personnel Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container text-primary font-label-caps text-label-caps border-b border-outline-variant uppercase tracking-wider">
                <th className="p-4 font-bold">Profil Personil</th>
                <th className="p-4 font-bold">NRP / NIK</th>
                <th className="p-4 font-bold">Kontak</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-on-surface-variant">Memuat data...</td></tr>
              ) : filteredPersonnel.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-on-surface-variant">Tidak ada personil ditemukan.</td></tr>
              ) : (
                filteredPersonnel.map((p) => (
                  <tr key={p.id} className="hover:bg-surface-subtle transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-high border border-outline-variant flex items-center justify-center text-outline bg-primary-container text-on-primary-container font-bold bg-cover bg-center" style={{ backgroundImage: p.avatar_url ? `url(${p.avatar_url})` : 'none' }}>
                          {!p.avatar_url && (p.name?.charAt(0) || 'B')}
                        </div>
                        <div>
                          <div className="font-button-text text-button-text text-on-surface">{p.name || 'Tanpa Nama'}</div>
                          <div className="text-on-surface-variant text-sm">Babinsa</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-on-surface-variant">
                      <div className="font-mono mt-0.5">{p.nik_hash || '-'}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-on-surface">
                        <span className="material-symbols-outlined text-outline text-[18px]">phone</span>
                        {p.phone || '-'}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-status-completed/10 text-status-completed border border-status-completed/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-status-completed"></span>
                        Tersedia
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenModal(p)} className="p-1.5 rounded-md text-primary hover:bg-primary-container/20 transition-colors" title="Edit">
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-md text-error hover:bg-error-container transition-colors" title="Hapus">
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-surface-container-lowest rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 my-8">
            <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-container">
              <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
                {isEditing ? 'Edit Personil' : 'Tambah Personil Baru'}
              </h2>
              <button type="button" onClick={() => setShowModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="flex justify-center mb-4">
                <div className="relative group cursor-pointer">
                  <div 
                    className="w-24 h-24 rounded-full overflow-hidden bg-surface-container-high border-2 border-outline-variant flex items-center justify-center text-outline bg-cover bg-center shadow-sm"
                    style={{ backgroundImage: formData.avatar_url ? `url(${formData.avatar_url})` : 'none' }}
                  >
                    {!formData.avatar_url && <span className="material-symbols-outlined text-4xl">person</span>}
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-white">photo_camera</span>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">Nama Lengkap</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none text-body-md"
                  placeholder="Misal: Sertu Budi"
                />
              </div>
              
              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">NIK / NRP</label>
                <input 
                  type="text" 
                  required
                  value={formData.nik}
                  onChange={e => setFormData({...formData, nik: e.target.value})}
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none text-body-md"
                  placeholder="Nomor Induk Personil"
                />
              </div>

              <div>
                <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1">Nomor Telepon</label>
                <input 
                  type="text" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none text-body-md"
                  placeholder="08123456789"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container font-button-text text-sm transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-primary text-on-primary rounded-lg hover:bg-primary-container font-button-text text-sm transition-colors shadow-sm"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

