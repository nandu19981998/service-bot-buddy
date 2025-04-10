
import React, { useState } from 'react';
import { MessageSquareIcon, InfoIcon, DatabaseIcon, FileIcon, AlertCircleIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { processWordDocument, saveKnowledgeEntriesToFile } from '@/utils/wordToJson';
import { parseImportedData, loadExternalKnowledgeBase } from './KnowledgeBase';
import { toast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ServiceHeaderProps {
  resetChat: () => void;
}

const ServiceHeader: React.FC<ServiceHeaderProps> = ({ resetChat }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [processedEntries, setProcessedEntries] = useState<any[]>([]);
  
  const handleWordFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Only accept .docx files
    if (!file.name.endsWith('.docx')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a Word (.docx) document.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsProcessing(true);
      toast({
        title: "Processing document",
        description: "Please wait while we process your Word document...",
      });
      
      // Process the Word document
      const entries = await processWordDocument(file);
      
      if (entries.length > 0) {
        setProcessedEntries(entries);
        setShowDialog(true);
        toast({
          title: "Document processed successfully",
          description: `Found ${entries.length} potential knowledge entries.`,
        });
      } else {
        toast({
          title: "No entries found",
          description: "Couldn't extract any question-answer pairs from the document.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error processing Word document:", error);
      toast({
        title: "Processing failed",
        description: "Failed to process the Word document. Please check the format.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      // Reset the file input
      e.target.value = '';
    }
  };
  
  const handleImportToKnowledgeBase = () => {
    if (processedEntries.length > 0) {
      // Load the entries into the knowledge base
      loadExternalKnowledgeBase(processedEntries);
      setShowDialog(false);
      
      toast({
        title: "Knowledge base updated",
        description: `Added ${processedEntries.length} entries to the knowledge base.`,
      });
      
      // Reset the processed entries
      setProcessedEntries([]);
    }
  };
  
  const handleDownloadJson = () => {
    if (processedEntries.length > 0) {
      saveKnowledgeEntriesToFile(processedEntries);
      setShowDialog(false);
    }
  };

  return (
    <>
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
                Import JSON Knowledge
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => document.getElementById('word-file')?.click()} disabled={isProcessing}>
                Convert Word Document
              </DropdownMenuItem>
              <DropdownMenuSeparator />
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
      
      {/* Hidden file inputs */}
      <input
        type="file"
        id="knowledge-file"
        accept=".json,.txt"
        className="hidden"
        onChange={(e) => {
          // This is handled by the existing code in ChatBot.tsx
          const event = new Event('change', { bubbles: true });
          document.getElementById('knowledge-file')?.dispatchEvent(event);
        }}
      />
      <input
        type="file"
        id="word-file"
        accept=".docx"
        className="hidden"
        onChange={handleWordFile}
      />
      
      {/* Dialog for previewing and confirming Word document processing */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Document Processed</DialogTitle>
            <DialogDescription>
              Successfully extracted {processedEntries.length} entries from your Word document.
              Would you like to add these to your knowledge base or download as JSON?
            </DialogDescription>
          </DialogHeader>
          
          <div className="max-h-[300px] overflow-y-auto border rounded p-3 my-3">
            {processedEntries.slice(0, 5).map((entry, index) => (
              <div key={index} className="mb-3 pb-3 border-b last:border-0">
                <p className="font-medium text-sm">{entry.question}</p>
                <p className="text-xs text-muted-foreground mt-1">{entry.answer.substring(0, 100)}...</p>
              </div>
            ))}
            {processedEntries.length > 5 && (
              <p className="text-sm text-muted-foreground italic">
                + {processedEntries.length - 5} more entries
              </p>
            )}
          </div>
          
          <DialogFooter className="sm:justify-start">
            <div className="flex space-x-2 w-full justify-between">
              <Button
                type="button"
                variant="secondary"
                onClick={handleDownloadJson}
              >
                <FileIcon className="mr-2 h-4 w-4" />
                Download JSON
              </Button>
              <Button
                type="button"
                onClick={handleImportToKnowledgeBase}
              >
                <DatabaseIcon className="mr-2 h-4 w-4" />
                Import to Knowledge Base
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ServiceHeader;
