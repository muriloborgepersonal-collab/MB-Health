
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ShareLinkView: React.FC = () => {
    const navigate = useNavigate();
    // In a real app, this would be a real URL pointing to the deployed app
    const registrationLink = `${window.location.origin}/#/register/public`;
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(registrationLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleWhatsApp = () => {
        const text = `Olá! Clique no link abaixo para se cadastrar no meu app e receber seus treinos:\n${registrationLink}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <div className="flex flex-col min-h-screen bg-black text-white p-6 pb-24 selection:bg-primary/30">
            <header className="flex items-center justify-between mb-10 animate-kinetic-reveal">
                <button
                    onClick={() => navigate(-1)}
                    className="p-3 bg-surface border border-white/5 rounded-2xl hover:border-primary/50 hover:shadow-glow transition-all active:scale-90"
                >
                    <span className="material-symbols-outlined text-2xl text-primary">arrow_back_ios_new</span>
                </button>
                <h1 className="text-xl font-black uppercase tracking-[0.2em] italic">Link de Cadastro</h1>
                <div className="w-12"></div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center space-y-10 max-w-lg mx-auto w-full animate-kinetic-reveal [animation-delay:200ms]">

                <div className="w-full bg-surface border border-white/5 p-10 rounded-[48px] text-center space-y-8 shadow-neon relative overflow-hidden group">
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-glow animate-pulse-neon">
                        <span className="material-symbols-outlined text-primary text-5xl">link</span>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-2xl font-black uppercase tracking-tight italic">Envie para novos alunos</h2>
                        <p className="text-text-muted font-bold text-sm leading-relaxed max-w-[280px] mx-auto">Compartilhe este link para que seus alunos possam realizar o auto-cadastro.</p>
                    </div>

                    <div className="bg-black p-5 rounded-2xl border border-primary/20 break-all text-[11px] font-black tracking-widest text-primary uppercase shadow-inner">
                        {registrationLink}
                    </div>
                </div>

                <div className="w-full space-y-5">
                    <button
                        onClick={handleCopy}
                        className="w-full h-16 bg-surface border-2 border-primary/20 border-dashed hover:border-solid hover:border-primary hover:bg-primary/10 rounded-3xl flex items-center justify-center gap-4 font-black uppercase tracking-widest text-xs transition-all duration-500 active:scale-[0.95] group"
                    >
                        <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">{copied ? 'check_circle' : 'content_copy'}</span>
                        {copied ? 'Link Copiado!' : 'Copiar Link'}
                    </button>

                    <button
                        onClick={handleWhatsApp}
                        className="w-full h-16 bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366] hover:text-black rounded-3xl flex items-center justify-center gap-4 font-black uppercase tracking-widest text-xs shadow-lg transition-all duration-500 active:scale-[0.95] group"
                    >
                        <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">send</span>
                        Enviar no WhatsApp
                    </button>
                </div>

            </main>
        </div>
    );
};

export default ShareLinkView;
