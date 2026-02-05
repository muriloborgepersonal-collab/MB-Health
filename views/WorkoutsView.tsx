import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Workout } from '../types';
import { Button } from '@/components/ui/Button';
import { DropdownMenu } from '@/components/ui/DropdownMenu';
import { CloneWorkoutModal } from '@/components/ui/CloneWorkoutModal';
import { DeleteWorkoutModal } from '@/components/ui/DeleteWorkoutModal';

const WorkoutsView: React.FC = () => {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'active' | 'archived' | 'deleted'>('active');

  // Modal States
  const [isCloneModalOpen, setIsCloneModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  const fetchWorkouts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
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

      setWorkouts(mapped);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleUpdateStatus = async (workoutId: string, newStatus: 'active' | 'archived' | 'deleted') => {
    try {
      const { error } = await supabase
        .from('workouts')
        .update({ status: newStatus })
        .eq('id', workoutId);
      if (error) throw error;
      await fetchWorkouts();
    } catch (error) {
      console.error(`Error updating workout status to ${newStatus}:`, error);
    }
  };

  const handleClone = async (cloneData: any) => {
    try {
      const { data: originalWorkout, error: fetchError } = await supabase
        .from('workouts')
        .select('*')
        .eq('id', cloneData.originalWorkoutId)
        .single();

      if (fetchError) throw fetchError;

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

      await fetchWorkouts();
    } catch (error) {
      console.error('Error in handleClone:', error);
      throw error;
    }
  };

  const filteredWorkouts = workouts.filter(w => w.status === viewMode);

  return (
    <div className="flex flex-col min-h-screen bg-background-dark">
      <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-md px-6 pt-12 pb-6 border-b border-white/5">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="text-white hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-3xl">chevron_left</span>
          </button>
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-slate-400 hover:text-white cursor-pointer transition-colors">search</span>
            <span className="material-symbols-outlined text-slate-400 hover:text-white cursor-pointer transition-colors">settings</span>
          </div>
        </div>
        <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">Treinos</h1>
      </header>

      <main className="px-6 py-8 space-y-6">
        {/* Highlight Card */}
        <div
          onClick={() => navigate('/exercises-library')}
          className="relative group cursor-pointer overflow-hidden rounded-[2.5rem] border-4 border-primary bg-white shadow-2xl transition-all active:scale-[0.98] p-8"
        >
          <div className="flex justify-between items-start mb-8">
            <div className="p-4 bg-primary/10 rounded-2xl">
              <span className="material-symbols-outlined text-primary text-5xl">fitness_center</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-slate-400 text-lg">arrow_forward_ios</span>
            </div>
          </div>
          <div>
            <h2 className="text-primary text-3xl font-black mb-3 uppercase tracking-tighter leading-tight">Biblioteca de Treinos</h2>
            <p className="text-slate-500 text-sm font-bold leading-relaxed">
              Crie, edite e organize rotinas personalizadas para cada perfil de aluno.
            </p>
          </div>
          <div className="absolute -right-6 -bottom-6 opacity-5 pointer-events-none">
            <span className="material-symbols-outlined text-[150px]">exercise</span>
          </div>
        </div>

        {/* Small Cards Grid */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Relatório de Frequência', icon: 'monitoring', desc: 'Acompanhe a constância' },
            { label: 'Biblioteca de Exercícios', icon: 'menu_book', desc: 'Base de movimentos' }
          ].map((card, i) => (
            <div
              key={i}
              onClick={() => {
                if (card.label === 'Biblioteca de Exercícios') {
                  navigate('/exercises-library');
                } else if (card.label === 'Relatório de Frequência') {
                  navigate('/frequency-report');
                }
              }}
              className="flex flex-col rounded-3xl bg-white p-6 shadow-xl border border-slate-100 transition-all active:scale-[0.96] cursor-pointer group"
            >
              <div className="mb-6">
                <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-xl group-hover:bg-primary transition-all group-hover:text-white text-primary">
                  <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">{card.icon}</span>
                </div>
              </div>
              <h3 className="text-slate-900 text-base font-black leading-tight uppercase tracking-tight">{card.label}</h3>
              <p className="mt-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* Filters/Tabs */}
        <div className="flex gap-3 bg-card-dark/50 backdrop-blur-xl p-1.5 rounded-[1.5rem] border border-white/5 shadow-2xl">
          <Button
            onClick={() => setViewMode('active')}
            variant={viewMode === 'active' ? 'premium' : 'glass'}
            className="flex-1 h-12 rounded-2xl text-[10px]"
          >
            Ativos
          </Button>
          <Button
            onClick={() => setViewMode('archived')}
            variant={viewMode === 'archived' ? 'premium' : 'glass'}
            className="flex-1 h-12 rounded-2xl text-[10px]"
          >
            Arquivados
          </Button>
          <Button
            onClick={() => setViewMode('deleted')}
            variant={viewMode === 'deleted' ? 'premium' : 'glass'}
            className="flex-1 h-12 rounded-2xl text-[10px]"
          >
            Excluídos
          </Button>
        </div>

        {/* Workouts List */}
        <div className="pt-4">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xl font-black tracking-tight text-white uppercase">
              {viewMode === 'active' ? 'Treinos Ativos' : viewMode === 'archived' ? 'Treinos Arquivados' : 'Treinos Excluídos'}
            </h4>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-20">
                <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
              </div>
            ) : filteredWorkouts.length > 0 ? (
              filteredWorkouts.map((workout) => (
                <div
                  key={workout.id}
                  onClick={() => viewMode === 'active' && navigate(`/routine/${workout.id}`)}
                  className="flex items-center p-5 bg-card-dark rounded-3xl border border-white/5 shadow-lg active:scale-[0.98] transition-all cursor-pointer group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mr-5 group-hover:border-primary transition-all">
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-all">fitness_center</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-black text-lg group-hover:text-primary transition-all uppercase">{workout.name}</p>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{workout.objective} • {workout.level}</p>
                  </div>

                  <DropdownMenu
                    items={[
                      {
                        label: 'Clonar',
                        icon: 'content_copy',
                        onClick: (e) => {
                          e?.stopPropagation();
                          setSelectedWorkout(workout);
                          setIsCloneModalOpen(true);
                        }
                      },
                      {
                        label: 'Editar',
                        icon: 'edit',
                        onClick: (e) => {
                          e?.stopPropagation();
                          navigate(`/routine/${workout.id}/edit`);
                        }
                      },
                      viewMode !== 'active' ? {
                        label: 'Ativar',
                        icon: 'bolt',
                        onClick: (e) => {
                          e?.stopPropagation();
                          handleUpdateStatus(workout.id, 'active');
                        }
                      } : {
                        label: 'Arquivar',
                        icon: 'archive',
                        onClick: (e) => {
                          e?.stopPropagation();
                          handleUpdateStatus(workout.id, 'archived');
                        }
                      },
                      viewMode !== 'deleted' ? {
                        label: 'Excluir',
                        icon: 'delete',
                        onClick: (e) => {
                          e?.stopPropagation();
                          setSelectedWorkout(workout);
                          setIsDeleteModalOpen(true);
                        },
                        variant: 'danger'
                      } : {
                        label: 'Excluir permanentemente',
                        icon: 'delete_forever',
                        onClick: (e) => {
                          e?.stopPropagation();
                          // Optional: Implement permanent delete if needed
                          console.log('Delete permanent:', workout.id);
                        },
                        variant: 'danger'
                      }
                    ]}
                    trigger={
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="material-symbols-outlined text-slate-600 hover:text-white transition-colors p-2"
                      >
                        more_vert
                      </button>
                    }
                  />
                </div>
              ))
            ) : (
              <div className="py-20 text-center opacity-30 border-2 border-dashed border-white/5 rounded-[2.5rem]">
                <p className="font-black uppercase tracking-widest text-[10px] text-white">Nenhum treino encontrado</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      {selectedWorkout && (
        <>
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

export default WorkoutsView;
