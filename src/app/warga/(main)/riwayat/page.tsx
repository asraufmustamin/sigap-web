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
    if (diffMins < 60) return `${diffMins} menit lalu`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} jam lalu`;
    return `${Math.floor(diffHours / 24)} hari lalu`;
  };

  return (
    <div className="flex flex-col gap-6 pb-10">
      
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Riwayat Laporan</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-6">
        
        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="relative w-full md:max-w-md">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            <input
              type="text"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-[#0b57d0] focus:ring-1 focus:ring-[#0b57d0] transition-shadow"
              placeholder="Cari ID Laporan atau Kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto hide-scrollbar">
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-5 py-2.5 rounded-full whitespace-nowrap transition-colors font-medium text-sm border ${
                    isActive 
                      ? 'bg-[#0b57d0] text-white border-[#0b57d0]' 
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        {/* Incident Cards List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#0b57d0] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <span className="material-symbols-outlined text-[48px] text-gray-300 mb-4">assignment</span>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Tidak ada laporan ditemukan</h3>
            <p className="text-gray-500 text-sm">Coba ubah kata kunci pencarian atau filter status.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReports.map((item) => {
              let statusColor = 'text-gray-600';
              let statusBg = 'bg-gray-100';
              let statusBorder = 'border-gray-200';
              let statusText = 'Pending';
              let iconName = 'assignment';
              
              if (item.status === 'proses' || item.status === 'processing') {
                statusColor = 'text-amber-700'; 
                statusBg = 'bg-amber-50';
                statusBorder = 'border-amber-200';
                statusText = 'Diproses';
                iconName = 'directions_car';
              } else if (item.status === 'selesai' || item.status === 'resolved') {
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
                <div key={item.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex relative group cursor-pointer">
                  <div className={`w-1.5 h-full absolute left-0 top-0 z-10 ${statusBg.replace('50', '400')}`}></div>
                  <div className="flex-1 p-4 flex gap-5 pl-5">
                    <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-gray-50 flex items-center justify-center border border-gray-100">
                      {item.image_url ? (
                         <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="Thumb" />
                      ) : (
                         <span className="material-symbols-outlined text-[32px] text-gray-300">{iconName}</span>
                      )}
                    </div>
                    <div className="flex flex-col justify-between flex-1 min-w-0 py-1">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                           <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100 truncate mr-2">#{String(item.id).substring(0,8).toUpperCase()}</span>
                           <div className={`px-2.5 py-1 rounded-full border ${statusBg} ${statusBorder} shrink-0`}>
                             <span className={`text-[10px] font-bold uppercase tracking-wider ${statusColor}`}>{statusText}</span>
                           </div>
                        </div>
                        <h3 className="font-semibold text-gray-900 text-lg leading-tight line-clamp-1 mb-1">
                          {item.category}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>
                      </div>
                      <div className="flex items-center gap-1.5 mt-3 text-gray-400 text-sm">
                        <span className="material-symbols-outlined text-[16px]">schedule</span>
                        <span>{getTimeAgo(item.created_at)}</span>
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
