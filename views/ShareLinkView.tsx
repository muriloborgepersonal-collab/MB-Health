
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
        <div className="flex flex-col min-h-screen bg-background-dark text-white p-6 pb-24">
            <header className="flex items-center justify-between mb-8">
                <button onClick={() => navigate(-1)} className="text-white hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-3xl">arrow_back_ios</span>
                </button>
                <h1 className="text-2xl font-black uppercase tracking-wider">Link de Cadastro</h1>
                <div className="w-8"></div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center space-y-8 max-w-lg mx-auto w-full">

                <div className="w-full bg-white/5 border border-white/10 p-8 rounded-3xl text-center space-y-6">
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-primary text-4xl">link</span>
                    </div>

                    <div>
                        <h2 className="text-2xl font-black mb-2">Envie para seus alunos</h2>
                        <p className="text-slate-400">Compartilhe este link para que seus alunos possam realizar o auto-cadastro.</p>
                    </div>

                    <div className="bg-background-dark/50 p-4 rounded-xl border border-white/5 break-all text-sm font-mono text-primary/80">
                        {registrationLink}
                    </div>
                </div>

                <div className="w-full space-y-4">
                    <button
                        onClick={handleCopy}
                        className="w-full h-14 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all active:scale-[0.98]"
                    >
                        <span className="material-symbols-outlined">{copied ? 'check' : 'content_copy'}</span>
                        {copied ? 'Link Copiado!' : 'Copiar Link'}
                    </button>

                    <button
                        onClick={handleWhatsApp}
                        className="w-full h-14 bg-[#25D366] hover:bg-[#128C7E] rounded-2xl flex items-center justify-center gap-2 font-bold text-white shadow-lg transition-all active:scale-[0.98]"
                    >
                        <i className="fa-brands fa-whatsapp text-xl"></i>
                        <span className="material-symbols-outlined">chat</span>
                        Enviar no WhatsApp
                    </button>
                </div>

            </main>
        </div>
    );
};

export default ShareLinkView;
