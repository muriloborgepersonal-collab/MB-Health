import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../src/lib/supabase';
import { useStudent } from '../contexts/StudentContext';
import { Button } from '../src/components/ui/Button';
import { Card } from '../src/components/ui/Card';
import { cn } from '../src/lib/utils';
import {
    MoreVertical, Calendar, Activity, Eye,
    ArrowUpDown, Plus, ChevronDown, ChevronUp,
    Loader2
} from 'lucide-react';

interface WorkoutDay {
    id: string;
    workout_id: string;
    name: string;
    instructions?: string;
    created_at: string;
}

export default function RoutineDetailView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { students } = useStudent();

    const [routine, setRoutine] = useState<any>(null);
    const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddingWorkout, setIsAddingWorkout] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);

    const student = students.find(s => s.id === routine?.student_id);

    useEffect(() => {
        const fetchRoutineData = async () => {
            if (!id) return;
            setLoading(true);
            try {
                // Fetch routine
                const { data: routineData, error: routineError } = await supabase
                    .from('workouts')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (routineError) throw routineError;
                setRoutine(routineData);

                // Fetch workout days
                const { data: daysData, error: daysError } = await supabase
                    .from('workout_days')
                    .select('*')
                    .eq('workout_id', id)
                    .order('created_at', { ascending: true });

                if (daysError) throw daysError;
                setWorkoutDays(daysData || []);
            } catch (error) {
                console.error('Error fetching routine details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRoutineData();
    }, [id]);

    const handleAddWorkout = async () => {
        if (!id) return;
        setIsAddingWorkout(true);
        try {
            const nextNumber = workoutDays.length + 1;
            const { data, error } = await supabase
                .from('workout_days')
                .insert([{
                    workout_id: id,
                    name: `Treino ${nextNumber}`,
                    instructions: ''
                }])
                .select()
                .single();

            if (error) throw error;
            setWorkoutDays(prev => [...prev, data]);
        } catch (error) {
            console.error('Error adding workout day:', error);
            alert('Erro ao adicionar treino.');
        } finally {
            setIsAddingWorkout(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
        );
    }

    if (!routine) {
        return (
            <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center p-6 text-center">
                <h2 className="text-xl font-bold text-white mb-4">Rotina não encontrada</h2>
                <Button onClick={() => navigate(-1)}>Voltar</Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen pb-20 bg-background-dark text-white">
            {/* Header */}
            <header className="bg-card-header px-6 pt-12 pb-24 border-b border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5">
                    <span className="material-symbols-outlined text-[120px]">fitness_center</span>
                </div>

                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1 text-primary mb-8 hover:text-white transition-all group relative z-10"
                >
                    <span className="material-symbols-outlined !text-xl group-hover:-translate-x-1 transition-transform">chevron_left</span>
                    <span className="text-sm font-black uppercase tracking-widest">Voltar</span>
                </button>

                <div className="flex items-center gap-5 relative z-10">
                    <img
                        src={student?.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(student?.name || 'Aluno')}&background=random`}
                        alt={student?.name}
                        className="size-20 rounded-2xl border-4 border-white/10 object-cover shadow-2xl"
                    />
                    <div>
                        <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-1">Detalhes da Rotina</p>
                        <h1 className="text-2xl font-black text-white uppercase tracking-tight">{student?.name || 'Aluno'}</h1>
                    </div>
                </div>
            </header>

            <div className="flex-1 px-4 -mt-12 space-y-6 relative z-10 pb-12">

                {/* Routine Info Card */}
                <Card className="bg-card-dark border-white/5 p-5 space-y-4 rounded-3xl shadow-2xl">
                    <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-primary text-background-dark flex items-center justify-center shadow-glow">
                                <Activity className="h-6 w-6 font-bold" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-white font-black text-xl leading-tight uppercase tracking-tight">{routine.name}</h3>
                                <div className="flex items-center gap-1 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                                    <Calendar className="h-4 w-4" />
                                    <span>{routine.date_range}</span>
                                </div>
                                <p className="text-primary text-[10px] font-black uppercase tracking-widest">{routine.objective} | {routine.level}</p>
                            </div>
                        </div>
                        <button className="p-1">
                            <MoreVertical className="text-slate-500 h-5 w-5" />
                        </button>
                    </div>

                    <div className="space-y-3 text-xs">
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-slate-400 font-bold uppercase tracking-widest">Tipo de treino:</span>
                            <span className="text-white font-black uppercase">{routine.type}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-slate-400 font-bold uppercase tracking-widest">Mostrar para o aluno:</span>
                            <span className="text-white font-black uppercase">{routine.show_time ? 'Sempre' : 'Não'}</span>
                        </div>
                        <div className="flex justify-between pb-2">
                            <span className="text-slate-400 font-bold uppercase tracking-widest">Arquivar automaticamente:</span>
                            <span className="text-white font-black uppercase">{routine.expire_on_end ? 'Sim' : 'Não'}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowInstructions(!showInstructions)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 flex justify-between items-center text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-colors"
                    >
                        <span>Orientações gerais</span>
                        {showInstructions ? <ChevronUp className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>

                    {showInstructions && (
                        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl text-xs text-slate-400 font-medium leading-relaxed animate-kinetic-reveal">
                            {routine.instructions || 'Nenhuma orientação cadastrada.'}
                        </div>
                    )}
                </Card>

                {/* Actions */}
                <div className="flex gap-4">
                    <Button variant="glass" className="flex-1 gap-2 h-14 rounded-2xl text-[10px] uppercase font-black tracking-widest border-primary/20">
                        <ArrowUpDown className="h-4 w-4 text-primary" />
                        Reordenar treinos
                    </Button>
                    <Button
                        variant="premium"
                        className="flex-1 gap-2 h-14 rounded-2xl text-[10px] uppercase font-black tracking-widest"
                        onClick={handleAddWorkout}
                        disabled={isAddingWorkout}
                    >
                        {isAddingWorkout ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                        Adicionar treino
                    </Button>
                </div>

                {/* Workout List */}
                <div className="space-y-4">
                    {workoutDays.map((day) => (
                        <WorkoutCard
                            key={day.id}
                            title={day.name}
                            subtitle={day.instructions || 'Sem subtítulo cadastrado'}
                            onClick={() => navigate(`/editor/${routine.id}?dayId=${day.id}`)}
                        />
                    ))}

                    {workoutDays.length === 0 && !isAddingWorkout && (
                        <div className="py-12 text-center border-2 border-dashed border-white/5 rounded-[2.5rem] opacity-30">
                            <p className="text-sm font-black uppercase tracking-widest">Nenhum treino adicionado</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function WorkoutCard({ title, subtitle, onClick }: { title: string, subtitle: string, onClick: () => void }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <Card className="bg-card-dark border-white/5 p-0 overflow-hidden rounded-[2.5rem] shadow-2xl relative">
            <div className="p-6 pb-2">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-black text-xl uppercase tracking-tight group-hover:text-primary transition-colors">{title}</h4>
                    <MoreVertical className="text-slate-500 h-5 w-5" />
                </div>
                <p className="text-slate-500 text-sm font-bold">{subtitle}</p>
            </div>

            <div className="px-6 pb-6 space-y-4">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setExpanded(!expanded);
                    }}
                    className="w-full flex bg-white/5 border border-white/10 rounded-2xl py-3 px-4 justify-between items-center text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-colors"
                >
                    <span>Orientações gerais</span>
                    {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {expanded && (
                    <div className="text-xs font-bold text-slate-400 bg-white/5 p-4 rounded-2xl border border-white/5 animate-kinetic-reveal">
                        Sem orientações específicas cadastradas para este treino.
                    </div>
                )}

                <div className="flex items-center gap-2 text-primary/50 text-[9px] font-black uppercase tracking-widest py-1">
                    <Activity size={12} />
                    <span>Executado 0 vezes • {new Date().toLocaleDateString('pt-BR')}</span>
                </div>

                <div className="flex gap-4">
                    <Button variant="premium" className="flex-1 h-12 rounded-2xl text-[10px] uppercase font-black tracking-widest lg:text-xs">
                        Evolução
                    </Button>
                    <Button variant="glass" className="flex-1 h-12 rounded-2xl text-[10px] uppercase font-black tracking-widest lg:text-xs border-primary/20">
                        Feedbacks
                    </Button>
                </div>
            </div>
        </Card>
    )
}
