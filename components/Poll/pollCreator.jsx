import react, { useState } from "react";
import { X, Plus, CloudCog, Minus, ImagePlus } from "lucide-react";
import { toast } from "react-toastify";
import pollStore from "@/store/pollStore";
import devLog from "@/utils/logger";

const form_alerts = [
  "• Atleast 2 options are required !!",
  "• Maximum 6 options allowed !!",
  "• Please fill the above options first",
  "• All options are compulsary.",
];

export default function PollCreator({ isOpen = true }) {
  const { uploadPollImages, savePoll } = pollStore(); // ─── State to trigger API ──────────────────
  const [isSavingPoll, setIsSavingPoll] = useState(false);
  const [gender, setGender] = useState("A");
  const [info, setInfo] = useState({
    title: "",
    gender: gender,
    options: [
      {
        id: 0,
        text: "",
        image: "",
      },
      {
        id: 1,
        text: "",
        image: "",
      },
    ],
  });

  const [alert_idx, set_alert_idx] = useState(-1);

  // ─── Function to choose gender ──────────────────
  function setColorAndBg(G) {
    if (gender === G) return "text-white bg-[#6A89A7] hover:bg-[#204D7D]";
    return "text-black bg-white";
  }

  // ─── Function to finally  submit the Poll ──────────────────
  const handleSubmit = async (e) => {
    try {
      setIsSavingPoll(true);
      e.preventDefault();
      if (info.options.length < 2 || info.options.length > 6) return;
      for (let option of info.options) {
        if (option.text === "") return;
      }
      if (info.title === "") return;
      await uploadPollImages(info);
      await savePoll(info);
    } catch (err) {
      devLog("Error while saving poll", err);
    } finally {
      setIsSavingPoll(false);
    }
  };

  // ─── Function to handle inc/dec of options  ──────────────────
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
                text: "",
                image: "",
              },
            ]
          : info.options.slice(0, -1);
      setInfo({ ...info, options });
      return;
    }
    set_alert_idx(len === MAX_LIMIT ? 1 : 0);

    setTimeout(() => {
      set_alert_idx(-1);
    }, 2000);
  }

  // ─── Function to handle Input poll Images ──────────────────
  function handleFileInputChange(e, idx) {
    const file = e.target.files[0];
    if (
      !file.name.endsWith("png") &&
      !file.name.endsWith("webp") &&
      !file.name.endsWith("jpeg")
    )
      return;
    console.log("done");
    setInfo({
      ...info,
      options: info.options.map((item, i) =>
        idx === i ? { ...item, image: file } : item
      ),
    });
  }

  return (
    // Semi-transparent dark overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      {/* White rounded box with shadow */}
      <div className="w-full max-w-md bg-background rounded-2xl shadow-2xl overflow-hidden">
        {/* Header with close button */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Create Poll</h2>
          <button className="p-1.5 rounded-full hover:bg-muted transition-colors duration-200">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit}>
          <div className="px-5 py-4 space-y-5">
            {/* Poll title input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Poll Title
              </label>
              <input
                type="text"
                spellCheck={false}
                placeholder="Enter your question..."
                className="w-full px-4 py-3 bg-muted rounded-xl border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                required
                value={info.title}
                onChange={(e) => setInfo({ ...info, title: e.target.value })}
              />
            </div>

            {/* Participant selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Who can participate?
              </label>{" "}
              <br />
              <div className="flex gap-2">
                <button
                  className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border border-border ${setColorAndBg("A")}`}
                  onClick={() => setGender("A")}
                  type="button"
                >
                  All
                </button>
                <button
                  className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border border-border ${setColorAndBg("B")}`}
                  onClick={() => setGender("B")}
                  type="button"
                >
                  Boys
                </button>
                <button
                  className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium  transition-all duration-200 border border-border ${setColorAndBg("G")}`}
                  onClick={() => setGender("G")}
                  type="button"
                >
                  Girls
                </button>
              </div>
            </div>

            {/* Poll options */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Options
              </label>

              <div className="space-y-2.5">
                {info?.options.map((option, idx) => (
                  <div className="relative" key={idx}>
                    <input
                      type="text"
                      spellCheck={false}
                      placeholder={`Option ${idx + 1}`}
                      className="w-full px-4 py-2.5 bg-muted rounded-xl border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-sm"
                      value={info.options[idx]?.text}
                      onChange={(e) =>
                        setInfo({
                          ...info,
                          options: info.options.map((item, i) =>
                            idx === i ? { ...item, text: e.target.value } : item
                          ),
                        })
                      }
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      <input
                        type="file"
                        id={`input-${idx}`}
                        onChange={(e) => handleFileInputChange(e, idx)}
                        accept="image/png, image/jpeg, image/webp" // Client-side format filter
                        multiple={false} // Only allow one file for a poll option
                        className="hidden" // Hides the default input
                      />
                      <label htmlFor={`input-${idx}`}>
                        <ImagePlus className="w-5 h-5 cursor-pointer"></ImagePlus>
                      </label>
                    </button>
                  </div>
                ))}
                {alert_idx > -1 && (
                  <p className="mt-2 text-sm text-red-600 font-medium">
                    {form_alerts[alert_idx]}
                  </p>
                )}
                <div className="flex justify-between gap-2 text-muted-foreground">
                  <Minus
                    className="w-6 h-6"
                    onClick={() => handlePMLogic(-1)}
                  />
                  <Plus className="w-6 h-6" onClick={() => handlePMLogic(+1)} />
                </div>
              </div>
            </div>
          </div>

          <div className="px-5 py-4 border-t border-border bg-muted/30">
            <button type={"submit"} className="authSubmitBtn">
              Submit Poll
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
