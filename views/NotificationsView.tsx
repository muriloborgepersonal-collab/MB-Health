
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotificationsView: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-screen bg-background-dark text-white p-6">
            <header className="flex items-center justify-between mb-8">
                <button onClick={() => navigate('/home')} className="text-white hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-3xl">arrow_back_ios</span>
                </button>
                <h1 className="text-2xl font-black uppercase tracking-wider">Envio de Mensagem</h1>
                <div className="w-8"></div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full">
                {/* Empty State */}
                <div className="text-center py-10 opacity-50 mb-12">
                    <span className="material-symbols-outlined text-7xl mb-4 text-slate-600">send_and_archive</span>
                    <p className="text-slate-400">Nenhuma mensagem enviada recentemente.</p>
                </div>

                <button
                    onClick={() => navigate('/notifications/create-selection')}
                    className="w-full h-16 bg-gradient-to-r from-primary to-[#00a0c0] rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-[0.98] transition-all group"
                >
                    <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                        <span className="material-symbols-outlined text-white text-lg">add</span>
                    </div>
                    <span className="text-background-dark font-black text-lg uppercase tracking-widest">CRIAR NOTIFICAÇÃO</span>
                </button>

                <div className="mt-8 w-full border-t border-white/10 pt-6">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Histórico Recente</h3>
                    {/* Placeholder for history list */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4 opacity-60">
                        <div className="h-10 w-10 bg-green-500/20 rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-green-500">check</span>
                        </div>
                        <div>
                            <p className="font-bold text-sm">Aviso de Feriado</p>
                            <p className="text-xs text-slate-400">Enviado para: Todos os Alunos</p>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default NotificationsView;
