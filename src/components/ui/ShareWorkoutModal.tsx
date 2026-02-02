import React from 'react';
import { Button } from './Button';

interface ShareWorkoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    workoutName: string;
    workoutId: string;
}

export const ShareWorkoutModal: React.FC<ShareWorkoutModalProps> = ({ isOpen, onClose, workoutName, workoutId }) => {
    if (!isOpen) return null;

    const shareUrl = `https://client.mfitpersonal.com.br/workout/${workoutId}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        // Toast could be added here
    };

    const handleWhatsApp = () => {
        const text = encodeURIComponent(`Confira o meu treino ${workoutName}: ${shareUrl}`);
        window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-[400px] rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="flex flex-col items-center">
                    {/* Paper Plane Icon */}
                    <div className="w-20 h-20 bg-[#E1F1FF] rounded-full flex items-center justify-center mb-6">
                        <span className="material-symbols-outlined text-[#0080FF] text-4xl transform -rotate-12 translate-x-1">send</span>
                    </div>

                    <h2 className="text-slate-900 text-xl font-black mb-2 uppercase tracking-tight">Compartilhar Link</h2>
                    <p className="text-slate-500 text-sm font-bold text-center mb-8 leading-tight">
                        Copie o link abaixo ou envie pelo WhatsApp
                    </p>

                    {/* Link Display Box */}
                    <div className="w-full bg-[#F3F5F7] p-6 rounded-2xl mb-8 break-all">
                        <p className="text-slate-600 text-[13px] font-medium leading-relaxed leading-6 text-center">
                            {shareUrl}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="w-full space-y-3">
                        <button
                            onClick={handleWhatsApp}
                            className="w-full h-14 bg-[#25D366] hover:bg-[#20bd5b] text-white rounded-2xl flex items-center justify-center gap-2 font-black uppercase tracking-widest text-[11px] transition-all"
                        >
                            <span className="material-symbols-outlined text-lg">chat</span>
                            Enviar por WhatsApp
                        </button>

                        <button
                            onClick={handleCopy}
                            className="w-full h-14 bg-[#0080FF] hover:bg-[#0070e0] text-white rounded-2xl flex items-center justify-center gap-2 font-black uppercase tracking-widest text-[11px] transition-all"
                        >
                            Copiar Link
                        </button>

                        <button
                            onClick={onClose}
                            className="w-full h-14 bg-white border-2 border-[#0080FF] text-[#0080FF] rounded-2xl flex items-center justify-center gap-2 font-black uppercase tracking-widest text-[11px] hover:bg-slate-50 transition-all font-bold"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShareWorkoutModal;
