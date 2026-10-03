import React, { useState } from 'react';
import Head from 'next/head';
import { Outfit, Inter } from 'next/font/google';
import { LayoutGrid, Globe, MessageSquare, Share2, Camera, Trash2, User } from 'lucide-react';
import { MobileHeader } from '@/components/ui/MobileHeader';
import { MobileNav } from '@/components/ui/MobileNav';
import { PollCard } from '@/components/Poll/PollCard';
import PollCreator from '@/components/Poll/pollCreator';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const geist = Inter({ subsets: ['latin'], variable: '--font-geist' });

export default function PollDashboard() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className={`min-h-screen bg-charcoal text-white ${outfit.variable} ${geist.variable} font-sans`}>
      <Head>
        <title>Poll Dashboard</title>
      </Head>

      {/* Desktop Left Navigation Dock */}
      <aside className="hidden md:flex flex-col items-center py-6 fixed left-0 top-0 bottom-0 w-[88px] bg-charcoal border-r border-charcoal-border z-50">
        <div className="w-12 h-12 bg-radium rounded-full flex items-center justify-center text-charcoal shadow-[0_0_20px_rgba(204,255,0,0.5)] mb-12">
          {/* Lightning Icon Simplified */}
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
          <div className="w-10 h-10 rounded-full border-2 border-charcoal-border overflow-hidden cursor-pointer hover:border-radium transition-colors">
            {/* Fake avatar */}
            <div className="w-full h-full bg-indigo-500 flex items-center justify-center">
               <User size={20} className="text-white"/>
            </div>
          </div>
        </div>
      </aside>
    
      {/* Main Content Area */}
      <main className="md:ml-[88px] pb-[80px] md:pb-12 pt-6 md:pt-12 px-[16px] md:px-[48px] max-w-[1400px] mx-auto min-h-screen">
        <PollCreator canRemove={false}/>
        
        {/* Drop Poll Hero (Composer) */}
        {/* <div className="bg-[#1A1A1A] border border-charcoal-border rounded-xl p-6 w-full max-w-full md:max-w-[500px] shadow-lg mb-12">
          <div className="flex items-center gap-2 mb-5">
            <h2 className="font-outfit font-bold text-xl uppercase tracking-wider text-white">Drop a New Poll</h2>
          </div>

          <div className="mb-4">
            <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Poll Question</label>
            <input 
              type="text" 
              placeholder="Which tech stack are you starting your side-hustle with in 2026?"
              className="w-full bg-[#242424] border border-[#333] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-radium transition-colors"
              defaultValue="Which tech stack are you starting your side-hustle with in 2026?"
            />
          </div>

          <div className="space-y-3 mb-4">
            <ComposerOption text="Next.js + Tailwind + Supabase" removable />
            <ComposerOption text="Remix + Prisma + Postgres" removable />
          </div>

          <div className="flex items-center justify-between mt-4">
            <button className="border border-dashed border-radium text-radium px-4 py-2 rounded-full text-sm font-semibold hover:bg-[rgba(204,255,0,0.1)] transition-colors">
              Add option +
            </button>
            <div className="bg-[#242424] p-1 rounded-full flex text-sm">
              <button className="px-4 py-1.5 text-gray-400 font-medium rounded-full cursor-not-allowed">Boys</button>
              <button className="px-4 py-1.5 text-gray-400 font-medium rounded-full cursor-not-allowed">Girls</button>
              <button className="px-4 py-1.5 bg-radium text-charcoal font-bold rounded-full">All</button>
            </div>
          </div>

          <div className="border-t border-[#333] mt-6 pt-5 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-400">Anonymous </span>
              <div className="w-10 h-6 bg-charcoal rounded-full flex items-center p-1 border border-[#333]">
                <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
              </div>
            </div>
            
            <button className="border-2 border-radium hover:bg-radium hover:text-charcoal text-radium px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-colors uppercase tracking-wider text-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
              Launch 
            </button>
          </div>
        </div> */}

        {/* Your Polls Section */}
        <div className="past-polls-section">
          <div className="flex items-center gap-3 mt-6 mb-3">
            <h2 className="font-outfit font-bold text-2xl uppercase tracking-wider">Your Polls</h2>
            <div className="bg-[#242424] text-radium text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center">3</div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 w-full lg:w-fit">
            
    <div className="flex flex-col gap-6 items-center">
  {/* Poll 1: Late Night Snack */}
          <PollCard 
            type="PUBLIC"
            poll={{
              title: "Ultimate late-night study fuel — what's your pick?",
              totalVotes: 3420,
              gender: "A",
              createdOn: new Date(Date.now() - 3 * 60 * 60 * 1000), // ~3 hours ago
              pollOptions: [
                { 
                  index: 0, 
                  content: "Loaded Truffle Fries", 
                  imageUrl: "https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=100&auto=format&fit=crop&q=60", 
                  votesCount: 1850, 
                  isActive: true 
                },
                { 
                  index: 1, 
                  content: "Woodfired Pepperoni Slice", 
                  imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&auto=format&fit=crop&q=60", 
                  votesCount: 1120, 
                  isActive: false 
                },
                { 
                  index: 2, 
                  content: "Spicy Shin Ramen Bowl", 
                  imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=100&auto=format&fit=crop&q=60", 
                  votesCount: 450, 
                  isActive: false 
                }
              ]
            }}
            onVote={(index) => console.log('Voted option:', index)}
            onDelete={() => console.log('Deleted poll')}
          />

          {/* Poll 2: Morning Caffeine */}
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

          {/* Poll 3: Weekend Escape */}
          <PollCard 
            type="PRIVATE"
            poll={{
              title: "Where are we escaping to this weekend?",
              totalVotes: 1450,
              gender: "B",
              createdOn: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // ~2 days ago
              pollOptions: [
                { 
                  index: 0, 
                  content: "Cozy Pine Forest Cabin", 
                  imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=100&auto=format&fit=crop&q=60", 
                  votesCount: 910, 
                  isActive: true 
                },
                { 
                  index: 1, 
                  content: "Sun-drenched Tropical Beach", 
                  imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100&auto=format&fit=crop&q=60", 
                  votesCount: 540, 
                  isActive: false 
                }
              ]
            }}
            onVote={(index) => console.log('Voted option:', index)}
            onDelete={() => console.log('Deleted poll')}
          />
        </div>
            
          </div>
        </div>

      </main>
     
     <MobileNav 
        // activeTab={activeTab} 
        // setActiveTab={setActiveTab} 
        // MobileNavItem={MobileNavItem} 
      />
    </div>
  );
}

