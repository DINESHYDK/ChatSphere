import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Outfit, Inter } from 'next/font/google';
import { LayoutGrid, Globe, MessageSquare, User } from 'lucide-react';
// import { MobileHeader } from '@/components/ui/MobileHeader';
import { MobileNav } from '@/components/ui/MobileNav';
import { FooterInputChatBar } from '@/components/ui/FooterInputChatBar';
import { ArrowLeft } from 'lucide-react';
import { PollCard } from '@/components/Poll/PollCard';
import { useRouter } from 'next/navigation';
// import { next/navigation } from 'next/router';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const geist = Inter({ subsets: ['latin'], variable: '--font-geist' });

// Dummy poll component
// function FeedPoll({ question, votes, options }) {
//   return (
//     <div className="bg-[#1A1A1A] border border-charcoal-border rounded-xl p-5 mt-2 shadow-lg mb-2">
//       <h3 className="text-white font-bold text-lg mb-4 leading-snug">{question}</h3>
      
//       <div className="space-y-3">
//         {options.map((opt, i) => (
//           <div key={i} className="relative bg-[#242424] border border-[#333] rounded-lg overflow-hidden h-12 flex items-center px-4 z-10 w-full">
//             <div 
//               className={`absolute left-0 top-0 bottom-0 z-[-1] transition-all duration-1000 ease-out ${opt.active ? 'bg-radium/10' : 'bg-charcoal/30'}`} 
//               style={{ width: `${opt.percent}%` }}
//             ></div>
//             {opt.active && (
//               <div className="absolute left-0 bottom-0 h-[2px] bg-radium shadow-[0_0_8px_rgba(204,255,0,0.8)] z-0" style={{ width: `${opt.percent}%` }}></div>
//             )}
//             <div className="flex items-center gap-3 w-full z-10 font-medium">
//               <span className="text-xl">{opt.emoji}</span>
//               <span className={`text-sm truncate flex-1 ${opt.active ? 'text-radium' : 'text-gray-300'}`}>{opt.text}</span>
//               <div className="flex items-center gap-3 ml-2 shrink-0">
//                 <span className="text-xs text-gray-500 hidden sm:block">{opt.votes}</span>
//                 <span className={`text-sm font-bold ${opt.active ? 'text-radium' : 'text-gray-400'}`}>{opt.percent}%</span>
//                 <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${opt.active ? 'border-radium' : 'border-gray-500'}`}>
//                   {opt.active && <div className="w-1.5 h-1.5 rounded-full bg-radium"></div>}
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
      
//       <div className="flex items-center justify-between mt-5">
//         <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
//           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
//             <circle cx="9" cy="7" r="4"></circle>
//             <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
//             <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
//           </svg>
//           {votes} votes
//         </div>
//         <button className="border border-radium text-radium px-6 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[rgba(204,255,0,0.1)] transition-colors">
//           Vote
//         </button>
//       </div>
//     </div>
//   );
// }

