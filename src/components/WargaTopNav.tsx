'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

export default function WargaTopNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const session = localStorage.getItem('warga_session');
    if (session) {
      setUser(JSON.parse(session));
    }
  }, []);

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    localStorage.removeItem('warga_session');
    router.push('/warga/login');
  };

  const navLinks = [
    { name: 'Beranda', href: '/warga/home', icon: 'home' },
    { name: 'Lapor', href: '/warga/lapor', icon: 'add_circle' },
    { name: 'Riwayat', href: '/warga/riwayat', icon: 'history' },
  ];

  return (
    <nav className="glass-panel sticky top-0 z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex flex-1 items-center justify-start">
            <div className="flex-shrink-0 flex items-center group cursor-pointer">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVHjIZWBDuWlh7HjNLkZcS3Khwpgv70J3Mwr48vlFF5aOX_rFHRyEZv929t0TXE-YhzK_BdJ_WpAPVxkCmTc6hkJ_itPvu2nv6hg-FYmRCs3GA7dChRzALsUt2NCsMuoMDMcYoAPRGK7HJ8HkKvlTeFEb0xTHm00HqlXfXavkCHXx6JPzNBfDr_E0OQPlIuH2fbTn3fuEpH7VBF45bJ050jq0UxRi69ZyGtXA8uGqfgOkGRA86HCyndsQqoI7DboE_-zevswtiiblK" 
                alt="Logo" 
                className="h-12 w-12 rounded-full object-cover shadow-lg group-hover:scale-110 transition-transform duration-300 ring-2 ring-primary/20"
              />
            </div>
          </div>
          
          <div className="hidden sm:flex flex-1 justify-center space-x-10">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`inline-flex items-center px-2 py-5 border-b-2 text-sm uppercase tracking-widest font-bold transition-all duration-300 ${
                    isActive 
                      ? 'border-primary text-primary scale-105' 
                      : 'border-transparent text-text-muted hover:border-primary/50 hover:text-text-main hover:scale-105'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="hidden sm:flex flex-1 items-center justify-end gap-3">
            
            {/* Theme Toggle */}
            {mounted && (
              <button 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2.5 rounded-full bg-surface text-text-muted hover:bg-surface-hover hover:text-primary transition-all shadow-sm border border-border"
                title="Ganti Tema"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                </span>
              </button>
            )}

            <button className="p-2.5 rounded-full bg-surface text-text-muted hover:bg-surface-hover hover:text-primary transition-all shadow-sm border border-border">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
            
            <div className="ml-2 flex items-center gap-4 bg-surface border border-border pl-4 pr-2 py-1.5 rounded-full shadow-sm">
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-text-main leading-tight tracking-wide">{user?.name || 'Warga'}</span>
                <span className="text-[10px] uppercase tracking-wider text-primary font-bold">Warga</span>
              </div>
              <button 
                onClick={handleLogout}
                className="w-10 h-10 flex items-center justify-center text-red-500 hover:text-white bg-red-50 hover:bg-red-500 dark:bg-red-500/10 dark:hover:bg-red-500 rounded-full transition-all"
                title="Keluar"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
              </button>
            </div>
          </div>

          <div className="-mr-2 flex flex-1 justify-end items-center sm:hidden gap-2">
            {/* Theme Toggle Mobile */}
            {mounted && (
              <button 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full text-text-muted hover:bg-surface-hover hover:text-text-main transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                </span>
              </button>
            )}
            
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-text-muted hover:text-text-main hover:bg-surface-hover transition-colors"
            >
              <span className="material-symbols-outlined">{isMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden border-t border-border bg-surface absolute w-full shadow-lg">
          <div className="pt-2 pb-3 space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`pl-3 pr-4 py-3 border-l-4 text-base font-medium flex items-center transition-colors ${
                    isActive 
                      ? 'bg-primary/5 border-primary text-primary' 
                      : 'border-transparent text-text-muted hover:bg-surface-hover hover:border-border hover:text-text-main'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="material-symbols-outlined mr-3 text-[20px]">{link.icon}</span>
                  {link.name}
                </Link>
              );
            })}
            <button
              onClick={() => { setIsMenuOpen(false); handleLogout(); }}
              className="w-full text-left pl-3 pr-4 py-3 border-l-4 border-transparent text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center transition-colors"
            >
              <span className="material-symbols-outlined mr-3 text-[20px]">logout</span>
              Keluar
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
