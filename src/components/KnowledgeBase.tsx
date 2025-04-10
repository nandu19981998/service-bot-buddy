interface KnowledgeEntry {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
  category?: string;
}

// This is a sample knowledge base that can be expanded with imported data
let knowledgeBase: KnowledgeEntry[] = [
  {
    id: "intro-1",
    question: "What is this service manual for?",
    answer: "This service manual provides information about our products, troubleshooting steps, maintenance procedures, and answers to frequently asked questions. You can ask me anything about our products and services, and I'll do my best to assist you.",
    keywords: ["introduction", "manual", "about", "help", "information", "service"],
    category: "General"
  },
  {
    id: "contact-1",
    question: "How can I contact support?",
    answer: "You can reach our support team by email at support@example.com or by phone at (555) 123-4567. Our support hours are Monday through Friday, 9:00 AM to 5:00 PM EST.",
    keywords: ["contact", "support", "help", "phone", "email", "reach"],
    category: "Support"
  },
  {
    id: "warranty-1",
    question: "What is your warranty policy?",
    answer: "Our standard warranty covers all products for 12 months from the date of purchase. This warranty covers manufacturing defects and hardware failures under normal use. For details specific to your product, please refer to the warranty card included with your purchase or contact our support team.",
    keywords: ["warranty", "policy", "guarantee", "coverage", "repair"],
    category: "Warranty"
  },
  {
    id: "troubleshoot-1",
    question: "My device won't turn on. What should I do?",
    answer: "If your device won't turn on, please try the following steps:\n\n1. Ensure the device is properly connected to a power source.\n2. If battery-powered, make sure the battery is charged.\n3. Try a different power outlet or cable.\n4. Press and hold the power button for 10-15 seconds.\n5. If possible, remove and reinsert the battery.\n\nIf none of these steps work, please contact our support team for further assistance.",
    keywords: ["power", "turn on", "startup", "boot", "not working", "troubleshoot"],
    category: "Troubleshooting"
  },
  {
    id: "maintenance-1",
    question: "How often should I clean my device?",
    answer: "We recommend cleaning your device at least once a month to maintain optimal performance. Use a soft, lint-free cloth and avoid harsh chemicals. For electronic components, a gentle wipe with a slightly damp cloth is sufficient. Make sure the device is powered off and disconnected from any power source before cleaning.",
    keywords: ["clean", "maintenance", "care", "dust", "performance"],
    category: "Maintenance"
  }
];

// Keep track of imported entries count
let importedEntriesCount = 0;

// This function loads data from an external source
export const loadExternalKnowledgeBase = (data: KnowledgeEntry[]): number => {
  if (!data || data.length === 0) return 0;
  
  // Add unique IDs to any entries that don't have them
  const processedData = data.map((entry, index) => ({
    ...entry,
    id: entry.id || `imported-${Date.now()}-${index}`
  }));
  
  // Merge with existing knowledge base
  knowledgeBase = [...knowledgeBase, ...processedData];
  
  // Update imported count
  importedEntriesCount += processedData.length;
  
  return processedData.length;
};

// Get the total count of knowledge base entries
export const getKnowledgeBaseStats = () => {
  return {
    total: knowledgeBase.length,
    imported: importedEntriesCount,
    default: knowledgeBase.length - importedEntriesCount
  };
};

// Enhanced search function with more robust matching
export const searchKnowledgeBase = (query: string): KnowledgeEntry | null => {
  if (!query.trim()) return null;
  
  const normalizedQuery = query.toLowerCase();
  const words = normalizedQuery.split(/\s+/).filter(word => word.length > 2);
  
  // Score-based matching system
  const entriesWithScores = knowledgeBase.map(entry => {
    let score = 0;
    
    // Direct question match (highest priority)
    if (entry.question.toLowerCase().includes(normalizedQuery)) {
      score += 10;
    }
    
    // Keyword matches
    entry.keywords.forEach(keyword => {
      if (normalizedQuery.includes(keyword.toLowerCase())) {
        score += 5;
      }
      
      // Partial keyword matches
      if (words.some(word => keyword.toLowerCase().includes(word))) {
        score += 2;
      }
    });
    
    // Word-by-word matching in question
    const questionLower = entry.question.toLowerCase();
    words.forEach(word => {
      if (questionLower.includes(word)) {
        score += 3;
      }
    });
    
    // Category matching if available
    if (entry.category && normalizedQuery.includes(entry.category.toLowerCase())) {
      score += 3;
    }
    
    return { entry, score };
  });
  
  // Sort by score and get the best match
  entriesWithScores.sort((a, b) => b.score - a.score);
  
  // Return the best match if it has a minimum score threshold
  return entriesWithScores[0]?.score > 1 ? entriesWithScores[0].entry : null;
};

export const getDefaultResponse = (): string => {
  return "I don't have specific information about that in my knowledge base yet. Please try asking about warranty policies, troubleshooting, maintenance, or contacting support. Alternatively, you can reach out to our support team directly for more assistance.";
};

export const getCategorizedEntries = (): Record<string, KnowledgeEntry[]> => {
  const categorized: Record<string, KnowledgeEntry[]> = {};
  
  knowledgeBase.forEach(entry => {
    const category = entry.category || 'General';
    if (!categorized[category]) {
      categorized[category] = [];
    }
    categorized[category].push(entry);
  });
  
  return categorized;
};

// Helper function to parse imported data (e.g., from a Word document conversion)
export const parseImportedData = (rawData: string): KnowledgeEntry[] => {
  try {
    // This is a placeholder for the actual parsing logic
    // In a real application, this would depend on the format of your imported data
    return JSON.parse(rawData);
  } catch (error) {
    console.error("Error parsing imported data:", error);
    return [];
  }
};