// ------ Components ------ 

function NavItem({ icon, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`relative w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 ${active ? 'text-radium bg-[#1A1A1A] border-l-2 border-radium rounded-none sm:rounded-xl sm:border-l-0 sm:border-l-0 ' : 'text-gray-500 hover:text-gray-300'}`}
    >
      {/* For desktop active indicator */}
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
      {/* 24x2px neon underline with 6px gap */}
      {/* {active && (
        <div className="absolute bottom-[8px] w-[24px] h-[2px] bg-radium shadow-[0_0_8px_rgba(204,255,0,0.8)] rounded-full"></div>
      )} */}
//     </button>
//   );
// }

function ComposerOption({ text, removable }) {
  return (
    <div className="flex items-center gap-3 bg-[#242424] border border-[#333] rounded-lg p-3 group hover:border-[#444] transition-colors">
      <div className="text-gray-400">
        <Camera size={18} />
      </div>
      <div className="flex-1 text-sm text-gray-200">
        {text}
      </div>
      {removable && (
        <button className="text-gray-500 hover:text-red-400 transition-colors">
          <Trash2 size={18} />
        </button>
      )}
    </div>
  );
}

// function PollCard({ type, time, question, votes, demographic, options }) {
//   return (
//     <div className="poll-card bg-[#1A1A1A] border border-charcoal-border rounded-xl p-5 md:p-6 lg:w-[480px] w-full flex flex-col hover:border-[#333] transition-colors shadow-sm">
//       <div className="flex items-center justify-between mb-4">
//         <div className="flex items-center gap-2 text-xs">
//           <span className={`px-2 py-0.5 rounded-full font-bold border ${type === 'PUBLIC' ? 'border-radium text-radium' : 'border-gray-500 text-gray-400'}`}>
//             {type}
//           </span>
//           <span className="text-gray-500">• {time}</span>
//         </div>
//         <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors bg-[#242424] px-3 py-1.5 rounded-full">
//           <Share2 size={14} />
//           Share
//         </button>
//       </div>

//       <h3 className="text-white font-bold text-lg mb-5 leading-snug pr-2">{question}</h3>

//       <div className="space-y-3 flex-1">
//         {options.map((opt, i) => (
//           <div key={i} className="relative bg-[#242424] border border-[#333] rounded-lg overflow-hidden h-12 flex items-center px-4 z-10 w-full group">
//             {/* Progress Fill */}
//             <div 
//               className={`absolute left-0 top-0 bottom-0 z-[-1] transition-all duration-1000 ease-out ${opt.active ? 'bg-radium/10' : 'bg-charcoal/30'}`} 
//               style={{ width: `${opt.percent}%` }}
//             ></div>

//             {/* Bottom active line indicator inside track */}
//             {opt.active && (
//                <div className="absolute left-0 bottom-0 h-[2px] bg-radium shadow-[0_0_8px_rgba(204,255,0,0.8)] z-0" style={{ width: `${opt.percent}%` }}></div>
//             )}

//             <div className="flex items-center gap-3 w-full z-10 font-medium">
//               <span className="text-xl">
//                  {/* Fake emoji for visual if appropriate, but keeping minimal or use passed ones. The mock has dynamic emojis, I'll pass a fixed one or None */}
//                  { i === 0 ? '🍔' : (i===1 ? '🥑' : '🥩') }
//               </span>
//               <span className={`text-sm truncate flex-1 ${opt.active ? 'text-radium' : 'text-gray-300'}`}>{opt.text}</span>
              
//               <div className="flex items-center gap-3 ml-2 shrink-0">
//                 <span className="text-xs text-gray-400">{opt.votes} votes</span>
//                 <span className={`text-sm font-bold ${opt.active ? 'text-radium' : 'text-gray-400'}`}>{opt.percent}%</span>
//                 <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${opt.active ? 'border-radium' : 'border-gray-500'}`}>
//                   {opt.active && <div className="w-1.5 h-1.5 rounded-full bg-radium"></div>}
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#333] text-xs text-gray-500 font-medium">
//         <div className="flex items-center gap-4">
//           <div className="flex items-center gap-1.5">
//             <UsersIcon size={14} />
//             {votes} votes
//           </div>
//           <div className="hidden sm:block">{demographic}</div>
//         </div>
//         <button className="hover:text-red-400 text-gray-400 transition-colors uppercase tracking-wider font-bold">
//           Remove
//         </button>
//       </div>
//     </div>
//   );
// }

function UsersIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  );
}
