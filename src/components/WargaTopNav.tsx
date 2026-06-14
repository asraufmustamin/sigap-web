'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function WargaTopNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
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
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVHjIZWBDuWlh7HjNLkZcS3Khwpgv70J3Mwr48vlFF5aOX_rFHRyEZv929t0TXE-YhzK_BdJ_WpAPVxkCmTc6hkJ_itPvu2nv6hg-FYmRCs3GA7dChRzALsUt2NCsMuoMDMcYoAPRGK7HJ8HkKvlTeFEb0xTHm00HqlXfXavkCHXx6JPzNBfDr_E0OQPlIuH2fbTn3fuEpH7VBF45bJ050jq0UxRi69ZyGtXA8uGqfgOkGRA86HCyndsQqoI7DboE_-zevswtiiblK" 
                alt="SIGAP" 
                className="h-8 w-8 rounded-full object-cover mr-2"
              />
              <span className="font-bold text-xl text-[#0b57d0] tracking-tight">SIGAP</span>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive 
                        ? 'border-[#0b57d0] text-[#0b57d0]' 
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px] mr-1">{link.icon}</span>
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0b57d0]">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="ml-3 relative flex items-center gap-3 border-l border-gray-200 pl-4">
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-gray-700">{user?.name || 'Warga'}</span>
                <span className="text-xs text-gray-500">Warga</span>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center text-sm font-medium text-red-600 hover:text-red-800 ml-2 bg-red-50 px-3 py-1.5 rounded-full transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] mr-1">logout</span>
                Keluar
              </button>
            </div>
          </div>

          <div className="-mr-2 flex items-center sm:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#0b57d0]"
            >
              <span className="material-symbols-outlined">{isMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden border-t border-gray-200 bg-white">
          <div className="pt-2 pb-3 space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium flex items-center ${
                    isActive 
                      ? 'bg-blue-50 border-[#0b57d0] text-[#0b57d0]' 
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="material-symbols-outlined mr-3">{link.icon}</span>
                  {link.name}
                </Link>
              );
            })}
            <button
              onClick={() => { setIsMenuOpen(false); handleLogout(); }}
              className="w-full text-left block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-red-600 hover:bg-red-50 hover:border-red-300 flex items-center"
            >
              <span className="material-symbols-outlined mr-3">logout</span>
              Keluar
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
