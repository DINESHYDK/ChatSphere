import React, { useState } from "react";
import { Paperclip } from "lucide-react";
// import PollCreator from "../Poll/pollCreator";

export function FooterInputChatBar({ setIsPollVisible }) {

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-charcoal/95 backdrop-blur-md border-t border-charcoal-border p-3 md:p-4 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      <div className="max-w-[800px] mx-auto w-full">
        <div className="relative flex items-center bg-[#242424] border border-[#333] rounded-full px-4 h-14">
          {/* Audio Bars / Left Icon */}
          <button
            className="text-gray-400 hover:text-white transition-colors flex items-center justify-center p-2"
            onClick={() => setIsPollVisible(true)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="8" y1="18" x2="8" y2="6"></line>
              <line x1="12" y1="22" x2="12" y2="2"></line>
              <line x1="16" y1="18" x2="16" y2="6"></line>
            </svg>
          </button>

          <input
            type="text"
            placeholder="Drop something cool..."
            className="flex-1 bg-transparent text-white placeholder-gray-500 text-[15px] focus:outline-none px-3"
          />

          <div className="flex items-center gap-2">
            <button className="text-gray-400 hover:text-white transition-colors p-2">
              <Paperclip size={20} />
            </button>
            <button className="w-9 h-9 rounded-full bg-[#333] hover:bg-[#444] transition-colors flex items-center justify-center text-white shrink-0">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </div>

{/* {isPollVisible && (
  <div className="absolute inset-0 z-50 min-h-screen w-full flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
    <PollCreator setIsPollVisible={setIsPollVisible} />
  </div>
)} */}
      {/* {isPollVisible && (
        <div className="inset-0 min-h-screen w-screen z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-hidden">
          <PollCreator setIsPollVisible={setIsPollVisible} />
        </div>
      )} */}
    </footer>
  );
}
