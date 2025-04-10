
import React from 'react';
import { MessageSquareIcon, InfoIcon } from 'lucide-react';

interface ServiceHeaderProps {
  resetChat: () => void;
}

const ServiceHeader: React.FC<ServiceHeaderProps> = ({ resetChat }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-2">
        <MessageSquareIcon className="w-6 h-6 text-primary" />
        <h1 className="text-xl font-semibold">Service Bot Buddy</h1>
      </div>
      <button 
        onClick={resetChat}
        className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <InfoIcon className="w-4 h-4 mr-1" />
        New Chat
      </button>
    </div>
  );
};

export default ServiceHeader;
