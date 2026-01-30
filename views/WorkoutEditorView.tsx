import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../src/lib/supabase';
import { useStudent } from '../contexts/AuthContext'; // Using auth context for trainer info or student context? 
// Actually using student context is better to find the student by ID
import { useStudent as useStudentData } from '../contexts/StudentContext';
import { Exercise } from '../types';
import { Button } from '../src/components/ui/Button';
import { Card } from '../src/components/ui/Card';
import { cn } from '../src/lib/utils';
import {
  MoreVertical, Eye, Play, Plus, Trash2,
  ChevronDown, ChevronUp, Loader2, Download,
  TrendingUp, AutoAwesome, GripVertical, Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WorkoutEditorView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dayId = searchParams.get('dayId');
  const { students } = useStudentData();

  const [workout, setWorkout] = useState<any>(null);
  const [workoutDay, setWorkoutDay] = useState<any>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandAll, setExpandAll] = useState(true);
  const [showGuidelines, setShowGuidelines] = useState(false);

  const student = students.find(s => s.id === workout?.student_id);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // Fetch workout
        const { data: workoutData, error: workoutError } = await supabase
          .from('workouts')
          .select('*')
          .eq('id', id)
          .single();

        if (workoutError) throw workoutError;
        setWorkout(workoutData);

        // Fetch workout day
        if (dayId) {
          const { data: dayData, error: dayError } = await supabase
            .from('workout_days')
            .select('*')
            .eq('id', dayId)
            .single();
          if (!dayError) setWorkoutDay(dayData);
        }

        // Fetch exercises
        let query = supabase
          .from('exercises')
          .select('*')
          .eq('workout_id', id);

        if (dayId) {
          query = query.eq('workout_day_id', dayId);
        } else {
          query = query.is('workout_day_id', null);
        }

        const { data: exercisesData, error: exercisesError } = await query
          .order('created_at', { ascending: true });

        if (exercisesError) throw exercisesError;

        const mapped = (exercisesData || []).map(ex => ({
          id: ex.id,
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          load: ex.load,
          rest: ex.rest,
          videoUrl: ex.video_url,
          thumbnailUrl: ex.thumbnail_url
        }));

        setExercises(mapped);
      } catch (error) {
        console.error('Error fetching editor data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, dayId]);

  const handleAddExercise = async () => {
    if (!id) return;
    try {
      const { data, error } = await supabase
        .from('exercises')
        .insert([{
          workout_id: id,
          workout_day_id: dayId || null,
          name: 'Novo Exercício',
          sets: 3,
          reps: '12',
          load: '0',
          rest: '60s'
        }])
        .select()
        .single();

      if (error) throw error;

      setExercises(prev => [...prev, {
        id: data.id,
        name: data.name,
        sets: data.sets,
        reps: data.reps,
        load: data.load,
        rest: data.rest,
        videoUrl: data.video_url,
        thumbnailUrl: data.thumbnail_url
      }]);
    } catch (error) {
      console.error('Error adding exercise:', error);
    }
  };

  const handleUpdateExercise = async (exId: string, updates: Partial<Exercise>) => {
    setExercises(prev => prev.map(ex => ex.id === exId ? { ...ex, ...updates } : ex));

    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.sets !== undefined) dbUpdates.sets = updates.sets;
    if (updates.reps !== undefined) dbUpdates.reps = updates.reps;
    if (updates.load !== undefined) dbUpdates.load = updates.load;
    if (updates.rest !== undefined) dbUpdates.rest = updates.rest;
    if (updates.videoUrl !== undefined) dbUpdates.video_url = updates.videoUrl;

    try {
      await supabase.from('exercises').update(dbUpdates).eq('id', exId);
    } catch (error) {
      console.error('Error updating exercise:', error);
    }
  };

  const handleDeleteExercise = async (exId: string) => {
    try {
      await supabase.from('exercises').delete().eq('id', exId);
      setExercises(prev => prev.filter(ex => ex.id !== exId));
    } catch (error) {
      console.error('Error deleting exercise:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background-dark text-white pb-12">
      {/* Header */}
      <header className="bg-card-header px-6 pt-12 pb-16 border-b border-white/5 relative overflow-hidden">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-primary mb-8 group relative z-10"
        >
          <span className="material-symbols-outlined !text-xl group-hover:-translate-x-1 transition-transform">chevron_left</span>
          <span className="text-sm font-black uppercase tracking-widest">Voltar</span>
        </button>

        <div className="flex items-center gap-5 relative z-10">
          <img
            src={student?.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(student?.name || 'Aluno')}&background=random`}
            alt={student?.name}
            className="size-16 rounded-2xl border-2 border-white/10 object-cover shadow-2xl"
          />
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">{student?.name || 'Aluno'}</h1>
        </div>
      </header>

      <div className="px-4 -mt-8 space-y-6 relative z-10">
        {/* Action Grid */}
        <div className="bg-white rounded-3xl p-6 shadow-2xl grid grid-cols-4 gap-2">
          <EditorAction icon={Download} label="Baixar treino" />
          <EditorAction icon={Eye} label="Visão do aluno" />
          <EditorAction icon={TrendingUp} label="Evolução de cargas" />
          <EditorAction icon={AutoAwesome} label="Prescrever com MFITIA" active />
        </div>

        {/* Guidelines */}
        <button
          onClick={() => setShowGuidelines(!showGuidelines)}
          className="w-full bg-white rounded-2xl p-4 flex justify-between items-center text-black font-bold shadow-lg"
        >
          <span className="text-sm">Orientações gerais</span>
          {showGuidelines ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
        </button>

        {/* Add Exercise */}
        <Button
          variant="premium"
          className="w-full h-14 rounded-2xl text-md font-black uppercase tracking-widest"
          onClick={handleAddExercise}
        >
          Adicionar Exercício
        </Button>

        {/* Workout Title and Toggle All */}
        <div className="space-y-4">
          <div className="flex justify-between items-end px-2">
            <div>
              <p className="text-primary text-[10px] font-black uppercase tracking-widest mb-1">
                {workoutDay?.name || 'Geral'}
              </p>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">
                {workoutDay?.subtitle || workout?.name}
              </h2>
            </div>
            <button
              onClick={() => setExpandAll(!expandAll)}
              className="text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-1 mb-1"
            >
              {expandAll ? 'Recolher todos' : 'Expandir todos'}
              <ChevronDown className={cn("transition-transform", expandAll && "rotate-180")} size={14} />
            </button>
          </div>

          {/* Exercise List */}
          <div className="space-y-3">
            {exercises.map((ex) => (
              <ExerciseItem
                key={ex.id}
                exercise={ex}
                initialExpanded={expandAll}
                onUpdate={handleUpdateExercise}
                onDelete={handleDeleteExercise}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function EditorAction({ icon: Icon, label, active }: { icon: any, label: string, active?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2 cursor-pointer group">
      <div className={cn(
        "size-12 rounded-full flex items-center justify-center transition-all",
        active ? "bg-primary/10 text-primary border-2 border-primary/20" : "bg-primary/5 text-primary"
      )}>
        <Icon size={20} className={cn(active && "animate-pulse")} />
      </div>
      <p className={cn(
        "text-[9px] font-black uppercase tracking-tight text-center leading-tight max-w-[60px]",
        active ? "text-primary" : "text-slate-400 group-hover:text-primary"
      )}>
        {label}
      </p>
    </div>
  );
}

function ExerciseItem({ exercise, initialExpanded, onUpdate, onDelete }: {
  exercise: Exercise,
  initialExpanded: boolean,
  onUpdate: (id: string, updates: Partial<Exercise>) => void,
  onDelete: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(initialExpanded);

  useEffect(() => {
    setExpanded(initialExpanded);
  }, [initialExpanded]);

  return (
    <Card className="bg-white border-none p-0 overflow-hidden rounded-2xl shadow-lg transition-all">
      {/* Collapsed Header */}
      <div
        className="p-4 flex items-center gap-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <GripVertical className="text-gray-300" size={20} />
        <div className="size-5 border-2 border-gray-200 rounded-md" />
        <span className="flex-1 font-bold text-black text-sm uppercase tracking-tight">{exercise.name}</span>
        <div className="flex items-center gap-2">
          <button className="p-1 hover:bg-gray-100 rounded-lg">
            <MoreVertical className="text-gray-400" size={18} />
          </button>
          {expanded ? <ChevronUp className="text-gray-400" size={18} /> : <ChevronDown className="text-gray-400" size={18} />}
        </div>
      </div>

      {/* Expanded Body */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-white border-t border-gray-50"
          >
            <div className="p-4 space-y-6">
              {/* Video Container */}
              <div className="relative aspect-video bg-black rounded-xl overflow-hidden group cursor-pointer">
                <img
                  src={exercise.thumbnailUrl || 'https://picsum.photos/800/450?fitness'}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="size-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform shadow-2xl">
                    <Play className="text-white fill-white ml-1" size={32} />
                  </div>
                </div>
              </div>

              {/* Controls Grid */}
              <div className="flex gap-4 items-end">
                <div className="flex-1 grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Série/rep</label>
                    <input
                      value={exercise.reps}
                      onChange={(e) => onUpdate(exercise.id, { reps: e.target.value })}
                      className="w-full h-12 bg-gray-50 border-none rounded-xl text-center font-black text-black focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Carga</label>
                    <input
                      value={exercise.load}
                      onChange={(e) => onUpdate(exercise.id, { load: e.target.value })}
                      className="w-full h-12 bg-gray-50 border-none rounded-xl text-center font-black text-black focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-1">Intervalo</label>
                    <input
                      value={exercise.rest}
                      onChange={(e) => onUpdate(exercise.id, { rest: e.target.value })}
                      className="w-full h-12 bg-gray-50 border-none rounded-xl text-center font-black text-black focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <button
                  onClick={() => onDelete(exercise.id)}
                  className="p-3 text-red-500 hover:bg-red-50 rounded-2xl transition-colors mb-0.5"
                >
                  <Trash2 size={22} />
                </button>
              </div>

              {/* Bottom Buttons */}
              <div className="flex gap-4">
                <Button className="flex-1 h-12 rounded-xl text-[11px] font-black uppercase tracking-widest bg-primary hover:bg-primary-dark">
                  Adicionar série
                </Button>
                <Button variant="outline" className="flex-1 h-12 rounded-xl text-[11px] font-black uppercase tracking-widest border-primary text-primary hover:bg-primary/5 flex items-center justify-center gap-2">
                  <Copy size={16} />
                  Replicar séries
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
