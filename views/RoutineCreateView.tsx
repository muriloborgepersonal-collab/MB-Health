import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudent } from '../contexts/StudentContext';

const RoutineCreateView: React.FC = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const { students, addWorkout } = useStudent();
    const student = students.find(s => s.id === studentId);

    const [formData, setFormData] = useState({
        name: '',
        type: '',
        objective: '',
        difficulty: '',
        instructions: '',
        allowPdf: 'sim',
        showTime: 'sim',
        startDate: '',
        endDate: '',
        expireOnEnd: false,
        hideBeforeStart: false
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checkbox = e.target as HTMLInputElement;
            setFormData(prev => ({ ...prev, [name]: checkbox.checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!studentId) return;

        setIsSaving(true);
        try {
            const difficultyMap: Record<string, 'Iniciante' | 'Intermediário' | 'Avançado'> = {
                'iniciante': 'Iniciante',
                'intermediario': 'Intermediário',
                'avancado': 'Avançado'
            };
            const workoutId = await addWorkout(studentId, {
                name: formData.name,
                type: formData.type,
                objective: formData.objective,
                level: difficultyMap[formData.difficulty] || 'Iniciante',
                dateRange: `${formData.startDate} - ${formData.endDate}`,
                instructions: formData.instructions,
                allowPdf: formData.allowPdf === 'sim',
                showTime: formData.showTime === 'sim',
                expireOnEnd: formData.expireOnEnd,
                hideBeforeStart: formData.hideBeforeStart
            });

            console.log('Routine created with ID:', workoutId);

            // Redirect to routine details
            navigate(`/routine/${workoutId}`);
        } catch (error) {
            console.error('Error saving routine:', error);
            alert('Erro ao salvar a rotina. Tente novamente.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background-dark">
            {/* Dark Header */}
            <header className="bg-card-header px-6 pt-12 pb-24 border-b border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5">
                    <span className="material-symbols-outlined text-[120px]">add_task</span>
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
                        <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-1">Nova Rotina de Treino</p>
                        <h1 className="text-2xl font-black text-white uppercase tracking-tight">{student?.name || 'Carregando...'}</h1>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 px-4 -mt-12 pb-24">
                <form onSubmit={handleSubmit} className="bg-card-dark border border-white/5 rounded-[2rem] p-8 shadow-2xl space-y-8 relative z-10">

                    {/* Nome da rotina */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Nome da rotina</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Ex: Treino de Hipertrofia A"
                            className="w-full h-14 px-6 rounded-2xl border border-white/10 bg-white/[0.02] text-white placeholder:text-slate-600 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all shadow-inner"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {/* Tipo dos treinos */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Tipo dos treinos</label>
                            <div className="relative">
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full h-14 px-6 rounded-2xl border border-white/10 bg-white/[0.02] text-white focus:border-primary outline-none transition-all appearance-none shadow-inner"
                                    required
                                >
                                    <option value="" className="bg-card-dark">Selecione</option>
                                    <option value="Numérico" className="bg-card-dark text-white text-base">Numérico</option>
                                    <option value="Dias da semana" className="bg-card-dark text-white text-base">Dias da semana</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none">expand_more</span>
                            </div>
                        </div>

                        {/* Objetivo */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Objetivo</label>
                            <div className="relative">
                                <select
                                    name="objective"
                                    value={formData.objective}
                                    onChange={handleChange}
                                    className="w-full h-14 px-6 rounded-2xl border border-white/10 bg-white/[0.02] text-white focus:border-primary outline-none transition-all appearance-none shadow-inner"
                                    required
                                >
                                    <option value="" className="bg-card-dark">Selecione</option>
                                    <option value="hipertrofia" className="bg-card-dark">Hipertrofia</option>
                                    <option value="emagrecimento" className="bg-card-dark">Emagrecimento</option>
                                    <option value="condicionamento" className="bg-card-dark">Condicionamento Físico</option>
                                    <option value="forca" className="bg-card-dark">Força</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none">expand_more</span>
                            </div>
                        </div>

                        {/* Dificuldade */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Dificuldade</label>
                            <div className="relative">
                                <select
                                    name="difficulty"
                                    value={formData.difficulty}
                                    onChange={handleChange}
                                    className="w-full h-14 px-6 rounded-2xl border border-white/10 bg-white/[0.02] text-white focus:border-primary outline-none transition-all appearance-none shadow-inner"
                                    required
                                >
                                    <option value="" className="bg-card-dark">Selecione</option>
                                    <option value="iniciante" className="bg-card-dark">Iniciante</option>
                                    <option value="intermediario" className="bg-card-dark">Intermediário</option>
                                    <option value="avancado" className="bg-card-dark">Avançado</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none">expand_more</span>
                            </div>
                        </div>
                    </div>

                    {/* Orientações gerais */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Orientações gerais</label>
                        <textarea
                            name="instructions"
                            value={formData.instructions}
                            onChange={handleChange}
                            placeholder="Descreva as orientações principais para esta rotina..."
                            className="w-full h-40 p-6 rounded-[1.5rem] border border-white/10 bg-white/[0.02] text-white placeholder:text-slate-700 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none shadow-inner"
                        />
                    </div>

                    {/* Permitir download PDF */}
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4">
                        <p className="text-xs font-black uppercase tracking-widest text-white">Permitir download em PDF?</p>
                        <div className="flex gap-8">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="allowPdf"
                                    value="sim"
                                    checked={formData.allowPdf === 'sim'}
                                    onChange={handleChange}
                                    className="size-6 bg-white/5 border-white/10 text-primary focus:ring-primary accent-primary"
                                />
                                <span className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors">Sim</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="allowPdf"
                                    value="nao"
                                    checked={formData.allowPdf === 'nao'}
                                    onChange={handleChange}
                                    className="size-6 bg-white/5 border-white/10 text-primary focus:ring-primary accent-primary"
                                />
                                <span className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors">Não</span>
                            </label>
                        </div>
                    </div>

                    {/* Mostrar tempo do treino */}
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4">
                        <p className="text-xs font-black uppercase tracking-widest text-white">Mostrar o tempo do treino?</p>
                        <div className="flex gap-8">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="showTime"
                                    value="sim"
                                    checked={formData.showTime === 'sim'}
                                    onChange={handleChange}
                                    className="size-6 bg-white/5 border-white/10 text-primary focus:ring-primary accent-primary"
                                />
                                <span className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors">Sim</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="showTime"
                                    value="nao"
                                    checked={formData.showTime === 'nao'}
                                    onChange={handleChange}
                                    className="size-6 bg-white/5 border-white/10 text-primary focus:ring-primary accent-primary"
                                />
                                <span className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors">Não</span>
                            </label>
                        </div>
                    </div>

                    {/* Datas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Data de Início</label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                className="w-full h-14 px-6 rounded-2xl border border-white/10 bg-white/[0.02] text-white focus:border-primary outline-none transition-all shadow-inner [color-scheme:dark]"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Data de Término</label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                className="w-full h-14 px-6 rounded-2xl border border-white/10 bg-white/[0.02] text-white focus:border-primary outline-none transition-all shadow-inner [color-scheme:dark]"
                            />
                        </div>
                    </div>

                    {/* Checkbox Options */}
                    <div className="space-y-4 pt-4 border-t border-white/5">
                        <label className="flex items-center gap-4 cursor-pointer group">
                            <input
                                type="checkbox"
                                name="expireOnEnd"
                                checked={formData.expireOnEnd}
                                onChange={handleChange}
                                className="size-6 rounded-lg border-white/10 bg-white/5 text-primary focus:ring-primary accent-primary"
                            />
                            <span className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors">Retirar do aluno após o vencimento</span>
                        </label>
                        <label className="flex items-center gap-4 cursor-pointer group">
                            <input
                                type="checkbox"
                                name="hideBeforeStart"
                                checked={formData.hideBeforeStart}
                                onChange={handleChange}
                                className="size-6 rounded-lg border-white/10 bg-white/5 text-primary focus:ring-primary accent-primary"
                            />
                            <span className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors">Esconder antes da data de início</span>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full h-16 bg-primary text-background-dark font-black uppercase tracking-[0.2em] text-sm rounded-2xl shadow-glow active:scale-[0.98] transition-all mt-12 hover:shadow-neon flex items-center justify-center gap-3"
                    >
                        {isSaving ? (
                            <span className="material-symbols-outlined animate-spin">progress_activity</span>
                        ) : 'Salvar Rotina'}
                    </button>
                </form>
            </main>
        </div>
    );
};

export default RoutineCreateView;
