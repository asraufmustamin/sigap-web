'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function WargaRiwayat() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem('warga_session');
    if (!session) {
      router.push('/warga/login');
    } else {
      const parsedUser = JSON.parse(session);
      setUser(parsedUser);
      fetchReports(parsedUser.id);
    }
  }, []);

  const fetchReports = async (userId: string) => {
    try {
      const res = await fetch('/api/reports');
      const data = await res.json();
      
      if (res.ok) {
        // Filter laporan khusus milik warga ini
        const userReports = data.reports.filter((r: any) => r.reporter_id === userId);
        // Urutkan dari yang terbaru
        userReports.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setReports(userReports);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'proses': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'selesai': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface-container-lowest pb-24">
      {/* App Bar */}
      <div className="bg-surface-container text-on-surface p-4 shadow-sm sticky top-0 z-10 text-center">
        <h1 className="font-bold text-lg">Riwayat Laporan</h1>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <span className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></span>
          </div>
        ) : reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant">history_edu</span>
            </div>
            <h2 className="text-lg font-bold text-on-surface mb-2">Belum ada laporan</h2>
            <p className="text-on-surface-variant text-sm px-4">
              Anda belum pernah mengirim laporan insiden.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="bg-white border border-outline-variant rounded-2xl p-4 shadow-sm flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[20px]">
                        {report.category.includes('Bencana') ? 'flood' : 
                         report.category.includes('Kriminalitas') ? 'local_police' : 
                         report.category.includes('Medis') ? 'medical_services' : 'warning'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-on-surface text-sm">{report.category}</h3>
                      <p className="text-xs text-on-surface-variant">{formatDate(report.created_at)}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md border uppercase ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                </div>
                
                <p className="text-sm text-on-surface-variant line-clamp-2">
                  "{report.description}"
                </p>

                <div className="flex items-center gap-1 text-xs text-on-surface-variant mt-1">
                  <span className="material-symbols-outlined text-[14px]">location_on</span>
                  <span>{report.lat.toFixed(4)}, {report.lng.toFixed(4)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 w-full max-w-md bg-surface-container-lowest border-t border-outline-variant pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center h-16">
          <Link href="/warga/lapor" className="flex flex-col items-center justify-center w-full h-full text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">add_circle</span>
            <span className="text-[10px] font-medium mt-1">Lapor</span>
          </Link>
          <Link href="/warga/riwayat" className="flex flex-col items-center justify-center w-full h-full text-primary">
            <span className="material-symbols-outlined font-variation-fill">history</span>
            <span className="text-[10px] font-bold mt-1">Riwayat</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
