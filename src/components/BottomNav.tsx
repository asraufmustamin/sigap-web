'use client';

import Link from 'next/link';

export default function BottomNav({ activeTab }: { activeTab: 'home' | 'history' | 'report' }) {
  return (
    <div className="fixed bottom-0 w-full max-w-md bg-surface border-t-0 rounded-t-2xl pb-safe shadow-[0_-4px_20px_rgba(0,42,22,0.08)] z-50 h-[70px] pt-2 px-6">
      <div className="flex justify-between items-center h-full relative">
        {/* Left Tab: Home */}
        <Link href="/warga/home" className="flex flex-col items-center justify-center h-full w-[60px]">
          <span 
            className="material-symbols-outlined text-[26px]" 
            style={{ 
              color: activeTab === 'home' ? '#002a16' : '#717972',
              fontVariationSettings: activeTab === 'home' ? "'FILL' 1" : "'FILL' 0" 
            }}
          >
            home
          </span>
          <span 
            className="text-[10px] font-bold uppercase mt-1 tracking-wider"
            style={{ color: activeTab === 'home' ? '#002a16' : '#717972' }}
          >
            Beranda
          </span>
        </Link>

        {/* Center Prominent FAB: Lapor */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-[35px] pointer-events-none">
          <Link 
            href="/warga/lapor" 
            className="bg-secondary-container w-20 h-20 rounded-full flex flex-col items-center justify-center border-4 border-surface shadow-[0_8px_24px_rgba(253,192,3,0.3)] pointer-events-auto transition-transform active:scale-[0.95]"
          >
            <span className="material-symbols-outlined text-[28px] text-on-secondary-container font-variation-fill">emergency</span>
            <span className="text-on-secondary-container font-bold text-[10px] uppercase mt-1 tracking-wider">
              Lapor
            </span>
          </Link>
        </div>

        {/* Right Tab: History */}
        <Link href="/warga/riwayat" className="flex flex-col items-center justify-center h-full w-[60px]">
          <span 
            className="material-symbols-outlined text-[26px]" 
            style={{ 
              color: activeTab === 'history' ? '#002a16' : '#717972',
              fontVariationSettings: activeTab === 'history' ? "'FILL' 1" : "'FILL' 0" 
            }}
          >
            history
          </span>
          <span 
            className="text-[10px] font-bold uppercase mt-1 tracking-wider"
            style={{ color: activeTab === 'history' ? '#002a16' : '#717972' }}
          >
            Riwayat
          </span>
        </Link>
      </div>
    </div>
  );
}
