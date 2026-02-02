import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Logo } from '@/components/ui/Logo';
import { User, Settings, ChevronLeft, Loader2 } from 'lucide-react';

type UserRole = 'student' | 'trainer' | null;

const LoginView: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { signIn, user, loading: authLoading } = useAuth();

    const [selectedRole, setSelectedRole] = useState<UserRole>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Redirect if already logged in
    useEffect(() => {
        if (user && !authLoading) {
            // Get stored role from localStorage or default to trainer
            const storedRole = localStorage.getItem('userRole') || 'trainer';
            const from = storedRole === 'student' ? '/student-home' : '/home';
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
                // Store role in localStorage for now (will be replaced with DB later)
                localStorage.setItem('userRole', selectedRole || 'trainer');

                // Navigate based on role
                if (selectedRole === 'student') {
                    navigate('/student-home', { replace: true });
                } else {
                    navigate('/home', { replace: true });
                }
            }
        } catch (err) {
            setError('Erro ao fazer login. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleBackToSelection = () => {
        setSelectedRole(null);
        setEmail('');
        setPassword('');
        setError(null);
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
                {/* Logo Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center mb-12"
                >
                    <div className="relative group p-6">
                        <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700" />
                        <Logo size="xl" showTagline={true} />
                    </div>
                </motion.div>

                <AnimatePresence mode="wait">
                    {/* ROLE SELECTION */}
                    {!selectedRole && (
                        <motion.div
                            key="role-selection"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95, x: -50 }}
                            transition={{ duration: 0.4 }}
                            className="space-y-6"
                        >
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Bem-vindo</h2>
                                <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Selecione seu perfil</p>
                            </div>

                            {/* STUDENT BUTTON */}
                            <motion.button
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedRole('student')}
                                className="w-full bg-surface/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 flex items-center gap-6 group hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-all duration-300"
                            >
                                <div className="size-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
                                    <User size={40} className="text-white" />
                                </div>
                                <div className="flex-1 text-left">
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-cyan-400 transition-colors">Aluno</h3>
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Acesse seus treinos</p>
                                </div>
                                <span className="material-symbols-outlined text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all">chevron_right</span>
                            </motion.button>

                            {/* TRAINER BUTTON */}
                            <motion.button
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedRole('trainer')}
                                className="w-full bg-surface/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 flex items-center gap-6 group hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                            >
                                <div className="size-20 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
                                    <Settings size={40} className="text-background-dark" />
                                </div>
                                <div className="flex-1 text-left">
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-primary transition-colors">Treinador</h3>
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Gerencie seus alunos</p>
                                </div>
                                <span className="material-symbols-outlined text-slate-600 group-hover:text-primary group-hover:translate-x-1 transition-all">chevron_right</span>
                            </motion.button>
                        </motion.div>
                    )}

                    {/* LOGIN FORM */}
                    {selectedRole && (
                        <motion.div
                            key="login-form"
                            initial={{ opacity: 0, scale: 0.95, x: 50 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.4 }}
                            className="bg-surface/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden"
                        >
                            {/* Inner Accent Lighting */}
                            <div className={`absolute -top-1/2 -left-1/2 w-full h-full ${selectedRole === 'student' ? 'bg-cyan-400/5' : 'bg-primary/5'} rounded-full blur-[100px] pointer-events-none`} />

                            <div className="relative z-10 w-full">
                                {/* Back Button & Title */}
                                <div className="flex items-center gap-4 mb-8">
                                    <button
                                        onClick={handleBackToSelection}
                                        className={`size-12 rounded-xl flex items-center justify-center border transition-all ${selectedRole === 'student'
                                                ? 'bg-cyan-400/10 border-cyan-400/20 text-cyan-400 hover:bg-cyan-400/20'
                                                : 'bg-primary/10 border-primary/20 text-primary hover:bg-primary/20'
                                            }`}
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <div>
                                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                                            {selectedRole === 'student' ? 'Área do Aluno' : 'Área do Treinador'}
                                        </h2>
                                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Faça login para continuar</p>
                                    </div>
                                </div>

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
                                        <label className={`text-[10px] font-black uppercase tracking-[0.2em] px-1 ${selectedRole === 'student' ? 'text-cyan-400/50' : 'text-primary/50'}`}>Seu Email</label>
                                        <div className="relative">
                                            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 transition-colors pointer-events-none">alternate_email</span>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className={`w-full h-16 bg-white/[0.03] border border-white/5 rounded-2xl pl-14 pr-4 text-white focus:bg-white/[0.05] focus:ring-4 transition-all outline-none font-bold placeholder:text-slate-700 ${selectedRole === 'student'
                                                        ? 'focus:border-cyan-400/40 focus:ring-cyan-400/5'
                                                        : 'focus:border-primary/40 focus:ring-primary/5'
                                                    }`}
                                                placeholder="email@exemplo.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center px-1">
                                            <label className={`text-[10px] font-black uppercase tracking-[0.2em] ${selectedRole === 'student' ? 'text-cyan-400/50' : 'text-primary/50'}`}>Sua Senha</label>
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
                                                className={`w-full h-16 bg-white/[0.03] border border-white/5 rounded-2xl pl-14 pr-4 text-white focus:bg-white/[0.05] focus:ring-4 transition-all outline-none font-bold placeholder:text-slate-700 ${selectedRole === 'student'
                                                        ? 'focus:border-cyan-400/40 focus:ring-cyan-400/5'
                                                        : 'focus:border-primary/40 focus:ring-primary/5'
                                                    }`}
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`w-full h-16 mt-6 font-black text-sm rounded-2xl active:scale-[0.98] transition-all uppercase tracking-[0.2em] flex items-center justify-center gap-3 disabled:opacity-50 group ${selectedRole === 'student'
                                                ? 'bg-gradient-to-r from-cyan-400 to-cyan-500 text-background-dark shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50'
                                                : 'bg-primary text-background shadow-neon hover:shadow-neon-strong'
                                            }`}
                                    >
                                        {loading ? (
                                            <Loader2 className="animate-spin" size={24} />
                                        ) : (
                                            <>
                                                Entrar Agora
                                                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">bolt</span>
                                            </>
                                        )}
                                    </button>
                                </form>

                                {/* Only show social login for trainer */}
                                {selectedRole === 'trainer' && (
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
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Footer Link - Show only on role selection */}
                {!selectedRole && (
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
                )}
            </main>
        </div>
    );
};

export default LoginView;
