import { useState } from 'react';
import { toast } from 'sonner';

export default function ReportDetailModal({ isOpen, onClose, report, onUpdateStatus }: any) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !report) return null;

  const handleTugaskan = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reports', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: report.id, status: 'diproses' })
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Terjadi kesalahan');
      
      toast.success('Babinsa berhasil ditugaskan');
      if (onUpdateStatus) onUpdateStatus();
      onClose();
    } catch (err: any) {
      toast.error('Gagal menugaskan Babinsa', { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-surface-container-lowest rounded-xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-outline-variant">
          <h2 className="font-headline-md font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">assignment</span>
            Detail Laporan
          </h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        {/* Body */}
        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {report.image_url ? (
            <img src={report.image_url} alt="Insiden" className="w-full h-64 object-cover rounded-lg border border-outline-variant/30" />
          ) : (
            <div className="w-full h-48 bg-surface-container flex flex-col items-center justify-center rounded-lg text-on-surface-variant border border-outline-variant/30">
              <span className="material-symbols-outlined text-4xl mb-2">image_not_supported</span>
              <p className="text-sm">Tidak ada foto bukti</p>
            </div>
          )}
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-lg text-on-surface">{report.category}</span>
              <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${report.status === 'pending' ? 'bg-error/20 text-error' : report.status === 'diproses' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                {report.status}
              </span>
            </div>
            <p className="text-on-surface-variant">{report.description}</p>
          </div>
          
          <div className="bg-surface-variant/50 p-3 rounded-lg text-sm text-on-surface-variant space-y-2">
            <p className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">schedule</span>
              <strong>Waktu:</strong> {new Date(report.created_at).toLocaleString('id-ID')}
            </p>
            <p className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">person</span>
              <strong>ID Pelapor:</strong> {report.reporter_id || 'Anonim'}
            </p>
            <p className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">location_on</span>
              <strong>Koordinat:</strong> {report.lat}, {report.lng}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-outline-variant bg-surface-subtle flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-variant font-medium transition-colors">
            Tutup
          </button>
          {report.status === 'pending' && (
            <button 
              onClick={handleTugaskan}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-primary text-on-primary font-bold hover:bg-primary/90 flex items-center gap-2 transition-colors disabled:opacity-50 shadow-md"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              {loading ? 'Memproses...' : 'Tugaskan Babinsa'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