// Dummy message component
function ChatMessage({ avatar, name, time, text, children, isLive }) {
  return (
    <div className="flex flex-col mb-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-full bg-[#333] border border-[#444] overflow-hidden flex items-center justify-center relative">
          {avatar ? (
            <img src={avatar} alt={name} className="w-full h-full object-cover" />
          ) : (
             <User size={14} className="text-white"/>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-[15px]">{name}</span>
          <span className="text-gray-500 text-xs">{time}</span>
          {isLive && (
            <span className="border border-radium text-radium text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide">
              LIVE
            </span>
          )}
        </div>
      </div>
      <div className="ml-11">
        {text && (
          <div className="bg-[#242424] text-white px-4 py-3 rounded-2xl rounded-tl-sm text-[15px] inline-block mb-1 border border-transparent max-w-full md:max-w-2xl break-words">
            {text}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

// Desktop Sidebar
function DesktopNav({ activeTab, setActiveTab }) {
  return (
    <aside className="hidden md:flex flex-col items-center py-6 fixed left-0 top-0 bottom-0 w-[88px] bg-charcoal border-r border-charcoal-border z-50">
      <div className="w-12 h-12 bg-radium rounded-full flex items-center justify-center text-charcoal shadow-[0_0_20px_rgba(204,255,0,0.5)] mb-12">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
      </div>
      <nav className="flex-1 flex flex-col items-center gap-10 mt-4">
        <NavItem active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<LayoutGrid size={24} />} />
        <NavItem active={activeTab === 'global'} onClick={() => setActiveTab('global')} icon={<Globe size={24} />} />
        <NavItem active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} icon={<MessageSquare size={24} />} />
      </nav>
      <div className="mt-auto">
        <div className="w-10 h-10 rounded-full border-2 border-charcoal-border overflow-hidden cursor-pointer hover:border-radium transition-colors relative">
          <div className="w-full h-full bg-indigo-500 flex items-center justify-center">
             <User size={20} className="text-white"/>
          </div>
        </div>
      </div>
    </aside>
  );
}

function NavItem({ icon, active, onClick }) {
  return (
    <button 
// onClick={() => (href ? router.push(href) : router.back())}
className="fixed top-4 left-4 z-50 flex items-center justify-center w-[55px] h-[55px] bg-[#1A1A1A]/95 backdrop-blur-md hover:bg-[#242424] border border-radium text-radium rounded-full transition-all shadow-[0_0_15px_rgba(204,255,0,0.4)]"
      aria-label="Go back"
    >
      {active && <div className="hidden md:block absolute left-[-16px] w-[2px] h-[24px] bg-radium shadow-[0_0_10px_rgba(204,255,0,0.8)]"></div>}
      {icon}
    </button>
  );
}

// function MobileNavItem({ icon, active, onClick }) {
//   return (
//     <button onClick={onClick} className="h-full flex flex-col items-center justify-center relative w-16">
//       <div className={`mt-1 transition-colors ${active ? 'text-radium' : 'text-gray-500'}`}>
//         {icon}
//       </div>
//       {active && (
//         <div className="absolute bottom-[8px] w-[24px] h-[2px] bg-radium shadow-[0_0_8px_rgba(204,255,0,0.8)] rounded-full"></div>
//       )}
//     </button>
//   );
// }

export default function GlobalFeed() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('global');

  return (
    <div className={`min-h-[100dvh] bg-charcoal text-white ${outfit.variable} ${geist.variable} font-sans flex flex-col`}>
      <Head>
        <title>Global Feed - ChatSphere</title>
      </Head>

      <DesktopNav activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Back button */}
      <div className="fixed top-4 left-4 z-50 flex items-center justify-center">
       <div className="absolute -inset-4 bg-radium/20 rounded-full blur-xl pointer-events-none"></div>

       {/* Main Button */}
       <button
         onClick={router.back}
         className="relative flex items-center justify-center w-[50px] h-[50px] bg-[#1A1A1A]/90 backdrop-blur-md hover:bg-[#242424] border-2 border-radium/30 text-white rounded-full transition-all shadow-[0_4px_20px_rgba(0,0,0,0.8)]"
         aria-label="Go back"
       >
         <ArrowLeft size={18} />
       </button>
     </div>
      {/* MobileHeader */}



      <main className="flex-1 md:ml-[88px] relative pb-[140px] md:pb-[90px]">
        {/* Date separator (optional visual touch from image) */}
        <div className="max-w-[800px] mx-auto px-4 md:px-8 mt-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-[1px] flex-1 bg-[#333]"></div>
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">SEP 27, 2026</span>
            <div className="h-[1px] flex-1 bg-[#333]"></div>
          </div>
          
          <div className="space-y-2">
            <ChatMessage 
              name="alex_codez" 
              time="2m ago" 
              text="yo who's making polls about food at 2am 😂" 
            />

            <ChatMessage 
              name="gamer_girl_99" 
              time="5m ago" 
              isLive
            >
            <PollCard 
              type="PUBLIC"
              poll={{
                title: "Morning vibe check: What's in your cup today?",
                totalVotes: 890,
                gender: "G",
                createdOn: new Date(Date.now() - 12 * 60 * 60 * 1000), // ~12 hours ago
                pollOptions: [
                  { 
                    index: 0, 
                    content: "Iced Caramel Macchiato", 
                    imageUrl: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=100&auto=format&fit=crop&q=60", 
                    votesCount: 520, 
                    isActive: false 
                  },
                  { 
                    index: 1, 
                    content: "Ceremonial Matcha Latte", 
                    imageUrl: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=100&auto=format&fit=crop&q=60", 
                    votesCount: 370, 
                    isActive: true 
                  }
                ]
              }}
              onVote={(index) => console.log('Voted option:', index)}
              onDelete={() => console.log('Deleted poll')}
            />
              {/* <FeedPoll 
                question="What's the game you'd play for 24 hours straight?"
                votes="2,410"
                options={[
                  { text: 'Minecraft (The Classic)', emoji: '👨‍🌾', votes: '1,156', percent: 48, active: true },
                  { text: 'Valorant (Ranked Grind)', emoji: '🔫', votes: '843', percent: 35, active: false },
                  { text: 'GTA VI (Waiting list mode)', emoji: '🚗', votes: '411', percent: 17, active: false }
                ]}
              /> */}
            </ChatMessage>

            <ChatMessage 
              name="sarah_jenkins" 
              time="4m ago" 
              text="just dropped a spicy one, go vote!" 
            />

            <ChatMessage 
              name="marcus_vibe" 
              time="7m ago" 
              text="this feed is fire tonight 🔥" 
            />
            
            {/* Some scrolling space buffer */}
            <div className="h-6"></div>
          </div>
        </div>
      </main>

      <FooterInputChatBar />

      {/* <MobileNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        MobileNavItem={MobileNavItem} 
      /> */}
    </div>
  );
}
