'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';
import ReportDetailModal from '@/components/ReportDetailModal';

// Dynamically import Map component to avoid SSR issues
const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function DashboardPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchReports();

    // Polling every 10 seconds for real-time replacement
    const interval = setInterval(() => {
      fetchReports();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  async function fetchReports() {
    try {
      const res = await fetch('/api/reports');
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to fetch');
      setReports(data || []);
    } catch (err: any) {
      toast.error('Gagal memuat laporan', { description: err.message });
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-error text-error';
      case 'diproses': return 'bg-status-processing text-on-secondary-fixed-variant';
      case 'selesai': return 'bg-status-completed text-status-completed';
      default: return 'bg-outline text-outline';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'KRITIS';
      case 'diproses': return 'WASPADA';
      case 'selesai': return 'INFO';
      default: return status;
    }
  };

  const criticalCount = reports.filter(r => r.status === 'pending').length;
  const processingCount = reports.filter(r => r.status === 'diproses').length;
  const completedCount = reports.filter(r => r.status === 'selesai').length;

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative h-full">
      {/* Left Panel: GIS Map (70%) */}
      <div className="w-full lg:w-[70%] h-[512px] lg:h-full relative bg-surface-variant z-0">
        <Map reports={reports} selectedReport={selectedReport} />

        {/* Map UI Overlays */}
        <div className="absolute top-4 left-4 flex gap-2 z-[400] pointer-events-none">
          <div className="bg-surface-container-lowest/90 backdrop-blur-sm shadow-sm rounded-lg p-2 flex items-center gap-2 border border-outline-variant/20 pointer-events-auto">
            <span className="material-symbols-outlined text-primary">layers</span>
            <span className="font-label-caps text-label-caps text-on-surface pr-2">Poligon Aktif</span>
          </div>
        </div>

        <div className="absolute bottom-6 left-6 z-[400] pointer-events-none">
          <div className="bg-surface-container-lowest/90 backdrop-blur-md shadow-[0_4px_20px_rgba(0,42,22,0.08)] rounded-xl p-4 border border-outline-variant/30 w-64 pointer-events-auto">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-3">Status Wilayah</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-error shadow-[0_0_8px_rgba(186,26,26,0.6)]"></div>
                  <span className="font-body-md text-body-md text-on-surface-variant">Kritis (Merah)</span>
                </div>
                <span className="font-button-text text-button-text text-on-surface">{criticalCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-status-processing shadow-[0_0_8px_rgba(255,193,7,0.6)]"></div>
                  <span className="font-body-md text-body-md text-on-surface-variant">Waspada (Kuning)</span>
                </div>
                <span className="font-button-text text-button-text text-on-surface">{processingCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-status-completed shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                  <span className="font-body-md text-body-md text-on-surface-variant">Aman (Hijau)</span>
                </div>
                <span className="font-button-text text-button-text text-on-surface">{completedCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Real-time Feed (30%) */}
      <div className="w-full lg:w-[30%] h-[512px] lg:h-full bg-surface-container-lowest border-l border-outline-variant flex flex-col z-30">
        <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Real-time Feed</h2>
          </div>
          <button className="text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">filter_list</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3 bg-surface-subtle">
          {reports.length === 0 ? (
            <p className="text-center text-on-surface-variant py-4">Belum ada laporan.</p>
          ) : (
            reports.map((report) => (
              <div 
                key={report.id}
                onClick={() => {
                  setSelectedReport(report);
                  setIsModalOpen(true);
                }}
                className={`bg-surface-container-lowest rounded-xl border ${selectedReport?.id === report.id ? 'border-primary ring-1 ring-primary' : 'border-outline-variant/40'} shadow-sm overflow-hidden flex relative cursor-pointer hover:-translate-y-0.5 transition-transform`}
              >
                <div className={`w-1 absolute left-0 top-0 bottom-0 ${getStatusColor(report.status).split(' ')[0]}`}></div>
                <div className="p-3 w-20 shrink-0 relative">
                  {report.image_url ? (
                    <img alt="Incident" className="w-full h-16 object-cover rounded-md" src={report.image_url} />
                  ) : (
                    <div className="w-full h-16 bg-surface-container rounded-md flex items-center justify-center text-outline">
                      <span className="material-symbols-outlined">image_not_supported</span>
                    </div>
                  )}
                  <div className={`absolute bottom-3 right-3 w-5 h-5 rounded-full flex items-center justify-center border-2 border-surface-container-lowest text-white ${getStatusColor(report.status).split(' ')[0]}`}>
                    <span className="material-symbols-outlined text-[12px]">
                      {report.status === 'pending' ? 'local_fire_department' : report.status === 'diproses' ? 'warning' : 'security'}
                    </span>
                  </div>
                </div>
                <div className="p-3 pl-0 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <span className={`font-label-caps text-label-caps px-2 py-0.5 rounded-sm bg-opacity-10 ${getStatusColor(report.status)}`}>
                        {getStatusLabel(report.status)}
                      </span>
                      <span className="font-label-caps text-label-caps text-on-surface-variant">
                        {new Date(report.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <h4 className="font-button-text text-button-text text-on-surface line-clamp-1">{report.category}</h4>
                  </div>
                  <div className="flex items-center gap-1 text-on-surface-variant mt-2">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    <span className="font-body-md text-[12px] truncate">{report.description}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <ReportDetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        report={selectedReport}
        onUpdateStatus={fetchReports}
      />
    </div>
  );
}

