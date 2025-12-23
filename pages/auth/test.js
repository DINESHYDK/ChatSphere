import React, { useState } from "react";
import ChatHeader from "@/components/Chat/ChatHeader";
import ChatInput from "@/components/Chat/ChatInput";
import ChatMessages from "@/components/Chat/ChatMessages";
import PollCreator from "@/components/Poll/pollCreator";
import ImagePreviewOverlay from "@/components/Poll/imagePreview";

const Test = () => {
  const [is_poll_visible, set_is_poll_visible] = useState(false);
  const [imgPreviewLink, setImgPreviewLink] = useState("");
  const [is_preview_visible, set_is_preview_visible] = useState(true);
  // console.log(imgPreviewLink);
  return (
    <>
      <div className="flex flex-col h-screen">
        {imgPreviewLink != "" && is_preview_visible && (
          <ImagePreviewOverlay
            imgPreviewLink={imgPreviewLink}
            set_is_preview_visible={set_is_preview_visible}
          />
        )}
        {is_poll_visible && (
          <PollCreator
            set_is_poll_visible={set_is_poll_visible}
            setImgPreviewLink={setImgPreviewLink}
            set_is_preview_visible={set_is_preview_visible}
          />
        )}
        <ChatHeader />
        <ChatMessages />
        <ChatInput set_is_poll_visible={set_is_poll_visible} />
      </div>
    </>
  );
};

export default Test;
