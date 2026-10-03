import React, { useState } from "react";
import Head from "next/head";
import { Outfit, Inter } from "next/font/google";
import {
  LayoutGrid,
  Globe,
  MessageSquare,
  User,
} from "lucide-react";
import { MobileNav } from "@/components/ui/MobileNav";
import { useRouter } from "next/navigation";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const geist = Inter({ subsets: ["latin"], variable: "--font-geist" });

// Desktop Sidebar
function DesktopNav({ activeTab, setActiveTab }) {
  const router = useRouter();
  
  const handleNav = (tab, path) => {
    setActiveTab(tab);
    if(path) router.push(path);
  }

  return (
    <aside className="hidden md:flex flex-col items-center py-6 fixed left-0 top-0 bottom-0 w-[88px] bg-[#121212] border-r border-[#333] z-50">
      <div className="w-12 h-12 bg-[#CCFF00] rounded-full flex items-center justify-center text-[#121212] shadow-[0_0_20px_rgba(204,255,0,0.5)] mb-12">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
      </div>
      <nav className="flex-1 flex flex-col items-center gap-10 mt-4">
        <NavItem
          active={activeTab === "home"}
          onClick={() => handleNav("home", "/dashboard")}
          icon={<LayoutGrid size={24} />}
        />
        <NavItem
          active={activeTab === "global"}
          onClick={() => handleNav("global", "/global")}
          icon={<Globe size={24} />}
        />
        <NavItem
          active={activeTab === "chat"}
          onClick={() => handleNav("chat", "/chat")}
          icon={<MessageSquare size={24} />}
        />
      </nav>
      <div className="mt-auto">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer ${
          activeTab === "profile" 
            ? "border-2 border-[#CCFF00] text-[#CCFF00]" 
            : "border-[1.5px] border-transparent text-gray-500 hover:text-white"
          }`}
          onClick={() => handleNav("profile", "/profile")}
        >
          {activeTab === "profile" && (
            <div className="absolute left-[-16px] w-[2px] h-[24px] bg-[#CCFF00] shadow-[0_0_10px_rgba(204,255,0,0.8)]"></div>
          )}
          <div className="w-10 h-10 rounded-full border-[1.5px] border-[#444] bg-[#222] flex items-center justify-center overflow-hidden">
            <User size={20} className={activeTab === "profile" ? "text-[#CCFF00]" : "text-gray-300"} />
          </div>
        </div>
      </div>
    </aside>
  );
}

function NavItem({ icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center justify-center w-[55px] h-[55px] hover:bg-[#242424] rounded-full transition-all ${
        active
          ? "bg-[#1A1A1A] text-[#CCFF00]"
          : "bg-transparent text-gray-400"
      }`}
      style={{
        boxShadow: active ? "0 0 15px rgba(204, 255, 0, 0.2)" : "none",
        border: active ? "1px solid #CCFF00" : "1px solid transparent"
      }}
      aria-label="Navigation item"
    >
      {active && (
        <div className="hidden md:block absolute left-[-16px] w-[2px] h-[24px] bg-[#CCFF00] shadow-[0_0_10px_rgba(204,255,0,0.8)]"></div>
      )}
      {icon}
    </button>
  );
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  
  // Track initial vs current bio to handle the button state change
  const initialBio = "Design enthusiast and coffee lover. Always exploring new ideas and connecting with creative minds.";
  const [bio, setBio] = useState(initialBio);

  const isBioChanged = bio.trim() !== initialBio;

  const handleSaveBio = () => {
    // Perform save API action here...
    console.log("Saved bio:", bio);
  };

  return (
    <div
      className="min-h-[100dvh] bg-[#121212] text-white font-sans flex flex-col"
    >
      <Head>
        <title>Profile - ChatSphere</title>
      </Head>

      {/* Desktop Nav */}
      <DesktopNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-[88px] relative pb-[100px] md:pb-[48px] pt-6 md:pt-14 w-full">
        <div className="mx-auto w-full md:max-w-[1192px] px-[20px] md:px-[48px] flex flex-col items-start justify-center">
    
          {/* Page Heading */}
          <div className="flex items-center justify-start gap-3 md:gap-4 mb-4 md:mb-8 w-full max-w-[885px]">
            <h1 className="font-outfit text-[28px] sm:text-[32px] md:text-[36px] font-bold tracking-wider leading-none">
              PROFILE
            </h1>
            <span className="border border-[#CCFF00] text-[#CCFF00] text-[12px] sm:text-[13px] md:text-[14px] font-bold px-3.5 sm:px-4 py-1 rounded-full uppercase tracking-wider flex items-center h-fit shrink-0">
              Verified User
            </span>
          </div>

          {/* Profile Card */}
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6 md:p-10 w-full md:max-w-[885px] shadow-md">
            
            {/* Identity Section */}
            <div className="flex flex-row items-center gap-5 md:gap-8 mb-5 md:mb-8">
              <div className="relative">
                {/* Scaled-Up Profile Image */}
                <div className="w-[100px] h-[100px] md:w-[144px] md:h-[144px] rounded-lg md:rounded-[32px] overflow-hidden shrink-0 bg-[#222] ring-2 ring-[#333]">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=faces&q=80" 
                    alt="Sarah Jenkins" 
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Gender Marker */}
                <div className="absolute top-0 right-0 md:top-0 md:right-0 w-[24px] h-[24px] md:w-[30px] md:h-[30px] bg-[#E83E8C] text-white rounded-full flex items-center justify-center font-bold text-[11px] md:text-[15px] shadow-md z-10 border-[2px] border-[#1A1A1A] translate-x-1/4 -translate-y-1/4">
                  G
                </div>
              </div>

              <div className="flex flex-col justify-center flex-1">
                <h2 className="font-outfit text-[24px] md:text-[30px] font-bold mb-1 md:mb-2 leading-tight">Sarah Jenkins</h2>
                {/* Live Desktop Bio Sync */}
                <p className="text-gray-300 font-geist text-[13px] md:text-[15px] leading-relaxed hidden md:block max-w-[500px]">
                  {bio}
                </p>
              </div>
            </div>

            {/* Live Mobile Bio Sync */}
            <p className="text-gray-300 font-geist text-[13px] md:hidden mb-6 leading-relaxed">
              {bio}
            </p>

            {/* Divider */}
            <div className="h-[1px] w-full bg-[#333] mb-6 md:mb-8"></div>

            {/* Details Section */}
            <div className="flex flex-col md:flex-row gap-5 md:gap-16 mb-5 md:mb-8">

              <div className="flex flex-col gap-1 w-full md:w-auto">
                <span className="text-gray-500 font-geist font-bold text-[10px] md:text-[11px] uppercase tracking-wider">
                  Email
                </span>
                <span className="text-white font-geist text-[16px] md:text-[22px] font-medium mt-1">
                  sarah@example.com
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1 mb-6 md:mb-10">
              <span className="text-gray-500 font-geist font-bold text-[10px] md:text-[11px] uppercase tracking-wider">
                Member Since
              </span>
              <span className="text-white font-geist text-[16px] md:text-[22px] font-medium mt-1">
                March 2024
              </span>
            </div>

            {/* Redesigned Bio Input */}
            <div className="flex flex-col gap-2 mb-6 md:mb-8">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-geist font-bold text-[10px] md:text-[11px] uppercase tracking-wider">
                  Change Bio
                </span>
                <span className="text-gray-500 text-[11px] font-geist">
                  {bio.length} / 160
                </span>
              </div>
              <textarea
                className="w-full bg-[#121212]/80 border border-[#333] focus:border-[#CCFF00]/60 text-white rounded-xl md:rounded-2xl p-4 font-geist text-[13px] md:text-[15px] resize-none focus:outline-none focus:ring-1 focus:ring-[#CCFF00]/40 transition-all leading-relaxed shadow-inner"
                rows={3}
                maxLength={160}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write something about yourself..."
              />
            </div>

            {/* G lowing Action Button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSaveBio}
                disabled={!isBioChanged}
                className={`transition-all duration-300 font-bold rounded-full px-8 py-2 md:py-2.5 tracking-wider text-[13px] ${
                  isBioChanged
                    ? "bg-transparent text-white border-2 hover:shadow-[0_0_25px_rgba(255,255,255,0.8)] hover:scale-105 active:scale-95 cursor-pointer"
                    : "bg-transparent border-[1.5px] border-[#444] text-gray-500 cursor-not-allowed opacity-60"
                }`}
              >
                DONE
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Nav */}
      <MobileNav />
    </div>
  );
}