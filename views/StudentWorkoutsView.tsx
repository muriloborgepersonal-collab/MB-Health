import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudent } from '../contexts/StudentContext';
import { Button } from '../src/components/ui/Button';

const StudentWorkoutsView: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { students } = useStudent();
    const student = students.find(s => s.id === id);
    const [activeTab, setActiveTab] = useState<'rotinas' | 'aerobico'>('rotinas');

    const routines = [
        {
            id: '1',
            name: 'POWERBUILDING 5x bloco 5',
            startDate: '02/01/2026',
            endDate: '02/02/2026',
            tags: ['Hipertrofia', 'Intermediário'],
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-background-dark">
            {/* Dark Header */}
            <header className="bg-card-header px-6 pt-12 pb-24 border-b border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5">
                    <span className="material-symbols-outlined text-[120px]">fitness_center</span>
                </div>
                <button
                    onClick={() => navigate(`/student/${id}`)}
                    className="flex items-center gap-1 text-primary mb-8 hover:text-white transition-all group relative z-10"
                >
                    <span className="material-symbols-outlined !text-xl group-hover:-translate-x-1 transition-transform">chevron_left</span>
                    <span className="text-sm font-black uppercase tracking-widest">Voltar para o Perfil</span>
                </button>

                <div className="flex items-center gap-5 relative z-10">
                    <img
                        src={student?.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(student?.name || 'Aluno')}&background=random`}
                        alt={student?.name}
                        className="size-20 rounded-2xl border-4 border-white/10 object-cover shadow-2xl"
                    />
                    <div>
                        <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-1">Listagem de Treinos</p>
                        <h1 className="text-2xl font-black text-white uppercase tracking-tight">{student?.name || 'Carregando...'}</h1>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 px-4 -mt-12 pb-24 space-y-4">
                {/* Tabs Container */}
                <div className="flex gap-3 bg-card-dark/50 backdrop-blur-xl p-1.5 rounded-[1.5rem] border border-white/5 shadow-2xl">
                    <Button
                        onClick={() => setActiveTab('rotinas')}
                        variant={activeTab === 'rotinas' ? 'premium' : 'glass'}
                        className="flex-1 h-12 rounded-2xl text-[10px]"
                    >
                        Rotinas de treino
                    </Button>
                    <Button
                        onClick={() => setActiveTab('aerobico')}
                        variant={activeTab === 'aerobico' ? 'premium' : 'glass'}
                        className="flex-1 h-12 rounded-2xl text-[10px]"
                    >
                        Aeróbico
                    </Button>
                </div>

                {/* Content Card */}
                <div className="bg-card-dark border border-white/5 rounded-[2rem] p-6 shadow-2xl space-y-8">
                    {activeTab === 'rotinas' ? (
                        <>
                            {/* Create Routine Button */}
                            <Button
                                onClick={() => navigate(`/routine/new/${id}`)}
                                variant="premium"
                                className="w-full h-28 rounded-[2rem] border-2 border-dashed border-primary/30 flex-col gap-2"
                                id="create-routine-btn"
                            >
                                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-2xl">add</span>
                                </div>
                                <span className="text-sm">Criar Nova Rotina</span>
                            </Button>

                            {/* Filter Buttons */}
                            <div className="flex gap-3">
                                <Button variant="glass" className="flex-1 h-12 rounded-2xl text-[10px] text-slate-400">
                                    Arquivadas
                                </Button>
                                <Button variant="glass" className="flex-1 h-12 rounded-2xl text-[10px] text-slate-400">
                                    Excluídas
                                </Button>
                            </div>

                            {/* Routine Cards */}
                            <div className="space-y-4">
                                {routines.map((routine) => (
                                    <div
                                        key={routine.id}
                                        onClick={() => navigate(`/editor/${routine.id}`)}
                                        className="flex items-center gap-5 p-5 bg-white/[0.02] border border-white/5 rounded-[1.5rem] hover:border-primary/30 hover:bg-white/[0.04] transition-all cursor-pointer group"
                                    >
                                        <div className="size-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-glow transition-transform group-hover:scale-110">
                                            <span className="material-symbols-outlined text-primary text-3xl">fitness_center</span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-white font-black text-lg uppercase tracking-tight group-hover:text-primary transition-colors">{routine.name}</h3>
                                            <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                                                <span className="material-symbols-outlined !text-xs">calendar_month</span>
                                                <span>{routine.startDate} - {routine.endDate}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {routine.tags.map(tag => (
                                                    <span key={tag} className="text-[9px] font-black uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md text-slate-500">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <button className="text-slate-700 hover:text-primary transition-colors">
                                            <span className="material-symbols-outlined">more_vert</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[1.5rem]">
                            <span className="material-symbols-outlined text-6xl text-white/5 mb-4">directions_run</span>
                            <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Nenhum treino aeróbico</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default StudentWorkoutsView;
