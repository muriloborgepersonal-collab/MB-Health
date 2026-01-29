
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SignUpView: React.FC = () => {
    const navigate = useNavigate();
    const { signUp } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validations
        if (password !== confirmPassword) {
            setError('As senhas não coincidem');
            return;
        }

        if (password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres');
            return;
        }

        setLoading(true);

        try {
            const { error } = await signUp(email, password, name);

            if (error) {
                if (error.message.includes('already registered')) {
                    setError('Este email já está cadastrado');
                } else {
                    setError(error.message);
                }
            } else {
                setSuccess(true);
            }
        } catch (err) {
            setError('Erro ao criar conta. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center p-6 relative overflow-hidden">
                {/* Background Ambience */}
                <div className="absolute top-[-20%] left-[-20%] w-[100%] h-[100%] bg-primary/10 rounded-full blur-[150px] pointer-events-none opacity-50"></div>
                <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none opacity-30"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none"></div>

                <div className="w-full max-w-sm relative z-10 flex flex-col items-center text-center">
                    <div className="size-24 rounded-[2rem] bg-primary/10 border border-primary/30 shadow-glow mb-8 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-6xl">verified</span>
                    </div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Verifique seu Email</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.1em] text-[11px] mb-8 leading-relaxed">
                        Enviamos um link de confirmação para <span className="text-primary">{email}</span>. Acesse o link para ativar sua conta.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full h-16 bg-primary text-background-dark font-black uppercase tracking-[0.2em] text-sm rounded-2xl shadow-glow hover:shadow-neon active:scale-[0.98] transition-all"
                    >
                        Ir para Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center p-6 relative overflow-hidden">

            {/* Background Ambience */}
            <div className="absolute top-[-20%] left-[-20%] w-[100%] h-[100%] bg-primary/10 rounded-full blur-[150px] pointer-events-none opacity-50"></div>
            <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none opacity-30"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none"></div>

            <div className="w-full max-w-sm relative z-10 flex flex-col items-center">

                {/* Logo / Branding */}
                <div className="mb-10 flex flex-col items-center text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 border border-white/10 shadow-glow mb-6 group">
                        <span className="material-symbols-outlined text-primary text-5xl transition-transform group-hover:scale-110">person_add</span>
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Criar Conta</h1>
                    <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mt-3">Junte-se à Elite do Treinamento</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="w-full mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3">
                        <span className="material-symbols-outlined text-red-400">error</span>
                        <p className="text-red-400 text-sm font-medium">{error}</p>
                    </div>
                )}

                {/* SignUp Form */}
                <form onSubmit={handleSignUp} className="w-full space-y-6">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Nome Completo</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors">person</span>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full h-16 bg-white/[0.02] border border-white/5 rounded-2xl pl-14 pr-4 text-white focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all font-bold placeholder:text-slate-700 shadow-inner outline-none"
                                placeholder="Seu nome"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Email</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors">mail</span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-16 bg-white/[0.02] border border-white/5 rounded-2xl pl-14 pr-4 text-white focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all font-bold placeholder:text-slate-700 shadow-inner outline-none"
                                placeholder="seu@email.com"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Senha</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors">lock</span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-16 bg-white/[0.02] border border-white/5 rounded-2xl pl-14 pr-4 text-white focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all font-bold placeholder:text-slate-700 shadow-inner outline-none"
                                placeholder="Mínimo 6 caracteres"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Confirmar Senha</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors">lock</span>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full h-16 bg-white/[0.02] border border-white/5 rounded-2xl pl-14 pr-4 text-white focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all font-bold placeholder:text-slate-700 shadow-inner outline-none"
                                placeholder="Repita a senha"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-16 mt-8 bg-primary text-background-dark font-black text-sm rounded-2xl shadow-glow active:scale-[0.98] transition-all uppercase tracking-[0.2em] flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-neon"
                    >
                        {loading ? (
                            <span className="animate-spin material-symbols-outlined font-black">progress_activity</span>
                        ) : (
                            'CRIAR MINHA CONTA'
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

export default SignUpView;
