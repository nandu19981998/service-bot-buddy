
import React, { useState } from 'react';
import { MessageSquareIcon, InfoIcon } from 'lucide-react';
import { getKnowledgeBaseStats } from './KnowledgeBase';
import { handleWordFileProcessing } from '@/utils/knowledgeBaseUtils';
import KnowledgeMenu from './knowledge/KnowledgeMenu';
import PreviewDialog from './knowledge/PreviewDialog';
import KnowledgeStatusBadge from './knowledge/KnowledgeStatusBadge';

interface ServiceHeaderProps {
  resetChat: () => void;
  onKnowledgeBaseUpdate: () => void;
}

const ServiceHeader: React.FC<ServiceHeaderProps> = ({ resetChat, onKnowledgeBaseUpdate }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [processedEntries, setProcessedEntries] = useState<any[]>([]);
  const [stats, setStats] = useState(() => getKnowledgeBaseStats());
  
  const handleWordFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    await handleWordFileProcessing(file, setIsProcessing, setProcessedEntries, setShowDialog);
    
    // Reset the file input
    e.target.value = '';
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <MessageSquareIcon className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-semibold">Service Bot Buddy</h1>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <KnowledgeStatusBadge importedCount={stats.imported} />
          </div>
        
          <KnowledgeMenu 
            isProcessing={isProcessing}
            onWordFileClick={() => document.getElementById('word-file')?.click()}
            onKnowledgeFileClick={() => document.getElementById('knowledge-file')?.click()}
          />
          
          <button 
            onClick={resetChat}
            className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <InfoIcon className="w-4 h-4 mr-1" />
            New Chat
          </button>
        </div>
      </div>
      
      {/* Hidden file inputs */}
      <input
        type="file"
        id="word-file"
        accept=".docx"
        className="hidden"
        onChange={handleWordFile}
      />
      
      {/* Dialog for previewing and confirming Word document processing */}
      <PreviewDialog
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        processedEntries={processedEntries}
        setProcessedEntries={setProcessedEntries}
        onKnowledgeBaseUpdate={onKnowledgeBaseUpdate}
      />
    </>
  );
};

export default ServiceHeader;
