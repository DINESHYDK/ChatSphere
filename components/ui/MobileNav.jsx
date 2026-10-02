import React, { useEffect, useState } from 'react';
import { LayoutGrid, Earth, MessageCircle, CircleUser } from 'lucide-react';
import { useScrollStore } from '@/store/scrollStore';
import { useRouter } from 'next/navigation';


export function MobileNav() {
  const router = useRouter()
  const { scrollDirection, setScrollDirection } = useScrollStore();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const handleScroll = () => setScrollDirection(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setScrollDirection]);

  return (
    <nav className={`md:hidden fixed bottom-0 left-0 right-0 h-[65px] bg-[#121212]/80 backdrop-blur-sm border-t border-white/10 flex items-start justify-evenly z-50 transition-transform duration-300 ${scrollDirection === 'down' ? 'translate-y-full' : 'translate-y-0'}`}>
      
      <MobileNavItem 
        active={activeTab === 'dashboard'} 
        onClick={() => setActiveTab('dashboard')} 
        icon={<LayoutGrid size={22} />} 
      />
      
      <MobileNavItem 
        active={activeTab === 'global'} 
        onClick={() => { setActiveTab('global'); router.push('/global') }} 
        icon={<Earth size={22} />} 
      />
      
      <MobileNavItem 
        active={activeTab === 'chat'} 
        onClick={() => setActiveTab('chat')} 
        icon={<MessageCircle size={22} />} 
      />
      
      <MobileNavItem 
        active={activeTab === 'profile'} 
        onClick={() => setActiveTab('profile')} 
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