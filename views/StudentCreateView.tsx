
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
            <header className="px-6 pt-12 pb-6 border-b border-white/5 bg-card-header/80 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="p-3 bg-card-dark border border-white/5 rounded-2xl hover:border-primary/50 transition-all active:scale-95 group">
                        <span className="material-symbols-outlined text-2xl text-slate-400 group-hover:text-primary">arrow_back_ios_new</span>
                    </button>
                    <div className="flex flex-col items-center">
                        <h1 className="text-xl font-black uppercase tracking-[0.2em] text-white">Novo Aluno</h1>
                        <div className="h-0.5 w-8 bg-primary mt-1"></div>
                    </div>
                    <div className="w-14"></div>
                </div>
            </header>

            <main className="flex-1 max-w-lg mx-auto w-full">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Photo Upload */}
                    <div className="flex flex-col items-center mb-10">
                        <div
                            onClick={handlePhotoClick}
                            className="relative cursor-pointer group"
                        >
                            <div className="w-32 h-32 rounded-[2.5rem] bg-white/[0.02] border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden transition-all group-hover:border-primary/50 group-hover:bg-primary/5 shadow-inner">
                                {photoPreview ? (
                                    <img
                                        src={photoPreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="material-symbols-outlined text-5xl text-slate-600 group-hover:text-primary transition-colors">
                                            add_a_photo
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-glow border-4 border-background-dark group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-background-dark text-xl font-black">add</span>
                            </div>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="hidden"
                        />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mt-5">
                            {photoPreview ? 'Toque para alterar' : 'Foto do Perfil'}
                        </p>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Nome Completo</label>
                        <div className="flex items-center px-6 h-16 bg-white/[0.02] border border-white/5 rounded-2xl focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/5 transition-all shadow-inner group">
                            <span className="material-symbols-outlined text-slate-600 mr-4 group-focus-within:text-primary transition-colors">person</span>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Ex: João da Silva"
                                className="bg-transparent border-none text-white w-full focus:ring-0 placeholder:text-slate-700 font-bold outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Email</label>
                        <div className="flex items-center px-6 h-16 bg-white/[0.02] border border-white/5 rounded-2xl focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/5 transition-all shadow-inner group">
                            <span className="material-symbols-outlined text-slate-600 mr-4 group-focus-within:text-primary transition-colors">mail</span>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Ex: joao@email.com"
                                className="bg-transparent border-none text-white w-full focus:ring-0 placeholder:text-slate-700 font-bold outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Grupo</label>
                            <div className="flex items-center px-6 h-16 bg-white/[0.02] border border-white/5 rounded-2xl focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/5 transition-all shadow-inner group">
                                <span className="material-symbols-outlined text-slate-600 mr-3 group-focus-within:text-primary transition-colors">group</span>
                                <select
                                    name="group_type"
                                    value={formData.group_type}
                                    onChange={handleChange}
                                    className="bg-transparent border-none text-white w-full focus:ring-0 font-bold [&>option]:bg-background-dark outline-none cursor-pointer"
                                >
                                    <option value="Online">Online</option>
                                    <option value="Presencial">Presencial</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Nascimento</label>
                            <div className="flex items-center px-6 h-16 bg-white/[0.02] border border-white/5 rounded-2xl focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/5 transition-all shadow-inner group">
                                <input
                                    type="date"
                                    name="birth_date"
                                    value={formData.birth_date}
                                    onChange={handleChange}
                                    className="bg-transparent border-none text-white w-full focus:ring-0 font-bold invert-calendar-icon outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">WhatsApp</label>
                        <div className="flex items-center px-6 h-16 bg-white/[0.02] border border-white/5 rounded-2xl focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/5 transition-all shadow-inner group">
                            <span className="material-symbols-outlined text-slate-600 mr-4 group-focus-within:text-primary transition-colors">chat</span>
                            <input
                                type="tel"
                                name="whatsapp"
                                value={formData.whatsapp}
                                onChange={handleChange}
                                placeholder="(00) 00000-0000"
                                className="bg-transparent border-none text-white w-full focus:ring-0 placeholder:text-slate-700 font-bold outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Gênero</label>
                        <div className="flex items-center px-6 h-16 bg-white/[0.02] border border-white/5 rounded-2xl focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/5 transition-all shadow-inner group">
                            <span className="material-symbols-outlined text-slate-600 mr-4 group-focus-within:text-primary transition-colors">wc</span>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="bg-transparent border-none text-white w-full focus:ring-0 font-bold [&>option]:bg-background-dark outline-none cursor-pointer"
                            >
                                <option value="" disabled>Selecione</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Feminino">Feminino</option>
                                <option value="Outro">Outro</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-10">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full h-18 py-6 bg-primary rounded-2xl text-background-dark font-black text-sm shadow-glow active:scale-[0.98] transition-all uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:shadow-neon ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <>
                                    <span className="animate-spin material-symbols-outlined font-black">progress_activity</span>
                                    SALVANDO...
                                </>
                            ) : (
                                <>
                                    SALVAR NOVO ALUNO
                                    <span className="material-symbols-outlined font-black">check_circle</span>
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </main>
        </div>
    );
};

export default StudentCreateView;
