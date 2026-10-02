import React, {useState} from 'react';
import Image from 'next/image';
import { Share2, Users as UsersIcon } from 'lucide-react';
import { formatTimeAgo } from '@/utils/timeAgo';
import ImagePreviewOverlay from './imagePreview';

export function PollCard({ poll, type = "PUBLIC", onVote, onDelete }) {
  const { title, pollOptions, totalVotes, gender, createdOn, createdAt } = poll || {};
   
  const rawDate = createdOn || createdAt;
  const timeAgo = formatTimeAgo(rawDate);
  const displayType = type ? type.toUpperCase() : "PUBLIC";
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  return (
    <div className="poll-card bg-[#1A1A1A] border border-charcoal-border rounded-xl p-5 md:p-6 lg:w-[480px] w-full flex flex-col hover:border-[#333] transition-colors shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-xs">
          <span className={`px-2 py-0.5 rounded-full font-bold border ${displayType === 'PUBLIC' ? 'border-radium text-radium' : 'border-gray-500 text-gray-400'}`}>
            {displayType}
          </span>
          <span className="text-gray-500">• {timeAgo}</span>
        </div>
        <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors bg-[#242424] px-3 py-1.5 rounded-full">
          <Share2 size={14} />
          Share
        </button>
      </div>

      {/* Question / Title */}
      <h3 className="text-white font-bold text-lg mb-5 leading-snug pr-2">{title}</h3>

      {/* Options List */}
      <div className="space-y-3 flex-1">
        {pollOptions?.map((opt, i) => {
          const percent = totalVotes > 0 ? Math.round((opt.votesCount / totalVotes) * 100) : 0;
          const isActive = opt.isActive || false;
          const hasImage = opt.imageUrl && opt.imageUrl.trim() !== "";

          return (
            <div 
              key={opt._id || i} 
              onClick={() => onVote && onVote(opt.index)}
              className={`relative bg-[#242424] border border-[#333] rounded-lg overflow-hidden ${hasImage ? 'h-16' : 'h-12'} flex items-center pl-1 pr-2 z-10 w-full group cursor-pointer transition-all`}
            >
              {/* Progress Fill */}
              <div 
                className={`absolute left-0 top-0 bottom-0 z-[-1] transition-all duration-1000 ease-out ${isActive ? 'bg-radium/10' : 'bg-charcoal/30'}`} 
                style={{ width: `${percent}%` }}
              ></div>

              {/* Bottom active line indicator inside track */}
              {isActive && (
                 <div className="absolute left-0 bottom-0 h-[2px] bg-radium shadow-[0_0_8px_rgba(204,255,0,0.8)] z-0" style={{ width: `${percent}%` }}></div>
              )}

              <div className="flex items-center gap-2 w-full z-10 font-medium">
                {/* Large square image with small gap from the border */}
                 {hasImage ? (
                   <div 
                     className="relative w-12 h-12 rounded-md overflow-hidden shrink-0 border border-gray-700 ml-0.5 cursor-zoom-in"
                     onClick={(e) => {
                       e.stopPropagation(); // Prevents triggering the option's vote click
                       const highResUrl = opt.imageUrl.replace('w=100', 'w=1200');
                       setPreviewUrl(highResUrl);
                       setIsPreviewVisible(true);
                     }}
                   >
                     <Image 
                       src={opt.imageUrl} 
                       alt={opt.content || "Option image"} 
                       width={48} 
                       height={48} 
                       className="w-full h-full object-cover" 
                     />
                   </div>
                 ) : null}

                <span className={`text-sm truncate flex-1 ${isActive ? 'text-radium' : 'text-gray-300'}`}>{opt.content}</span>
                
                <div className="flex items-center gap-3 ml-2 shrink-0">
                  <span className="text-xs text-gray-400">{opt.votesCount} votes</span>
                  <span className={`text-sm font-bold ${isActive ? 'text-radium' : 'text-gray-400'}`}>{percent}%</span>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${isActive ? 'border-radium' : 'border-gray-500'}`}>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-radium"></div>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#333] text-xs text-gray-500 font-medium">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <UsersIcon size={14} />
            {totalVotes} votes
          </div>
          <div className="hidden sm:block">Target: {gender}</div>
        </div>
        <button 
          onClick={onDelete}
          className="hover:text-red-400 text-gray-400 transition-colors uppercase tracking-wider font-bold"
        >
          Remove
        </button>
      </div>
      {isPreviewVisible && (
       <ImagePreviewOverlay 
         set_is_preview_visible={setIsPreviewVisible} 
         imgPreviewLink={previewUrl} 
       />
      )}
    </div>
  );
}