'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function IncidentsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetchReports();
    const channel = supabase
      .channel('incidents:reports')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, () => fetchReports())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  async function fetchReports() {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*, users:reporter_id (name, phone)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setReports(data || []);
      if (!selectedId && data && data.length > 0) {
        setSelectedId(data[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, newStatus: string) {
    setUpdatingId(id);
    const toastId = toast.loading('Mengubah status...');
    try {
      const { error } = await supabase.from('reports').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      toast.success('Status berhasil diubah!', { id: toastId });
      fetchReports();
    } catch (err: any) {
      toast.error('Gagal: ' + err.message, { id: toastId });
    } finally {
      setUpdatingId(null);
    }
  }

  function getStatusLabel(status: string) {
    if (status === 'selesai') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-status-completed/10 text-status-completed border border-status-completed/20">
          <span className="w-1.5 h-1.5 rounded-full bg-current"></span> Selesai
        </span>
      );
    }
    if (status === 'diproses') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-status-processing/10 text-status-processing border border-status-processing/20">
          <span className="w-1.5 h-1.5 rounded-full bg-current"></span> Diproses
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-error/10 text-error border border-error/20">
        <span className="w-1.5 h-1.5 rounded-full bg-current"></span> Menunggu
      </span>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex h-full items-center justify-center bg-surface">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const selected = reports.find(r => r.id === selectedId) || null;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-surface">
      {/* Header with Back Button */}
      <header className="bg-surface-container-lowest border-b border-outline-variant px-4 md:px-6 py-4 flex-shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/" 
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors text-on-surface-variant group border border-outline-variant/50"
            title="Kembali ke Dasbor"
          >
            <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
          </Link>
          <div>
            <h1 className="font-headline-md text-headline-md font-bold text-on-surface">Verifikasi Laporan</h1>
            <p className="font-body-md text-sm text-on-surface-variant mt-0.5">Tindak lanjuti dan eksekusi laporan insiden</p>
          </div>
        </div>
        <div className="flex items-center gap-2 font-label-caps text-xs font-bold text-primary bg-primary-container/30 border border-primary/20 px-3 py-1.5 rounded-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Live Feed
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Report list */}
        <div className="w-80 lg:w-96 flex-shrink-0 bg-surface-container-lowest border-r border-outline-variant flex flex-col z-10">
          <div className="px-4 py-3 border-b border-outline-variant">
            <p className="font-label-caps text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Antrean · {reports.length} laporan</p>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {reports.length === 0 && <p className="text-center text-on-surface-variant text-sm py-12">Belum ada laporan.</p>}
            {reports.map((r) => {
              const active = selectedId === r.id;
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedId(r.id)}
                  className={`px-4 py-3.5 cursor-pointer border-b border-outline-variant/50 transition-colors ${
                    active ? 'bg-surface-container-low border-l-4 border-l-primary' : 'hover:bg-surface-container border-l-4 border-l-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className={`font-button-text text-sm truncate ${active ? 'text-primary' : 'text-on-surface'}`}>{r.category}</p>
                      <p className="text-[11px] text-on-surface-variant mt-0.5">{new Date(r.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                    </div>
                    {getStatusLabel(r.status)}
                  </div>
                  <p className="font-body-md text-xs text-on-surface-variant mt-1.5 line-clamp-1">{r.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detail */}
        <div className="flex-1 flex flex-col min-w-0 bg-surface relative z-0">
          {!selected ? (
            <div className="flex-1 flex items-center justify-center text-on-surface-variant text-sm font-body-md">
              Pilih laporan dari daftar di sebelah kiri
            </div>
          ) : (
            <>
              {/* Map — top half */}
              <div className="h-[45%] p-4 pb-2 flex-shrink-0">
                <div className="w-full h-full rounded-xl overflow-hidden border border-outline-variant shadow-sm relative z-0">
                  <Map reports={[selected]} selectedReport={selected} />
                </div>
              </div>

              {/* Detail — bottom half */}
              <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-sm">
                  {/* Title row */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-3xl">
                        {selected.category === 'Kriminal' ? 'local_police' : selected.category === 'Kecelakaan' ? 'car_crash' : 'warning'}
                      </span>
                      <h2 className="font-headline-md text-headline-md font-bold text-on-surface">{selected.category}</h2>
                    </div>
                    {getStatusLabel(selected.status)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Col 1: Photo & Actions */}
                    <div className="space-y-4">
                      {selected.image_url ? (
                        <div className="rounded-xl w-full aspect-[4/3] overflow-hidden border border-outline-variant">
                          <img src={selected.image_url} alt="Bukti" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="rounded-xl w-full aspect-[4/3] bg-surface-container border border-outline-variant flex flex-col items-center justify-center gap-2">
                          <span className="material-symbols-outlined text-4xl text-outline">image_not_supported</span>
                          <span className="font-body-md text-xs text-on-surface-variant">Tidak ada foto bukti</span>
                        </div>
                      )}

                      {/* Action buttons */}
                      {selected.status === 'pending' && (
                        <button
                          onClick={() => updateStatus(selected.id, 'diproses')}
                          disabled={updatingId === selected.id}
                          className="w-full bg-status-processing text-white font-button-text text-sm py-3 rounded-lg transition hover:bg-status-processing/90 disabled:opacity-50 shadow-sm flex items-center justify-center gap-2"
                        >
                          <span className="material-symbols-outlined">sync</span>
                          {updatingId === selected.id ? 'Memproses...' : 'Proses Laporan'}
                        </button>
                      )}
                      {(selected.status === 'diproses' || selected.status === 'processing') && (
                        <button
                          onClick={() => updateStatus(selected.id, 'selesai')}
                          disabled={updatingId === selected.id}
                          className="w-full bg-primary text-on-primary font-button-text text-sm py-3 rounded-lg transition hover:bg-primary-container hover:text-on-primary-container disabled:opacity-50 shadow-sm flex items-center justify-center gap-2"
                        >
                          <span className="material-symbols-outlined">check_circle</span>
                          {updatingId === selected.id ? 'Memproses...' : 'Selesaikan Insiden'}
                        </button>
                      )}
                      {selected.status === 'selesai' && (
                        <div className="w-full text-center py-3 bg-surface-container border border-outline-variant text-status-completed font-button-text text-sm rounded-lg flex items-center justify-center gap-2">
                          <span className="material-symbols-outlined">done_all</span> Insiden Selesai
                        </div>
                      )}
                    </div>

                    {/* Col 2 & 3: Info */}
                    <div className="md:col-span-2 space-y-4">
                      <div>
                        <label className="font-label-caps text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Deskripsi Laporan</label>
                        <p className="font-body-md text-sm text-on-surface mt-1 leading-relaxed whitespace-pre-wrap bg-surface-container-low rounded-lg p-4 border border-outline-variant/50">
                          {selected.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant/50">
                          <label className="font-label-caps text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">person</span> Pelapor
                          </label>
                          <p className="font-button-text text-sm text-on-surface mt-1">{selected.users?.name || 'Anonim'}</p>
                        </div>
                        <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant/50">
                          <label className="font-label-caps text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">call</span> Kontak
                          </label>
                          <p className="font-button-text text-sm text-on-surface mt-1">{selected.users?.phone || '-'}</p>
                        </div>
                      </div>

                      <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant/50">
                        <label className="font-label-caps text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">schedule</span> Waktu Masuk
                        </label>
                        <p className="font-button-text text-sm text-on-surface mt-1">
                          {new Date(selected.created_at).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'long' })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
