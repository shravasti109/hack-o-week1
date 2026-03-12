
import { Intent, FAQ } from './types';

export const STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'if', 'then', 'else', 'when', 'at', 'from', 'by', 
  'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 
  'after', 'above', 'below', 'to', 'of', 'in', 'on', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'what', 'how', 'where', 'is', 'it'
]);

export const SYNONYM_MAP: Record<string, string> = {
  'tuition': 'fees',
  'payment': 'fees',
  'cost': 'fees',
  'money': 'fees',
  'stipend': 'salary',
  'dorm': 'hostel',
  'residence': 'hostel',
  'attendance': 'presence',
  'professor': 'teacher',
  'wifi': 'internet',
  'hospital': 'medical',
  'bus': 'transport',
  'mess': 'food',
  'internship': 'intern',
  'college': 'institute',
  'sit': 'institute',
  'fest': 'festival'
};

export const FAQ_DATA: FAQ[] = [
  // FEES
  { id: 1, question: "What is the fee structure for B.Tech at SIT Pune?", answer: "The annual academic fee for B.Tech at SIT Pune is approximately ₹2.60 Lakhs to ₹3.00 Lakhs per annum, plus hostel and mess charges.", intent: Intent.FEES, keywords: ["btech", "fees", "structure", "pune"] },
  { id: 2, question: "Is there any scholarship for merit students at SIT?", answer: "Yes, Symbiosis International (Deemed University) offers Merit Scholarships to the top students of each program.", intent: Intent.FEES, keywords: ["scholarship", "merit", "fees"] },
  { id: 3, question: "How much are the hostel and mess fees at Lavale campus?", answer: "Hostel fees are approximately ₹1.2 Lakhs to ₹1.5 Lakhs per year, which includes the mess charges for 3 meals and snacks.", intent: Intent.FEES, keywords: ["hostel", "mess", "fees", "lavale"] },

  // PLACEMENTS
  { id: 4, question: "Which top companies recruit from SIT?", answer: "Top recruiters include Microsoft, Google, Amazon, Rakuten, Symantec, and many automotive giants like Mercedes-Benz.", intent: Intent.PLACEMENTS, keywords: ["companies", "recruiters", "placement"] },
  { id: 5, question: "What is the average package for CSE at SIT?", answer: "The average package for Computer Science and Engineering graduates is approximately ₹9-12 Lakhs per annum.", intent: Intent.PLACEMENTS, keywords: ["average", "package", "cse", "salary"] },
  { id: 6, question: "Does SIT have global placement opportunities?", answer: "Yes, many students get placed internationally, especially in Japan with companies like Rakuten and Works Applications.", intent: Intent.PLACEMENTS, keywords: ["international", "global", "placements"] },

  // MESS
  { id: 7, question: "What is the quality of food in the SIT mess?", answer: "The mess at Lavale provides a variety of nutritious meals, including North Indian, South Indian, and Continental options on special days.", intent: Intent.MESS, keywords: ["food", "quality", "mess"] },
  { id: 8, question: "Is non-veg food available in the Symbiosis mess?", answer: "Yes, non-vegetarian food is served on specific days of the week, usually twice a week.", intent: Intent.MESS, keywords: ["nonveg", "meat", "mess"] },
  { id: 9, question: "Are there any cafes other than the mess?", answer: "Yes, the Lavale campus has Symbi-Eat, Cafe Coffee Day, and various other food kiosks open until late.", intent: Intent.MESS, keywords: ["cafe", "food", "snacks"] },

  // HOSTEL
  { id: 10, question: "What are the curfew timings for SIT hostels?", answer: "The general curfew for students at the Lavale campus is 10:30 PM. Late entry requires prior permission from the rector.", intent: Intent.HOSTEL, keywords: ["curfew", "timing", "hostel"] },
  { id: 11, question: "Is the hostel accommodation mandatory for all students?", answer: "Hostel is mandatory for all first-year students to ensure they integrate well into the campus culture.", intent: Intent.HOSTEL, keywords: ["mandatory", "hostel", "stay"] },

  // ACADEMICS
  { id: 12, question: "What is the attendance criteria at SIT?", answer: "A minimum of 75% attendance is mandatory to appear for the end-semester examinations.", intent: Intent.ACADEMICS, keywords: ["attendance", "75", "criteria"] },
  { id: 13, question: "How does the relative grading system work?", answer: "SIT follows a CGPA-based relative grading system where your performance is evaluated against the batch average.", intent: Intent.ACADEMICS, keywords: ["grading", "relative", "cgpa"] },

  // FACULTY
  { id: 14, question: "What is the faculty profile at SIT?", answer: "SIT has highly experienced faculty, many of whom are PhD holders from top IITs and international universities.", intent: Intent.FACULTY, keywords: ["faculty", "profile", "teachers"] },
  { id: 15, question: "Do teachers help in research publications?", answer: "Yes, SIT has a very strong research culture, and faculty actively mentor students for publishing papers in Scopus-indexed journals.", intent: Intent.FACULTY, keywords: ["research", "publication", "mentor"] },

  // INFRASTRUCTURE
  { id: 16, question: "Are there high-end labs for AI and Robotics?", answer: "Yes, SIT has dedicated labs for AI, Machine Learning, Robotics, and IoT with industry-standard equipment.", intent: Intent.INFRASTRUCTURE, keywords: ["labs", "ai", "robotics"] },
  { id: 17, question: "Is the entire campus Wi-Fi enabled?", answer: "The entire Symbiosis Lavale hill-base and hill-top campuses are fully Wi-Fi enabled with high-speed connectivity.", intent: Intent.INFRASTRUCTURE, keywords: ["wifi", "internet", "campus"] },

  // TRANSPORT
  { id: 18, question: "Is there a bus facility from Pune city to SIT?", answer: "Yes, Symbiosis provides regular bus services for day scholars from various points across Pune city.", intent: Intent.TRANSPORT, keywords: ["bus", "transport", "pune"] },

  // SPORTS
  { id: 19, question: "What sports facilities are available at Lavale?", answer: "The campus has a football ground, cricket pitch, basketball courts, and a world-class indoor sports complex with a swimming pool.", intent: Intent.SPORTS, keywords: ["sports", "swimming", "gym", "football"] },

  // LIBRARY
  { id: 20, question: "Is the SIT library open 24 hours?", answer: "The library is open from 8:00 AM to 10:00 PM usually, and 24/7 during the week of examinations.", intent: Intent.LIBRARY, keywords: ["library", "hours", "24x7"] },

  // MEDICAL
  { id: 21, question: "Is there a hospital near the campus?", answer: "Yes, the Symbiosis University Hospital & Research Centre (SUHRC) is located right on the Lavale campus for 24/7 medical aid.", intent: Intent.MEDICAL, keywords: ["hospital", "medical", "suhrc"] },

  // INTERNSHIPS
  { id: 22, question: "Does SIT provide six-month industry internships?", answer: "Yes, the 8th semester is entirely dedicated to a mandatory Industry Internship project (IIP).", intent: Intent.INTERNSHIPS, keywords: ["internship", "6-month", "iip"] },

  // CAMPUS LIFE
  { id: 23, question: "What is the annual festival of SIT?", answer: "Reverb is the annual cultural festival of SIT, which features technical events, music, dance, and celebrity nights.", intent: Intent.CAMPUS_LIFE, keywords: ["reverb", "fest", "festival"] },

  // EXAMS
  { id: 24, question: "How many internal exams are there per semester?", answer: "There are typically two Continuous Evaluation (CA) tests followed by one end-semester examination.", intent: Intent.EXAMS, keywords: ["exams", "internal", "semester"] },

  // EXTRA
  { id: 25, question: "Is the Symbiosis entrance test (SITEEE) mandatory?", answer: "Yes, for B.Tech admission, candidates must appear for SITEEE or provide a valid JEE Main/MHT CET score.", intent: Intent.ACADEMICS, keywords: ["siteee", "entrance", "exam", "admission"] },
  { id: 26, question: "What are the timings for the central gym at Lavale?", answer: "The central gym is open from 6:00 AM to 9:00 AM and 5:00 PM to 9:00 PM for all students.", intent: Intent.SPORTS, keywords: ["gym", "timings", "workout"] }
];
