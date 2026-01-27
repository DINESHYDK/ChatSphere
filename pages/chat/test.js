import React, { useState } from "react";
import ChatHeader from "@/components/Chat/ChatHeader";
import ChatInput from "@/components/Chat/ChatInput";
import ChatMessages from "@/components/Chat/ChatMessages";
import PollCreator from "@/components/Poll/pollCreator";
import ImagePreviewOverlay from "@/components/Poll/imagePreview";
import Poll from "@/components/Poll/poll";

const samplePoll = {
  title: "Which college is better ?",
  options: [
    {
      id: "1",
      text: "IIT(ISM) Dhanbad",
      avatarUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLat8bZvhXD3ChSXyzGsFVh6qgplm1KhYPKA&s",
      avatarAlt: "Option 1",
    },
    {
      id: "2",
      text: "National Insdititute of technology kurukshetra",
      avatarUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLat8bZvhXD3ChSXyzGsFVh6qgplm1KhYPKA&s",
      avatarAlt: "Option 2",
    },
    {
      id: "3",
      text: "IIT Delhi",
      avatarUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLat8bZvhXD3ChSXyzGsFVh6qgplm1KhYPKA&s",
      avatarAlt: "Option 3",
    },
    {
      id: "4",
      text: "IIT Mahendragarh",
      avatarUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLat8bZvhXD3ChSXyzGsFVh6qgplm1KhYPKA&s",
      avatarAlt: "Option 4",
    },
  ],
};

const Test = () => {
  const [is_poll_visible, set_is_poll_visible] = useState(false);
  const [imgPreviewLink, setImgPreviewLink] = useState("");
  const [is_preview_visible, set_is_preview_visible] = useState(true); // *** Is previewImage component visible? ***
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
        <Poll title={samplePoll.title} options={samplePoll.options} />
        <ChatInput
          is_poll_visible={is_poll_visible}
          set_is_poll_visible={set_is_poll_visible}
        />
      </div>
    </>
  );
};

export default Test;
