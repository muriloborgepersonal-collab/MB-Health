
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudent } from '../contexts/StudentContext';
import { cn } from '../src/lib/utils';

const SubscriptionView: React.FC = () => {
    const navigate = useNavigate();
    const { students } = useStudent();

    // Helper to calculate expiration (mock logic: 30 days after creation)
    const getExpirationDate = (createdAt?: string) => {
        if (!createdAt) return 'N/A';
        const date = new Date(createdAt);
        date.setDate(date.getDate() + 30);
        return date.toLocaleDateString('pt-BR');
    };

    return (
        <div className="flex flex-col min-h-screen bg-background-dark">
            <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-md px-6 pt-12 pb-6 border-b border-white/5">
                <div className="flex items-center justify-between mb-4">
                    <button onClick={() => navigate(-1)} className="text-white hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-3xl">chevron_left</span>
                    </button>
                    <span className="material-symbols-outlined text-slate-400">payments</span>
                </div>
                <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">Controle Financeiro</h1>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">Gestão de Assinantes</p>
            </header>

            <main className="px-6 py-8 space-y-4">
                {students.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <span className="material-symbols-outlined text-6xl text-slate-800 mb-4 cursor-default">person_off</span>
                        <p className="text-slate-500 font-bold uppercase tracking-widest">Nenhum aluno encontrado</p>
                    </div>
                ) : (
                    students.map((student) => (
                        <div
                            key={student.id}
                            className="group flex flex-col p-6 rounded-3xl bg-card-dark border border-white/5 shadow-xl hover:border-primary/20 transition-all"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <img
                                            src={student.image_url || 'https://via.placeholder.com/150'}
                                            alt={student.name}
                                            className="w-12 h-12 rounded-2xl object-cover border border-white/10"
                                        />
                                        <div className={cn(
                                            "absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-card-dark",
                                            student.status === 'active' ? "bg-primary" : "bg-slate-500"
                                        )} />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-black text-lg leading-none mb-1">{student.name}</h3>
                                        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">{student.plan || 'Plano Mensal'}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-primary font-black text-xl">R$ 149,90</span>
                                    <span className="text-slate-500 text-[8px] uppercase font-bold">Valor Mensal</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                <div>
                                    <p className="text-slate-500 text-[8px] uppercase font-bold tracking-widest mb-1">Início</p>
                                    <p className="text-white text-xs font-black">
                                        {student.created_at ? new Date(student.created_at).toLocaleDateString('pt-BR') : 'N/A'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-slate-500 text-[8px] uppercase font-bold tracking-widest mb-1">Próximo Vencimento</p>
                                    <p className="text-primary text-xs font-black">{getExpirationDate(student.created_at)}</p>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-6">
                                <button className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-black uppercase tracking-wider transition-all">
                                    Ver Recibo
                                </button>
                                <button className="flex-1 py-3 rounded-xl bg-primary text-background-dark text-[10px] font-black uppercase tracking-wider transition-all shadow-glow hover:scale-105 active:scale-95">
                                    Confirmar Pagamento
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </main>
        </div>
    );
};

export default SubscriptionView;
