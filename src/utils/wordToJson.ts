
interface KnowledgeEntry {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
  category?: string;
}

/**
 * Processes a Word document (.docx) file and extracts structured knowledge entries
 * This uses the mammoth library to convert Word to HTML, then parses the HTML to find Q&A pairs
 */
export const processWordDocument = async (file: File): Promise<KnowledgeEntry[]> => {
  try {
    // We'll use the mammoth.js library for Word document processing
    const mammoth = await import('mammoth');
    
    // Get file content as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Convert Word to HTML
    const result = await mammoth.convertToHtml({ arrayBuffer });
    const html = result.value;
    
    // Create a temporary DOM element to parse the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Extract knowledge entries from the document
    return extractKnowledgeEntries(doc);
  } catch (error) {
    console.error("Error processing Word document:", error);
    throw new Error("Failed to process Word document. Please check the file format.");
  }
};

/**
 * Extracts knowledge entries from parsed HTML document
 * This function looks for patterns that indicate questions and answers
 */
const extractKnowledgeEntries = (doc: Document): KnowledgeEntry[] => {
  const entries: KnowledgeEntry[] = [];
  let currentCategory = "General";
  
  // Find headings which might be categories
  const headings = doc.querySelectorAll('h1, h2, h3');
  headings.forEach(heading => {
    // Extract text content
    const text = heading.textContent?.trim();
    if (text) {
      // Check if it's followed by potential Q&A content
      let sibling = heading.nextElementSibling;
      if (sibling) {
        // If heading is followed by paragraphs, treat it as category
        currentCategory = text;
      }
    }
  });
  
  // Find paragraphs that might be questions (typically bold or styled differently)
  const paragraphs = doc.querySelectorAll('p');
  let currentQuestion = "";
  let currentAnswer = "";
  let collectingAnswer = false;
  
  paragraphs.forEach((paragraph, index) => {
    const text = paragraph.textContent?.trim();
    
    if (!text) return;
    
    // Check if paragraph is a question (heuristic: ends with ?, or contains bold text)
    const isBold = paragraph.querySelector('strong, b') !== null;
    const isQuestion = text.endsWith('?') || isBold || text.length < 150;
    
    if (isQuestion && !collectingAnswer) {
      // If we've collected a Q&A pair, add it to entries
      if (currentQuestion && currentAnswer) {
        const id = `imported-${entries.length + 1}-${Date.now()}`;
        // Extract keywords from question (simplistic approach)
        const keywords = extractKeywords(currentQuestion);
        
        entries.push({
          id,
          question: currentQuestion,
          answer: currentAnswer,
          keywords,
          category: currentCategory
        });
      }
      
      // Start new question
      currentQuestion = text;
      currentAnswer = "";
      collectingAnswer = true;
    } else if (collectingAnswer) {
      // Add to current answer
      currentAnswer += (currentAnswer ? "\n\n" : "") + text;
      
      // If next paragraph looks like a question, finish this answer
      const nextParagraph = index < paragraphs.length - 1 ? paragraphs[index + 1] : null;
      if (nextParagraph) {
        const nextText = nextParagraph.textContent?.trim();
        const nextIsBold = nextParagraph.querySelector('strong, b') !== null;
        const nextIsQuestion = nextText?.endsWith('?') || nextIsBold || (nextText?.length || 0) < 150;
        
        if (nextIsQuestion) {
          collectingAnswer = false;
        }
      }
    }
  });
  
  // Add the last Q&A pair if it exists
  if (currentQuestion && currentAnswer) {
    const id = `imported-${entries.length + 1}-${Date.now()}`;
    const keywords = extractKeywords(currentQuestion);
    
    entries.push({
      id,
      question: currentQuestion,
      answer: currentAnswer,
      keywords,
      category: currentCategory
    });
  }
  
  return entries;
};

/**
 * Extracts potential keywords from a question
 */
const extractKeywords = (question: string): string[] => {
  // Remove common words and punctuation
  const stopWords = ["a", "an", "the", "is", "are", "in", "on", "at", "to", "for", "with", "by"];
  
  // Split into words, remove punctuation, convert to lowercase
  const words = question
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.includes(word));
  
  // Get unique words
  return [...new Set(words)];
};

/**
 * Saves knowledge entries as a downloadable JSON file
 */
export const saveKnowledgeEntriesToFile = (entries: KnowledgeEntry[], filename = "knowledge-base.json") => {
  const json = JSON.stringify(entries, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
};
