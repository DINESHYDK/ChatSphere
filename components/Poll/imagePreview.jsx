// export default function ImagePreviewOverlay({imgPreviewLink}) {
//   return (
//     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
//       <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
//         <img
//           src={imgPreviewLink}
//           alt="Preview"
//           className="w-full h-full object-contain rounded-2xl shadow-2xl"
//         />
//         <button
//           className="absolute top-4 right-4 bg-white/90 hover:bg-white text-black rounded-full w-10 h-10 flex items-center justify-center text-xl font-light transition-colors backdrop-blur-sm shadow-lg"
//           aria-label="Close preview"
//         >
//           ✕
//         </button>
//       </div>
//     </div>
//   );
// }

export default function ImagePreviewOverlay({
  set_is_preview_visible,
  imgPreviewLink,
}) {
  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-md flex items-center justify-center">
      <div className="relative w-full h-full flex items-center justify-center p-4">
        <img
          src={imgPreviewLink}
          alt="Preview"
          className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
        />

        <button
          className="absolute top-6 right-6 bg-white/90 hover:bg-white text-black rounded-full w-11 h-11 flex items-center justify-center text-xl transition-all backdrop-blur-sm shadow-lg"
          aria-label="Close preview"
          onClick={() => set_is_preview_visible(false)}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
