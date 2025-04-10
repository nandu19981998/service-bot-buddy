
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendIcon } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ServiceHeader from './ServiceHeader';
import { searchKnowledgeBase, getDefaultResponse } from './KnowledgeBase';

interface Message {
  text: string;
  isBot: boolean;
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      text: "Hello! I'm your Service Bot Buddy. I can help you with product information, troubleshooting, maintenance, and more. How can I assist you today?", 
      isBot: true 
    }
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { text: inputValue, isBot: false }]);
    setInputValue('');
    setIsTyping(true);
    
    // Simulate bot response delay
    setTimeout(() => {
      const response = getBotResponse(inputValue);
      setMessages(prev => [...prev, { text: response, isBot: true }]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const getBotResponse = (query: string): string => {
    const knowledgeEntry = searchKnowledgeBase(query);
    
    if (knowledgeEntry) {
      return knowledgeEntry.answer;
    }
    
    return getDefaultResponse();
  };

  const resetChat = () => {
    setMessages([
      { 
        text: "Hello! I'm your Service Bot Buddy. I can help you with product information, troubleshooting, maintenance, and more. How can I assist you today?", 
        isBot: true 
      }
    ]);
  };

  return (
    <div className="flex flex-col w-full h-full border rounded-lg shadow-lg overflow-hidden bg-white">
      <ServiceHeader resetChat={resetChat} />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <ChatMessage 
            key={index} 
            message={message.text} 
            isBot={message.isBot} 
          />
        ))}
        
        {isTyping && <ChatMessage message="" isBot={true} isTyping={true} />}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-3 border-t">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex space-x-2"
        >
          <Input
            type="text"
            placeholder="Ask about our products or services..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <SendIcon className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;
