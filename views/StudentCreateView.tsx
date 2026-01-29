
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudent } from '../contexts/StudentContext';

const StudentCreateView: React.FC = () => {
    const navigate = useNavigate();
    const { addStudent } = useStudent();
    const [loading, setLoading] = useState(false);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        group_type: 'Online' as 'Online' | 'Presencial',
        birth_date: '',
        whatsapp: '',
        gender: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('A imagem deve ter no máximo 5MB');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePhotoClick = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || loading) return;

        setLoading(true);
        try {
            await addStudent({
                name: formData.name,
                email: formData.email,
                group_type: formData.group_type,
                birth_date: formData.birth_date,
                whatsapp: formData.whatsapp,
                gender: formData.gender,
                image_url: photoPreview || undefined
            });
            navigate('/students');
        } catch (error) {
            console.error('Error saving student:', error);
            alert('Erro ao salvar aluno. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background-dark text-white p-6 pb-24">
            <header className="flex items-center justify-between mb-8">
                <button onClick={() => navigate(-1)} className="text-white hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-3xl">arrow_back_ios</span>
                </button>
                <h1 className="text-2xl font-black uppercase tracking-wider">Novo Aluno</h1>
                <div className="w-8"></div>
            </header>

            <main className="flex-1 max-w-lg mx-auto w-full">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Photo Upload */}
                    <div className="flex flex-col items-center mb-6">
                        <div
                            onClick={handlePhotoClick}
                            className="relative cursor-pointer group"
                        >
                            <div className="w-28 h-28 rounded-full bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden transition-all group-hover:border-primary group-hover:bg-primary/5">
                                {photoPreview ? (
                                    <img
                                        src={photoPreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="material-symbols-outlined text-4xl text-slate-500 group-hover:text-primary transition-colors">
                                        add_a_photo
                                    </span>
                                )}
                            </div>
                            {photoPreview && (
                                <div className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
                                    <span className="material-symbols-outlined text-background-dark text-lg">edit</span>
                                </div>
                            )}
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="hidden"
                        />
                        <p className="text-xs text-slate-500 mt-3 text-center">
                            {photoPreview ? 'Clique para alterar a foto' : 'Adicionar foto do aluno'}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Nome Completo</label>
                        <div className="flex items-center px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus-within:border-primary transition-colors">
                            <span className="material-symbols-outlined text-slate-500 mr-3">person</span>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Ex: João da Silva"
                                className="bg-transparent border-none text-white w-full focus:ring-0 placeholder:text-slate-600 font-medium"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Email</label>
                        <div className="flex items-center px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus-within:border-primary transition-colors">
                            <span className="material-symbols-outlined text-slate-500 mr-3">mail</span>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Ex: joao@email.com"
                                className="bg-transparent border-none text-white w-full focus:ring-0 placeholder:text-slate-600 font-medium"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Grupo</label>
                            <div className="flex items-center px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus-within:border-primary transition-colors">
                                <span className="material-symbols-outlined text-slate-500 mr-3">group</span>
                                <select
                                    name="group_type"
                                    value={formData.group_type}
                                    onChange={handleChange}
                                    className="bg-transparent border-none text-white w-full focus:ring-0 font-medium [&>option]:bg-background-dark"
                                >
                                    <option value="Online">Online</option>
                                    <option value="Presencial">Presencial</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Nascimento</label>
                            <div className="flex items-center px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus-within:border-primary transition-colors">
                                <input
                                    type="date"
                                    name="birth_date"
                                    value={formData.birth_date}
                                    onChange={handleChange}
                                    className="bg-transparent border-none text-white w-full focus:ring-0 font-medium invert-calendar-icon"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">WhatsApp</label>
                        <div className="flex items-center px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus-within:border-primary transition-colors">
                            <span className="material-symbols-outlined text-slate-500 mr-3">chat</span>
                            <input
                                type="tel"
                                name="whatsapp"
                                value={formData.whatsapp}
                                onChange={handleChange}
                                placeholder="(00) 00000-0000"
                                className="bg-transparent border-none text-white w-full focus:ring-0 placeholder:text-slate-600 font-medium"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Gênero</label>
                        <div className="flex  items-center px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus-within:border-primary transition-colors">
                            <span className="material-symbols-outlined text-slate-500 mr-3">wc</span>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="bg-transparent border-none text-white w-full focus:ring-0 font-medium [&>option]:bg-background-dark"
                            >
                                <option value="" disabled>Selecione</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Feminino">Feminino</option>
                                <option value="Outro">Outro</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full h-14 bg-gradient-to-r from-primary to-[#00a0c0] rounded-2xl text-background-dark font-black text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all uppercase tracking-widest flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
                        >
                            {loading ? (
                                <>
                                    <span className="animate-spin material-symbols-outlined">progress_activity</span>
                                    Salvando...
                                </>
                            ) : (
                                'Salvar Aluno'
                            )}
                        </button>
                    </div>

                </form>
            </main>
        </div>
    );
};

export default StudentCreateView;
