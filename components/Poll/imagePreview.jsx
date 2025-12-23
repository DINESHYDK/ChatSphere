import { X } from "lucide-react";
export default function ImagePreviewOverlay({
  set_is_preview_visible,
  imgPreviewLink,
}) {
  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-md flex items-center justify-center"
      onClick={() => set_is_preview_visible(false)}
    >
      <div className="relative w-full h-full flex items-center justify-center p-4">
        <img
          src={imgPreviewLink}
          alt="Preview"
          className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />

        <button
          className="absolute top-6 right-6 bg-white/90 hover:bg-white text-black rounded-full w-11 h-11 flex items-center justify-center text-xl transition-all backdrop-blur-sm shadow-lg"
          aria-label="Close preview"
          onClick={() => set_is_preview_visible(false)}
        >
          <X></X>
        </button>
      </div>
    </div>
  );
}
