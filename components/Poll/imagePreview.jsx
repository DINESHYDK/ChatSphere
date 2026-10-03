import { X } from "lucide-react";

export default function ImagePreviewOverlay({
  setIsPreviewVisible,
  imgPreviewLink,
}) {
  return (
    setIsPreviewVisible && (
      <div
        className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-lg flex items-center justify-center p-4 md:p-8"
        onClick={() => {
          setIsPreviewVisible(false);
        }}
      >
        <div
          className="relative max-w-4xl max-h-[85vh] w-full flex items-center justify-center"
        >
          <img
            src={imgPreviewLink}
            alt="Preview"
            className="max-w-full max-h-[80vh] w-auto h-auto object-contain rounded-xl border border-[#333] shadow-[0_0_40px_rgba(0,0,0,0.9)] bg-[#1A1A1A]"
          />

          <button
            className="absolute -top-3 -right-3 md:top-3 md:right-3 bg-[#1A1A1A] hover:bg-[#242424] text-radium border border-radium/40 hover:border-radium rounded-full w-10 h-10 flex items-center justify-center transition-all shadow-[0_0_15px_rgba(204,255,0,0.3)] z-10"
            aria-label="Close preview"
            onClick={() => setIsPreviewVisible(false)}
          >
            <X size={20} />
          </button>
        </div>
      </div>
    )
  );
}
