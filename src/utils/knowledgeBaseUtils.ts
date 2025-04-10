
import { toast } from '@/hooks/use-toast';
import { saveKnowledgeEntriesToFile, processWordDocument } from '@/utils/wordToJson';
import { loadExternalKnowledgeBase, getKnowledgeBaseStats } from '../components/KnowledgeBase';

// Types
export interface KnowledgeEntry {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
  category?: string;
}

// Process a Word document file and extract knowledge entries
export const handleWordFileProcessing = async (
  file: File,
  setIsProcessing: (state: boolean) => void,
  setProcessedEntries: (entries: KnowledgeEntry[]) => void,
  setShowDialog: (show: boolean) => void
): Promise<void> => {
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
  }
};

// Import knowledge entries to the knowledge base
export const importToKnowledgeBase = (
  processedEntries: KnowledgeEntry[],
  setShowDialog: (show: boolean) => void,
  setProcessedEntries: (entries: KnowledgeEntry[]) => void,
  onKnowledgeBaseUpdate: () => void
): void => {
  if (processedEntries.length > 0) {
    // Load the entries into the knowledge base
    const entriesAdded = loadExternalKnowledgeBase(processedEntries);
    setShowDialog(false);
    
    // Notify parent component
    onKnowledgeBaseUpdate();
    
    toast({
      title: "Knowledge base updated",
      description: `Added ${entriesAdded} entries to the knowledge base.`,
    });
    
    // Reset the processed entries
    setProcessedEntries([]);
  }
};

// Download processed entries as JSON
export const downloadProcessedEntries = (
  processedEntries: KnowledgeEntry[],
  setShowDialog: (show: boolean) => void
): void => {
  if (processedEntries.length > 0) {
    saveKnowledgeEntriesToFile(processedEntries);
    setShowDialog(false);
  }
};
