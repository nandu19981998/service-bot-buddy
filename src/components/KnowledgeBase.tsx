
interface KnowledgeEntry {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
}

// This is a sample knowledge base that can be expanded later
const knowledgeBase: KnowledgeEntry[] = [
  {
    id: "intro-1",
    question: "What is this service manual for?",
    answer: "This service manual provides information about our products, troubleshooting steps, maintenance procedures, and answers to frequently asked questions. You can ask me anything about our products and services, and I'll do my best to assist you.",
    keywords: ["introduction", "manual", "about", "help", "information", "service"]
  },
  {
    id: "contact-1",
    question: "How can I contact support?",
    answer: "You can reach our support team by email at support@example.com or by phone at (555) 123-4567. Our support hours are Monday through Friday, 9:00 AM to 5:00 PM EST.",
    keywords: ["contact", "support", "help", "phone", "email", "reach"]
  },
  {
    id: "warranty-1",
    question: "What is your warranty policy?",
    answer: "Our standard warranty covers all products for 12 months from the date of purchase. This warranty covers manufacturing defects and hardware failures under normal use. For details specific to your product, please refer to the warranty card included with your purchase or contact our support team.",
    keywords: ["warranty", "policy", "guarantee", "coverage", "repair"]
  },
  {
    id: "troubleshoot-1",
    question: "My device won't turn on. What should I do?",
    answer: "If your device won't turn on, please try the following steps:\n\n1. Ensure the device is properly connected to a power source.\n2. If battery-powered, make sure the battery is charged.\n3. Try a different power outlet or cable.\n4. Press and hold the power button for 10-15 seconds.\n5. If possible, remove and reinsert the battery.\n\nIf none of these steps work, please contact our support team for further assistance.",
    keywords: ["power", "turn on", "startup", "boot", "not working", "troubleshoot"]
  },
  {
    id: "maintenance-1",
    question: "How often should I clean my device?",
    answer: "We recommend cleaning your device at least once a month to maintain optimal performance. Use a soft, lint-free cloth and avoid harsh chemicals. For electronic components, a gentle wipe with a slightly damp cloth is sufficient. Make sure the device is powered off and disconnected from any power source before cleaning.",
    keywords: ["clean", "maintenance", "care", "dust", "performance"]
  }
];

export const searchKnowledgeBase = (query: string): KnowledgeEntry | null => {
  const normalizedQuery = query.toLowerCase();
  
  // Direct match on question
  const directMatch = knowledgeBase.find(entry => 
    entry.question.toLowerCase().includes(normalizedQuery)
  );
  
  if (directMatch) return directMatch;
  
  // Keyword match
  const keywordMatch = knowledgeBase.find(entry => 
    entry.keywords.some(keyword => normalizedQuery.includes(keyword))
  );
  
  if (keywordMatch) return keywordMatch;
  
  // No match found
  return null;
};

export const getDefaultResponse = (): string => {
  return "I don't have specific information about that in my knowledge base yet. Please try asking about warranty policies, troubleshooting, maintenance, or contacting support. Alternatively, you can reach out to our support team directly for more assistance.";
};
