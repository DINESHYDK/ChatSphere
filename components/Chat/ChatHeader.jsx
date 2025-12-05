import { IoVideocamOutline } from "react-icons/io5";
import { MdOutlinePhone } from "react-icons/md";
import { FiMoreVertical } from "react-icons/fi";


export default function ChatHeader() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-2 py-2 bg-background border-b border-border shadow-sm">
      {/* User info section */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src="/images/default-woman.png"
            alt="Sarah Johnson"
            className="h-11 rounded-full  "
          />
          {/* Online status indicator */}
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-background rounded-full" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-base font-semibold text-foreground">
            Sarah Johnson
          </h2>
          <span className="text-xs text-emerald-500 font-medium">Online</span>
        </div>
      </div>

      {/* Action icons */}
      <div className="flex items-center gap-0">
        <button className="p-2.5 rounded-full hover:bg-muted transition-colors duration-200">
            <MdOutlinePhone className="w-6 h-6"/>
        </button>
        <button className="p-2.5 rounded-full hover:bg-muted transition-colors duration-200">
            <IoVideocamOutline className="w-7 h-7"/>
        </button>
        <button className="p-2.5 rounded-full hover:bg-muted transition-colors duration-200">
            <FiMoreVertical className="w-5 h-6"/>
        </button>
      </div>
    </header>
  );
}
