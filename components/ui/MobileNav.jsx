import React, { useEffect } from 'react';
import { LayoutGrid, Earth, CircleUser } from 'lucide-react';
import { useScrollStore } from '@/store/scrollStore';
import { useRouter, usePathname } from 'next/navigation';
import { ROUTES } from '@/constants/page-routes';

export function MobileNav() {
  const router = useRouter();
  const pathname = usePathname(); // Get current route
  const { scrollDirection, setScrollDirection } = useScrollStore();

  useEffect(() => {
    const handleScroll = () => setScrollDirection(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setScrollDirection]);

  return (
    <nav className={`md:hidden fixed bottom-0 left-0 right-0 h-[65px] bg-[#121212]/80 backdrop-blur-sm border-t border-white/10 flex items-start justify-evenly z-50 transition-transform duration-300 ${scrollDirection === 'down' ? 'translate-y-full' : 'translate-y-0'}`}>
      
      <MobileNavItem 
        active={pathname === ROUTES.DASHBOARD} 
        onClick={() => router.push(ROUTES.DASHBOARD)}
        icon={<LayoutGrid size={22} />} 
      />
      
      <MobileNavItem 
        active={pathname === ROUTES.GLOBAL_CHAT} 
        onClick={() => router.push(ROUTES.GLOBAL_CHAT)} 
        icon={<Earth size={22} />} 
      />
      
      <MobileNavItem 
        active={pathname === ROUTES.PROFILE} 
        onClick={() => router.push(ROUTES.PROFILE)} 
        icon={<CircleUser size={22} />} 
      />
    </nav>
  );
}

function MobileNavItem({ icon, active, onClick }) {
  return (
    <button 
      onClick={onClick} 
      className="h-full flex flex-col items-center justify-start pt-2 relative w-16 focus:outline-none"
    >
      <div className={`mt-1.5 flex items-center justify-center w-11 h-9 rounded-full transition-all duration-200 ${
        active ? 'text-white shadow-[0_0_12px_rgba(255,255,255,0.25)]' : 'text-gray-500 hover:text-gray-300'
      }`}>
        {React.cloneElement(icon, {
          fill: 'none',
          strokeWidth: active ? 2.5 : 2,
        })}
      </div>
    </button>
  );
}