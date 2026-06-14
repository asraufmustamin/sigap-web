'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';

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

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      // Filter by status
      if (activeFilter !== 'Semua') {
        if (activeFilter === 'Pending' && report.status !== 'pending') return false;
        if (activeFilter === 'Diproses' && report.status !== 'proses' && report.status !== 'processing') return false;
        if (activeFilter === 'Selesai' && report.status !== 'selesai' && report.status !== 'resolved') return false;
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
    if (diffMins < 60) return `${diffMins} mnt lalu`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} jam lalu`;
    return `${Math.floor(diffHours / 24)} hri lalu`;
  };

  return (
    <div className="flex-1 bg-surface min-h-screen flex flex-col relative pb-28">
      {/* TopAppBar */}
      <div className="bg-surface border-b border-outline-variant flex items-center justify-between px-5 w-full h-16 z-40 sticky top-0">
        <div className="flex items-center gap-3">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVHjIZWBDuWlh7HjNLkZcS3Khwpgv70J3Mwr48vlFF5aOX_rFHRyEZv929t0TXE-YhzK_BdJ_WpAPVxkCmTc6hkJ_itPvu2nv6hg-FYmRCs3GA7dChRzALsUt2NCsMuoMDMcYoAPRGK7HJ8HkKvlTeFEb0xTHm00HqlXfXavkCHXx6JPzNBfDr_E0OQPlIuH2fbTn3fuEpH7VBF45bJ050jq0UxRi69ZyGtXA8uGqfgOkGRA86HCyndsQqoI7DboE_-zevswtiiblK"
            className="w-8 h-8 rounded-full object-cover"
            alt="SIGAP"
          />
          <span className="font-headline-md text-xl font-bold text-primary tracking-tight">SIGAP</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-[24px] text-on-surface-variant">notifications</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
            <span className="text-on-primary-container font-button-text font-bold">
              {user?.name ? user.name.substring(0, 2).toUpperCase() : 'US'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 px-5 pt-4">
        {/* Search and Filter Section */}
        <div className="mb-6">
          <div className="relative mb-4 flex items-center">
            <span className="material-symbols-outlined absolute left-3 z-10 text-outline text-[20px]">search</span>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Cari ID Laporan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Filter Chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${isActive ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'}`}
                >
                  <span className="font-label-caps text-xs font-bold">{filter}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Incident Cards List */}
        {isLoading ? (
          <div className="flex-1 items-center justify-center py-12 flex">
            <span className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></span>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="flex-1 items-center justify-center py-12 flex flex-col">
            <span className="material-symbols-outlined text-[48px] text-outline-variant mb-3">assignment</span>
            <span className="text-on-surface-variant font-body-md">Tidak ada laporan ditemukan</span>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredReports.map((item) => {
              let statusColor = '#6B7280';
              let statusBg = 'bg-gray-500';
              let statusBgLight = 'bg-gray-500/10';
              let statusText = 'Pending';
              
              if (item.status === 'proses' || item.status === 'processing') {
                statusColor = '#FFC107'; 
                statusBg = 'bg-[#FFC107]';
                statusBgLight = 'bg-[#FFC107]/10';
                statusText = 'Diproses';
              } else if (item.status === 'selesai' || item.status === 'resolved') {
                statusColor = '#10B981';
                statusBg = 'bg-[#10B981]';
                statusBgLight = 'bg-[#10B981]/10';
                statusText = 'Selesai';
              }

              return (
                <div key={item.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm flex relative">
                  <div className={`w-1.5 h-full absolute left-0 top-0 z-10 ${statusBg}`}></div>
                  <div className="flex-1 p-3 flex gap-4 pl-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-surface-container-high flex items-center justify-center">
                      {item.image_url ? (
                         <img src={item.image_url} className="w-full h-full object-cover" alt="Thumb" />
                      ) : (
                         <span className="material-symbols-outlined text-[24px] text-outline">image_not_supported</span>
                      )}
                    </div>
                    <div className="flex flex-col justify-between flex-1 py-1 min-w-0">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                           <span className="font-label-caps text-[10px] uppercase font-bold text-on-surface-variant truncate mr-2">ID: RPT-{String(item.id).substring(0,6).toUpperCase()}</span>
                           <div className={`px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 ${statusBgLight}`}>
                             <span className="font-label-caps text-[10px] font-bold" style={{ color: statusColor }}>{statusText}</span>
                           </div>
                        </div>
                        <span className="font-headline-md text-base font-bold text-on-surface leading-tight line-clamp-2">
                          {item.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-2 text-on-surface-variant">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        <span className="font-body-md text-[12px]">{getTimeAgo(item.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <BottomNav activeTab="history" />
    </div>
  );
}
