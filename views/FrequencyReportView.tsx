
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../src/components/ui/Button';

interface StudentFrequency {
    id: string;
    name: string;
    workoutsExecuted: number;
    lastWorkout: string; // ISO string
    status: 'active' | 'warning' | 'critical';
}

const FrequencyReportView: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'routines' | 'aerobic'>('routines');

    // Mock data for initial view
    const students: StudentFrequency[] = [
        { id: '1', name: 'Luiz Cláudio', workoutsExecuted: 7, lastWorkout: '2026-01-29', status: 'active' },
        { id: '2', name: 'Andreia Aparecida Rosa Barros', workoutsExecuted: 6, lastWorkout: '2026-01-28', status: 'active' },
        { id: '3', name: 'Juliano Augusto do Rosário Ribas', workoutsExecuted: 6, lastWorkout: '2026-01-25', status: 'warning' },
        { id: '4', name: 'Thais Eliza Da Silva', workoutsExecuted: 6, lastWorkout: '2026-01-20', status: 'critical' },
        { id: '5', name: 'Iaraci da Silva Pereira', workoutsExecuted: 6, lastWorkout: '2026-01-28', status: 'active' },
        { id: '6', name: 'PAULO FELIPE SANTOS DA SILVA', workoutsExecuted: 6, lastWorkout: '2026-01-15', status: 'critical' },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-500';
            case 'warning': return 'bg-yellow-500';
            case 'critical': return 'bg-red-500';
            default: return 'bg-slate-500';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'active': return 'Frequente';
            case 'warning': return 'Ausente a pouco tempo';
            case 'critical': return 'Vários dias sem treinar';
            default: return 'Sem dados';
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background-dark pb-24">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-card-header/80 backdrop-blur-md px-6 pt-12 pb-6 border-b border-white/5">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate(-1)} className="text-primary hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-3xl">chevron_left</span>
                    </button>
                    <h1 className="text-2xl font-black tracking-tighter uppercase">Relatório de Frequência</h1>
                </div>

                {/* Styled Tabs */}
                <div className="flex bg-white/[0.03] p-1.5 rounded-2xl border border-white/5 mb-6">
                    <Button
                        onClick={() => setActiveTab('routines')}
                        variant={activeTab === 'routines' ? 'primary' : 'glass'}
                        className={`flex-1 h-14 rounded-xl text-xs ${activeTab === 'routines' ? 'bg-white text-background-dark' : ''}`}
                    >
                        Rotinas de Treino
                    </Button>
                    <Button
                        onClick={() => setActiveTab('aerobic')}
                        variant={activeTab === 'aerobic' ? 'premium' : 'glass'}
                        className="flex-1 h-14 rounded-xl text-xs"
                    >
                        Aeróbico
                    </Button>
                </div>

                {/* Date Picker Range Mock */}
                <div className="w-full h-14 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center gap-3">
                    <span className="material-symbols-outlined text-primary text-lg">calendar_month</span>
                    <span className="text-sm font-black text-primary tracking-widest">23/01/2026 - 29/01/2026</span>
                </div>
            </header>

            <main className="px-6 py-8">
                {/* Statistics Card Summary */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Treinos</p>
                        <p className="text-3xl font-black text-white">177</p>
                    </div>
                    <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Engajamento</p>
                        <p className="text-3xl font-black text-primary">84%</p>
                    </div>
                </div>

                {/* Table Header */}
                <div className="flex px-4 mb-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                    <div className="flex-1">Aluno</div>
                    <div className="w-16 text-center">Treinos</div>
                    <div className="w-24 text-right">Status</div>
                </div>

                {/* Student List */}
                <div className="space-y-3">
                    {students.map(student => (
                        <div key={student.id} className="bg-white/[0.02] border border-white/5 rounded-3xl p-5 hover:border-primary/20 transition-all group">
                            <div className="flex items-center gap-4">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-white font-bold text-base truncate group-hover:text-primary transition-colors">{student.name}</h3>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">
                                        Último treino: {new Date(student.lastWorkout).toLocaleDateString('pt-BR')}
                                    </p>
                                </div>
                                <div className="w-12 text-center">
                                    <span className="text-xl font-black text-white">{student.workoutsExecuted}</span>
                                </div>
                                <div className="flex flex-col items-end gap-1.5 ml-2">
                                    <div className={`w-3 h-3 rounded-full ${getStatusColor(student.status)} shadow-lg shadow-${student.status === 'active' ? 'green' : student.status === 'warning' ? 'yellow' : 'red'}-500/20`}></div>
                                    <span className={`text-[8px] font-black uppercase tracking-tight text-right ${student.status === 'active' ? 'text-green-500' : student.status === 'warning' ? 'text-yellow-500' : 'text-red-500'}`}>
                                        {student.status === 'active' ? 'Ativo' : student.status === 'warning' ? 'Alerta' : 'Parado'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-center gap-2 mt-10">
                    <Button variant="premium" className="w-10 h-10 rounded-xl text-sm">1</Button>
                    {[2, 3, 4, 5].map(n => (
                        <Button key={n} variant="glass" className="w-10 h-10 rounded-xl text-sm text-slate-500">{n}</Button>
                    ))}
                    <Button variant="glass" className="w-10 h-10 rounded-xl text-sm text-slate-500">
                        <span className="material-symbols-outlined text-lg">chevron_right</span>
                    </Button>
                </div>
            </main>
        </div>
    );
};

export default FrequencyReportView;
