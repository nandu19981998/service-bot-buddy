
import React from 'react';
import { DatabaseIcon } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface KnowledgeStatusBadgeProps {
  importedCount: number;
}

const KnowledgeStatusBadge: React.FC<KnowledgeStatusBadgeProps> = ({ importedCount }) => {
  return (
    <Badge variant={importedCount > 0 ? "default" : "outline"} className="mr-3">
      <DatabaseIcon className="w-3 h-3 mr-1" />
      {importedCount > 0 
        ? `${importedCount} Entries Imported` 
        : "No Custom Knowledge"}
    </Badge>
  );
};

export default KnowledgeStatusBadge;
