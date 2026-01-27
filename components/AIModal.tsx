
import React, { useState } from 'react';
import { getGeminiResponse } from '../services/gemini';

interface AIModalProps {
  onClose: () => void;
}

const AIModal: React.FC<AIModalProps> = ({ onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAsk = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setResponse('');
    const res = await getGeminiResponse(prompt);
    setResponse(res || '');
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-background-dark/80 backdrop-blur-xl">
      <div className="bg-card-dark w-full max-w-lg rounded-[2.5rem] border border-primary/20 shadow-2xl shadow-primary/10 overflow-hidden flex flex-col max-h-[80vh]">
        <div className="bg-gradient-to-tr from-primary to-purple-500 p-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="size-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                <span className="material-symbols-outlined text-white text-3xl">auto_awesome</span>
             </div>
             <div>
                <h2 className="text-white text-2xl font-black tracking-tighter uppercase leading-none">MFITIA</h2>
                <p className="text-white/70 text-[10px] font-black uppercase tracking-widest mt-1">Assistente Inteligente</p>
             </div>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>
        </div>

        <div className="p-8 space-y-6 overflow-y-auto hide-scrollbar flex-1">
          {response && (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 prose prose-invert max-w-none">
               <p className="text-slate-300 font-medium leading-relaxed">{response}</p>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center gap-4 py-8">
               <div className="size-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
               <p className="text-primary text-xs font-black uppercase tracking-widest animate-pulse">Pensando...</p>
            </div>
          )}

          {!response && !isLoading && (
            <div className="text-center py-12 px-4 space-y-4">
              <span className="material-symbols-outlined text-6xl text-slate-700">lightbulb</span>
              <p className="text-slate-400 font-medium italic">"Sugerir treino de hipertrofia para iniciantes..."</p>
            </div>
          )}
        </div>

        <div className="p-8 pt-0">
          <div className="flex gap-4 items-end bg-white/5 rounded-3xl p-2 border border-white/10 focus-within:border-primary transition-all">
            <textarea 
              rows={2}
              className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-slate-500 font-medium p-4 resize-none"
              placeholder="Como posso ajudar seu treino hoje?"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button 
              onClick={handleAsk}
              disabled={isLoading || !prompt.trim()}
              className="size-14 rounded-2xl bg-primary text-background-dark flex items-center justify-center shadow-glow disabled:opacity-50 disabled:grayscale transition-all active:scale-95"
            >
              <span className="material-symbols-outlined font-black">send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIModal;
