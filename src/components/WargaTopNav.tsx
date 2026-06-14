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
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVHjIZWBDuWlh7HjNLkZcS3Khwpgv70J3Mwr48vlFF5aOX_rFHRyEZv929t0TXE-YhzK_BdJ_WpAPVxkCmTc6hkJ_itPvu2nv6hg-FYmRCs3GA7dChRzALsUt2NCsMuoMDMcYoAPRGK7HJ8HkKvlTeFEb0xTHm00HqlXfXavkCHXx6JPzNBfDr_E0OQPlIuH2fbTn3fuEpH7VBF45bJ050jq0UxRi69ZyGtXA8uGqfgOkGRA86HCyndsQqoI7DboE_-zevswtiiblK" 
                alt="SIGAP" 
                className="h-8 w-8 rounded-full object-cover mr-2 shadow-sm"
              />
              <span className="font-bold text-xl text-primary tracking-tight">SIGAP</span>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                      isActive 
                        ? 'border-primary text-primary' 
                        : 'border-transparent text-text-muted hover:border-border hover:text-text-main'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px] mr-1">{link.icon}</span>
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center gap-2">
            
            {/* Theme Toggle */}
            {mounted && (
              <button 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full text-text-muted hover:bg-surface-hover hover:text-text-main transition-colors"
                title="Ganti Tema"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                </span>
              </button>
            )}

            <button className="p-2 rounded-full text-text-muted hover:bg-surface-hover hover:text-text-main transition-colors">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
            
            <div className="ml-3 relative flex items-center gap-3 border-l border-border pl-4">
              <div className="flex flex-col items-end">
                <span className="text-sm font-semibold text-text-main">{user?.name || 'Warga'}</span>
                <span className="text-xs text-text-muted font-medium">Warga</span>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center text-sm font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 ml-2 bg-red-50 dark:bg-red-500/10 px-4 py-1.5 rounded-full transition-colors border border-red-100 dark:border-red-500/20"
              >
                <span className="material-symbols-outlined text-[18px] mr-1">logout</span>
                Keluar
              </button>
            </div>
          </div>

          <div className="-mr-2 flex items-center sm:hidden gap-2">
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
