
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginView: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            navigate('/home');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center p-6 relative overflow-hidden">

            {/* Background Ambience */}
            <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="w-full max-w-sm relative z-10 flex flex-col items-center">

                {/* Logo / Branding */}
                <div className="mb-12 flex flex-col items-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 shadow-glow mb-6">
                        <span className="material-symbols-outlined text-primary text-5xl">fitness_center</span>
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight">MBHealth</h1>
                    <p className="text-slate-400 text-sm font-medium tracking-widest uppercase mt-2">Trainer Dashboard</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="w-full space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">mail</span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-white focus:border-primary focus:ring-0 focus:bg-white/10 transition-all font-medium placeholder:text-slate-600"
                                placeholder="seu@email.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Senha</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">lock</span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-white focus:border-primary focus:ring-0 focus:bg-white/10 transition-all font-medium placeholder:text-slate-600"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button type="button" className="text-xs text-slate-400 hover:text-white transition-colors">Esqueceu a senha?</button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 mt-4 bg-gradient-to-r from-primary to-[#00a0c0] text-background-dark font-black text-lg rounded-2xl shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-[0.98] transition-all uppercase tracking-widest flex items-center justify-center gap-2 group"
                    >
                        {loading ? (
                            <span className="animate-spin material-symbols-outlined">progress_activity</span>
                        ) : (
                            <>
                                ENTRAR
                                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-12 text-center">
                    <p className="text-slate-500 text-sm">Não tem uma conta?</p>
                    <button className="text-primary font-bold hover:underline">Cadastre-se</button>
                </div>

            </div>
        </div>
    );
};

export default LoginView;
