
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../src/lib/supabase';
import { Exercise } from '../types';

const ExerciseLibraryView: React.FC = () => {
    const navigate = useNavigate();
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'app' | 'yours' | 'favs'>('app');

    // Mock data for initial visual (matching image categories)
    const muscleGroups = ['Todos', 'Abdômen', 'Braços', 'Costas', 'Pernas', 'Peitoral', 'Ombros'];
    const categories = ['Todas', 'Musculação', 'Cardio', 'Alongamento', 'Funcional'];

    const [selectedMuscle, setSelectedMuscle] = useState('Todos');
    const [selectedCategory, setSelectedCategory] = useState('Todas');

    useEffect(() => {
        const fetchExercises = async () => {
            setLoading(true);
            try {
                // In a real app, we'd fetch from specialized tables. 
                // For now, we fetch from the generic exercises table.
                const { data, error } = await supabase
                    .from('exercises')
                    .select('*')
                    .limit(50);

                if (error) throw error;

                const mapped: Exercise[] = (data || []).map(ex => ({
                    id: ex.id,
                    name: ex.name,
                    sets: ex.sets || 3,
                    reps: ex.reps || '12',
                    load: ex.load || '0',
                    rest: ex.rest || '60s',
                    videoUrl: ex.video_url,
                    thumbnailUrl: ex.thumbnail_url || `https://picsum.photos/seed/${ex.id}/400/225`
                }));

                // Add some default exercises if DB is empty for demo purposes
                const defaultExercises: Exercise[] = [
                    { id: '1', name: 'Abdominal Canivete', sets: 3, reps: '15', load: '0', rest: '45s', thumbnailUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=400' },
                    { id: '2', name: 'Abdominal Canivete Alternado', sets: 3, reps: '20', load: '0', rest: '45s', thumbnailUrl: 'https://images.unsplash.com/photo-1548691905-57c36cc8d935?auto=format&fit=crop&q=80&w=400' },
                    { id: '3', name: 'Abdominal com Rodinha Solo', sets: 3, reps: '12', load: '0', rest: '60s', thumbnailUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=400' }
                ];

                const finalExercises = mapped.length > 0 ? mapped : defaultExercises;
                setExercises(finalExercises);
                setFilteredExercises(finalExercises);
            } catch (err) {
                console.error('Error fetching exercises:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchExercises();
    }, []);

    useEffect(() => {
        let result = exercises;

        if (searchQuery) {
            result = result.filter(ex => ex.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        // Muscle group filter (mock logic)
        if (selectedMuscle !== 'Todos') {
            // In real app, check muscle_group field
        }

        setFilteredExercises(result);
    }, [searchQuery, exercises, selectedMuscle, selectedCategory]);

    return (
        <div className="flex flex-col min-h-screen bg-background-dark pb-20">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-card-header/80 backdrop-blur-md px-6 pt-12 pb-6 border-b border-white/5">
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => navigate(-1)} className="text-primary hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-3xl">chevron_left</span>
                    </button>
                    <h1 className="text-2xl font-black tracking-tighter uppercase">Biblioteca de Exercícios</h1>
                </div>

                <button className="w-full flex items-center justify-center gap-3 rounded-2xl h-16 bg-white/[0.03] border border-primary/30 text-primary font-black uppercase tracking-widest text-sm shadow-glow active:scale-[0.98] transition-all hover:bg-primary/5 mb-6">
                    <span className="material-symbols-outlined text-2xl">add_circle</span>
                    Criar Exercício
                </button>

                <div className="flex gap-4">
                    <button className="flex-1 h-14 bg-white/[0.03] border border-white/10 rounded-xl text-slate-400 font-bold uppercase tracking-widest text-[10px] hover:border-primary/50 hover:text-white transition-all">Grupos</button>
                    <button className="flex-1 h-14 bg-white/[0.03] border border-white/10 rounded-xl text-slate-400 font-bold uppercase tracking-widest text-[10px] hover:border-primary/50 hover:text-white transition-all">Categorias</button>
                </div>
            </header>

            <main className="px-6 py-8 space-y-8">
                {/* Search */}
                <div className="relative group">
                    <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors">search</span>
                    <input
                        type="text"
                        placeholder="Buscar exercícios..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-16 bg-white/[0.02] border border-white/5 rounded-2xl pl-14 pr-4 text-white focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all font-bold placeholder:text-slate-700 outline-none"
                    />
                </div>

                {/* Filter Tabs */}
                <div className="flex bg-white/[0.02] p-1.5 rounded-2xl border border-white/5">
                    {[
                        { id: 'favs', label: 'Favoritos', icon: 'star' },
                        { id: 'app', label: 'Do App', icon: 'apps' },
                        { id: 'yours', label: 'Seus', icon: 'person' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id
                                    ? 'bg-primary text-background-dark shadow-glow'
                                    : 'text-slate-500 hover:text-white'
                                }`}
                        >
                            <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Dropdowns */}
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <select
                            value={selectedMuscle}
                            onChange={(e) => setSelectedMuscle(e.target.value)}
                            className="w-full h-12 bg-white/[0.02] border border-white/10 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 appearance-none outline-none focus:border-primary/50"
                        >
                            {muscleGroups.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none text-lg">expand_more</span>
                    </div>
                    <div className="flex-1 relative">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full h-12 bg-white/[0.02] border border-white/10 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 appearance-none outline-none focus:border-primary/50"
                        >
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none text-lg">expand_more</span>
                    </div>
                    <button
                        onClick={() => { setSelectedMuscle('Todos'); setSelectedCategory('Todas'); setSearchQuery(''); }}
                        className="px-4 text-[10px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors"
                    >
                        Limpar
                    </button>
                </div>

                {/* Exercise List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
                        </div>
                    ) : filteredExercises.length > 0 ? (
                        filteredExercises.map(ex => (
                            <div key={ex.id} className="bg-white/[0.03] border border-white/5 rounded-3xl p-4 flex gap-5 items-center hover:border-primary/30 transition-all group active:scale-[0.98]">
                                <div className="relative w-32 aspect-video rounded-2xl overflow-hidden shadow-2xl flex-shrink-0">
                                    <img
                                        src={ex.thumbnailUrl}
                                        alt={ex.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all flex items-center justify-center">
                                        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform">
                                            <span className="material-symbols-outlined fill-1">play_arrow</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-white font-black text-lg tracking-tight truncate group-hover:text-primary transition-colors">{ex.name}</h3>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <span className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black uppercase tracking-widest text-slate-400">Abdômen</span>
                                        <span className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black uppercase tracking-widest text-slate-400">Musculação</span>
                                    </div>
                                </div>
                                <button className="text-slate-600 hover:text-yellow-500 transition-colors">
                                    <span className="material-symbols-outlined text-2xl">star</span>
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 opacity-30">
                            <span className="material-symbols-outlined text-6xl block mb-4">search_off</span>
                            <p className="font-black uppercase tracking-widest text-sm">Nenhum resultado encontrado</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ExerciseLibraryView;
