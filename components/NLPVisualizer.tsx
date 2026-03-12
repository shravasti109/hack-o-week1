
import React from 'react';
import { NLPResult } from '../types';

interface NLPVisualizerProps {
  nlp: NLPResult;
}

const PipelineStep: React.FC<{ 
  title: string, 
  content: string | string[], 
  icon: string, 
  color: string, 
  desc: string 
}> = ({ title, content, icon, color, desc }) => (
  <div className="mb-6 last:mb-0 group">
    <div className="flex items-center gap-3 mb-2">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color} shadow-sm group-hover:scale-110 transition-transform`}>
        <i className={`fas ${icon} text-white text-xs`}></i>
      </div>
      <div>
        <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-700 leading-none">{title}</h4>
        <p className="text-[9px] text-slate-400 font-medium leading-none mt-1">{desc}</p>
      </div>
    </div>
    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm ml-4 border-l-4" style={{ borderLeftColor: color.split('-')[1] }}>
      <div className="flex flex-wrap gap-1.5">
        {Array.isArray(content) ? (
          content.length > 0 ? (
            content.map((item, idx) => (
              <span key={idx} className="px-2 py-0.5 bg-slate-50 text-slate-700 rounded text-[10px] border border-slate-100 font-mono font-bold">
                {item}
              </span>
            ))
          ) : (
            <span className="text-xs italic text-slate-400">Empty set</span>
          )
        ) : (
          <p className="text-xs font-bold text-slate-700 font-mono break-all">{content}</p>
        )}
      </div>
    </div>
  </div>
);

const NLPVisualizer: React.FC<NLPVisualizerProps> = ({ nlp }) => {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 pb-10">
      {/* Intent Badge */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl mb-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Classified Intent</p>
          <h3 className="text-2xl font-black mb-3 text-indigo-400">{nlp.intent}</h3>
          <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mb-2">
            <div 
              className="bg-indigo-500 h-full transition-all duration-1000 ease-out" 
              style={{ width: `${Math.min(nlp.similarityScore * 100, 100)}%` }}
            ></div>
          </div>
          <p className="text-[9px] font-bold opacity-60">Confidence Score: {(nlp.similarityScore * 100).toFixed(1)}%</p>
        </div>
        <i className="fas fa-brain absolute right-[-20px] bottom-[-20px] text-9xl opacity-10"></i>
      </div>

      <PipelineStep 
        title="1. Original" 
        desc="Raw user input string"
        icon="fa-quote-left" 
        color="bg-slate-400" 
        content={nlp.original} 
      />

      <PipelineStep 
        title="2. Normalization" 
        desc="Lowercasing the text"
        icon="fa-spell-check" 
        color="bg-blue-500" 
        content={nlp.lowercased} 
      />
      
      <PipelineStep 
        title="3. Punctuation" 
        desc="Removing special characters"
        icon="fa-eraser" 
        color="bg-orange-500" 
        content={nlp.noPunctuation} 
      />

      <PipelineStep 
        title="4. Tokenization" 
        desc="Splitting text into atomic units"
        icon="fa-scissors" 
        color="bg-green-500" 
        content={nlp.tokens} 
      />

      <PipelineStep 
        title="5. Stopwords" 
        desc="Filtering common filler words"
        icon="fa-filter" 
        color="bg-purple-500" 
        content={nlp.noStopwords} 
      />

      <PipelineStep 
        title="6. Semantic Synonyms" 
        desc="Mapping related keywords"
        icon="fa-project-diagram" 
        color="bg-pink-500" 
        content={nlp.normalized} 
      />

      {nlp.matchedFaq && (
        <div className="mt-8 p-5 bg-indigo-900 rounded-2xl border border-indigo-700 shadow-lg animate-bounce-short">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
              <i className="fas fa-check text-[10px] text-white"></i>
            </div>
            <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Retrieval Success</h4>
          </div>
          <p className="text-[11px] font-bold text-indigo-200 mb-2 leading-tight">Question Matched:</p>
          <p className="text-xs text-white leading-relaxed font-medium bg-white/10 p-2 rounded-lg italic">"{nlp.matchedFaq.question}"</p>
        </div>
      )}
    </div>
  );
};

export default NLPVisualizer;
