
import React from 'react';
import { useNavigate } from 'react-router-dom';

const UpdatesMenuView: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-screen bg-background-dark text-white p-6">
            <header className="flex items-center justify-between mb-8">
                <button onClick={() => navigate(-1)} className="text-white hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-3xl">arrow_back_ios</span>
                </button>
                <h1 className="text-2xl font-black uppercase tracking-wider">Atualizações</h1>
                <div className="w-8"></div>
            </header>

            <main className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full gap-6">
                <button
                    onClick={() => navigate('/updates/workouts')}
                    className="flex-1 max-h-48 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 p-8 flex items-center justify-between group active:scale-[0.98] transition-all"
                >
                    <div className="text-left">
                        <div className="h-14 w-14 rounded-2xl bg-primary text-background-dark flex items-center justify-center mb-4 shadow-glow">
                            <span className="material-symbols-outlined text-3xl">fitness_center</span>
                        </div>
                        <h2 className="text-3xl font-black text-white">Treinos</h2>
                        <p className="text-primary font-bold uppercase tracking-wider text-xs mt-1">Vencendo em breve</p>
                    </div>
                    <span className="material-symbols-outlined text-primary/50 text-6xl group-hover:scale-110 transition-transform">chevron_right</span>
                </button>

                <button
                    className="flex-1 max-h-48 rounded-3xl bg-white/5 border border-white/10 p-8 flex items-center justify-between group active:scale-[0.98] transition-all hover:border-white/20"
                >
                    <div className="text-left">
                        <div className="h-14 w-14 rounded-2xl bg-white/10 text-white flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-3xl">cake</span>
                        </div>
                        <h2 className="text-3xl font-black text-white">Aniversários</h2>
                        <p className="text-slate-400 font-bold uppercase tracking-wider text-xs mt-1">Próximas datas</p>
                    </div>
                    <span className="material-symbols-outlined text-white/20 text-6xl group-hover:scale-110 transition-transform">chevron_right</span>
                </button>
            </main>
        </div>
    );
};

export default UpdatesMenuView;
