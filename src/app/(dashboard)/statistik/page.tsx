'use client';

import { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar
} from 'recharts';

export default function StatistikPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reports');
      const data = await res.json();
      if (res.ok && data) setReports(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Aggregation for metrics
  const totalLaporan = reports.length;
  const laporanSelesai = reports.filter(r => r.status === 'selesai').length;
  const resolutionRate = totalLaporan > 0 ? Math.round((laporanSelesai / totalLaporan) * 100) : 0;

  // Process data for Line Chart (Trend Laporan Bulanan)
  // Group by date
  const trendDataMap: Record<string, { masuk: number, selesai: number }> = {};
  reports.forEach(r => {
    const date = new Date(r.created_at).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' });
    if (!trendDataMap[date]) trendDataMap[date] = { masuk: 0, selesai: 0 };
    trendDataMap[date].masuk += 1;
    if (r.status === 'selesai') trendDataMap[date].selesai += 1;
  });
  const trendData = Object.keys(trendDataMap).map(date => ({
    name: date,
    masuk: trendDataMap[date].masuk,
    selesai: trendDataMap[date].selesai
  })).slice(-7); // Last 7 days if any

  // Process data for Pie Chart (Kategori Insiden)
  const categoryMap: Record<string, number> = {};
  reports.forEach(r => {
    const cat = r.category || 'Lainnya';
    categoryMap[cat] = (categoryMap[cat] || 0) + 1;
  });
  const pieData = Object.keys(categoryMap).map(key => ({
    name: key,
    value: categoryMap[key]
  }));
  const COLORS = ['#ba1a1a', '#fdc003', '#10B981', '#717972', '#002a16'];

  // Process data for Bar Chart (Performa Wilayah) - dummy categories as regions for now
  const barData = Object.keys(categoryMap).map(key => ({
    name: key,
    waktu_respons: Math.floor(Math.random() * 30) + 5 // Simulated response time in mins
  }));

  if (loading) {
    return <div className="p-8 text-center text-on-surface-variant animate-pulse">Memuat data analitik...</div>;
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-background">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card 1: Total Laporan */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-primary group-hover:scale-110 transition-transform duration-500">
            <span className="material-symbols-outlined" style={{ fontSize: '64px' }}>description</span>
          </div>
          <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">Total Laporan</p>
          <h3 className="font-headline-lg text-headline-lg text-primary font-bold mb-2">{totalLaporan}</h3>
          <div className="flex items-center gap-1 text-status-completed font-body-md text-sm">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span>Data Real-time</span>
          </div>
          <div className="absolute bottom-0 left-0 h-1 bg-primary w-full"></div>
        </div>

        {/* Card 2: Laporan Selesai */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-status-completed group-hover:scale-110 transition-transform duration-500">
            <span className="material-symbols-outlined" style={{ fontSize: '64px' }}>check_circle</span>
          </div>
          <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">Laporan Selesai</p>
          <h3 className="font-headline-lg text-headline-lg text-on-surface font-bold mb-2">{laporanSelesai}</h3>
          <div className="flex items-center gap-2">
            <div className="w-full bg-surface-variant rounded-full h-2 max-w-[150px]">
              <div className="bg-status-completed h-2 rounded-full" style={{ width: `${resolutionRate}%` }}></div>
            </div>
            <span className="font-body-md text-sm text-on-surface-variant">{resolutionRate}% Resolution</span>
          </div>
          <div className="absolute bottom-0 left-0 h-1 bg-status-completed w-full"></div>
        </div>

        {/* Card 3: Rata-rata Waktu Respons */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-secondary group-hover:scale-110 transition-transform duration-500">
            <span className="material-symbols-outlined" style={{ fontSize: '64px' }}>timer</span>
          </div>
          <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">Rata-rata Waktu Respons</p>
          <h3 className="font-headline-lg text-headline-lg text-on-surface font-bold mb-2">
            14<span className="text-headline-md">m</span> 32<span className="text-headline-md">s</span>
          </h3>
          <div className="flex items-center gap-1 text-status-completed font-body-md text-sm">
            <span className="material-symbols-outlined text-sm">trending_down</span>
            <span>-2m 15s peningkatan</span>
          </div>
          <div className="absolute bottom-0 left-0 h-1 bg-secondary w-full"></div>
        </div>
      </div>

      {/* Main Charts Grid (Bento style) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart: Tren Laporan Bulanan */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm lg:col-span-2 flex flex-col h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Tren Laporan Masuk</h3>
              <p className="font-body-md text-sm text-on-surface-variant">Volume laporan masuk vs diselesaikan</p>
            </div>
          </div>
          <div className="flex-1 w-full h-full relative">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e1e3df" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#717972', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#717972', fontSize: 12}} />
                  <RechartsTooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Line type="monotone" dataKey="masuk" stroke="#002a16" strokeWidth={3} dot={{r: 4, fill: '#002a16'}} activeDot={{r: 6}} />
                  <Line type="monotone" dataKey="selesai" stroke="#10B981" strokeWidth={3} dot={{r: 4, fill: '#10B981'}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-outline">Tidak ada data tren</div>
            )}
          </div>
          <div className="flex gap-4 mt-4 justify-center">
            <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-primary"></span><span className="text-xs text-on-surface-variant">Masuk</span></div>
            <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-status-completed"></span><span className="text-xs text-on-surface-variant">Selesai</span></div>
          </div>
        </div>

        {/* Pie Chart: Kategori Insiden */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Kategori Insiden</h3>
              <p className="font-body-md text-sm text-on-surface-variant">Distribusi tipe laporan</p>
            </div>
          </div>
          <div className="flex-1 w-full h-[200px] relative flex justify-center items-center">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-outline">Tidak ada data</div>
            )}
          </div>
          <div className="mt-4 flex flex-col gap-2 max-h-[100px] overflow-y-auto custom-scrollbar">
            {pieData.map((entry, index) => (
              <div key={index} className="flex justify-between items-center text-sm font-body-md">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm" style={{backgroundColor: COLORS[index % COLORS.length]}}></span>
                  <span className="truncate max-w-[120px]" title={entry.name}>{entry.name}</span>
                </div>
                <span className="font-bold">{Math.round((entry.value / totalLaporan) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart: Performa Respons Wilayah */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm lg:col-span-3 flex flex-col h-[350px]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Estimasi Waktu Respons</h3>
              <p className="font-body-md text-sm text-on-surface-variant">Berdasarkan Kategori Laporan (Menit)</p>
            </div>
          </div>
          <div className="flex-1 w-full h-full relative">
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e1e3df" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#717972', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#717972', fontSize: 12}} />
                  <RechartsTooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Bar dataKey="waktu_respons" fill="#9ed3af" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
               <div className="w-full h-full flex items-center justify-center text-outline">Tidak ada data</div>
            )}
          </div>
        </div>
      </div>

      <footer className="mt-8 text-center text-on-surface-variant font-label-caps text-xs py-4 border-t border-outline-variant">
        © 2026 SIGAP - SISTEM INTEGRASI GANGGUAN & PELAPORAN. ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
}

