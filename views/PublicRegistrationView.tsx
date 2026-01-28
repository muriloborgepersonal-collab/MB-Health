
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudent } from '../contexts/StudentContext';

const PublicRegistrationView: React.FC = () => {
    const navigate = useNavigate();
    const { addStudent } = useStudent();
    const [step, setStep] = useState<'form' | 'success'>('form');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate creating student from public link
        addStudent({
            name: formData.name,
            email: formData.email,
            whatsapp: formData.phone,
            group: 'Online', // Default for public signup
            status: 'active'
        });
        setStep('success');
    };

    if (step === 'success') {
        return (
            <div className="flex flex-col min-h-screen bg-background-dark items-center justify-center p-6 text-center">
                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-green-500 text-5xl">check_circle</span>
                </div>
                <h1 className="text-3xl font-black text-white mb-2">Cadastro Realizado!</h1>
                <p className="text-slate-400 mb-8 max-w-xs">Seu cadastro foi enviado para o treinador. Aguarde a liberação do seu treino.</p>
                <button
                    onClick={() => navigate('/')} // Redirect to home/login in real app
                    className="w-full max-w-xs h-14 bg-primary text-background-dark font-black rounded-2xl"
                >
                    Voltar ao Início
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-background-dark p-6">
            <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full">
                <div className="text-center mb-10">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 shadow-glow mb-4">
                        <span className="material-symbols-outlined text-primary text-4xl">fitness_center</span>
                    </div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-widest">MBHealth</h1>
                    <p className="text-slate-400 text-sm mt-2">Crie sua conta para acessar seus treinos</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Nome Completo</label>
                        <input
                            required
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-4 text-white focus:border-primary focus:ring-0 transition-colors"
                            placeholder="Digite seu nome"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email</label>
                        <input
                            required
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-4 text-white focus:border-primary focus:ring-0 transition-colors"
                            placeholder="Digite seu melhor email"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">WhatsApp</label>
                        <input
                            required
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-4 text-white focus:border-primary focus:ring-0 transition-colors"
                            placeholder="(00) 00000-0000"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Senha</label>
                        <input
                            required
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-4 text-white focus:border-primary focus:ring-0 transition-colors"
                            placeholder="Crie uma senha"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full h-14 mt-6 bg-gradient-to-r from-primary to-[#00a0c0] text-background-dark font-black text-lg rounded-2xl shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-[0.98] transition-all uppercase tracking-widest"
                    >
                        Cadastrar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PublicRegistrationView;
