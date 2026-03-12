
export enum Intent {
  FEES = 'Fees',
  PLACEMENTS = 'Placements',
  MESS = 'Mess',
  HOSTEL = 'Hostel',
  ACADEMICS = 'Academics',
  FACULTY = 'Faculty',
  INFRASTRUCTURE = 'Infrastructure',
  CAMPUS_LIFE = 'Campus Life',
  TRANSPORT = 'Transport',
  SPORTS = 'Sports',
  LIBRARY = 'Library',
  MEDICAL = 'Medical',
  INTERNSHIPS = 'Internships',
  EXAMS = 'Exams',
  GENERAL = 'General'
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  intent: Intent;
  keywords: string[];
}

export interface NLPResult {
  original: string;
  lowercased: string;
  noPunctuation: string;
  tokens: string[];
  noStopwords: string[];
  normalized: string[];
  intent: Intent;
  similarityScore: number;
  matchedFaq?: FAQ;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  nlp?: NLPResult;
}
