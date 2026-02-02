import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
    Play, Calendar, TrendingUp, Clock,
    Dumbbell, ChevronRight, Loader2, LogOut,
    User, History, Home
} from 'lucide-react';

interface StudentWorkout {
    id: string;
    name: string;
    date_range?: string;
    objective?: string;
    level?: string;
    days_count?: number;
}

const StudentHomeView: React.FC = () => {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();
    const [workouts, setWorkouts] = useState<StudentWorkout[]>([]);
    const [loading, setLoading] = useState(true);
    const [studentInfo, setStudentInfo] = useState<any>(null);

    useEffect(() => {
        const fetchStudentData = async () => {
            if (!user) return;
            setLoading(true);

            try {
                // Fetch student info using user email
                const { data: studentData } = await supabase
                    .from('students')
                    .select('*')
                    .eq('email', user.email)
                    .single();

                if (studentData) {
                    setStudentInfo(studentData);

                    // Fetch workouts assigned to this student
                    const { data: workoutsData } = await supabase
                        .from('workouts')
                        .select('*')
                        .eq('student_id', studentData.id)
                        .order('created_at', { ascending: false });

                    setWorkouts(workoutsData || []);
                }
            } catch (error) {
                console.error('Error fetching student data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudentData();
    }, [user]);

    const handleLogout = async () => {
        localStorage.removeItem('userRole');
        await signOut();
        navigate('/', { replace: true });
    };

    const todayWorkout = workouts[0]; // First workout as "today's workout"

    if (loading) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-cyan-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-background-dark text-white pb-24">
            {/* Header */}
            <header className="bg-card-header sticky top-0 z-50 px-6 pt-12 pb-6 border-b border-white/5 backdrop-blur-md">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <img
                            src={studentInfo?.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(studentInfo?.name || user?.email || 'Aluno')}&background=22d3ee&color=fff`}
                            alt="Avatar"
                            className="size-14 rounded-2xl border-2 border-cyan-400/30 object-cover"
                        />
                        <div>
                            <p className="text-cyan-400 text-[10px] font-black uppercase tracking-widest">Bem-vindo</p>
                            <h1 className="text-xl font-black text-white uppercase tracking-tight">
                                {studentInfo?.name || user?.email?.split('@')[0] || 'Aluno'}
                            </h1>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="size-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-red-400 hover:border-red-400/30 transition-all"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            <main className="px-4 py-6 space-y-6">
                {/* Today's Workout Card */}
                {todayWorkout ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative overflow-hidden"
                    >
                        <Card className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/5 border-cyan-400/30 p-6 rounded-[2rem]">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="size-14 rounded-2xl bg-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                                        <Dumbbell size={28} className="text-background-dark" />
                                    </div>
                                    <div>
                                        <p className="text-cyan-400 text-[10px] font-black uppercase tracking-widest">Treino de Hoje</p>
                                        <h2 className="text-xl font-black text-white uppercase tracking-tight">{todayWorkout.name}</h2>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-cyan-400/70">
                                    <Clock size={14} />
                                    <span className="text-[10px] font-black uppercase">~45 min</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3 mb-6">
                                <span className="px-3 py-1 bg-cyan-400/10 border border-cyan-400/20 rounded-full text-[10px] font-black uppercase text-cyan-400">
                                    {todayWorkout.objective || 'Hipertrofia'}
                                </span>
                                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase text-white/60">
                                    {todayWorkout.level || 'Intermediário'}
                                </span>
                            </div>

                            <Button
                                onClick={() => navigate(`/student/workout/${todayWorkout.id}`)}
                                className="w-full h-14 rounded-2xl bg-cyan-400 text-background-dark font-black uppercase tracking-widest shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all"
                            >
                                <Play size={20} className="mr-2" />
                                Iniciar Treino
                            </Button>
                        </Card>
                    </motion.div>
                ) : (
                    <Card className="bg-card-dark border-white/5 p-8 text-center rounded-[2rem]">
                        <Dumbbell size={48} className="mx-auto mb-4 text-slate-600" />
                        <h3 className="text-lg font-black text-white uppercase mb-2">Nenhum Treino</h3>
                        <p className="text-slate-500 text-sm">Seu treinador ainda não atribuiu treinos para você.</p>
                    </Card>
                )}

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { icon: Calendar, label: 'Treinos', value: workouts.length.toString() },
                        { icon: TrendingUp, label: 'Sequência', value: '5 dias' },
                        { icon: Clock, label: 'Tempo', value: '12h' }
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-card-dark border border-white/5 rounded-2xl p-4 text-center"
                        >
                            <stat.icon size={20} className="mx-auto mb-2 text-cyan-400" />
                            <p className="text-xl font-black text-white">{stat.value}</p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* All Workouts */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-sm font-black uppercase tracking-widest text-white">Meus Treinos</h3>
                        <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">{workouts.length} rotinas</span>
                    </div>

                    <div className="space-y-3">
                        {workouts.map((workout, i) => (
                            <motion.div
                                key={workout.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Card
                                    className="bg-card-dark border-white/5 p-5 rounded-2xl cursor-pointer hover:border-cyan-400/30 transition-all group"
                                    onClick={() => navigate(`/student/workout/${workout.id}`)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center group-hover:bg-cyan-400/20 transition-colors">
                                            <Dumbbell size={20} className="text-cyan-400" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-white font-black uppercase tracking-tight group-hover:text-cyan-400 transition-colors">{workout.name}</h4>
                                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                                                {workout.date_range || 'Sem período definido'}
                                            </p>
                                        </div>
                                        <ChevronRight size={20} className="text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Student Navigation Bar */}
            <nav className="fixed bottom-0 left-0 right-0 bg-card-header/95 backdrop-blur-xl border-t border-white/5 px-6 py-4 z-50">
                <div className="flex justify-around items-center">
                    {[
                        { icon: Home, label: 'Início', path: '/student-home', active: true },
                        { icon: Dumbbell, label: 'Treinos', path: '/student/workouts', active: false },
                        { icon: History, label: 'Histórico', path: '/student/history', active: false },
                        { icon: User, label: 'Perfil', path: '/student/profile', active: false }
                    ].map((item) => (
                        <button
                            key={item.label}
                            onClick={() => navigate(item.path)}
                            className={`flex flex-col items-center gap-1 transition-all ${item.active ? 'text-cyan-400' : 'text-slate-500 hover:text-white'
                                }`}
                        >
                            <item.icon size={24} className={item.active ? 'scale-110' : ''} />
                            <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
                        </button>
                    ))}
                </div>
            </nav>
        </div>
    );
};

export default StudentHomeView;
