
import React from 'react';
import { Message } from '../types';

interface ChatBubbleProps {
  message: Message;
  isSelected: boolean;
  onClick: () => void;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isSelected, onClick }) => {
  const isBot = message.sender === 'bot';

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} group animate-in slide-in-from-bottom-2 duration-300`}>
      <div 
        onClick={onClick}
        className={`
          max-w-[90%] md:max-w-[80%] p-4 rounded-3xl shadow-sm transition-all relative
          ${isBot 
            ? 'bg-white text-slate-800 rounded-bl-none border border-slate-200' 
            : 'bg-red-600 text-white rounded-br-none shadow-red-100 shadow-xl'}
          ${message.nlp ? 'cursor-pointer hover:shadow-md' : 'cursor-default'}
          ${isSelected ? 'ring-2 ring-red-500 ring-offset-2' : ''}
        `}
      >
        <div className="flex items-center gap-2 mb-2 opacity-50">
           <i className={`fas ${isBot ? 'fa-robot' : 'fa-user'} text-[10px]`}></i>
           <span className="text-[10px] font-black uppercase tracking-widest">
            {isBot ? 'SIT AI Assistant' : 'Student Question'}
           </span>
        </div>
        
        <p className={`text-sm leading-relaxed whitespace-pre-line ${isBot ? 'font-medium' : 'font-bold'}`}>
          {message.text}
        </p>

        {/* NLP OUTPUT STEPS - Requested specifically to be in the output screen */}
        {!isBot && message.nlp && (
          <div className="mt-4 pt-4 border-t border-red-400/30">
            <h5 className="text-[9px] font-black uppercase tracking-[0.2em] mb-3 text-red-100 flex items-center gap-2">
              <i className="fas fa-microchip text-[10px]"></i>
              Real-time Preprocessing Results:
            </h5>
            
            <div className="space-y-3">
              <div className="bg-red-900/30 p-2.5 rounded-xl border border-red-400/20">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[8px] uppercase font-black text-red-200">1. Punctuation Handling:</span>
                  <i className="fas fa-eraser text-[8px] text-red-300"></i>
                </div>
                <p className="text-[10px] font-mono break-all leading-tight text-white/90 italic">
                  {message.nlp.noPunctuation || "(empty)"}
                </p>
              </div>

              <div className="bg-red-900/30 p-2.5 rounded-xl border border-red-400/20">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[8px] uppercase font-black text-red-200">2. Tokenized Values:</span>
                  <i className="fas fa-scissors text-[8px] text-red-300"></i>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {message.nlp.tokens.map((t, i) => (
                    <span key={i} className="bg-red-500/50 px-1.5 py-0.5 rounded text-[9px] font-mono border border-red-400/20">
                      {t}
                    </span>
                  ))}
                  {message.nlp.tokens.length === 0 && <span className="text-[10px] italic text-red-300">No tokens found</span>}
                </div>
              </div>

              <div className="bg-red-900/30 p-2.5 rounded-xl border border-red-400/20">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[8px] uppercase font-black text-red-200">3. Normalized (Synonyms + Stopwords):</span>
                  <i className="fas fa-spell-check text-[8px] text-red-300"></i>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {message.nlp.normalized.map((t, i) => (
                    <span key={i} className="bg-white text-red-800 px-1.5 py-0.5 rounded text-[9px] font-black shadow-sm">
                      {t}
                    </span>
                  ))}
                  {message.nlp.normalized.length === 0 && <span className="text-[10px] italic text-red-300">No keywords remaining</span>}
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between mt-4">
          <span className={`text-[10px] font-bold ${isBot ? 'text-slate-400' : 'text-red-200'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {message.nlp && (
            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full ${isBot ? 'bg-red-50 text-red-600' : 'bg-red-800 text-white'}`}>
              <i className="fas fa-tag text-[8px]"></i>
              <span className="text-[9px] font-black uppercase tracking-tight">{message.nlp.intent}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
