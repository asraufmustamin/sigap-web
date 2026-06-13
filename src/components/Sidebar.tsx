'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: 'Peta', icon: 'map' },
  { href: '/incidents', label: 'Daftar Laporan', icon: 'description' },
  { href: '/personil', label: 'Manajemen Babinsa', icon: 'military_tech' },
  { href: '/statistik', label: 'Statistik', icon: 'analytics' },
  { href: '/settings', label: 'Pengaturan Komando', icon: 'settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showIncidentModal, setShowIncidentModal] = useState(false);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem('user_session');
    router.push('/login');
  };

  const handleLaporInsiden = () => {
    // In a real app, this would open a complex form. For now, an alert or simple state modal.
    alert('Modul Lapor Insiden manual segera hadir.');
  };

  const handleBantuan = (e: React.MouseEvent) => {
    e.preventDefault();
    alert('Pusat Bantuan: Hubungi Administrator Utama atau lihat dokumentasi SIGAP.');
  };

  return (
    <nav className="hidden md:flex flex-col bg-surface-container h-full w-64 fixed left-0 top-0 py-stack-lg z-40 shadow-sm border-r border-outline-variant/30">
      {/* Header */}
      <div className="px-gutter-md mb-stack-lg flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-on-primary font-headline-md font-bold overflow-hidden shadow-sm">
          S
        </div>
        <div>
          <h1 className="font-headline-md text-headline-md text-primary font-bold tracking-tight">KOMANDO UTAMA</h1>
          <p className="font-label-caps text-label-caps text-on-surface-variant opacity-80">Vigilance &amp; Speed</p>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 px-3 space-y-1 mt-4">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group relative ${
                isActive 
                  ? 'text-primary font-bold translate-x-1 bg-surface-container-highest' 
                  : 'text-on-surface-variant hover:bg-surface-container-highest'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full"></div>
              )}
              <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                {item.icon}
              </span>
              <span className="font-body-md text-body-md">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* CTA & Footer Nav */}
      <div className="px-gutter-md mt-auto space-y-4">
        <button 
          onClick={handleLaporInsiden}
          className="w-full bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed transition-colors font-button-text text-button-text py-3 rounded-full flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(253,192,3,0.15)]"
        >
          <span className="material-symbols-outlined">add_alert</span>
          LAPOR INSIDEN
        </button>
        
        <div className="border-t border-outline-variant/30 pt-4 space-y-1">
          <a href="#" onClick={handleBantuan} className="flex items-center gap-3 px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-highest transition-all cursor-pointer">
            <span className="material-symbols-outlined">help</span>
            <span className="font-body-md text-body-md">Bantuan</span>
          </a>
          <a href="#" onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-highest transition-all cursor-pointer">
            <span className="material-symbols-outlined">logout</span>
            <span className="font-body-md text-body-md">Keluar</span>
          </a>
        </div>
      </div>
    </nav>
  );
}

