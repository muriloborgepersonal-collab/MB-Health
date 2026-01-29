import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../src/lib/supabase';
import { Workout, Exercise } from '../types';

const WorkoutEditorView: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // Fetch workout details
        const { data: workoutData, error: workoutError } = await supabase
          .from('workouts')
          .select('*')
          .eq('id', id)
          .single();

        if (workoutError) throw workoutError;
        setWorkout(workoutData);

        // Fetch exercises
        const { data: exercisesData, error: exercisesError } = await supabase
          .from('exercises')
          .select('*')
          .eq('workout_id', id)
          .order('created_at', { ascending: true });

        if (exercisesError) throw exercisesError;

        // Map DB snake_case to frontend camelCase
        const mappedExercises: Exercise[] = (exercisesData || []).map(ex => ({
          id: ex.id,
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          load: ex.load,
          rest: ex.rest,
          videoUrl: ex.video_url,
          thumbnailUrl: ex.thumbnail_url
        }));

        setExercises(mappedExercises);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddExercise = async () => {
    if (!id) return;
    try {
      const { data, error } = await supabase
        .from('exercises')
        .insert([{
          workout_id: id,
          name: 'Novo Exercício',
          sets: 3,
          reps: '12',
          load: '0',
          rest: '60s'
        }])
        .select();

      if (error) throw error;

      const newEx = data[0];
      setExercises(prev => [...prev, {
        id: newEx.id,
        name: newEx.name,
        sets: newEx.sets,
        reps: newEx.reps,
        load: newEx.load,
        rest: newEx.rest,
        videoUrl: newEx.video_url,
        thumbnailUrl: newEx.thumbnail_url
      }]);
    } catch (error) {
      console.error('Error adding exercise:', error);
    }
  };

  const handleUpdateExercise = async (exId: string, updates: Partial<Exercise>) => {
    // Optimistic update
    setExercises(prev => prev.map(ex => ex.id === exId ? { ...ex, ...updates } : ex));

    // DB update (snake_case)
    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.sets !== undefined) dbUpdates.sets = updates.sets;
    if (updates.reps !== undefined) dbUpdates.reps = updates.reps;
    if (updates.load !== undefined) dbUpdates.load = updates.load;
    if (updates.rest !== undefined) dbUpdates.rest = updates.rest;
    if (updates.videoUrl !== undefined) dbUpdates.video_url = updates.videoUrl;

    try {
      const { error } = await supabase
        .from('exercises')
        .update(dbUpdates)
        .eq('id', exId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating exercise:', error);
      // Revert on error if needed
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-primary text-5xl">progress_activity</span>
      </div>
    );
  }

  const handleDeleteExercise = async (exId: string) => {
    try {
      const { error } = await supabase
        .from('exercises')
        .delete()
        .eq('id', exId);

      if (error) throw error;
      setExercises(prev => prev.filter(ex => ex.id !== exId));
    } catch (error) {
      console.error('Error deleting exercise:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-dark">
      <header className="sticky top-0 z-50 bg-card-header/80 backdrop-blur-md p-6 border-b border-white/5">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <button onClick={() => navigate(-1)} className="text-primary hover:text-white transition-colors group">
            <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back_ios</span>
          </button>
          <h2 className="text-white text-lg font-black tracking-widest uppercase">{workout?.name || 'Editor de Exercícios'}</h2>
          <button className="text-slate-500 hover:text-white transition-colors">
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        </div>
      </header>

      <main className="px-4 py-8 space-y-8 max-w-lg mx-auto w-full">
        {/* Actions Bar */}
        <div className="overflow-x-auto hide-scrollbar -mx-4 px-4">
          <div className="flex gap-6 min-w-max pb-2">
            {[
              { label: 'Baixar treino', icon: 'download' },
              { label: 'Visão aluno', icon: 'visibility' },
              { label: 'Evolução', icon: 'trending_up' },
              { label: 'MFITIA', icon: 'auto_awesome', highlight: true }
            ].map((action, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-3 py-2 w-24 cursor-pointer group"
              >
                <div className={`rounded-2xl p-4 transition-all ${action.highlight ? 'bg-gradient-to-tr from-primary to-blue-600 shadow-glow scale-110' : 'bg-white/5 border border-white/5 hover:border-primary/30 group-hover:bg-white/10'}`}>
                  <span className={`material-symbols-outlined ${action.highlight ? 'text-background-dark font-black' : 'text-slate-400 group-hover:text-primary'}`}>{action.icon}</span>
                </div>
                <p className={`text-[9px] font-black uppercase tracking-[0.2em] text-center ${action.highlight ? 'text-primary' : 'text-slate-500 group-hover:text-white'}`}>
                  {action.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Add Button */}
        <button
          onClick={handleAddExercise}
          className="w-full flex items-center justify-center gap-3 rounded-[1.5rem] h-16 bg-primary text-background-dark font-black uppercase tracking-widest text-sm shadow-glow active:scale-[0.98] transition-all hover:shadow-neon"
        >
          <span className="material-symbols-outlined text-2xl font-black">add_circle</span>
          <span>Adicionar Exercício</span>
        </button>

        {/* Exercise List */}
        <div className="space-y-6">
          {exercises.map((ex) => (
            <div key={ex.id} className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl animate-kinetic-reveal">
              <div className="flex items-center p-6 pb-2">
                <span className="material-symbols-outlined text-slate-600 cursor-grab active:cursor-grabbing">drag_indicator</span>
                <input
                  type="text"
                  value={ex.name}
                  onChange={(e) => handleUpdateExercise(ex.id, { name: e.target.value })}
                  className="bg-transparent border-none text-white text-xl font-black tracking-tight ml-4 flex-1 outline-none focus:text-primary transition-colors"
                />
                <button
                  onClick={() => handleDeleteExercise(ex.id)}
                  className="text-slate-600 hover:text-red-500 transition-colors ml-2"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>

              <div className="p-6 pt-2">
                <div
                  className="relative flex items-center justify-center bg-zinc-800 bg-cover bg-center aspect-video rounded-3xl overflow-hidden group shadow-inner border border-white/5"
                  style={{ backgroundImage: `url("${ex.thumbnailUrl || 'https://picsum.photos/600/400?fitness'}")` }}
                >
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all"></div>
                  <button className="relative z-10 flex items-center justify-center rounded-full size-20 bg-white/10 backdrop-blur-xl text-white border border-white/20 hover:scale-110 transition-transform shadow-2xl">
                    <span className="material-symbols-outlined text-4xl fill-1">play_arrow</span>
                  </button>

                  {/* Video URL Input Overlay (Subtle) */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex bg-black/60 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/10">
                      <span className="material-symbols-outlined text-xs text-primary mr-2">link</span>
                      <input
                        placeholder="Link do vídeo..."
                        value={ex.videoUrl || ''}
                        onChange={(e) => handleUpdateExercise(ex.id, { videoUrl: e.target.value })}
                        className="bg-transparent border-none text-[10px] text-white outline-none w-24"
                      />
                    </div>
                  </div>
                </div>

                {/* Inputs Grid */}
                <div className="grid grid-cols-3 gap-4 mt-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 ml-1 text-center block">Séries</label>
                    <input
                      type="number"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 px-4 text-white text-sm font-bold focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-center"
                      value={ex.sets}
                      onChange={(e) => handleUpdateExercise(ex.id, { sets: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 ml-1 text-center block">Reps</label>
                    <input
                      className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 px-4 text-white text-sm font-bold focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-center"
                      value={ex.reps}
                      onChange={(e) => handleUpdateExercise(ex.id, { reps: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 ml-1 text-center block">Carga</label>
                    <input
                      className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 px-4 text-white text-sm font-bold focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-center"
                      value={ex.load}
                      onChange={(e) => handleUpdateExercise(ex.id, { load: e.target.value })}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 ml-1 mb-2 block">Intervalo de Descanso</label>
                  <input
                    className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 px-6 text-white text-sm font-bold focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    value={ex.rest}
                    onChange={(e) => handleUpdateExercise(ex.id, { rest: e.target.value })}
                    placeholder="Ex: 60s"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {exercises.length === 0 && (
          <div className="py-20 text-center space-y-4 opacity-30">
            <span className="material-symbols-outlined text-6xl">fitness_center</span>
            <p className="font-black uppercase tracking-[0.2em] text-sm">Nenhum exercício adicionado</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default WorkoutEditorView;
