import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Logo } from '../src/components/ui/Logo';

const LoginView: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { signIn, user, loading: authLoading } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Redirect if already logged in
    useEffect(() => {
        if (user && !authLoading) {
            const from = (location.state as any)?.from?.pathname || '/home';
            navigate(from, { replace: true });
        }
    }, [user, authLoading, navigate, location]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const { error } = await signIn(email, password);

            if (error) {
                if (error.message.includes('Invalid login credentials')) {
                    setError('Email ou senha incorretos');
                } else if (error.message.includes('Email not confirmed')) {
                    setError('Por favor, confirme seu email antes de fazer login');
                } else {
                    setError(error.message);
                }
            }
        } catch (err) {
            setError('Erro ao fazer login. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="size-12 border-4 border-primary/20 border-t-primary rounded-full shadow-neon"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-white selection:bg-primary/30 flex flex-col justify-center items-center p-6 relative overflow-hidden">
            {/* Background Kinetic Accents */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] mix-blend-overlay" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05]" />
            </div>

            <main className="w-full max-w-md relative z-10">
                {/* Logo Section with Scene Integration */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center mb-12"
                >
                    <div className="relative group p-6">
                        {/* Glow Layer */}
                        <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700" />
                        <Logo size="xl" />

                        {/* Kinetic Horizon Line */}
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.8, duration: 1.2 }}
                            className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-[2px] w-32 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
                        />
                    </div>
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-xs font-black uppercase tracking-[0.4em] text-primary/60 mt-4"
                    >
                        Performance Intelligence
                    </motion.h1>
                </motion.div>

                {/* Login Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="bg-surface/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden group/card"
                >
                    {/* Inner Accent Lighting */}
                    <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

                    <div className="relative z-10 w-full">
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Bem-vindo</h2>
                        <p className="text-slate-400 text-sm font-medium mb-10 uppercase tracking-widest">Acesse seu painel de treinamento</p>

                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3"
                                >
                                    <span className="material-symbols-outlined text-red-400 text-xl">error</span>
                                    <p className="text-red-400 text-xs font-bold uppercase tracking-wide">{error}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/50 px-1">Seu Email</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 transition-colors pointer-events-none">alternate_email</span>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full h-16 bg-white/[0.03] border border-white/5 rounded-2xl pl-14 pr-4 text-white focus:border-primary/40 focus:bg-white/[0.05] focus:ring-4 focus:ring-primary/5 transition-all outline-none font-bold placeholder:text-slate-700"
                                        placeholder="email@exemplo.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/50">Sua Senha</label>
                                    <button
                                        type="button"
                                        onClick={() => navigate('/forgot-password')}
                                        className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors"
                                    >
                                        Esqueci a senha
                                    </button>
                                </div>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 transition-colors pointer-events-none">lock</span>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full h-16 bg-white/[0.03] border border-white/5 rounded-2xl pl-14 pr-4 text-white focus:border-primary/40 focus:bg-white/[0.05] focus:ring-4 focus:ring-primary/5 transition-all outline-none font-bold placeholder:text-slate-700"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-16 mt-6 bg-primary text-background font-black text-sm rounded-2xl shadow-neon hover:shadow-neon-strong active:scale-[0.98] transition-all uppercase tracking-[0.2em] flex items-center justify-center gap-3 disabled:opacity-50 group"
                            >
                                {loading ? (
                                    <span className="animate-spin material-symbols-outlined">progress_activity</span>
                                ) : (
                                    <>
                                        Entrar Agora
                                        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">bolt</span>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-10 flex flex-col items-center gap-4">
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Ou continue com</p>
                            <div className="flex gap-4 w-full">
                                <button className="flex-1 h-14 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center justify-center hover:bg-white/5 transition-colors">
                                    <img src="https://www.google.com/favicon.ico" className="size-5 grayscale hover:grayscale-0 transition-all" alt="Google" />
                                </button>
                                <button className="flex-1 h-14 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center justify-center hover:bg-white/5 transition-colors">
                                    <span className="material-symbols-outlined text-xl text-slate-400">apple</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Footer Link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-10 text-center"
                >
                    <button
                        onClick={() => navigate('/signup')}
                        className="group flex flex-col items-center gap-2"
                    >
                        <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Ainda não tem acesso?</span>
                        <span className="text-primary font-black uppercase tracking-widest text-sm group-hover:underline decoration-2 underline-offset-8 transition-all">
                            Solicitar Cadastro
                        </span>
                    </button>
                </motion.div>
            </main>
        </div>
    );
};

export default LoginView;
