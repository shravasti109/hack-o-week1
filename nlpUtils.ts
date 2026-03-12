
import { FAQ_DATA, STOPWORDS, SYNONYM_MAP } from './constants';
import { Intent, FAQ, NLPResult } from './types';

/**
 * Preprocess the query string into normalized tokens
 */
// Add 'original' to the return type and object to fulfill NLPResult requirements
export const preprocess = (query: string): { 
  original: string,
  lowercased: string, 
  noPunctuation: string, 
  tokens: string[], 
  noStopwords: string[], 
  normalized: string[] 
} => {
  const lowercased = query.toLowerCase();
  const noPunctuation = lowercased.replace(/[^\w\s]/g, '');
  const tokens = noPunctuation.split(/\s+/).filter(t => t.length > 0);
  const noStopwords = tokens.filter(t => !STOPWORDS.has(t));
  const normalized = noStopwords.map(t => SYNONYM_MAP[t] || t);

  return { original: query, lowercased, noPunctuation, tokens, noStopwords, normalized };
};

/**
 * Simple TF-IDF Implementation for Retrieval
 */
const getAllFaqTokens = () => FAQ_DATA.map(faq => preprocess(faq.question).normalized);

const calculateIDF = (tokensList: string[][]) => {
  const idf: Record<string, number> = {};
  const N = tokensList.length;
  
  const allWords = new Set(tokensList.flat());
  allWords.forEach(word => {
    const docCount = tokensList.filter(tokens => tokens.includes(word)).length;
    idf[word] = Math.log(N / (docCount + 1)) + 1;
  });
  
  return idf;
};

const getTF = (tokens: string[]) => {
  const tf: Record<string, number> = {};
  tokens.forEach(t => {
    tf[t] = (tf[t] || 0) + 1;
  });
  const maxFreq = Math.max(...Object.values(tf), 1);
  Object.keys(tf).forEach(t => tf[t] = tf[t] / maxFreq);
  return tf;
};

const getVector = (tokens: string[], idf: Record<string, number>) => {
  const tf = getTF(tokens);
  const vector: Record<string, number> = {};
  Object.keys(idf).forEach(word => {
    vector[word] = (tf[word] || 0) * idf[word];
  });
  return vector;
};

const cosineSimilarity = (vecA: Record<string, number>, vecB: Record<string, number>) => {
  const keys = Object.keys(vecA);
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  keys.forEach(key => {
    dotProduct += vecA[key] * vecB[key];
    normA += vecA[key] * vecA[key];
    normB += vecB[key] * vecB[key];
  });
  
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

/**
 * Identify the best matching FAQ and detect intent
 */
export const findBestMatch = (query: string): NLPResult => {
  const pre = preprocess(query);
  const faqTokensList = getAllFaqTokens();
  const idf = calculateIDF(faqTokensList);
  
  const queryVector = getVector(pre.normalized, idf);
  
  let bestScore = -1;
  let bestFaq: FAQ | undefined;
  
  FAQ_DATA.forEach(faq => {
    const faqPre = preprocess(faq.question);
    const faqVector = getVector(faqPre.normalized, idf);
    const score = cosineSimilarity(queryVector, faqVector);
    
    // Boost by keyword matches
    const keywordMatchCount = faq.keywords.filter(k => pre.normalized.includes(k)).length;
    const finalScore = score + (keywordMatchCount * 0.2);

    if (finalScore > bestScore) {
      bestScore = finalScore;
      bestFaq = faq;
    }
  });

  // Simple Intent Classification based on buckets
  // Fixed initialization to include all Intent keys
  const intentScores: Record<Intent, number> = {
    [Intent.FEES]: 0,
    [Intent.PLACEMENTS]: 0,
    [Intent.MESS]: 0,
    [Intent.HOSTEL]: 0,
    [Intent.ACADEMICS]: 0,
    [Intent.FACULTY]: 0,
    [Intent.INFRASTRUCTURE]: 0,
    [Intent.CAMPUS_LIFE]: 0,
    [Intent.TRANSPORT]: 0,
    [Intent.SPORTS]: 0,
    [Intent.LIBRARY]: 0,
    [Intent.MEDICAL]: 0,
    [Intent.INTERNSHIPS]: 0,
    [Intent.EXAMS]: 0,
    [Intent.GENERAL]: 0,
  };

  // Rule-based routing
  // Fixed mapping to align with actual Intent members from types.ts
  const intentKeywords: Record<Intent, string[]> = {
    [Intent.FEES]: ['fees', 'tuition', 'payment', 'cost', 'money', 'stipend', 'scholarship'],
    [Intent.PLACEMENTS]: ['placement', 'job', 'recruit', 'company', 'salary'],
    [Intent.MESS]: ['mess', 'food', 'breakfast', 'lunch', 'dinner', 'cooking'],
    [Intent.HOSTEL]: ['hostel', 'room', 'dorm', 'stay', 'curfew'],
    [Intent.ACADEMICS]: ['attendance', 'paper', 'schedule', 'results', 'academics', 'study'],
    [Intent.EXAMS]: ['exam', 'test', 'grading', 'relative'],
    [Intent.FACULTY]: ['faculty', 'professor', 'teacher', 'phd', 'staff'],
    [Intent.INFRASTRUCTURE]: ['wifi', 'internet', 'building', 'lab', 'octagon', 'infrastructure'],
    [Intent.CAMPUS_LIFE]: ['campus', 'safe', 'night', 'walk', 'social'],
    [Intent.TRANSPORT]: ['bus', 'transport', 'city', 'travel'],
    [Intent.SPORTS]: ['sports', 'swimming', 'pool', 'gym', 'ground'],
    [Intent.LIBRARY]: ['library', 'book', 'hours', 'study'],
    [Intent.MEDICAL]: ['medical', 'health', 'hospital', 'doctor', 'ambulance'],
    [Intent.INTERNSHIPS]: ['internship', 'summer', 'winter', 'intern'],
    [Intent.GENERAL]: ['contact', 'hello', 'hi', 'help', 'admin']
  };

  Object.entries(intentKeywords).forEach(([intent, keywords]) => {
    keywords.forEach(k => {
      if (pre.normalized.includes(k)) {
        intentScores[intent as Intent] += 1;
      }
    });
  });

  // Default to General or best matching intent
  let finalIntent = bestFaq?.intent || Intent.GENERAL;
  let maxIntentScore = 0;
  Object.entries(intentScores).forEach(([intent, score]) => {
    if (score > maxIntentScore) {
      maxIntentScore = score;
      finalIntent = intent as Intent;
    }
  });

  return {
    ...pre,
    intent: finalIntent,
    similarityScore: bestScore,
    matchedFaq: bestScore > 0.1 ? bestFaq : undefined
  };
};
