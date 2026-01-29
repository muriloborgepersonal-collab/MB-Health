import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudent } from '../contexts/StudentContext';

const RoutineCreateView: React.FC = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const { students } = useStudent();
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checkbox = e.target as HTMLInputElement;
            setFormData(prev => ({ ...prev, [name]: checkbox.checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Routine Data:', formData);
        alert('Rotina salva com sucesso! (Simulação)');
        navigate(-1);
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#f3f4f6]">
            {/* Navy Header */}
            <header className="bg-[#1e2d40] px-6 pt-10 pb-20">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1 text-white mb-8 hover:opacity-80 transition-opacity"
                >
                    <span className="material-symbols-outlined !text-xl">chevron_left</span>
                    <span className="text-sm font-medium">Voltar</span>
                </button>

                <div className="flex items-center gap-4">
                    <img
                        src={student?.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(student?.name || 'Aluno')}&background=random`}
                        alt={student?.name}
                        className="size-16 rounded-full border-2 border-white/20 object-cover"
                    />
                    <h1 className="text-2xl font-medium text-white">{student?.name || 'Carregando...'}</h1>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 px-4 -mt-10 pb-24">
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm space-y-6">

                    {/* Nome da rotina */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-800">Nome da rotina</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Ex: Treino de Hipertrofia A"
                            className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            required
                        />
                    </div>

                    {/* Tipo dos treinos */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-800">Tipo dos treinos</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none"
                            required
                        >
                            <option value="">Selecione</option>
                            <option value="presencial">Presencial</option>
                            <option value="online">Online</option>
                            <option value="hibrido">Híbrido</option>
                        </select>
                    </div>

                    {/* Objetivo */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-800">Objetivo</label>
                        <select
                            name="objective"
                            value={formData.objective}
                            onChange={handleChange}
                            className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none"
                            required
                        >
                            <option value="">Selecione</option>
                            <option value="hipertrofia">Hipertrofia</option>
                            <option value="emagrecimento">Emagrecimento</option>
                            <option value="condicionamento">Condicionamento Físico</option>
                            <option value="forca">Força</option>
                        </select>
                    </div>

                    {/* Dificuldade */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-800">Dificuldade</label>
                        <select
                            name="difficulty"
                            value={formData.difficulty}
                            onChange={handleChange}
                            className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none"
                            required
                        >
                            <option value="">Selecione</option>
                            <option value="iniciante">Iniciante</option>
                            <option value="intermediario">Intermediário</option>
                            <option value="avancado">Avançado</option>
                        </select>
                    </div>

                    {/* Orientações gerais */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-800">Orientações gerais</label>
                        <textarea
                            name="instructions"
                            value={formData.instructions}
                            onChange={handleChange}
                            placeholder="Orientações gerais"
                            className="w-full h-32 p-4 rounded-xl border border-slate-200 bg-slate-50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                        />
                    </div>

                    {/* Permitir download PDF */}
                    <div className="space-y-3">
                        <p className="text-sm font-bold text-slate-800">Permitir que o aluno baixe o treino em pdf?</p>
                        <div className="flex gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="allowPdf"
                                    value="sim"
                                    checked={formData.allowPdf === 'sim'}
                                    onChange={handleChange}
                                    className="size-5 accent-primary"
                                />
                                <span className="text-sm text-slate-600">Sim</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="allowPdf"
                                    value="nao"
                                    checked={formData.allowPdf === 'nao'}
                                    onChange={handleChange}
                                    className="size-5 accent-primary"
                                />
                                <span className="text-sm text-slate-600">Não</span>
                            </label>
                        </div>
                    </div>

                    {/* Mostrar tempo do treino */}
                    <div className="space-y-3">
                        <p className="text-sm font-bold text-slate-800">Mostrar o tempo do treino para o aluno?</p>
                        <div className="flex gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="showTime"
                                    value="sim"
                                    checked={formData.showTime === 'sim'}
                                    onChange={handleChange}
                                    className="size-5 accent-primary"
                                />
                                <span className="text-sm text-slate-600">Sim</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="showTime"
                                    value="nao"
                                    checked={formData.showTime === 'nao'}
                                    onChange={handleChange}
                                    className="size-5 accent-primary"
                                />
                                <span className="text-sm text-slate-600">Não</span>
                            </label>
                        </div>
                    </div>

                    {/* Datas */}
                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-800">Começa em:</label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-800">Termina em:</label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Checkbox Options */}
                    <div className="space-y-4 pt-2">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                name="expireOnEnd"
                                checked={formData.expireOnEnd}
                                onChange={handleChange}
                                className="size-5 rounded-lg border-slate-300 accent-primary"
                            />
                            <span className="text-sm text-slate-700 font-medium">Retirar a rotina da tela do aluno quando ela vencer.</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                name="hideBeforeStart"
                                checked={formData.hideBeforeStart}
                                onChange={handleChange}
                                className="size-5 rounded-lg border-slate-300 accent-primary"
                            />
                            <span className="text-sm text-slate-700 font-medium">Não exibir essa rotina para o aluno antes da data de início</span>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full h-14 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all mt-8"
                    >
                        Salvar
                    </button>
                </form>
            </main>
        </div>
    );
};

export default RoutineCreateView;
