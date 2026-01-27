
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStudent } from '../contexts/StudentContext';

const FeedbackSubmissionView: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Should be workout ID or Student ID context
    const { addFeedback, students } = useStudent();

    // For demo, we assume we are the student (or trainer simulating one)
    // In a real app, we'd get the student from auth/session
    const student = students[0];

    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);

    // Borg Scale Colors and Labels
    const getScaleInfo = (val: number) => {
        if (val <= 2) return { label: 'Muito Leve', color: 'bg-green-400', text: 'text-green-400' };
        if (val <= 4) return { label: 'Leve', color: 'bg-green-500', text: 'text-green-500' };
        if (val <= 6) return { label: 'Moderado', color: 'bg-yellow-400', text: 'text-yellow-400' };
        if (val <= 8) return { label: 'Intenso', color: 'bg-orange-500', text: 'text-orange-500' };
        return { label: 'Muito Intenso', color: 'bg-red-500', text: 'text-red-500' };
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) return;

        addFeedback({
            studentId: student.id,
            studentName: student.name,
            rating,
            comment,
            workoutId: id
        });
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="flex flex-col min-h-screen bg-background-dark items-center justify-center p-6 text-center">
                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-green-500 text-5xl">thumb_up</span>
                </div>
                <h1 className="text-3xl font-black text-white mb-2">Treino Concluído!</h1>
                <p className="text-slate-400 mb-8 max-w-xs">Obrigado pelo seu feedback. Bom descanso!</p>
                <button
                    onClick={() => navigate('/')}
                    className="w-full max-w-xs h-14 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black rounded-2xl"
                >
                    Fechar
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-background-dark text-white p-6 pb-24">
            <header className="flex items-center justify-between mb-8">
                <button onClick={() => navigate(-1)} className="text-white hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-3xl">close</span>
                </button>
                <h1 className="text-xl font-black uppercase tracking-wider">Feedback do Treino</h1>
                <div className="w-8"></div>
            </header>

            <main className="flex-1 flex flex-col max-w-lg mx-auto w-full">
                <form onSubmit={handleSubmit} className="space-y-8">

                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold">Como foi o treino?</h2>
                        <p className="text-slate-400">Avalie a intensidade do esforço (Escala de Borg)</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                            const info = getScaleInfo(num);
                            const isSelected = rating === num;

                            return (
                                <button
                                    key={num}
                                    type="button"
                                    onClick={() => setRating(num)}
                                    className={`h-14 rounded-xl border-2 transition-all font-black text-lg flex items-center justify-center relative overflow-hidden group
                    ${isSelected
                                            ? `border-${info.color.split('-')[1]}-${info.color.split('-')[2]} bg-white/10 text-white scale-105 shadow-glow`
                                            : 'border-white/10 bg-white/5 text-slate-500 hover:border-white/30'
                                        }`}
                                    style={{ borderColor: isSelected ? undefined : 'rgba(255,255,255,0.1)' }} // Fallback for dynamic class construction issues in some setups
                                >
                                    <span className={`z-10 ${isSelected ? info.text : ''}`}>{num}</span>
                                    {isSelected && <div className={`absolute inset-0 opacity-10 ${info.color}`}></div>}
                                </button>
                            );
                        })}
                    </div>

                    {rating > 0 && (
                        <div className={`p-4 rounded-xl border border-white/10 bg-white/5 text-center transition-all animate-fade-in`}>
                            <p className="text-sm font-bold uppercase text-slate-400 mb-1">Intensidade Percebida</p>
                            <p className={`text-2xl font-black ${getScaleInfo(rating).text}`}>{getScaleInfo(rating).label}</p>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Observações (Opcional)</label>
                        <textarea
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-primary focus:ring-0 transition-colors h-32 resize-none"
                            placeholder="Sentiu alguma dor? Algum exercício foi muito difícil?"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={rating === 0}
                        className={`w-full h-14 rounded-2xl font-black text-lg transition-all uppercase tracking-widest shadow-lg
              ${rating > 0
                                ? 'bg-primary text-background-dark hover:scale-[1.02] shadow-primary/25'
                                : 'bg-white/5 text-slate-500 cursor-not-allowed'
                            }`}
                    >
                        Enviar Feedback
                    </button>

                </form>
            </main>
        </div>
    );
};

export default FeedbackSubmissionView;
