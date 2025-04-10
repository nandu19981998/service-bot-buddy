
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileIcon, DatabaseIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { KnowledgeEntry, downloadProcessedEntries, importToKnowledgeBase } from '@/utils/knowledgeBaseUtils';

interface PreviewDialogProps {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  processedEntries: KnowledgeEntry[];
  setProcessedEntries: (entries: KnowledgeEntry[]) => void;
  onKnowledgeBaseUpdate: () => void;
}

const PreviewDialog: React.FC<PreviewDialogProps> = ({
  showDialog,
  setShowDialog,
  processedEntries,
  setProcessedEntries,
  onKnowledgeBaseUpdate
}) => {
  const handleImport = () => {
    importToKnowledgeBase(
      processedEntries,
      setShowDialog,
      setProcessedEntries,
      onKnowledgeBaseUpdate
    );
  };

  const handleDownload = () => {
    downloadProcessedEntries(processedEntries, setShowDialog);
  };

  return (
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
              onClick={handleDownload}
            >
              <FileIcon className="mr-2 h-4 w-4" />
              Download JSON
            </Button>
            <Button
              type="button"
              onClick={handleImport}
            >
              <DatabaseIcon className="mr-2 h-4 w-4" />
              Import to Knowledge Base
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewDialog;
