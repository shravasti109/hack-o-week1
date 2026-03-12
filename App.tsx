
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { findBestMatch } from './nlpUtils';
import { Message, Intent, FAQ } from './types';
import { FAQ_DATA } from './constants';
import ChatBubble from './components/ChatBubble';
import NLPVisualizer from './components/NLPVisualizer';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Welcome to Symbiosis Institute of Technology (SIT) NLP Lab. I've been trained on 25+ campus FAQs.\n\nType your question below to see how I tokenize values and handle text preprocessing in real-time!",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<Intent | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Derive current analysis context from selected message
  const currentNLP = messages.find(m => m.id === selectedMessageId)?.nlp;

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    // Analyze query immediately
    const nlp = findBestMatch(text);

    const userMsgId = Date.now().toString();
    const userMsg: Message = {
      id: userMsgId,
      text: text,
      sender: 'user',
      timestamp: new Date(),
      nlp // Analysis shown in user bubble as requested
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setSelectedMessageId(userMsgId); // Auto-select user message to show analysis panel

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: nlp.matchedFaq 
          ? `${nlp.matchedFaq.answer}\n\nWhat else doubt do you have? Thank you.`
          : "I couldn't find a direct match. Try asking about 'B.Tech fees', 'hostel facility', or 'CSE placements'.\n\nWhat else doubt do you have? Thank you.",
        sender: 'bot',
        timestamp: new Date(),
        nlp
      };
      setMessages(prev => [...prev, botResponse]);
      setSelectedMessageId(botResponse.id);
    }, 800);
  };

  const handleCategoryClick = (intent: Intent) => {
    setActiveCategory(intent === activeCategory ? null : intent);
  };

  const suggestedQuestions = activeCategory 
    ? FAQ_DATA.filter(faq => faq.intent === activeCategory)
    : [];

  return (
    <div className="flex flex-col h-screen bg-slate-100 overflow-hidden font-sans">
      {/* Red Header - SIT Branding */}
      <header className="bg-red-700 text-white p-4 shadow-xl border-b border-red-900 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg border-2 border-red-500">
              <i className="fas fa-university text-2xl text-red-700"></i>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight uppercase leading-none">Symbiosis SIT</h1>
              <p className="text-[10px] text-red-100 font-bold uppercase tracking-[0.2em] mt-1 opacity-80">NLP Preprocessing Lab v2.5</p>
            </div>
          </div>
          <div className="hidden md:flex flex-col items-end">
             <span className="text-[10px] font-black bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-widest">Assignment Task</span>
             <span className="text-xs font-medium mt-1">Rule-Based & TF-IDF Retrieval</span>
          </div>
        </div>
      </header>

      {/* Interactive Category Ribbon */}
      <div className="bg-white border-b border-slate-200 shadow-sm overflow-x-auto scrollbar-hide">
        <div className="max-w-7xl mx-auto flex gap-2 p-3 px-4">
          {Object.values(Intent).filter(i => i !== Intent.GENERAL).map(intent => (
            <button
              key={intent}
              onClick={() => handleCategoryClick(intent)}
              className={`
                whitespace-nowrap px-4 py-2 rounded-xl text-[11px] font-black transition-all border uppercase tracking-wider
                ${activeCategory === intent 
                  ? 'bg-red-600 text-white border-red-600 shadow-md transform -translate-y-0.5' 
                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-red-300 hover:text-red-600'}
              `}
            >
              {intent}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 flex flex-col md:flex-row overflow-hidden max-w-7xl mx-auto w-full">
        {/* Chat Canvas */}
        <section className="flex-1 flex flex-col bg-white">
          {activeCategory && (
            <div className="bg-red-50 border-b border-red-100 p-4 animate-in slide-in-from-top duration-300">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[10px] font-black text-red-800 uppercase tracking-[0.2em]">SIT Knowledge Base: {activeCategory}</h3>
                <button onClick={() => setActiveCategory(null)} className="text-red-300 hover:text-red-600 transition-colors">
                  <i className="fas fa-circle-xmark text-lg"></i>
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map(faq => (
                  <button
                    key={faq.id}
                    onClick={() => handleSend(faq.question)}
                    className="bg-white border border-red-100 text-red-700 text-[10px] px-3 py-2 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all shadow-sm hover:shadow-red-200"
                  >
                    {faq.question}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth bg-slate-50/50"
          >
            {messages.map((msg) => (
              <ChatBubble 
                key={msg.id} 
                message={msg} 
                isSelected={selectedMessageId === msg.id}
                onClick={() => setSelectedMessageId(msg.id)}
              />
            ))}
          </div>

          {/* User Input Module */}
          <div className="p-4 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
            <div className="max-w-3xl mx-auto flex gap-3">
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
                  placeholder="Ask SIT Assistant (e.g., 'What are the fees for B.Tech?')"
                  className="w-full px-6 py-4 rounded-2xl border border-slate-300 focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all text-sm shadow-inner font-medium placeholder:text-slate-400"
                />
              </div>
              <button 
                onClick={() => handleSend(inputValue)}
                className="bg-red-600 text-white w-14 h-14 rounded-2xl hover:bg-red-700 transition-all shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 group"
              >
                <i className="fas fa-paper-plane text-xl group-hover:rotate-12 transition-transform"></i>
              </button>
            </div>
            <div className="flex items-center justify-center gap-4 mt-3">
              <p className="text-[9px] text-slate-400 font-bold tracking-[0.2em] uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                TF-IDF Retrieval Active
              </p>
              <p className="text-[9px] text-slate-400 font-bold tracking-[0.2em] uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Pattern Matching Ready
              </p>
            </div>
          </div>
        </section>

        {/* NLP Sidebar Analysis */}
        <aside className="hidden lg:flex w-[380px] bg-white overflow-y-auto border-l border-slate-200 flex flex-col">
          <div className="p-5 border-b border-slate-200 bg-slate-50 sticky top-0 z-10 flex items-center justify-between">
            <div>
              <h2 className="font-black text-slate-800 flex items-center gap-2 text-sm uppercase tracking-tight">
                <i className="fas fa-code-branch text-red-600"></i>
                Processing Logs
              </h2>
              <p className="text-[10px] text-slate-500 font-medium">Step-by-step Tokenization</p>
            </div>
            <div className="px-2 py-0.5 bg-red-100 text-red-700 rounded-md text-[9px] font-black uppercase">Debug Mode</div>
          </div>
          <div className="p-4 flex-1">
            {currentNLP ? (
              <NLPVisualizer nlp={currentNLP} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                  <i className="fas fa-terminal text-2xl text-slate-300"></i>
                </div>
                <p className="text-xs font-black text-slate-600 uppercase tracking-widest leading-loose">
                  Select a message<br/>to see NLP details
                </p>
              </div>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
};

export default App;
