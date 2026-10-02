import react, { useState } from "react";
import { X, Plus, Minus, ImagePlus } from "lucide-react";
import { toast } from "react-toastify";
import pollStore from "@/store/pollStore";
import devLog from "@/utils/logger";
import isValidImage from "@/utils/isImageValid";

const form_alerts = [
  "• Atleast 2 options are required !!",
  "• Maximum 6 options allowed !!",
  "• Enter a valid image !!"
];
const isValid = (info) => {
  return (
    info.title.trim != "" &&
    info.options.length >= 2 &&
    info.options.length <= 6 &&
    info.options.every((option) => option.content.trim != "")
  );
};

export default function PollCreator({
  // setIsPollVisible,
  // setImgPreviewLink, // ─── State for providing blob for image ──────────────────
  // setIsPreviewVisible, // ─── Is preview section visible ? ──────────────────
}) {
  const {
    // info, setInfo,
    setIsPollVisible,
    setImgPreviewLink,
    setIsPreviewVisible,
    uploadPollImages, 
    savePoll,
    set_is_saving_poll, 
    handleSubmit,
    // handlePMLogic,
    // handleFileInputChange
  } = pollStore()

  // const { uploadPollImages, savePoll, set_is_saving_poll } = pollStore(); // ─── State to trigger API ──────────────────
  const [info, setInfo] = useState({
    title: "",
    gender: "A",
    options: [
      {
        id: 0,
        content: "",
        imageUrl: "",
        rawFile: null,
        blobURL: "",
      },
      {
        id: 1,
        content: "",
        imageUrl: "",
        rawFile: null,
        blobURL: "",
      },
    ],
  });

  const [alert_idx, set_alert_idx] = useState(-1);

  // ─── Function to choose gender ──────────────────
  function setColorAndBg(G) {
    if (info.gender === G) return "text-white bg-[#6A89A7]";
    return "text-black bg-white";
  }

  // ─── Function to finally  submit the Poll ──────────────────
  // const handleSubmit = async (e) => {
  //   try {
  //     e.preventDefault();
  //     set_is_saving_poll(true);

  //     setIsPollVisible(false); // ─── Removing CREATE_POLL page ──────────────────

  //     await uploadPollImages(info); // ─── Upload poll Images on cloudiary ──────────────────
  //     await savePoll(info); // ─── Saving poll in DB ──────────────────
  //     console.log('done');
  //   } catch (err) {
  //     devLog("Error while saving poll", err);
  //   } finally {
  //     set_is_saving_poll(false);
  //   }
  // };

  // ─── Function to handle plus/minus of options  ──────────────────
  function handlePMLogic(val) {
    const MAX_LIMIT = 6,
      MIN_LIMIT = 2;

    let len = info.options.length;
    let is_min_limit = len === MIN_LIMIT && val === -1;
    let is_max_limit = len === MAX_LIMIT && val === +1;

    if (!is_min_limit && !is_max_limit) {
      const sz = info.options.length;
      set_alert_idx(-1);
      const options =
        val === +1
          ? [
              ...info.options,
              {
                id: sz,
                content: "",
                imageUrl: "",
                rawFile: null,
              },
            ]
          : info.options.slice(0, -1);
      setInfo((prev) => ({ ...prev, options }));
      return;
    }
    set_alert_idx(len === MAX_LIMIT ? 1 : 0);

    setTimeout(() => {
      set_alert_idx(-1);
    }, 1000);
  }

  // ─── Function to handle Input poll Imag es ──────────────────
  async function handleFileInputChange(e, idx) {
    const file = e.target.files[0];
    let isImageValid = await isValidImage(file);
    if (!isImageValid) {
       set_alert_idx(); 
       setTimeout(() => {
         set_alert_idx(2);
       }, 1000); 
      return
    }
      // return; // ─── Checking signature for file ──────────────────

    const imgBlobURL = URL.createObjectURL(new Blob([file]));
    setInfo((prev) => ({
      ...prev,
      options: prev.options.map((item, i) =>
        idx === i ? { ...item, rawFile: file, blobURL: imgBlobURL } : item,
      ),
    }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <form onSubmit={(e) => { e.preventDefault(); }} className="bg-[#1A1A1A] border border-[var(--charcoal-border,#333)] rounded-xl p-6 w-full max-w-full md:max-w-[500px] shadow-lg relative max-h-[90vh] overflow-y-auto">
        <button type="button" onClick={() => setIsPollVisible(false)} className="absolute right-6 top-6 text-gray-500 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-5 pr-8">
          <svg className="text-radium drop-shadow-[0_0_8px_rgba(204,255,0,0.5)]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
          <h2 className="font-outfit font-bold text-xl uppercase tracking-wider text-white">Drop a New Poll</h2>
        </div>
        
          <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">WHO CAN VOTE</label>
         <div className="bg-[#242424] p-1 mb-4 rounded-full flex text-[13px] w-full sm:w-auto">
            <button type="button" onClick={() => setInfo(prev => ({...prev, gender: "B"}))} className={`flex-1 sm:flex-none px-4 py-1.5 rounded-full transition-colors ${info.gender === 'B' ? 'bg-radium text-[#121212] font-bold shadow-sm' : 'text-gray-400 font-medium hover:text-white'}`}>Boys</button>
            <button type="button" onClick={() => setInfo(prev => ({...prev, gender: "G"}))} className={`flex-1 sm:flex-none px-4 py-1.5 rounded-full transition-colors ${info.gender === 'G' ? 'bg-radium text-[#121212] font-bold shadow-sm' : 'text-gray-400 font-medium hover:text-white'}`}>Girls</button>
            <button type="button" onClick={() => setInfo(prev => ({...prev, gender: "A"}))} className={`flex-1 sm:flex-none px-4 py-1.5 rounded-full transition-colors ${info.gender === 'A' ? 'bg-radium text-[#121212] font-bold shadow-sm' : 'text-gray-400 font-medium hover:text-white'}`}>All</button>
          </div>

        <div className="mb-4">
          <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Poll Question</label>
          <input 
            type="text"
            spellCheck={false}
            placeholder="Enter your question..."
            className="w-full bg-[#242424] border border-[#333] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-radium transition-colors"
            required
            value={info.title ?? ""}
            onChange={(e) => setInfo((prev) => ({ ...prev, title: e.target.value }))}
          />
        </div>

        <div className="space-y-3 mb-4">
          {info?.options.map((option, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-[#242424] border border-[#333] rounded-lg p-3 group hover:border-[#444] transition-colors relative">
              
              {/* Image Preview Thumbnail */}
              {info.options[idx].rawFile && (
                <div
                  className="absolute left-[-8px] top-[-8px] z-20 flex items-center justify-center cursor-pointer shadow-[0_0_10px_rgba(0,0,0,0.5)] rounded-lg border border-[#444] bg-[#242424] mr-3"
                  onClick={() => {
                    setIsPreviewVisible(true);
                    setImgPreviewLink(info.options[idx].blobURL);
                  }}
                >
                  <img
                    src={info.options[idx].blobURL}
                    alt="Preview"
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white shadow-sm border border-background cursor-pointer hover:bg-red-600 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setInfo((prev) => ({
                        ...prev,
                        options: prev.options.map((opt, i) =>
                          idx === i ? { ...opt, blobURL: "", rawFile: null } : opt,
                        ),
                      }));
                      setIsPreviewVisible(false);
                      setImgPreviewLink("");
                    }}
                  >
                    <Minus className="w-3 h-3" />
                  </div>
                </div>
              )}

              {/* Upload Icon */}
              <div className="text-gray-400 shrink-0">
                <input
                  type="file"
                  id={`input-${idx}`}
                  onChange={(e) => handleFileInputChange(e, idx)}
                  accept="image/jpg, image/png, image/jpeg, image/webp"
                  multiple={false}
                  className="hidden"
                />
                <label htmlFor={`input-${idx}`} className="cursor-pointer hover:text-white transition-colors">
                  <ImagePlus className="w-[18px] h-[18px]" />
                </label>
              </div>

              {/* Text Input */}
              <input 
                type="text"
                spellCheck={false}
                placeholder={`Option ${idx + 1}`}
                className={`flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none pr-2 ${info.options[idx].blobURL === "" ? "pl-1" : "pl-2"}`}
                value={info.options[idx]?.content ?? ""}
                onChange={(e) =>
                  setInfo((prev) => ({
                    ...prev,
                    options: prev.options.map((item, i) =>
                      idx === i ? { ...item, content: e.target.value } : item,
                    ),
                  }))
                }
                required
              />
            </div>
          ))}
        </div>

        {alert_idx > -1 && (
          <p className="mb-2 text-[11px] text-red-500 font-bold uppercase tracking-wider pl-1">
            {form_alerts[alert_idx]}
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button type="button" onClick={() => handlePMLogic(+1)} className="flex-1 sm:flex-none border border-dashed border-radium text-radium px-4 py-2 rounded-full text-[13px] font-semibold hover:bg-[rgba(204,255,0,0.1)] transition-colors flex items-center justify-center gap-1">
              Add option <Plus size={14} />
            </button>
            <button type="button" onClick={() => handlePMLogic(-1)} className="border border-dashed border-[#555] text-gray-400 px-3 py-2 rounded-full hover:bg-[#242424] hover:text-white transition-colors flex items-center justify-center">
              <Minus size={14} />
            </button>
          </div>
          
         
        </div>

        <div className="border-t border-[#333] mt-6 pt-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-medium text-gray-400">Anonymous</span>
            <div className="w-10 h-6 bg-[#121212] rounded-full flex items-center p-1 border border-[#444]">
              <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
            </div>
          </div>

          <button type="submit" className="border-2 border-radium hover:bg-radium hover:text-[#121212] text-radium px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-all duration-300 uppercase tracking-wider text-[13px] drop-shadow-[0_0_12px_rgba(204,255,0,0.15)] hover:drop-shadow-[0_0_18px_rgba(204,255,0,0.4)]">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
            Launch
          </button>
        </div>
      </form>
    </div>
  );
}
