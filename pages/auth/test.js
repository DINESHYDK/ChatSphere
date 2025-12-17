import React from "react";
import ChatHeader from "@/components/Chat/ChatHeader";
import ChatInput from "@/components/Chat/ChatInput";
import ChatMessages from "@/components/Chat/ChatMessages";
const Test = () => {
  return (
    <>
      <div className="flex flex-col h-screen">
        <ChatHeader />
        <ChatMessages />
        <ChatInput />
      </div>
    </>
  );
};

export default Test;
