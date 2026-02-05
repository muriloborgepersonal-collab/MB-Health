import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface AddWorkoutDayModalProps {
    isOpen: boolean;
    onClose: () => void;
    routineId: string;
    routineType: string;
    studentId: string;
    existingDaysCount: number;
    onSave: (data: { name: string; subtitle: string; instructions: string; copyFromId?: string }) => Promise<void>;
}

export const AddWorkoutDayModal: React.FC<AddWorkoutDayModalProps> = ({
    isOpen,
    onClose,
    routineId,
    routineType,
    studentId,
    existingDaysCount,
    onSave
}) => {
    const [name, setName] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [copyFromId, setCopyFromId] = useState('');
    const [instructions, setInstructions] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [otherDays, setOtherDays] = useState<any[]>([]);

    useEffect(() => {
        if (isOpen) {
            // Calculate automatic name
            if (routineType === 'Numérico') {
                setName((existingDaysCount + 1).toString());
            } else if (routineType === 'Dias da semana') {
                const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
                setName(days[existingDaysCount % 7]);
            } else {
                setName((existingDaysCount + 1).toString());
            }

            // Fetch other workout days for "Copiar de"
            const fetchOtherDays = async () => {
                try {
                    // Fetch all workout days for this student from all their routines
                    const { data: workouts } = await supabase
                        .from('workouts')
                        .select('id')
                        .eq('student_id', studentId);

                    if (workouts && workouts.length > 0) {
                        const workoutIds = workouts.map(w => w.id);
                        const { data: days } = await supabase
                            .from('workout_days')
                            .select('id, name, subtitle, workout_id, workouts(name)')
                            .in('workout_id', workoutIds)
                            .order('created_at', { ascending: false });

                        setOtherDays(days || []);
                    }
                } catch (error) {
                    console.error('Error fetching other days:', error);
                }
            };
            fetchOtherDays();
        }
    }, [isOpen, routineType, existingDaysCount, studentId]);

    if (!isOpen) return null;

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave({
                name: routineType === 'Numérico' ? `Treino ${name}` : name,
                subtitle: subtitle,
                instructions: instructions,
                copyFromId: copyFromId || undefined
            });
            onClose();
            // Reset fields
            setSubtitle('');
            setInstructions('');
            setCopyFromId('');
        } catch (error) {
            console.error('Error in handleSave:', error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
                <div className="p-8 overflow-y-auto custom-scrollbar">
                    <h2 className="text-slate-900 text-xl font-black mb-8 tracking-tight">Treino</h2>

                    <div className="space-y-6">
                        {/* Treino Identifier (e.g., 1 or Segunda-feira) */}
                        <div>
                            <label className="block text-slate-900 text-[13px] font-black mb-2">Treino</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                            />
                        </div>

                        {/* Nome (Subtitle) */}
                        <div>
                            <label className="block text-slate-900 text-[13px] font-black mb-2">Nome</label>
                            <input
                                type="text"
                                value={subtitle}
                                onChange={(e) => setSubtitle(e.target.value)}
                                placeholder="ex: peito e triceps"
                                className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                            />
                        </div>

                        {/* Copiar de */}
                        <div>
                            <label className="block text-slate-900 text-[13px] font-black mb-2">Copiar de</label>
                            <div className="relative">
                                <select
                                    value={copyFromId}
                                    onChange={(e) => setCopyFromId(e.target.value)}
                                    className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-slate-500 font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none"
                                >
                                    <option value="">Selecione um treino</option>
                                    {otherDays.map(day => (
                                        <option key={day.id} value={day.id}>
                                            {day.workouts?.name} - {day.name} {day.subtitle ? `(${day.subtitle})` : ''}
                                        </option>
                                    ))}
                                </select>
                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                            </div>
                        </div>

                        {/* Orientações gerais */}
                        <div>
                            <label className="block text-slate-900 text-[13px] font-black mb-2">Orientações gerais (Opcional)</label>
                            <textarea
                                value={instructions}
                                onChange={(e) => setInstructions(e.target.value)}
                                className="w-full h-32 p-4 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-8 pt-0 space-y-3 bg-white">
                    <button
                        onClick={handleSave}
                        disabled={isSaving || !name}
                        className="w-full h-14 bg-[#0080FF] hover:bg-[#0070e0] disabled:bg-slate-300 text-white rounded-2xl flex items-center justify-center font-black uppercase tracking-widest text-[11px] transition-all"
                    >
                        {isSaving ? 'Salvando...' : 'Salvar'}
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
