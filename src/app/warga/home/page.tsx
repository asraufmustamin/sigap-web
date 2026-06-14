'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BottomNav from '../../components/BottomNav'; // We will create this

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
    if (diffMins < 60) return `${diffMins} mnt lalu`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} jam lalu`;
    return `${Math.floor(diffHours / 24)} hri lalu`;
  };

  const totalReports = reports.length;
  const latestReport = reports[0];

  return (
    <div className="flex-1 flex flex-col bg-background min-h-screen pb-28 relative">
      {/* TopAppBar */}
      <div className="bg-surface border-b border-outline-variant flex items-center justify-between px-5 w-full h-16 z-40 sticky top-0">
        <div className="flex items-center gap-3">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVHjIZWBDuWlh7HjNLkZcS3Khwpgv70J3Mwr48vlFF5aOX_rFHRyEZv929t0TXE-YhzK_BdJ_WpAPVxkCmTc6hkJ_itPvu2nv6hg-FYmRCs3GA7dChRzALsUt2NCsMuoMDMcYoAPRGK7HJ8HkKvlTeFEb0xTHm00HqlXfXavkCHXx6JPzNBfDr_E0OQPlIuH2fbTn3fuEpH7VBF45bJ050jq0UxRi69ZyGtXA8uGqfgOkGRA86HCyndsQqoI7DboE_-zevswtiiblK"
            className="w-8 h-8 rounded-md object-contain"
            alt="Logo"
          />
          <span className="font-headline-md text-xl font-bold text-primary tracking-tight">SIGAP</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-full hover:bg-surface-container-high transition-colors text-primary">
            <span className="material-symbols-outlined text-[24px]">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border border-surface"></span>
          </button>
          <button 
            onClick={() => { localStorage.removeItem('warga_session'); router.push('/warga/login'); }}
            className="text-error"
          >
            <span className="material-symbols-outlined text-[24px]">logout</span>
          </button>
        </div>
      </div>

      <div className="px-5 pt-6 flex-col gap-6 flex">
        {/* Greeting Section */}
        <div className="flex flex-col gap-1">
          <h1 className="font-headline-lg-mobile text-2xl font-bold text-on-surface leading-tight">
            {getGreeting()},<br/>{user?.name}
          </h1>
          <p className="font-body-md text-on-surface-variant mt-1">
            Sistem pelaporan warga aktif.
          </p>
        </div>

        {/* Summary Grid */}
        <div className="flex gap-4">
          {/* Card 1 */}
          <div className="flex-1 bg-background-pure border border-outline-variant/50 rounded-xl p-4 shadow-sm flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-label-caps text-xs font-bold uppercase text-on-surface-variant">Total Laporan</span>
              <span className="material-symbols-outlined text-[20px] text-primary/70">assignment</span>
            </div>
            <div className="flex items-baseline gap-2">
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <span className="font-headline-lg text-3xl font-bold text-primary">{totalReports}</span>
              )}
              <span className="font-body-md text-status-pending text-xs">Bulan ini</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="flex-1 bg-background-pure border border-outline-variant/50 rounded-xl p-4 shadow-sm flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-label-caps text-xs font-bold uppercase text-on-surface-variant">Status Terakhir</span>
              <span 
                className="material-symbols-outlined text-[20px]"
                style={{ color: latestReport?.status === 'selesai' ? '#10B981' : latestReport?.status === 'proses' ? '#FFC107' : '#6B7280' }}
              >
                {latestReport?.status === 'selesai' ? 'check_circle' : latestReport?.status === 'proses' ? 'directions_run' : 'schedule'}
              </span>
            </div>
            <div className="flex flex-col">
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <span className="font-headline-md text-lg font-semibold text-on-surface">
                    {latestReport ? (latestReport.status === 'selesai' ? 'Selesai' : latestReport.status === 'proses' ? 'Diproses' : 'Menunggu') : '-'}
                  </span>
                  <span className="font-body-md text-on-surface-variant text-xs truncate">
                    {latestReport ? `ID #${String(latestReport.id).substring(0,6).toUpperCase()}` : 'Belum ada'}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Recent Updates Header */}
        <div className="flex items-center justify-between mt-2 mb-2">
          <h2 className="font-headline-md text-xl font-bold text-on-surface">Pembaruan Terkini</h2>
          <Link href="/warga/riwayat" className="font-body-md text-primary font-semibold hover:underline">
            Lihat Semua
          </Link>
        </div>

        {/* Incident Cards */}
        {isLoading ? (
          <div className="py-8 flex justify-center"><span className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></span></div>
        ) : reports.length === 0 ? (
          <div className="py-8 flex items-center justify-center text-on-surface-variant font-body-md">
            Belum ada laporan.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {reports.slice(0, 3).map((item) => {
              let statusColor = '#6B7280';
              let statusBg = 'bg-gray-500';
              let statusBorder = 'border-gray-500/20';
              let statusBgLight = 'bg-gray-500/10';
              let statusText = 'Menunggu';
              let iconName = 'assignment';

              if (item.status === 'proses') {
                statusColor = '#FFC107';
                statusBg = 'bg-[#FFC107]';
                statusBorder = 'border-[#FFC107]/20';
                statusBgLight = 'bg-[#FFC107]/10';
                statusText = 'Diproses';
                iconName = 'directions_car';
              } else if (item.status === 'selesai') {
                statusColor = '#10B981';
                statusBg = 'bg-[#10B981]';
                statusBorder = 'border-[#10B981]/20';
                statusBgLight = 'bg-[#10B981]/10';
                statusText = 'Selesai';
                iconName = 'check_circle';
              }

              if (item.category.toLowerCase().includes('infrastruktur')) iconName = 'build';
              else if (item.category.toLowerCase().includes('kriminal')) iconName = 'local_police';
              else if (item.category.toLowerCase().includes('bencana')) iconName = 'warning';

              return (
                <div key={item.id} className="bg-background-pure border border-outline-variant/50 rounded-xl overflow-hidden shadow-sm flex relative mb-3">
                  {/* Left Status Bar */}
                  <div className={`w-1.5 h-full absolute left-0 top-0 z-10 ${statusBg}`}></div>
                  
                  <div className="p-4 pl-5 flex items-start gap-4 w-full">
                    {item.image_url ? (
                      <img src={item.image_url} className="w-12 h-12 rounded-lg shrink-0 bg-surface-container-high object-cover" alt="Inc" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[24px] text-on-surface-variant">{iconName}</span>
                      </div>
                    )}

                    <div className="flex flex-col flex-1 gap-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-body-md font-semibold text-on-surface truncate">{item.category}</span>
                        <span className="font-label-caps text-[10px] uppercase font-bold text-on-surface-variant shrink-0 ml-2">{getTimeAgo(item.created_at)}</span>
                      </div>
                      <span className="font-body-md text-on-surface-variant text-sm truncate">{item.description}</span>
                      
                      <div className="flex justify-between items-center mt-1">
                        <div className={`inline-flex items-center px-2 py-0.5 rounded-full border self-start ${statusBgLight} ${statusBorder}`}>
                          <span className="font-label-caps text-[10px] font-bold" style={{ color: statusColor }}>{statusText}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <BottomNav activeTab="home" />
    </div>
  );
}
