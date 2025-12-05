import { BarChart3, Paperclip } from "lucide-react"
import { IoSend } from "react-icons/io5";


export default function ChatInput() {
  return (
    <footer className="sticky bottom-0 z-10 px-4 py-3 bg-background border-t border-border shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-3">
        {/* Input container with icons inside */}
        <div className="flex-1 flex items-center gap-2 px-4 py-2.5 bg-muted rounded-full border border-border focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200">
          {/* Poll creation icon */}
          <button className="p-1.5 rounded-full hover:bg-background/80 transition-colors duration-200">
            <BarChart3 className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* Input field */}
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />

          {/* File upload icon */}
          <button className="p-1.5 rounded-full hover:bg-background/80 transition-colors duration-200">
            <Paperclip className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Send button */}
        <button className="px-3 py-3  text-primary-foreground rounded-full hover:bg-primary/90 active:scale-95 transition-all duration-200 shadow-md bg-[#02b344]">
        <IoSend className="w-5 h-5 "/>
        </button>
      </div>
    </footer>
  )
}