import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudent } from '../contexts/StudentContext';

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
        <div className="flex flex-col min-h-screen bg-[#f3f4f6]">
            {/* Navy Header */}
            <header className="bg-[#1e2d40] px-6 pt-10 pb-20">
                <button
                    onClick={() => navigate(`/student/${id}`)}
                    className="flex items-center gap-1 text-white mb-8 hover:opacity-80 transition-opacity"
                >
                    <span className="material-symbols-outlined !text-xl">chevron_left</span>
                    <span className="text-sm font-medium">Voltar</span>
                </button>

                <div className="flex items-center gap-4">
                    <img
                        src={student?.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(student?.name || 'Aluno')}&background=random`}
                        alt={student?.name}
                        className="size-16 rounded-full border-2 border-white/20 object-cover"
                    />
                    <h1 className="text-2xl font-medium text-white">{student?.name || 'Carregando...'}</h1>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 px-4 -mt-10 pb-24">
                {/* Tabs Container */}
                <div className="flex gap-2 mb-4">
                    <button
                        onClick={() => setActiveTab('rotinas')}
                        className={`flex-1 h-14 rounded-t-xl font-medium text-lg transition-all ${activeTab === 'rotinas' ? 'bg-white text-slate-800' : 'bg-[#3b82f6] text-white'
                            }`}
                    >
                        Rotinas de treino
                    </button>
                    <button
                        onClick={() => setActiveTab('aerobico')}
                        className={`flex-1 h-14 rounded-t-xl font-medium text-lg transition-all ${activeTab === 'aerobico' ? 'bg-white text-slate-800' : 'bg-[#3b82f6] text-white'
                            }`}
                    >
                        Aeróbico
                    </button>
                </div>

                {/* Content Card */}
                <div className="bg-white rounded-b-xl rounded-t-none p-6 shadow-sm space-y-6">
                    {activeTab === 'rotinas' ? (
                        <>
                            {/* Create Routine Button */}
                            <button
                                onClick={() => navigate(`/routine/new/${id}`)}
                                className="w-full flex items-center justify-center gap-3 rounded-xl h-24 border-2 border-dashed border-[#0ea5e9] text-[#0ea5e9] font-bold text-xl hover:bg-sky-50 transition-colors"
                                id="create-routine-btn"
                            >
                                <span className="material-symbols-outlined text-3xl font-light">add</span>
                                <span>Criar rotina</span>
                            </button>

                            {/* Filter Buttons */}
                            <div className="flex gap-4">
                                <button className="flex-1 h-14 bg-[#e0f2fe] text-[#0ea5e9] rounded-xl font-bold text-lg active:scale-95 transition-all">
                                    Arquivadas
                                </button>
                                <button className="flex-1 h-14 bg-[#e0f2fe] text-[#0ea5e9] rounded-xl font-bold text-lg active:scale-95 transition-all">
                                    Excluídas
                                </button>
                            </div>

                            {/* Routine Cards */}
                            <div className="space-y-4 pt-2">
                                {routines.map((routine) => (
                                    <div
                                        key={routine.id}
                                        onClick={() => navigate(`/editor/${routine.id}`)}
                                        className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-2xl hover:border-[#0ea5e9] transition-colors cursor-pointer group"
                                    >
                                        <div className="size-16 rounded-full bg-[#f0f9ff] border border-[#e0f2fe] flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[#0ea5e9] text-3xl">fitness_center</span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-slate-800 font-bold text-lg">{routine.name}</h3>
                                            <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                                                <span className="material-symbols-outlined !text-sm">calendar_month</span>
                                                <span>{routine.startDate} - {routine.endDate}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {routine.tags.map(tag => (
                                                    <span key={tag} className="text-xs font-medium text-slate-400">
                                                        {tag} {routine.tags.indexOf(tag) < routine.tags.length - 1 ? '| ' : ''}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <button className="text-slate-400 group-hover:text-slate-800">
                                            <span className="material-symbols-outlined">more_vert</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="py-20 text-center">
                            <span className="material-symbols-outlined text-6xl text-slate-200">directions_run</span>
                            <p className="text-slate-400 mt-4">Nenhum treino aeróbico encontrado.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default StudentWorkoutsView;
