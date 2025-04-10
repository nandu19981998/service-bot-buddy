
import React from 'react';
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  isTyping?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isBot, isTyping = false }) => {
  return (
    <div className="chat-message-container flex w-full mb-4 animate-in fade-in slide-in-from-bottom-5">
      <div className={cn(
        "p-3 rounded-lg max-w-[85%] shadow-sm",
        isBot ? "bot-message" : "user-message ml-auto"
      )}>
        {isTyping ? (
          <div className="typing-indicator px-2">
            <span></span>
            <span></span>
            <span></span>
          </div>
        ) : (
          <div className="whitespace-pre-line">{message}</div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
