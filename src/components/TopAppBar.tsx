'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function TopAppBar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get user from localStorage
    const sessionStr = typeof window !== 'undefined' ? localStorage.getItem('user_session') : null;
    if (sessionStr) {
      try {
        const parsed = JSON.parse(sessionStr);
        setUser(parsed);
        if (parsed?.avatar_url) setAvatarUrl(parsed.avatar_url);
      } catch (e) {}
    }
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    if (typeof window !== 'undefined') localStorage.removeItem('user_session');
    router.push('/login');
  };

  return (
    <header className="bg-surface-container-lowest border-b border-outline-variant flex justify-between items-center w-full px-gutter-md h-16 z-50 shrink-0">
      {/* Left: Brand (Mobile) or Search (Web) */}
      <div className="flex items-center gap-4">
        <span className="md:hidden font-headline-md text-headline-md font-bold text-primary">SIGAP</span>
        <div className="hidden md:flex relative group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">
            search
          </span>
          <input
            type="text"
            className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full w-64 focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/60 outline-none"
            placeholder="Cari insiden, babinsa, desa..."
          />
        </div>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-3 relative">
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
            className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors relative"
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full ring-2 ring-surface-container-lowest"></span>
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant overflow-hidden z-50">
              <div className="p-4 border-b border-outline-variant bg-surface-container-low">
                <h3 className="font-headline-sm text-on-surface font-bold">Notifikasi</h3>
              </div>
              <div className="p-8 text-center text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">notifications_paused</span>
                <p className="font-body-md">Tidak ada notifikasi baru.</p>
              </div>
            </div>
          )}
        </div>

        <Link href="/settings" className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors">
          <span className="material-symbols-outlined">settings</span>
        </Link>
        
        <div className="h-8 w-px bg-outline-variant/50 mx-1"></div>
        
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
            className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full hover:bg-surface-container transition-colors"
          >
            <div 
              className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant bg-primary text-white flex items-center justify-center font-bold bg-cover bg-center"
              style={{ backgroundImage: avatarUrl ? `url(${avatarUrl})` : 'none' }}
            >
              {!avatarUrl && (user?.email?.charAt(0).toUpperCase() || 'A')}
            </div>
            <span className="font-body-md text-body-md font-semibold text-on-surface hidden md:block">
              {user?.email ? user.email.split('@')[0] : 'Admin Kodim'}
            </span>
            <span className="material-symbols-outlined text-on-surface-variant text-sm">
              expand_more
            </span>
          </button>
          
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant overflow-hidden z-50 py-1">
              <Link href="/settings" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-surface-container text-on-surface font-body-md">
                <span className="material-symbols-outlined text-[20px]">person</span>
                Profil
              </Link>
              <Link href="/settings" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 px-4 py-2 hover:bg-surface-container text-on-surface font-body-md">
                <span className="material-symbols-outlined text-[20px]">settings</span>
                Pengaturan
              </Link>
              <div className="h-px bg-outline-variant my-1"></div>
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-error-container hover:text-on-error-container text-error font-body-md transition-colors">
                <span className="material-symbols-outlined text-[20px]">logout</span>
                Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}


