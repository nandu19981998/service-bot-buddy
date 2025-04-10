
import React from 'react';
import { DatabaseIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface KnowledgeMenuProps {
  isProcessing: boolean;
  onWordFileClick: () => void;
  onKnowledgeFileClick: () => void;
}

const KnowledgeMenu: React.FC<KnowledgeMenuProps> = ({
  isProcessing,
  onWordFileClick,
  onKnowledgeFileClick
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
          <DatabaseIcon className="w-4 h-4 mr-1" />
          Knowledge Base
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onKnowledgeFileClick}>
          Import JSON Knowledge
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onWordFileClick} disabled={isProcessing}>
          Convert Word Document {isProcessing && '(Processing...)'}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => alert("Export functionality would be implemented here")}>
          Export Current Knowledge
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default KnowledgeMenu;
