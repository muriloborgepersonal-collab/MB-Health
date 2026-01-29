
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
        <div className="flex flex-col min-h-screen bg-background-dark text-white p-6 pb-24 selection:bg-primary/30">
            <header className="flex items-center justify-between mb-10 pt-12 animate-kinetic-reveal">
                <button
                    onClick={() => navigate(-1)}
                    className="p-4 bg-card-dark border border-white/5 rounded-2xl hover:border-primary/50 hover:shadow-glow transition-all active:scale-95 group"
                >
                    <span className="material-symbols-outlined text-2xl text-slate-400 group-hover:text-primary">arrow_back_ios_new</span>
                </button>
                <div className="flex flex-col items-center">
                    <h1 className="text-xl font-black uppercase tracking-[0.2em] text-white">Link de Cadastro</h1>
                    <div className="h-0.5 w-8 bg-primary mt-1"></div>
                </div>
                <div className="w-14"></div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center space-y-10 max-w-lg mx-auto w-full animate-kinetic-reveal [animation-delay:200ms]">

                <div className="w-full bg-card-dark border border-white/5 p-12 rounded-[2.5rem] text-center space-y-8 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute -top-10 -right-10 size-40 bg-primary/5 rounded-full blur-3xl"></div>

                    <div className="size-28 bg-primary/10 border border-primary/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-glow transition-transform group-hover:scale-110">
                        <span className="material-symbols-outlined text-primary text-6xl">qr_code_2</span>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">Novos Alunos</h2>
                        <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] max-w-[280px] mx-auto leading-relaxed">Compartilhe o link de auto-cadastro para acelerar sua consultoria.</p>
                    </div>

                    <div className="bg-background-dark p-6 rounded-2xl border border-white/5 break-all text-[11px] font-black tracking-[0.2em] text-primary uppercase shadow-inner relative z-10">
                        {registrationLink}
                    </div>
                </div>

                <div className="w-full space-y-4">
                    <button
                        onClick={handleCopy}
                        className="w-full h-20 bg-primary text-background-dark rounded-[1.5rem] flex items-center justify-center gap-4 font-black uppercase tracking-[0.2em] text-sm transition-all shadow-glow hover:shadow-neon active:scale-[0.98] group"
                    >
                        <span className="material-symbols-outlined text-2xl transition-transform group-hover:scale-110">{copied ? 'check_circle' : 'content_copy'}</span>
                        {copied ? 'Link Copiado!' : 'Copiar Link'}
                    </button>

                    <button
                        onClick={handleWhatsApp}
                        className="w-full h-20 bg-white/5 border border-white/10 hover:border-[#25D366]/50 hover:bg-[#25D366]/10 text-white rounded-[1.5rem] flex items-center justify-center gap-4 font-black uppercase tracking-[0.2em] text-sm transition-all active:scale-[0.98] group"
                    >
                        <div className="size-10 rounded-full bg-[#25D366]/20 flex items-center justify-center transition-transform group-hover:rotate-12">
                            <span className="material-symbols-outlined text-[#25D366] text-2xl">send</span>
                        </div>
                        Enviar WhatsApp
                    </button>
                </div>

            </main>
        </div>
    );
};

export default ShareLinkView;
