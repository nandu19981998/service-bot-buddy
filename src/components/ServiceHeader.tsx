
import React from 'react';
import { MessageSquareIcon, InfoIcon, DatabaseIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
      <div className="flex items-center space-x-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
              <DatabaseIcon className="w-4 h-4 mr-1" />
              Knowledge Base
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => document.getElementById('knowledge-file')?.click()}>
              Import Knowledge
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert("Export functionality would be implemented here")}>
              Export Current Knowledge
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <button 
          onClick={resetChat}
          className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <InfoIcon className="w-4 h-4 mr-1" />
          New Chat
        </button>
      </div>
    </div>
  );
};

export default ServiceHeader;
