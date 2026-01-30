
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

    const [dynamicMuscleGroups, setDynamicMuscleGroups] = useState<{ id: string, name: string }[]>([]);
    const categories = ['Todas', 'Musculação', 'Cardio', 'Alongamento', 'Funcional'];

    const [selectedMuscle, setSelectedMuscle] = useState('Todos');
    const [selectedCategory, setSelectedCategory] = useState('Todas');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGroupsModalOpen, setIsGroupsModalOpen] = useState(false);
    const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
    const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
    const [newExercise, setNewExercise] = useState({ name: '', muscle_group: '', category: 'Musculação', video_url: '' });

    // Group management state
    const [newGroupName, setNewGroupName] = useState('');
    const [editingGroup, setEditingGroup] = useState<{ id: string, name: string } | null>(null);

    const fetchMuscleGroups = async () => {
        const { data, error } = await supabase
            .from('muscle_groups')
            .select('*')
            .order('name', { ascending: true });

        if (!error && data) {
            setDynamicMuscleGroups(data);
            if (!newExercise.muscle_group && data.length > 0) {
                setNewExercise(prev => ({ ...prev, muscle_group: data[0].name }));
            }
        }
    };

    const handleSaveGroup = async () => {
        if (!newGroupName) return;
        try {
            if (editingGroup) {
                const { error } = await supabase
                    .from('muscle_groups')
                    .update({ name: newGroupName })
                    .eq('id', editingGroup.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('muscle_groups')
                    .insert([{ name: newGroupName }]);
                if (error) throw error;
            }
            setNewGroupName('');
            setEditingGroup(null);
            fetchMuscleGroups();
        } catch (err: any) {
            alert('Erro ao salvar grupo: ' + err.message);
        }
    };

    const handleDeleteGroup = async (id: string) => {
        if (!confirm('Tem certeza? Isso pode afetar exercícios vinculados a este grupo.')) return;
        try {
            const { error } = await supabase.from('muscle_groups').delete().eq('id', id);
            if (error) throw error;
            fetchMuscleGroups();
        } catch (err: any) {
            alert('Erro ao excluir grupo: ' + err.message);
        }
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

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este exercício?')) return;

        try {
            const { error } = await supabase
                .from('exercise_library')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setExercises(prev => prev.filter(ex => ex.id !== id));
        } catch (err: any) {
            console.error('Error deleting exercise:', err);
            alert('Erro ao excluir exercício: ' + err.message);
        }
    };

    const handleEdit = (exercise: Exercise) => {
        setEditingExercise(exercise);
        setNewExercise({
            name: exercise.name,
            muscle_group: exercise.muscle_group || (dynamicMuscleGroups[0]?.name || ''),
            category: exercise.category || 'Musculação',
            video_url: exercise.videoUrl || ''
        });
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!newExercise.name || !newExercise.video_url) return;

        let thumbnailUrl = '';
        try {
            const videoId = newExercise.video_url.split('v=')[1]?.split('&')[0];
            if (videoId) {
                thumbnailUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;
            } else if (newExercise.video_url.includes('youtu.be/')) {
                const shortId = newExercise.video_url.split('youtu.be/')[1]?.split('?')[0];
                if (shortId) thumbnailUrl = `https://img.youtube.com/vi/${shortId}/0.jpg`;
            }
        } catch (e) { }

        try {
            if (editingExercise) {
                const { error } = await supabase
                    .from('exercise_library')
                    .update({
                        name: newExercise.name,
                        muscle_group: newExercise.muscle_group,
                        category: newExercise.category,
                        video_url: newExercise.video_url,
                        thumbnail_url: thumbnailUrl
                    })
                    .eq('id', editingExercise.id);

                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('exercise_library')
                    .insert([{
                        name: newExercise.name,
                        muscle_group: newExercise.muscle_group,
                        category: newExercise.category,
                        video_url: newExercise.video_url,
                        thumbnail_url: thumbnailUrl
                    }]);

                if (error) throw error;
            }

            setIsModalOpen(false);
            setEditingExercise(null);
            setNewExercise({ name: '', muscle_group: dynamicMuscleGroups[0]?.name || '', category: 'Musculação', video_url: '' });
            window.location.reload();
        } catch (err: any) {
            console.error('Error saving exercise:', err);
            alert(`Erro ao salvar: ${err.message}`);
        }
    };

    useEffect(() => {
        fetchMuscleGroups();
        const fetchExercises = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('exercise_library')
                    .select('*')
                    .order('name', { ascending: true });

                if (error) {
                    console.warn('exercise_library table not found or error, using fallback:', error);
                    throw error;
                }

                const mapped: Exercise[] = (data || []).map(ex => ({
                    id: ex.id,
                    name: ex.name,
                    muscle_group: ex.muscle_group,
                    category: ex.category,
                    sets: 3,
                    reps: '12',
                    load: '0',
                    rest: '60s',
                    videoUrl: ex.video_url,
                    thumbnailUrl: ex.thumbnail_url || (ex.video_url ? `https://img.youtube.com/vi/${ex.video_url.split('v=')[1]?.split('&')[0]}/0.jpg` : `https://picsum.photos/seed/${ex.id}/400/225`)
                }));

                setExercises(mapped);
                setFilteredExercises(mapped);
            } catch (err) {
                const fallbackExercises: Exercise[] = [
                    { id: '1', name: 'Supino Reto com Barra', sets: 3, reps: '10', load: '40kg', rest: '60s', thumbnailUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400', muscle_group: 'Peitoral', category: 'Musculação' },
                    { id: '2', name: 'Agachamento Livre', sets: 4, reps: '12', load: '60kg', rest: '90s', thumbnailUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=400', muscle_group: 'Pernas', category: 'Musculação' },
                    { id: '3', name: 'Abdominal Canivete', sets: 3, reps: '15', load: '0', rest: '45s', thumbnailUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=400', muscle_group: 'Abdômen', category: 'Musculação' }
                ];
                setExercises(fallbackExercises);
                setFilteredExercises(fallbackExercises);
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

        if (selectedMuscle !== 'Todos') {
            result = result.filter(ex => ex.muscle_group === selectedMuscle);
        }

        if (selectedCategory !== 'Todas') {
            result = result.filter(ex => ex.category === selectedCategory);
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

                <button
                    onClick={() => {
                        setEditingExercise(null);
                        setNewExercise({ name: '', muscle_group: dynamicMuscleGroups[0]?.name || '', category: 'Musculação', video_url: '' });
                        setIsModalOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-3 rounded-2xl h-16 bg-white/[0.03] border border-primary/30 text-primary font-black uppercase tracking-widest text-sm shadow-glow active:scale-[0.98] transition-all hover:bg-primary/5 mb-6"
                >
                    <span className="material-symbols-outlined text-2xl">add_circle</span>
                    Criar Exercício
                </button>

                <div className="flex gap-4">
                    <button
                        onClick={() => setIsGroupsModalOpen(true)}
                        className="flex-1 h-14 bg-white/[0.03] border border-white/10 rounded-xl text-slate-400 font-bold uppercase tracking-widest text-[10px] hover:border-primary/50 hover:text-white transition-all"
                    >
                        Grupos
                    </button>
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
                            <option value="Todos">Todos os Grupos</option>
                            {dynamicMuscleGroups.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
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
                            <div key={ex.id} className="bg-white/[0.03] border border-white/5 rounded-3xl p-4 flex gap-5 items-center hover:border-primary/30 transition-all group">
                                <div
                                    className="relative w-32 aspect-video rounded-2xl overflow-hidden shadow-2xl flex-shrink-0 cursor-pointer active:scale-95 transition-transform"
                                    onClick={() => ex.videoUrl && setSelectedVideoUrl(ex.videoUrl)}
                                >
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
                                <div
                                    className="flex-1 min-w-0 cursor-pointer"
                                    onClick={() => ex.videoUrl && setSelectedVideoUrl(ex.videoUrl)}
                                >
                                    <h3 className="text-white font-black text-lg tracking-tight truncate group-hover:text-primary transition-colors">{ex.name}</h3>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <span className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black uppercase tracking-widest text-slate-400">{ex.muscle_group || 'Musculação'}</span>
                                        <span className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black uppercase tracking-widest text-slate-400">{ex.category || 'Geral'}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(ex)}
                                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary/50 transition-all"
                                    >
                                        <span className="material-symbols-outlined text-xl">edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(ex.id)}
                                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-red-500 hover:border-red-500/50 transition-all"
                                    >
                                        <span className="material-symbols-outlined text-xl">delete</span>
                                    </button>
                                </div>
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

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background-dark/95 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-card-dark border border-white/10 rounded-[2.5rem] p-8 space-y-6 shadow-glow-lg">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">{editingExercise ? 'Editar Exercício' : 'Novo Exercício'}</h2>
                            <button onClick={() => { setIsModalOpen(false); setEditingExercise(null); }} className="text-slate-500 hover:text-white">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Nome do Exercício</label>
                                <input
                                    type="text"
                                    value={newExercise.name}
                                    onChange={e => setNewExercise({ ...newExercise, name: e.target.value })}
                                    placeholder="Ex: Supino Reto"
                                    className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-xl px-4 text-white focus:border-primary outline-none font-bold"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Link do YouTube</label>
                                <input
                                    type="text"
                                    value={newExercise.video_url}
                                    onChange={e => setNewExercise({ ...newExercise, video_url: e.target.value })}
                                    placeholder="Cole o link aqui..."
                                    className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-xl px-4 text-white focus:border-primary outline-none font-bold"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Grupo Muscular</label>
                                    <select
                                        value={newExercise.muscle_group}
                                        onChange={e => setNewExercise({ ...newExercise, muscle_group: e.target.value })}
                                        className="w-full h-14 bg-card-header border border-white/10 rounded-xl px-4 text-white focus:border-primary outline-none font-bold appearance-none cursor-pointer"
                                    >
                                        {dynamicMuscleGroups.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                                    </select>
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Categoria</label>
                                    <select
                                        value={newExercise.category}
                                        onChange={e => setNewExercise({ ...newExercise, category: e.target.value })}
                                        className="w-full h-14 bg-card-header border border-white/10 rounded-xl px-4 text-white focus:border-primary outline-none font-bold appearance-none cursor-pointer"
                                    >
                                        {categories.filter(c => c !== 'Todas').map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleSave}
                            className="w-full h-16 bg-primary text-background-dark font-black uppercase tracking-widest rounded-2xl shadow-glow active:scale-95 transition-all"
                        >
                            {editingExercise ? 'Salvar Alterações' : 'Salvar Exercício'}
                        </button>
                    </div>
                </div>
            )}

            {/* Muscle Groups Management Modal */}
            {isGroupsModalOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-background-dark/95 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-card-dark border border-white/10 rounded-[2.5rem] p-8 space-y-6 shadow-glow-lg">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Grupos Musculares</h2>
                            <button onClick={() => { setIsGroupsModalOpen(false); setEditingGroup(null); setNewGroupName(''); }} className="text-slate-500 hover:text-white">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Create/Edit Group Form */}
                        <div className="flex gap-3">
                            <input
                                type="text"
                                placeholder="Novo grupo..."
                                value={newGroupName}
                                onChange={(e) => setNewGroupName(e.target.value)}
                                className="flex-1 h-14 bg-white/[0.03] border border-white/10 rounded-xl px-4 text-white focus:border-primary outline-none font-bold"
                            />
                            <button
                                onClick={handleSaveGroup}
                                className="w-14 h-14 bg-primary text-background-dark rounded-xl flex items-center justify-center shadow-glow active:scale-90 transition-all font-black"
                            >
                                <span className="material-symbols-outlined">check</span>
                            </button>
                        </div>

                        <div className="max-h-[40vh] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                            {dynamicMuscleGroups.map(group => (
                                <div key={group.id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl group">
                                    <span className="text-white font-bold">{group.name}</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => { setEditingGroup(group); setNewGroupName(group.name); }}
                                            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-primary transition-all"
                                        >
                                            <span className="material-symbols-outlined text-sm">edit</span>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteGroup(group.id)}
                                            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-red-500 transition-all"
                                        >
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Video Modal */}
            {selectedVideoUrl && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-background-dark/98 backdrop-blur-xl">
                    <div className="w-full max-w-4xl aspect-video bg-black rounded-[2rem] overflow-hidden border border-white/10 shadow-glow-lg relative">
                        <button
                            onClick={() => setSelectedVideoUrl(null)}
                            className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-primary hover:text-background-dark transition-all"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>

                        {getYouTubeEmbedUrl(selectedVideoUrl) ? (
                            <iframe
                                src={getYouTubeEmbedUrl(selectedVideoUrl)!}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                                <span className="material-symbols-outlined text-6xl mb-4">video_off</span>
                                <p className="font-black uppercase tracking-widest">Link de vídeo inválido</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExerciseLibraryView;
