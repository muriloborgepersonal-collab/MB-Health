import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
    ChevronLeft, Play, Check, Clock,
    Dumbbell, ChevronDown, ChevronUp,
    Loader2, X, Timer
} from 'lucide-react';

interface Exercise {
    id: string;
    name: string;
    sets: number;
    reps: string;
    load: string;
    rest: string;
    video_url?: string;
    thumbnail_url?: string;
    completed?: boolean;
}

interface WorkoutDay {
    id: string;
    name: string;
    instructions?: string;
}

const StudentWorkoutExecutionView: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [workout, setWorkout] = useState<any>(null);
    const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>([]);
    const [selectedDay, setSelectedDay] = useState<WorkoutDay | null>(null);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
    const [showRestTimer, setShowRestTimer] = useState(false);
    const [restSeconds, setRestSeconds] = useState(60);
    const [videoModalUrl, setVideoModalUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchWorkoutData = async () => {
            if (!id) return;
            setLoading(true);

            try {
                // Fetch workout
                const { data: workoutData } = await supabase
                    .from('workouts')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (workoutData) {
                    setWorkout(workoutData);

                    // Fetch workout days
                    const { data: daysData } = await supabase
                        .from('workout_days')
                        .select('*')
                        .eq('workout_id', id)
                        .order('created_at', { ascending: true });

                    setWorkoutDays(daysData || []);
                    if (daysData && daysData.length > 0) {
                        setSelectedDay(daysData[0]);
                    }
                }
            } catch (error) {
                console.error('Error fetching workout:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWorkoutData();
    }, [id]);

    // Fetch exercises when day changes
    useEffect(() => {
        const fetchExercises = async () => {
            if (!selectedDay || !id) return;

            const { data } = await supabase
                .from('exercises')
                .select('*')
                .eq('workout_id', id)
                .eq('workout_day_id', selectedDay.id)
                .order('created_at', { ascending: true });

            setExercises((data || []).map(ex => ({ ...ex, completed: false })));
        };

        fetchExercises();
    }, [selectedDay, id]);

    // Rest timer
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (showRestTimer && restSeconds > 0) {
            interval = setInterval(() => {
                setRestSeconds(prev => prev - 1);
            }, 1000);
        } else if (restSeconds === 0) {
            setShowRestTimer(false);
            setRestSeconds(60);
        }
        return () => clearInterval(interval);
    }, [showRestTimer, restSeconds]);

    const toggleExerciseComplete = (exId: string) => {
        setExercises(prev => prev.map(ex =>
            ex.id === exId ? { ...ex, completed: !ex.completed } : ex
        ));
    };

    const startRestTimer = (seconds: number) => {
        setRestSeconds(seconds);
        setShowRestTimer(true);
    };

    const getYouTubeEmbedUrl = (url: string) => {
        let videoId = '';
        if (url.includes('v=')) {
            videoId = url.split('v=')[1]?.split('&')[0];
        } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1]?.split('?')[0];
        }
        return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : null;
    };

    const completedCount = exercises.filter(ex => ex.completed).length;
    const progress = exercises.length > 0 ? (completedCount / exercises.length) * 100 : 0;

    if (loading) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-cyan-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-background-dark text-white pb-8">
            {/* Header */}
            <header className="bg-card-header sticky top-0 z-50 px-6 pt-12 pb-6 border-b border-white/5">
                <div className="flex items-center gap-4 mb-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="size-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 hover:bg-cyan-400/20 transition-all"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div className="flex-1">
                        <p className="text-cyan-400 text-[10px] font-black uppercase tracking-widest">Executando</p>
                        <h1 className="text-xl font-black text-white uppercase tracking-tight">{workout?.name}</h1>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                        <span className="text-slate-500">Progresso</span>
                        <span className="text-cyan-400">{completedCount}/{exercises.length} exercícios</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>
            </header>

            {/* Day Selector */}
            {workoutDays.length > 1 && (
                <div className="px-4 py-4 flex gap-2 overflow-x-auto hide-scrollbar">
                    {workoutDays.map((day) => (
                        <button
                            key={day.id}
                            onClick={() => setSelectedDay(day)}
                            className={`px-4 py-2 rounded-xl font-black text-sm uppercase tracking-tight whitespace-nowrap transition-all ${selectedDay?.id === day.id
                                    ? 'bg-cyan-400 text-background-dark'
                                    : 'bg-white/5 text-slate-400 hover:text-white'
                                }`}
                        >
                            {day.name}
                        </button>
                    ))}
                </div>
            )}

            {/* Exercise List */}
            <main className="px-4 py-4 space-y-3 flex-1">
                {exercises.map((exercise, index) => (
                    <motion.div
                        key={exercise.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Card className={`border p-0 overflow-hidden rounded-2xl transition-all ${exercise.completed
                                ? 'bg-cyan-400/10 border-cyan-400/30'
                                : 'bg-card-dark border-white/5'
                            }`}>
                            {/* Exercise Header */}
                            <div
                                className="p-4 flex items-center gap-4 cursor-pointer"
                                onClick={() => setExpandedExercise(expandedExercise === exercise.id ? null : exercise.id)}
                            >
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleExerciseComplete(exercise.id);
                                    }}
                                    className={`size-10 rounded-xl flex items-center justify-center transition-all ${exercise.completed
                                            ? 'bg-cyan-400 text-background-dark'
                                            : 'bg-white/5 border border-white/10 text-slate-500'
                                        }`}
                                >
                                    {exercise.completed ? <Check size={20} /> : <span className="text-sm font-black">{index + 1}</span>}
                                </button>

                                <div className="flex-1">
                                    <h4 className={`font-black text-sm uppercase tracking-tight ${exercise.completed ? 'text-cyan-400 line-through' : 'text-white'
                                        }`}>
                                        {exercise.name}
                                    </h4>
                                    <div className="flex gap-3 mt-1">
                                        <span className="text-[10px] font-bold text-slate-500">{exercise.sets}x{exercise.reps}</span>
                                        <span className="text-[10px] font-bold text-slate-500">{exercise.load}</span>
                                        <span className="text-[10px] font-bold text-slate-500">{exercise.rest}</span>
                                    </div>
                                </div>

                                {expandedExercise === exercise.id
                                    ? <ChevronUp size={20} className="text-slate-500" />
                                    : <ChevronDown size={20} className="text-slate-500" />
                                }
                            </div>

                            {/* Expanded Content */}
                            <AnimatePresence>
                                {expandedExercise === exercise.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-4 pt-0 space-y-4">
                                            {/* Video Thumbnail */}
                                            {exercise.video_url && (
                                                <button
                                                    onClick={() => setVideoModalUrl(exercise.video_url!)}
                                                    className="relative w-full aspect-video bg-black rounded-xl overflow-hidden group"
                                                >
                                                    <img
                                                        src={exercise.thumbnail_url || 'https://picsum.photos/800/450?fitness'}
                                                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                                                        alt={exercise.name}
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="size-14 rounded-full bg-cyan-400/20 backdrop-blur-md flex items-center justify-center border border-cyan-400/30 group-hover:scale-110 transition-transform">
                                                            <Play className="text-cyan-400 fill-cyan-400 ml-1" size={28} />
                                                        </div>
                                                    </div>
                                                </button>
                                            )}

                                            {/* Rest Timer Button */}
                                            <Button
                                                onClick={() => startRestTimer(parseInt(exercise.rest) || 60)}
                                                className="w-full h-12 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm"
                                            >
                                                <Timer size={18} className="mr-2" />
                                                Iniciar Descanso ({exercise.rest})
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Card>
                    </motion.div>
                ))}

                {exercises.length === 0 && (
                    <div className="py-20 text-center">
                        <Dumbbell size={48} className="mx-auto mb-4 text-slate-600" />
                        <p className="text-slate-500 font-bold">Nenhum exercício cadastrado</p>
                    </div>
                )}
            </main>

            {/* Finish Button */}
            {completedCount === exercises.length && exercises.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="px-4 pt-4"
                >
                    <Button
                        onClick={() => navigate('/student-home')}
                        className="w-full h-14 rounded-2xl bg-gradient-to-r from-cyan-400 to-cyan-500 text-background-dark font-black uppercase tracking-widest shadow-lg shadow-cyan-500/30"
                    >
                        <Check size={20} className="mr-2" />
                        Finalizar Treino
                    </Button>
                </motion.div>
            )}

            {/* Rest Timer Modal */}
            <AnimatePresence>
                {showRestTimer && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-background-dark/95 backdrop-blur-xl flex flex-col items-center justify-center p-6"
                    >
                        <button
                            onClick={() => setShowRestTimer(false)}
                            className="absolute top-8 right-6 text-slate-500 hover:text-white"
                        >
                            <X size={32} />
                        </button>

                        <Clock size={60} className="text-cyan-400 mb-8" />
                        <h2 className="text-6xl font-black text-white mb-4">
                            {Math.floor(restSeconds / 60)}:{(restSeconds % 60).toString().padStart(2, '0')}
                        </h2>
                        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Descanso</p>

                        <div className="flex gap-4 mt-12">
                            <Button
                                onClick={() => setRestSeconds(prev => prev + 15)}
                                className="px-6 h-12 rounded-xl bg-white/5 border border-white/10 text-white font-bold"
                            >
                                +15s
                            </Button>
                            <Button
                                onClick={() => setShowRestTimer(false)}
                                className="px-8 h-12 rounded-xl bg-cyan-400 text-background-dark font-bold"
                            >
                                Pular
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Video Modal */}
            <AnimatePresence>
                {videoModalUrl && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
                    >
                        <button
                            onClick={() => setVideoModalUrl(null)}
                            className="absolute top-4 right-4 z-10 size-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                        >
                            <X size={24} />
                        </button>
                        <div className="w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden">
                            {getYouTubeEmbedUrl(videoModalUrl) ? (
                                <iframe
                                    src={getYouTubeEmbedUrl(videoModalUrl)!}
                                    title="Exercise Video"
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-500">
                                    <p>Vídeo não disponível</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StudentWorkoutExecutionView;
