'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function WargaHome() {
  const [user, setUser] = useState<any>(null);
  const [recentReports, setRecentReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSOSActive, setIsSOSActive] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem('warga_session');
    if (session) {
      const parsedUser = JSON.parse(session);
      setUser(parsedUser);
      fetchData(parsedUser.id);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchData = async (userId: string) => {
    try {
      const res = await fetch('/api/reports');
      if (res.ok) {
        const data = await res.json();
        // Assuming data is the array itself based on previous fixes
        const reportsArray = Array.isArray(data) ? data : data.reports || [];
        const userReports = reportsArray.filter((r: any) => r.reporter_id === userId);
        setRecentReports(userReports.slice(0, 3)); // Top 3 recent
      }
    } catch (err) {
      console.error('Failed to fetch reports', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 19) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  const handleSOS = () => {
    setIsSOSActive(true);
    // Simulate SOS delay
    setTimeout(() => {
      alert("Sinyal Darurat SOS telah dikirim ke Pusat Komando beserta lokasi Anda!");
      setIsSOSActive(false);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'selesai': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'diproses': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      default: return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'selesai': return 'check_circle';
      case 'diproses': return 'hourglass_top';
      default: return 'pending';
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex justify-center items-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background min-h-screen">
      
      {/* Dynamic Header */}
      <div className="bg-surface border-b border-border pt-10 pb-12 px-6 sm:px-10 lg:px-16 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-text-main mb-2 tracking-tight">
              {getGreeting()}, <span className="text-primary">{user?.name || 'Warga'}</span>
            </h1>
            <p className="text-text-muted text-base sm:text-lg max-w-xl">
              Pusat Kendali Keamanan Anda. Laporkan kejadian di sekitar Anda dan pantau statusnya secara real-time.
            </p>
          </div>
          
          <Link 
            href="/warga/lapor"
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-on-primary font-semibold rounded-full overflow-hidden shadow-lg shadow-primary/25 hover:bg-primary-hover transition-all active:scale-95"
          >
            <span className="absolute inset-0 w-full h-full bg-white/20 group-hover:translate-x-full -translate-x-full transition-transform duration-500 ease-out skew-x-12"></span>
            <span className="material-symbols-outlined text-[24px]">add_circle</span>
            <span>Buat Laporan</span>
          </Link>
        </div>
      </div>

      {/* Main Content Dashboard */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column (Stats & SOS) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* SOS Button Widget */}
            <div className="bg-surface rounded-3xl p-8 border border-border shadow-sm flex flex-col items-center text-center relative overflow-hidden transition-colors">
              <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-red-500 to-rose-600"></div>
              <h2 className="text-xl font-bold text-text-main mb-2">Tombol Darurat</h2>
              <p className="text-sm text-text-muted mb-8">
                Tekan dan tahan tombol ini <strong>hanya</strong> saat Anda dalam bahaya yang mengancam nyawa.
              </p>
              
              <button 
                onClick={handleSOS}
                disabled={isSOSActive}
                className={`relative w-40 h-40 rounded-full flex items-center justify-center transition-all ${
                  isSOSActive 
                    ? 'bg-red-600 scale-95 shadow-inner' 
                    : 'bg-gradient-to-br from-red-500 to-red-600 hover:scale-105 shadow-xl shadow-red-500/30'
                }`}
              >
                {/* Pulse rings */}
                {!isSOSActive && (
                  <>
                    <div className="absolute inset-0 rounded-full border-2 border-red-500/50 animate-ping" style={{ animationDuration: '2s' }}></div>
                    <div className="absolute inset-[-10px] rounded-full border-2 border-red-500/20 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}></div>
                  </>
                )}
                
                <div className="flex flex-col items-center">
                  <span className="material-symbols-outlined text-[48px] text-white mb-1">
                    {isSOSActive ? 'cell_tower' : 'sos'}
                  </span>
                  <span className="text-white font-bold tracking-widest text-lg">
                    {isSOSActive ? 'MENGIRIM...' : 'S O S'}
                  </span>
                </div>
              </button>
            </div>

            {/* Quick Stats Widget */}
            <div className="bg-surface rounded-3xl p-6 border border-border shadow-sm flex items-center gap-5 transition-colors">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary text-[32px]">assignment</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-1">Total Laporan Anda</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-text-main leading-none">{recentReports.length}</span>
                  <span className="text-sm text-text-muted">laporan terkirim</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (Recent Reports) */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-text-main tracking-tight">Pembaruan Terkini</h2>
              <Link href="/warga/riwayat" className="text-sm font-semibold text-primary hover:text-primary-hover flex items-center gap-1 transition-colors">
                Lihat Semua <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {recentReports.length > 0 ? (
                recentReports.map((report) => (
                  <Link 
                    href={`/warga/riwayat`}
                    key={report.id} 
                    className="group bg-surface rounded-3xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all hover:-translate-y-1 flex flex-col h-full"
                  >
                    <div className="h-48 relative overflow-hidden bg-surface-hover">
                      {report.image_url ? (
                        <img 
                          src={report.image_url} 
                          alt="Foto Laporan" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-[48px] text-border">image</span>
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <div className={`px-3 py-1.5 rounded-full border backdrop-blur-md flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${getStatusColor(report.status)}`}>
                          <span className="material-symbols-outlined text-[16px]">{getStatusIcon(report.status)}</span>
                          {report.status || 'Pending'}
                        </div>
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2.5 py-1 bg-surface-hover text-text-main text-xs font-semibold rounded-lg border border-border">
                          {report.category}
                        </span>
                        <span className="text-xs text-text-muted ml-auto font-medium">Hari ini</span>
                      </div>
                      <p className="text-text-main text-base font-medium line-clamp-2 leading-relaxed mb-4">
                        {report.description || 'Tidak ada deskripsi.'}
                      </p>
                      <div className="mt-auto flex items-center gap-2 text-text-muted text-sm">
                        <span className="material-symbols-outlined text-[18px]">location_on</span>
                        <span className="truncate">Lat: {report.lat}, Lng: {report.lng}</span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="md:col-span-2 bg-surface rounded-3xl p-12 border border-border border-dashed flex flex-col items-center text-center transition-colors">
                  <div className="w-20 h-20 bg-surface-hover rounded-full flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-[40px] text-text-muted">inbox</span>
                  </div>
                  <h3 className="text-xl font-bold text-text-main mb-2">Belum Ada Laporan</h3>
                  <p className="text-text-muted max-w-sm">
                    Anda belum pernah membuat laporan. Laporkan kejadian keamanan di sekitar Anda sekarang juga.
                  </p>
                  <Link 
                    href="/warga/lapor"
                    className="mt-6 px-6 py-2.5 bg-primary/10 text-primary font-semibold rounded-xl hover:bg-primary/20 transition-colors"
                  >
                    Buat Laporan Perdana
                  </Link>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
