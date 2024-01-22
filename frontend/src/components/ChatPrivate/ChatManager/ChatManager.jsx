// ChatManager
import React, { useState, forwardRef, useImperativeHandle } from "react";
import ChatWebSocket from "../ChatWebSocket/ChatWebSocket";
import "./ChatManager.css";

const ChatManager = forwardRef((props, ref) => {
  const [openChats, setOpenChats] = useState([]);

  const openNewChat = (userId) => {
    if (!openChats.some((chat) => chat.userId === userId)) {
      setOpenChats([...openChats, { userId, isMinimized: false }]);
    }
  };

  const toggleMinimizeChat = (userId) => {
    setOpenChats(
      openChats.map((chat) =>
        chat.userId === userId
          ? { ...chat, isMinimized: !chat.isMinimized }
          : chat
      )
    );
  };

  const closeChat = (userId) => {
    setOpenChats(openChats.filter((chat) => chat.userId !== userId));
  };
  useImperativeHandle(ref, () => ({
    openNewChat,
  }));

  return (
    <div className="chat-container">
      {openChats.map((chat, index) => (
        <ChatWebSocket
          key={chat.userId}
          userId={chat.userId}
          isMinimized={chat.isMinimized}
          onClose={() => closeChat(chat.userId)}
          onMinimize={() => toggleMinimizeChat(chat.userId)}
          style={{ right: `${index * 320}px`, bottom: "10px" }}
        />
      ))}
    </div>
  );
});

export default ChatManager;
