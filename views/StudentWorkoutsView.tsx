import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudent } from '../contexts/StudentContext';
import { supabase } from '@/lib/supabase';
import { Workout } from '../types';
import { Button } from '@/components/ui/Button';
import { DropdownMenu } from '@/components/ui/DropdownMenu';
import { ShareWorkoutModal } from '@/components/ui/ShareWorkoutModal';
import { CloneWorkoutModal } from '@/components/ui/CloneWorkoutModal';
import { DeleteWorkoutModal } from '@/components/ui/DeleteWorkoutModal';

const StudentWorkoutsView: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { students } = useStudent();
    const student = students.find(s => s.id === id);

    const [activeTab, setActiveTab] = useState<'rotinas' | 'aerobico'>('rotinas');
    const [viewMode, setViewMode] = useState<'active' | 'archived' | 'deleted'>('active');

    const [routines, setRoutines] = useState<Workout[]>([]);
    const [loadingRoutines, setLoadingRoutines] = useState(true);

    // Modal States
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isCloneModalOpen, setIsCloneModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

    const fetchRoutines = async () => {
        if (!id) return;
        setLoadingRoutines(true);
        try {
            const { data, error } = await supabase
                .from('workouts')
                .select('*')
                .eq('student_id', id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const mapped: Workout[] = (data || []).map(w => ({
                id: w.id,
                name: w.name,
                type: w.type,
                objective: w.objective,
                level: w.level,
                dateRange: w.date_range,
                status: w.status || 'active',
                exercises: []
            }));

            setRoutines(mapped);
        } catch (error) {
            console.error('Error fetching routines:', error);
        } finally {
            setLoadingRoutines(false);
        }
    };

    useEffect(() => {
        fetchRoutines();
    }, [id]);

    const handleUpdateStatus = async (workoutId: string, newStatus: 'active' | 'archived' | 'deleted') => {
        try {
            const { error } = await supabase
                .from('workouts')
                .update({ status: newStatus })
                .eq('id', workoutId);
            if (error) throw error;
            await fetchRoutines();
        } catch (error) {
            console.error(`Error updating workout status to ${newStatus}:`, error);
        }
    };

    const handleClone = async (cloneData: any) => {
        try {
            // First get the original workout
            const { data: originalWorkout, error: fetchError } = await supabase
                .from('workouts')
                .select('*')
                .eq('id', cloneData.originalWorkoutId)
                .single();

            if (fetchError) throw fetchError;

            // Create the new workout
            const { data: newWorkout, error: createError } = await supabase
                .from('workouts')
                .insert([{
                    name: cloneData.name,
                    student_id: cloneData.studentId,
                    type: originalWorkout.type,
                    objective: originalWorkout.objective,
                    level: originalWorkout.level,
                    date_range: `${new Date(cloneData.startDate).toLocaleDateString()} - ${new Date(cloneData.endDate).toLocaleDateString()}`,
                    status: 'active',
                    instructions: originalWorkout.instructions,
                    allow_pdf: originalWorkout.allow_pdf,
                    show_time: originalWorkout.show_time,
                    expire_on_end: originalWorkout.expire_on_end,
                    hide_before_start: originalWorkout.hide_before_start
                }])
                .select()
                .single();

            if (createError) throw createError;

            // Clone workout days
            const { data: originalDays, error: daysError } = await supabase
                .from('workout_days')
                .select('*')
                .eq('workout_id', originalWorkout.id);

            if (daysError) throw daysError;

            if (originalDays && originalDays.length > 0) {
                for (const day of originalDays) {
                    const { data: newDay, error: newDayError } = await supabase
                        .from('workout_days')
                        .insert([{
                            workout_id: newWorkout.id,
                            name: day.name,
                            subtitle: day.subtitle,
                            instructions: day.instructions
                        }])
                        .select()
                        .single();

                    if (newDayError) throw newDayError;

                    // Clone exercises for this day
                    const { data: originalExercises, error: exercisesError } = await supabase
                        .from('exercises')
                        .select('*')
                        .eq('workout_day_id', day.id);

                    if (exercisesError) throw exercisesError;

                    if (originalExercises && originalExercises.length > 0) {
                        const exercisesToInsert = originalExercises.map(ex => ({
                            name: ex.name,
                            sets: ex.sets,
                            reps: ex.reps,
                            load: ex.load,
                            rest: ex.rest,
                            video_url: ex.video_url,
                            thumbnail_url: ex.thumbnail_url,
                            workout_id: newWorkout.id,
                            workout_day_id: newDay.id
                        }));

                        const { error: insertExercisesError } = await supabase
                            .from('exercises')
                            .insert(exercisesToInsert);

                        if (insertExercisesError) throw insertExercisesError;
                    }
                }
            }

            if (cloneData.studentId === id) {
                await fetchRoutines();
            }
        } catch (error) {
            console.error('Error in handleClone:', error);
            throw error;
        }
    };

    const filteredRoutines = routines.filter(r => r.status === viewMode);

    return (
        <div className="flex flex-col min-h-screen bg-background-dark">
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

            <main className="flex-1 px-4 -mt-12 pb-24 space-y-4">
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

                <div className="bg-card-dark border border-white/5 rounded-[2rem] p-6 shadow-2xl space-y-8 min-h-[400px]">
                    {activeTab === 'rotinas' ? (
                        <>
                            {viewMode === 'active' && (
                                <Button
                                    onClick={() => navigate(`/routine/new/${id}`)}
                                    variant="premium"
                                    className="w-full h-28 rounded-[2rem] border-2 border-dashed border-primary/30 flex-col gap-2"
                                >
                                    <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-2xl">add</span>
                                    </div>
                                    <span className="text-sm">Criar Nova Rotina</span>
                                </Button>
                            )}

                            {viewMode === 'deleted' && (
                                <h2 className="text-white font-black text-xl uppercase tracking-tight">Rotinas excluídas</h2>
                            )}

                            <div className="flex gap-3">
                                <Button
                                    onClick={() => setViewMode('archived')}
                                    variant={viewMode === 'archived' ? 'premium' : 'glass'}
                                    className={`flex-1 h-12 rounded-2xl text-[10px] ${viewMode !== 'archived' ? 'text-slate-400' : ''}`}
                                >
                                    Arquivadas
                                </Button>
                                <Button
                                    onClick={() => setViewMode('deleted')}
                                    variant={viewMode === 'deleted' ? 'premium' : 'glass'}
                                    className={`flex-1 h-12 rounded-2xl text-[10px] ${viewMode !== 'deleted' ? 'text-slate-400' : ''}`}
                                >
                                    Excluídas
                                </Button>
                                {(viewMode === 'archived' || viewMode === 'deleted') && (
                                    <Button
                                        onClick={() => setViewMode('active')}
                                        variant="glass"
                                        className="size-12 rounded-2xl text-slate-400"
                                    >
                                        <span className="material-symbols-outlined">close</span>
                                    </Button>
                                )}
                            </div>

                            <div className={`space-y-4 ${viewMode === 'deleted' ? 'bg-white rounded-[2rem] p-4' : ''}`}>
                                {loadingRoutines ? (
                                    <div className="flex justify-center py-10">
                                        <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
                                    </div>
                                ) : filteredRoutines.length > 0 ? (
                                    filteredRoutines.map((routine) => (
                                        <div
                                            key={routine.id}
                                            onClick={() => viewMode === 'active' && navigate(`/routine/${routine.id}`)}
                                            className={`flex items-center gap-5 p-5 border transition-all ${viewMode === 'deleted'
                                                ? 'bg-transparent border-slate-100 rounded-none first:rounded-t-[1.5rem] last:rounded-b-[1.5rem] hover:bg-slate-50'
                                                : 'bg-white/[0.02] border-white/5 rounded-[1.5rem] hover:border-primary/30 hover:bg-white/[0.04] cursor-pointer group'
                                                }`}
                                        >
                                            <div className={`size-16 rounded-2xl flex items-center justify-center transition-transform ${viewMode === 'deleted'
                                                ? 'bg-[#E1F1FF]'
                                                : 'bg-primary/10 border border-primary/20 shadow-glow group-hover:scale-110'
                                                }`}>
                                                <span className={`material-symbols-outlined text-3xl ${viewMode === 'deleted' ? 'text-[#0080FF]' : 'text-primary'}`}>
                                                    {viewMode === 'deleted' ? 'fitness_center' : 'fitness_center'}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className={`font-black text-lg uppercase tracking-tight transition-colors ${viewMode === 'deleted' ? 'text-slate-900' : 'text-white group-hover:text-primary'
                                                    }`}>
                                                    {routine.name}
                                                </h3>
                                                <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                                                    <span className="material-symbols-outlined !text-xs">calendar_month</span>
                                                    <span>{routine.dateRange || 'Sem período definido'}</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2 mt-3">
                                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${viewMode === 'deleted' ? 'bg-slate-100 text-slate-500' : 'bg-white/5 text-slate-500'
                                                        }`}>
                                                        {routine.objective}
                                                    </span>
                                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${viewMode === 'deleted' ? 'bg-slate-100 text-slate-500' : 'bg-white/5 text-slate-500'
                                                        }`}>
                                                        {routine.level}
                                                    </span>
                                                </div>
                                            </div>
                                            <DropdownMenu
                                                items={[
                                                    {
                                                        label: 'Compartilhar',
                                                        icon: 'share',
                                                        onClick: () => {
                                                            setSelectedWorkout(routine);
                                                            setIsShareModalOpen(true);
                                                        }
                                                    },
                                                    {
                                                        label: 'Clonar',
                                                        icon: 'content_copy',
                                                        onClick: () => {
                                                            setSelectedWorkout(routine);
                                                            setIsCloneModalOpen(true);
                                                        }
                                                    },
                                                    {
                                                        label: 'Editar',
                                                        icon: 'edit',
                                                        onClick: () => navigate(`/routine/${routine.id}/edit`)
                                                    },
                                                    viewMode === 'deleted' ? {
                                                        label: 'Recuperar',
                                                        icon: 'settings_backup_restore',
                                                        onClick: () => handleUpdateStatus(routine.id, 'active')
                                                    } : {
                                                        label: 'Arquivar',
                                                        icon: 'archive',
                                                        onClick: () => handleUpdateStatus(routine.id, 'archived')
                                                    },
                                                    viewMode !== 'deleted' ? {
                                                        label: 'Excluir',
                                                        icon: 'delete',
                                                        onClick: () => {
                                                            setSelectedWorkout(routine);
                                                            setIsDeleteModalOpen(true);
                                                        },
                                                        variant: 'danger'
                                                    } : {
                                                        label: 'Excluir permanentemente',
                                                        icon: 'delete_forever',
                                                        onClick: () => {
                                                            // Logic for permanent delete if needed
                                                            console.log('Delete permanently:', routine.id);
                                                        },
                                                        variant: 'danger'
                                                    }
                                                ]}
                                                trigger={
                                                    <span className={`material-symbols-outlined ${viewMode === 'deleted' ? 'text-slate-400' : 'text-slate-700'}`}>more_vert</span>
                                                }
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-20 opacity-30">
                                        <p className="font-black uppercase tracking-widest text-[10px]">
                                            {viewMode === 'active' ? 'Nenhuma rotina ativa' :
                                                viewMode === 'archived' ? 'Nenhuma rotina arquivada' :
                                                    'Nenhuma rotina excluída'}
                                        </p>
                                    </div>
                                )}
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

            {/* Modals */}
            {selectedWorkout && (
                <>
                    <ShareWorkoutModal
                        isOpen={isShareModalOpen}
                        onClose={() => setIsShareModalOpen(false)}
                        workoutName={selectedWorkout.name}
                        workoutId={selectedWorkout.id}
                    />
                    <CloneWorkoutModal
                        isOpen={isCloneModalOpen}
                        onClose={() => setIsCloneModalOpen(false)}
                        workout={selectedWorkout}
                        onClone={handleClone}
                    />
                    <DeleteWorkoutModal
                        isOpen={isDeleteModalOpen}
                        onClose={() => setIsDeleteModalOpen(false)}
                        workoutName={selectedWorkout.name}
                        onConfirm={() => handleUpdateStatus(selectedWorkout.id, 'deleted')}
                    />
                </>
            )}
        </div>
    );
};

export default StudentWorkoutsView;
