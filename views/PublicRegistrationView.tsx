
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Logo } from '@/components/ui/Logo';

const PublicRegistrationView: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<'form' | 'success' | 'confirm_email'>('form');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validations
        if (formData.password !== formData.confirmPassword) {
            setError('As senhas não coincidem');
            return;
        }

        if (formData.password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres');
            return;
        }

        setLoading(true);

        try {
            // 1. Create user in Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.name,
                        role: 'student'
                    }
                }
            });

            if (authError) {
                if (authError.message.includes('already registered')) {
                    setError('Este email já está cadastrado. Faça login.');
                } else {
                    setError(authError.message);
                }
                return;
            }

            // 2. Create student in students table
            const image_url = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`;

            const { error: studentError } = await supabase
                .from('Alunos')
                .insert([{
                    name: formData.name,
                    email: formData.email,
                    whatsapp: formData.phone,
                    group_type: 'Online',
                    status: 'active',
                    plan: 'Sem treino definido',
                    image_url,
                    auth_user_id: authData.user?.id // Link to auth user
                }]);

            if (studentError) {
                console.error('Error creating student:', studentError);
                // Even if student creation fails, auth was successful
                // We can still show success but log the error
            }

            // Check if email confirmation is required
            if (authData.user && !authData.session) {
                // Email confirmation required
                setStep('confirm_email');
            } else {
                // Auto-confirmed (or confirmation disabled)
                setStep('success');
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError('Erro ao criar conta. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    // Email confirmation screen
    if (step === 'confirm_email') {
        return (
            <div className="flex flex-col min-h-screen bg-background-dark items-center justify-center p-6 text-center">
                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-primary text-5xl">mark_email_unread</span>
                </div>
                <h1 className="text-3xl font-black text-white mb-2">Confirme seu Email</h1>
                <p className="text-slate-400 mb-2 max-w-xs">
                    Enviamos um link de confirmação para:
                </p>
                <p className="text-white font-bold mb-6">{formData.email}</p>
                <p className="text-slate-500 text-sm mb-8 max-w-xs">
                    Verifique sua caixa de entrada e clique no link para ativar sua conta.
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="w-full max-w-xs h-14 bg-primary text-background-dark font-black rounded-2xl"
                >
                    Ir para Login
                </button>
            </div>
        );
    }

    // Success screen
    if (step === 'success') {
        return (
            <div className="flex flex-col min-h-screen bg-background-dark items-center justify-center p-6 text-center">
                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-green-500 text-5xl">check_circle</span>
                </div>
                <h1 className="text-3xl font-black text-white mb-2">Cadastro Realizado!</h1>
                <p className="text-slate-400 mb-8 max-w-xs">Seu cadastro foi concluído com sucesso. Agora você pode fazer login e acessar seus treinos.</p>
                <button
                    onClick={() => navigate('/')}
                    className="w-full max-w-xs h-14 bg-primary text-background-dark font-black rounded-2xl"
                >
                    Fazer Login
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-background-dark p-6">
            <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full">
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative inline-flex flex-col items-center group mb-6"
                    >
                        {/* Glow for integration */}
                        <div className="absolute inset-0 -m-8 bg-primary/10 rounded-full blur-2xl pointer-events-none opacity-50"></div>

                        <div className="relative z-10 w-full flex items-center justify-center">
                            <Logo size="lg" />
                        </div>
                    </motion.div>
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Crie sua conta para acessar seus treinos</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3">
                        <span className="material-symbols-outlined text-red-400">error</span>
                        <p className="text-red-400 text-sm font-medium">{error}</p>
                    </div>
                )}

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
                            disabled={loading}
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
                            disabled={loading}
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
                            disabled={loading}
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
                            placeholder="Mínimo 6 caracteres"
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Confirmar Senha</label>
                        <input
                            required
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-4 text-white focus:border-primary focus:ring-0 transition-colors"
                            placeholder="Repita a senha"
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 mt-6 bg-gradient-to-r from-primary to-[#00a0c0] text-background-dark font-black text-lg rounded-2xl shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-[0.98] transition-all uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="animate-spin material-symbols-outlined">progress_activity</span>
                        ) : (
                            'Cadastrar'
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-slate-500 text-sm">Já tem uma conta?</p>
                    <button
                        onClick={() => navigate('/')}
                        className="text-primary font-bold hover:underline"
                    >
                        Fazer login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PublicRegistrationView;
