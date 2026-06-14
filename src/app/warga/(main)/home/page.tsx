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
            
            {/* Quick Stats Widget */}
            <div className="group bg-surface rounded-3xl p-6 border border-border shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-0 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="relative z-10 flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500 border border-primary/10">
                  <span className="material-symbols-outlined text-primary text-[32px]">assignment</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">Total Laporan Anda</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-text-main leading-none tracking-tight group-hover:text-primary transition-colors">{recentReports.length}</span>
                    <span className="text-sm font-semibold text-text-muted">laporan</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SOS Button Widget */}
            <div className="bg-surface rounded-3xl p-8 border border-border shadow-sm flex flex-col items-center text-center relative overflow-hidden transition-all duration-500 hover:shadow-xl group">
              <div className="absolute top-0 w-full h-1.5 bg-gradient-to-r from-red-500 to-rose-600"></div>
              <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight mb-2">Tombol Darurat</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-[200px] leading-relaxed">
                Tekan dan tahan <strong>hanya</strong> saat Anda dalam bahaya nyata.
              </p>
              
              <button 
                onClick={handleSOS}
                disabled={isSOSActive}
                className={`relative w-40 h-40 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isSOSActive 
                    ? 'bg-red-600 scale-95 shadow-inner' 
                    : 'bg-gradient-to-br from-red-500 via-red-600 to-rose-600 hover:scale-105 shadow-[0_0_40px_rgba(239,68,68,0.4)] hover:shadow-[0_0_60px_rgba(239,68,68,0.6)]'
                }`}
              >
                {/* Pulse rings */}
                {!isSOSActive && (
                  <>
                    <div className="absolute inset-0 rounded-full border border-red-400/50 animate-ping" style={{ animationDuration: '2s' }}></div>
                    <div className="absolute inset-[-15px] rounded-full border border-red-400/30 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}></div>
                  </>
                )}
                
                <div className="flex flex-col items-center z-10">
                  <span className="material-symbols-outlined text-[56px] text-white mb-1 drop-shadow-md">
                    {isSOSActive ? 'cell_tower' : 'sos'}
                  </span>
                  <span className="text-white font-black tracking-[0.3em] text-xl drop-shadow-md">
                    {isSOSActive ? 'MENGIRIM' : 'SOS'}
                  </span>
                </div>
              </button>
            </div>

          </div>

          {/* Right Column (Recent Reports) */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-text-main tracking-tight flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">history</span>
                </span>
                Laporan Terkini
              </h2>
              <Link href="/warga/riwayat" className="group text-sm font-bold text-primary hover:text-primary-hover flex items-center gap-1 transition-all bg-primary/5 px-4 py-2 rounded-full hover:bg-primary/10">
                Lihat Semua <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {recentReports.length > 0 ? (
                recentReports.map((report) => (
                  <Link 
                    href={`/warga/riwayat`}
                    key={report.id} 
                    className="group bg-surface rounded-[2rem] overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 flex flex-col h-full relative"
                  >
                    <div className="h-56 relative overflow-hidden bg-slate-100 dark:bg-surface-hover">
                      {report.image_url ? (
                        <img 
                          src={report.image_url} 
                          alt="Foto Laporan" 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-surface-hover dark:to-surface">
                          <span className="material-symbols-outlined text-[64px] text-slate-300 dark:text-border group-hover:scale-110 transition-transform duration-700">image</span>
                        </div>
                      )}
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                      
                      <div className="absolute top-4 left-4 z-10">
                        <div className={`px-3.5 py-1.5 rounded-xl border backdrop-blur-md flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest shadow-sm ${getStatusColor(report.status)}`}>
                          <span className="material-symbols-outlined text-[16px]">{getStatusIcon(report.status)}</span>
                          {report.status || 'Pending'}
                        </div>
                      </div>
                      
                      {/* Category Badge on Image */}
                      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between">
                         <span className="px-3 py-1.5 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-lg border border-white/30 shadow-sm">
                           {report.category}
                         </span>
                         <span className="text-xs text-white/90 font-semibold bg-black/30 px-2 py-1 rounded-md backdrop-blur-sm">Hari ini</span>
                      </div>
                    </div>
                    
                    <div className="p-6 flex-1 flex flex-col bg-surface relative z-20">
                      <p className="text-text-main text-base font-semibold line-clamp-2 leading-relaxed mb-4 group-hover:text-primary transition-colors">
                        {report.description || 'Tidak ada deskripsi rinci untuk laporan ini.'}
                      </p>
                      <div className="mt-auto flex items-center gap-2 text-text-muted text-sm bg-surface-hover px-3 py-2 rounded-xl">
                        <span className="material-symbols-outlined text-[18px] text-primary">location_on</span>
                        <span className="truncate font-medium">Lat: {report.lat.toFixed(4)}, Lng: {report.lng.toFixed(4)}</span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="sm:col-span-2 bg-surface rounded-[2rem] p-12 border-2 border-border border-dashed flex flex-col items-center text-center transition-colors group hover:border-primary/50 hover:bg-primary/5">
                  <div className="w-24 h-24 bg-surface-hover rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                    <span className="material-symbols-outlined text-[48px] text-primary/60 group-hover:text-primary transition-colors">inbox</span>
                  </div>
                  <h3 className="text-2xl font-bold text-text-main mb-3">Belum Ada Laporan</h3>
                  <p className="text-text-muted max-w-md text-lg">
                    Anda belum pernah membuat laporan. Laporkan kejadian keamanan di sekitar Anda sekarang juga.
                  </p>
                  <Link 
                    href="/warga/lapor"
                    className="mt-8 px-8 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined">add_circle</span>
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
