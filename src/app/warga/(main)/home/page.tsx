'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function WargaHome() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem('warga_session');
    if (!session) {
      router.push('/warga/login');
    } else {
      const parsedUser = JSON.parse(session);
      setUser(parsedUser);
      fetchData(parsedUser.id);
    }
  }, []);

  const fetchData = async (userId: string) => {
    try {
      const res = await fetch('/api/reports');
      const data = await res.json();
      if (res.ok) {
        const userReports = data.reports.filter((r: any) => r.reporter_id === userId);
        userReports.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setReports(userReports);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins} menit yang lalu`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    return `${Math.floor(diffHours / 24)} hari yang lalu`;
  };

  const totalReports = reports.length;
  const latestReport = reports[0];

  return (
    <div className="flex flex-col gap-8 pb-10">
      
      {/* Hero / Greeting Section */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50 pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {getGreeting()}, <span className="text-[#0b57d0]">{user?.name}</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Sistem Informasi Keamanan dan Pelaporan Warga SIGAP
          </p>
        </div>
        <div className="relative z-10 shrink-0">
          <Link href="/warga/lapor" className="inline-flex items-center gap-2 bg-[#0b57d0] hover:bg-[#0842a0] text-white px-6 py-3 rounded-full font-medium transition-colors shadow-sm">
            <span className="material-symbols-outlined">add_circle</span>
            Buat Laporan Baru
          </Link>
        </div>
      </div>

      {/* Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-[#0b57d0] shrink-0">
            <span className="material-symbols-outlined text-[32px]">assignment</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Laporan Anda</p>
            <div className="flex items-baseline gap-2">
              {isLoading ? (
                <div className="w-8 h-8 border-2 border-[#0b57d0] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="text-4xl font-bold text-gray-900">{totalReports}</span>
              )}
              <span className="text-sm text-gray-500">laporan terkirim</span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-6">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
            latestReport?.status === 'selesai' ? 'bg-emerald-50 text-emerald-600' : 
            latestReport?.status === 'proses' ? 'bg-amber-50 text-amber-600' : 
            'bg-gray-50 text-gray-600'
          }`}>
            <span className="material-symbols-outlined text-[32px]">
              {latestReport?.status === 'selesai' ? 'check_circle' : latestReport?.status === 'proses' ? 'directions_run' : 'schedule'}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Status Laporan Terakhir</p>
            <div className="flex flex-col">
              {isLoading ? (
                <div className="w-8 h-8 border-2 border-[#0b57d0] border-t-transparent rounded-full animate-spin mt-1"></div>
              ) : (
                <>
                  <span className="text-2xl font-bold text-gray-900 capitalize">
                    {latestReport ? (latestReport.status === 'selesai' ? 'Selesai' : latestReport.status === 'proses' ? 'Sedang Diproses' : 'Menunggu Validasi') : 'Belum Ada'}
                  </span>
                  <span className="text-sm text-gray-500 truncate mt-1">
                    {latestReport ? `Laporan #${String(latestReport.id).substring(0,8).toUpperCase()} - ${latestReport.category}` : 'Mari buat laporan pertama Anda'}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Updates Header */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Pembaruan Terkini</h2>
          <Link href="/warga/riwayat" className="text-[#0b57d0] font-semibold hover:underline flex items-center gap-1">
            Lihat Semua Riwayat <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </Link>
        </div>

        {/* Incident Grid */}
        {isLoading ? (
          <div className="py-12 flex justify-center"><div className="w-10 h-10 border-4 border-[#0b57d0] border-t-transparent rounded-full animate-spin"></div></div>
        ) : reports.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 py-16 flex flex-col items-center justify-center text-center">
            <span className="material-symbols-outlined text-[48px] text-gray-300 mb-4">inbox</span>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Belum ada laporan</h3>
            <p className="text-gray-500">Anda belum pernah mengirimkan laporan keamanan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.slice(0, 6).map((item) => {
              let statusColor = 'text-gray-600';
              let statusBg = 'bg-gray-100';
              let statusBorder = 'border-gray-200';
              let statusText = 'Menunggu';
              let iconName = 'assignment';

              if (item.status === 'proses') {
                statusColor = 'text-amber-700';
                statusBg = 'bg-amber-50';
                statusBorder = 'border-amber-200';
                statusText = 'Diproses';
                iconName = 'directions_car';
              } else if (item.status === 'selesai') {
                statusColor = 'text-emerald-700';
                statusBg = 'bg-emerald-50';
                statusBorder = 'border-emerald-200';
                statusText = 'Selesai';
                iconName = 'check_circle';
              }

              if (item.category.toLowerCase().includes('infrastruktur')) iconName = 'build';
              else if (item.category.toLowerCase().includes('kriminal')) iconName = 'local_police';
              else if (item.category.toLowerCase().includes('bencana')) iconName = 'warning';

              return (
                <div key={item.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
                  
                  {item.image_url ? (
                    <div className="h-48 w-full bg-gray-100 relative overflow-hidden">
                      <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Insiden" />
                      <div className="absolute top-3 left-3">
                        <div className={`inline-flex items-center px-2.5 py-1 rounded-full border ${statusBg} ${statusBorder} backdrop-blur-md bg-white/90`}>
                          <span className={`text-xs font-bold ${statusColor}`}>{statusText}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-32 w-full bg-gray-50 flex items-center justify-center relative border-b border-gray-100">
                      <span className="material-symbols-outlined text-[48px] text-gray-300">{iconName}</span>
                      <div className="absolute top-3 left-3">
                        <div className={`inline-flex items-center px-2.5 py-1 rounded-full border ${statusBg} ${statusBorder}`}>
                          <span className={`text-xs font-bold ${statusColor}`}>{statusText}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg line-clamp-1" title={item.category}>{item.category}</h3>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-1" title={item.description}>{item.description}</p>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                      <div className="flex items-center text-xs text-gray-500 font-medium">
                        <span className="material-symbols-outlined text-[16px] mr-1">schedule</span>
                        {getTimeAgo(item.created_at)}
                      </div>
                      <span className="text-xs text-gray-400 font-mono">#{String(item.id).substring(0,6).toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
