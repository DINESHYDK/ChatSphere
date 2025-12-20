import React, { useState } from "react";
import ChatHeader from "@/components/Chat/ChatHeader";
import ChatInput from "@/components/Chat/ChatInput";
import ChatMessages from "@/components/Chat/ChatMessages";
import PollCreator from "@/components/Poll/pollCreator";

const Test = () => {
  const [is_poll_visible, set_is_poll_visible] = useState(false);

  return (
    <>
      <div className="flex flex-col h-screen">
        {is_poll_visible && (
          <PollCreator set_is_poll_visible={set_is_poll_visible} />
        )}
        <ChatHeader/>
        <ChatMessages />
        <ChatInput set_is_poll_visible={set_is_poll_visible} />
      </div>
    </>
  );
};

export default Test;
