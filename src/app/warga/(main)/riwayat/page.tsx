'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

const FILTERS = ['Semua', 'Pending', 'Diproses', 'Selesai'];

export default function WargaRiwayat() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Semua');

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
      
      const reportsArray = Array.isArray(data) ? data : data.reports || [];
      if (res.ok) {
        const userReports = reportsArray.filter((r: any) => r.reporter_id === userId);
        userReports.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setReports(userReports);
      }
    } catch (err) {
      console.error('Gagal mengambil laporan:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      // Filter by status
      if (activeFilter !== 'Semua') {
        const rStatus = report.status?.toLowerCase() || 'pending';
        if (activeFilter === 'Pending' && rStatus !== 'pending') return false;
        if (activeFilter === 'Diproses' && !['proses', 'processing', 'diproses'].includes(rStatus)) return false;
        if (activeFilter === 'Selesai' && !['selesai', 'resolved'].includes(rStatus)) return false;
      }
      
      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const categoryMatch = report.category.toLowerCase().includes(query);
        const idMatch = String(report.id).toLowerCase().includes(query);
        const descMatch = (report.description || '').toLowerCase().includes(query);
        if (!categoryMatch && !idMatch && !descMatch) return false;
      }
      
      return true;
    });
  }, [reports, activeFilter, searchQuery]);

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins} menit lalu`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} jam lalu`;
    return `${Math.floor(diffHours / 24)} hari lalu`;
  };

  const getStatusConfig = (status: string) => {
    const s = status?.toLowerCase() || 'pending';
    if (['selesai', 'resolved'].includes(s)) {
      return { 
        color: 'text-emerald-600 dark:text-emerald-400', 
        bg: 'bg-emerald-500/10', 
        border: 'border-emerald-500/20', 
        text: 'Selesai', 
        icon: 'check_circle',
        bar: 'bg-emerald-500'
      };
    }
    if (['proses', 'processing', 'diproses'].includes(s)) {
      return { 
        color: 'text-amber-600 dark:text-amber-400', 
        bg: 'bg-amber-500/10', 
        border: 'border-amber-500/20', 
        text: 'Diproses', 
        icon: 'hourglass_top',
        bar: 'bg-amber-500'
      };
    }
    return { 
      color: 'text-slate-600 dark:text-slate-400', 
      bg: 'bg-slate-500/10', 
      border: 'border-slate-500/20', 
      text: 'Pending', 
      icon: 'pending',
      bar: 'bg-slate-400'
    };
  };

  const getCategoryIcon = (category: string) => {
    const cat = category?.toLowerCase() || '';
    if (cat.includes('infrastruktur')) return 'build';
    if (cat.includes('kriminal')) return 'local_police';
    if (cat.includes('bencana')) return 'flood';
    if (cat.includes('kebakaran')) return 'local_fire_department';
    if (cat.includes('kecelakaan')) return 'car_crash';
    return 'assignment';
  };

  return (
    <div className="flex-1 bg-background min-h-screen py-8 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-text-main tracking-tight">Riwayat Laporan</h1>
          <p className="text-text-muted">Pantau status laporan kejadian Anda secara langsung (real-time).</p>
        </div>

        {/* Filter & Search */}
        <div className="bg-surface rounded-3xl shadow-sm border border-border p-4 sm:p-6 flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center transition-colors">
          <div className="relative w-full lg:max-w-md">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">search</span>
            <input
              type="text"
              className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-2xl text-text-main outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              placeholder="Cari ID atau Kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto hide-scrollbar">
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-6 py-2.5 rounded-full whitespace-nowrap transition-all font-semibold text-sm border-2 ${
                    isActive 
                      ? 'bg-primary border-primary text-on-primary shadow-lg shadow-primary/25' 
                      : 'bg-transparent text-text-muted border-border hover:border-text-muted/30 hover:text-text-main'
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        {/* Reports List */}
        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-32 bg-surface-hover rounded-3xl border border-border animate-pulse"></div>
            ))}
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-surface rounded-3xl border border-dashed border-border transition-colors">
            <div className="w-20 h-20 bg-surface-hover rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-[40px] text-text-muted">assignment_late</span>
            </div>
            <h3 className="text-xl font-bold text-text-main mb-2">Tidak ada laporan ditemukan</h3>
            <p className="text-text-muted max-w-sm text-center">Coba ubah kata kunci pencarian atau buat laporan baru.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {filteredReports.map((item) => {
              const status = getStatusConfig(item.status);
              const iconName = getCategoryIcon(item.category);

              return (
                <div key={item.id} className="bg-surface border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex relative group cursor-pointer">
                  {/* Status Indicator Bar */}
                  <div className={`w-2 h-full absolute left-0 top-0 z-10 ${status.bar}`}></div>
                  
                  <div className="flex-1 p-5 flex flex-col sm:flex-row gap-5 pl-7">
                    
                    {/* Image / Icon */}
                    <div className="w-full sm:w-32 h-40 sm:h-32 rounded-2xl overflow-hidden shrink-0 bg-surface-hover flex items-center justify-center border border-border relative">
                      {item.image_url ? (
                         <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Thumb" />
                      ) : (
                         <span className="material-symbols-outlined text-[40px] text-text-muted">{iconName}</span>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent sm:hidden"></div>
                    </div>
                    
                    {/* Details */}
                    <div className="flex flex-col justify-between flex-1 min-w-0 py-1">
                      <div>
                        <div className="flex justify-between items-start mb-3">
                           <div className="flex items-center gap-2">
                             <span className="text-xs font-mono font-semibold text-text-muted bg-surface-hover px-2.5 py-1 rounded-lg border border-border">
                               #{String(item.id).substring(0,8).toUpperCase()}
                             </span>
                           </div>
                           <div className={`px-3 py-1 rounded-full border flex items-center gap-1.5 ${status.bg} ${status.border}`}>
                             <span className={`material-symbols-outlined text-[14px] ${status.color}`}>{status.icon}</span>
                             <span className={`text-[11px] font-bold uppercase tracking-wider ${status.color}`}>{status.text}</span>
                           </div>
                        </div>
                        
                        <h3 className="font-bold text-text-main text-xl leading-tight line-clamp-1 mb-2">
                          {item.category}
                        </h3>
                        <p className="text-base text-text-muted line-clamp-2 leading-relaxed">
                          {item.description || 'Tidak ada deskripsi rinci.'}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4 border-t border-border pt-4">
                        <div className="flex items-center gap-2 text-text-muted text-sm font-medium">
                          <span className="material-symbols-outlined text-[18px]">schedule</span>
                          <span>{getTimeAgo(item.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-primary text-sm font-semibold opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                          Lihat Detail <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
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
    </div>
  );
}
