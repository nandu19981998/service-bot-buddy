
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendIcon, UploadIcon, DatabaseIcon } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ServiceHeader from './ServiceHeader';
import { 
  searchKnowledgeBase, 
  getDefaultResponse, 
  parseImportedData, 
  loadExternalKnowledgeBase,
  getKnowledgeBaseStats 
} from './KnowledgeBase';
import { toast } from '@/hooks/use-toast';
import { Badge } from "@/components/ui/badge";

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
  const [kbStats, setKbStats] = useState(() => getKnowledgeBaseStats());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Only allow text or JSON files for simplicity
    if (file.type !== 'application/json' && !file.type.startsWith('text/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JSON file containing your knowledge base data.",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const parsedData = parseImportedData(result);
        
        if (parsedData.length > 0) {
          const entriesAdded = loadExternalKnowledgeBase(parsedData);
          
          // Update knowledge base stats
          setKbStats(getKnowledgeBaseStats());
          
          toast({
            title: "Knowledge base updated",
            description: `Added ${entriesAdded} entries to the knowledge base.`,
            variant: "default"
          });
          
          setMessages(prev => [...prev, { 
            text: `I've learned ${entriesAdded} new topics! Ask me about them.`, 
            isBot: true 
          }]);
        } else {
          toast({
            title: "No data found",
            description: "The file didn't contain any valid knowledge base entries.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error processing file:", error);
        toast({
          title: "Error processing file",
          description: "Please check that your file is properly formatted.",
          variant: "destructive"
        });
      }
    };
    
    reader.readAsText(file);
    
    // Reset the file input so the same file can be uploaded again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Called by ServiceHeader when word document is processed
  const handleKnowledgeBaseUpdate = () => {
    setKbStats(getKnowledgeBaseStats());
  };

  return (
    <div className="flex flex-col w-full h-full border rounded-lg shadow-lg overflow-hidden bg-white">
      <ServiceHeader resetChat={resetChat} onKnowledgeBaseUpdate={handleKnowledgeBaseUpdate} />
      
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
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json,.txt"
              className="hidden"
              id="knowledge-file"
            />
            <label 
              htmlFor="knowledge-file" 
              className="flex items-center text-sm text-primary cursor-pointer hover:text-primary/80 transition-colors"
            >
              <UploadIcon className="h-4 w-4 mr-1" />
              Import Knowledge Base
            </label>
          </div>
          
          <div className="flex items-center">
            <DatabaseIcon className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-xs text-muted-foreground mr-2">Knowledge Base:</span>
            <Badge variant="outline" className="text-xs bg-primary/10">
              {kbStats.total} Entries
            </Badge>
            {kbStats.imported > 0 && (
              <Badge variant="outline" className="ml-1 text-xs bg-green-100 text-green-800">
                {kbStats.imported} Imported
              </Badge>
            )}
          </div>
        </div>
        
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
