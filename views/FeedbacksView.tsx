
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudent } from '../contexts/StudentContext';

const FeedbacksView: React.FC = () => {
    const navigate = useNavigate();
    const { feedbacks } = useStudent();

    // Helper for Borg Scale colors
    const getScaleColor = (val: number) => {
        if (val <= 2) return 'text-green-400';
        if (val <= 4) return 'text-green-500';
        if (val <= 6) return 'text-yellow-400';
        if (val <= 8) return 'text-orange-500';
        return 'text-red-500';
    };

    const getScaleLabel = (val: number) => {
        if (val <= 2) return 'Muito Leve';
        if (val <= 4) return 'Leve';
        if (val <= 6) return 'Moderado';
        if (val <= 8) return 'Intenso';
        return 'Muito Intenso';
    };

    return (
        <div className="flex flex-col min-h-screen bg-background-dark text-white p-6 pb-24">
            <header className="flex items-center justify-between mb-8">
                <button onClick={() => navigate(-1)} className="text-white hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-3xl">arrow_back_ios</span>
                </button>
                <h1 className="text-2xl font-black uppercase tracking-wider">Feedbacks</h1>
                <div className="w-8"></div>
            </header>

            <main className="flex-1 space-y-4 max-w-lg mx-auto w-full">
                {feedbacks.length === 0 ? (
                    <div className="text-center py-20 opacity-50">
                        <span className="material-symbols-outlined text-6xl mb-4">chat_bubble_outline</span>
                        <p>Nenhum feedback recebido ainda.</p>
                    </div>
                ) : (
                    feedbacks.map((feedback) => (
                        <div key={feedback.id} className="bg-card-dark border border-white/5 p-5 rounded-2xl shadow-lg">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                                        <span className="font-bold text-xs">{feedback.studentName.substring(0, 2).toUpperCase()}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold leading-tight">{feedback.studentName}</h3>
                                        <p className="text-xs text-slate-500">{new Date(feedback.date).toLocaleDateString()} às {new Date(feedback.date).toLocaleTimeString().substring(0, 5)}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className={`text-2xl font-black ${getScaleColor(feedback.rating)}`}>{feedback.rating}</span>
                                    <span className={`text-[10px] uppercase font-bold tracking-wider ${getScaleColor(feedback.rating)}`}>{getScaleLabel(feedback.rating)}</span>
                                </div>
                            </div>

                            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                                <p className="text-sm text-slate-300 italic">"{feedback.comment || 'Sem observações.'}"</p>
                            </div>
                        </div>
                    ))
                )}
            </main>
        </div>
    );
};

export default FeedbacksView;
