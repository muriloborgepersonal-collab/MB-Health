import React, { useState } from 'react';
import { Button } from './Button';
import { useStudent } from '@/contexts/StudentContext';

interface CloneWorkoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    workout: {
        id: string;
        name: string;
        objective?: string;
        level?: string;
    };
    onClone: (data: any) => Promise<void>;
}

export const CloneWorkoutModal: React.FC<CloneWorkoutModalProps> = ({ isOpen, onClose, workout, onClone }) => {
    const { students } = useStudent();
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [routineName, setRoutineName] = useState(workout.name);
    const [allowPdf, setAllowPdf] = useState('selecione');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(() => {
        const d = new Date();
        d.setMonth(d.getMonth() + 1);
        return d.toISOString().split('T')[0];
    });
    const [expireOnFinish, setExpireOnFinish] = useState(false);
    const [hideBeforeStart, setHideBeforeStart] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!selectedStudentId) return;
        setIsSubmitting(true);
        try {
            await onClone({
                studentId: selectedStudentId,
                name: routineName,
                allowPdf: allowPdf === 'sim',
                startDate,
                endDate,
                expireOnFinish,
                hideBeforeStart,
                originalWorkoutId: workout.id
            });
            onClose();
        } catch (error) {
            console.error('Error cloning workout:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
                <div className="p-8 overflow-y-auto custom-scrollbar">
                    <h2 className="text-slate-900 text-xl font-black mb-8 tracking-tight">Clonar rotina para alunos ou grupos:</h2>

                    <div className="space-y-6">
                        {/* Clone To */}
                        <div>
                            <label className="block text-slate-900 text-[13px] font-black mb-2">Clonar para:</label>
                            <select
                                value={selectedStudentId}
                                onChange={(e) => setSelectedStudentId(e.target.value)}
                                className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-slate-500 font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none"
                            >
                                <option value="">Selecione</option>
                                {students.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Routine Name */}
                        <div>
                            <label className="block text-slate-900 text-[13px] font-black mb-2">Nome da Rotina:</label>
                            <input
                                type="text"
                                value={routineName}
                                onChange={(e) => setRoutineName(e.target.value)}
                                className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                            />
                        </div>

                        {/* Allow PDF */}
                        <div>
                            <label className="block text-slate-900 text-[13px] font-black mb-2">Permitir que o aluno baixe o treino em pdf?</label>
                            <select
                                value={allowPdf}
                                onChange={(e) => setAllowPdf(e.target.value)}
                                className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-slate-500 font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none"
                            >
                                <option value="selecione">Selecione</option>
                                <option value="sim">Sim</option>
                                <option value="nao">Não</option>
                            </select>
                        </div>

                        {/* Dates Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-slate-900 text-[13px] font-black mb-2">Inicia em:</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                    />
                                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">calendar_month</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-slate-900 text-[13px] font-black mb-2">Termina em:</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                    />
                                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">calendar_month</span>
                                </div>
                            </div>
                        </div>

                        {/* Options */}
                        <div className="space-y-3 pt-2">
                            <p className="text-slate-900 text-[13px] font-black mb-2">Periodização:</p>
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={expireOnFinish}
                                    onChange={(e) => setExpireOnFinish(e.target.checked)}
                                    className="size-5 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                                />
                                <span className="text-[13px] font-bold text-slate-600 transition-colors group-hover:text-slate-900 leading-tight">
                                    Retirar a rotina da tela do aluno quando ela vencer.
                                </span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={hideBeforeStart}
                                    onChange={(e) => setHideBeforeStart(e.target.checked)}
                                    className="size-5 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                                />
                                <span className="text-[13px] font-bold text-slate-600 transition-colors group-hover:text-slate-900 leading-tight">
                                    Não exibir essa rotina para o aluno antes da data de início
                                </span>
                            </label>
                        </div>

                        {/* Warning Box */}
                        <div className="bg-[#F8F9FA] border border-slate-100 p-5 rounded-2xl flex flex-col gap-3">
                            <div className="flex items-center gap-2 text-slate-900 font-black text-xs">
                                <span className="material-symbols-outlined text-base">warning</span>
                                Atenção
                            </div>
                            <div className="h-px bg-slate-200 w-full"></div>
                            <p className="text-[#6C757D] text-[11px] font-bold">
                                Essa ação irá replicar a rotina, treinos, exercícios e séries.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-8 pt-0 space-y-3 bg-white">
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedStudentId || isSubmitting}
                        className="w-full h-14 bg-[#0080FF] hover:bg-[#0070e0] disabled:bg-slate-300 text-white rounded-2xl flex items-center justify-center font-black uppercase tracking-widest text-[11px] transition-all"
                    >
                        {isSubmitting ? 'Clonando...' : 'Clonar'}
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full h-14 bg-white border-2 border-[#0080FF] text-[#0080FF] rounded-2xl flex items-center justify-center font-black uppercase tracking-widest text-[11px] hover:bg-slate-50 transition-all font-bold"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CloneWorkoutModal;
