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
            } else {
                // Successful login - redirect happens via useEffect
            }
        } catch (err) {
            setError('Erro ao fazer login. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = () => {
        navigate('/forgot-password');
    };

    const handleSignUp = () => {
        navigate('/signup');
    };

    // Show loading while checking auth state
    if (authLoading) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <span className="material-symbols-outlined animate-spin text-primary text-5xl">
                    progress_activity
                </span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center p-6 relative overflow-hidden">

            {/* Background Ambience */}
            <div className="absolute top-[-20%] left-[-20%] w-[100%] h-[100%] bg-primary/10 rounded-full blur-[150px] pointer-events-none opacity-50"></div>
            <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-primary/5 rounded-full blur-[120px] pointer-events-none opacity-30"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none"></div>

            <div className="w-full max-w-sm relative z-10 flex flex-col items-center">

                {/* Logo / Branding - Redesigned for Integration */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-16 relative flex flex-col items-center group"
                >
                    {/* Integrated Scene Lighting (The "Scenário" Integration) */}
                    <div className="absolute inset-0 -m-20 pointer-events-none overflow-visible">
                        {/* Core glow directly behind the logo */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/20 rounded-full blur-[40px] mix-blend-screen opacity-70 group-hover:opacity-100 transition-opacity duration-1000"></div>

                        {/* Wider ambient wash */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-[80px] mix-blend-lighten pointer-events-none"></div>

                        {/* Secondary kinetic accent */}
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.1, 0.2, 0.1]
                            }}
                            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-primary/5 rounded-full blur-[100px]"
                        ></motion.div>
                    </div>

                    <div className="relative z-10 p-4">
                        <Logo size="xl" />
                    </div>

                    {/* Subtle Horizon Line (Integrated instead of text) */}
                    <motion.div
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="h-[1px] w-24 bg-gradient-to-r from-transparent via-primary/40 to-transparent mt-6"
                    />
                </motion.div>

                {/* Error Message */}
                {error && (
                    <div className="w-full mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3">
                        <span className="material-symbols-outlined text-red-400">error</span>
                        <p className="text-red-400 text-sm font-medium">{error}</p>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleLogin} className="w-full space-y-5">
                    <div className="space-y-6">
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
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Senha</label>
                                <button
                                    type="button"
                                    onClick={handleForgotPassword}
                                    className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-primary transition-colors"
                                >
                                    Esqueceu a senha?
                                </button>
                            </div>
                            <div className="relative group">
                                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors">lock</span>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-16 bg-white/[0.02] border border-white/5 rounded-2xl pl-14 pr-4 text-white focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all font-bold placeholder:text-slate-700 shadow-inner outline-none"
                                    placeholder="••••••••"
                                    required
                                    disabled={loading}
                                />
                            </div>
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
                            <>
                                ENTRAR NO DASHBOARD
                                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1 font-black">arrow_forward</span>
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-12 text-center">
                    <p className="text-slate-500 text-sm">Não tem uma conta?</p>
                    <button
                        onClick={handleSignUp}
                        className="text-primary font-bold hover:underline"
                    >
                        Cadastre-se
                    </button>
                </div>

            </div>
        </div>
    );
};

export default LoginView;
