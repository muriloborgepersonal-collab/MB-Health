
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ForgotPasswordView: React.FC = () => {
    const navigate = useNavigate();
    const { resetPassword } = useAuth();

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const { error } = await resetPassword(email);

            if (error) {
                setError(error.message);
            } else {
                setSuccess(true);
            }
        } catch (err) {
            setError('Erro ao enviar email. Tente novamente.');
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
                        <span className="material-symbols-outlined text-primary text-6xl">email</span>
                    </div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Link Enviado!</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.1em] text-[11px] mb-8 leading-relaxed">
                        Verifique o email <span className="text-primary">{email}</span> para instruções de recuperação.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full h-16 bg-primary text-background-dark font-black uppercase tracking-[0.2em] text-sm rounded-2xl shadow-glow hover:shadow-neon active:scale-[0.98] transition-all"
                    >
                        Voltar ao Login
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

                {/* Back Button */}
                <button
                    onClick={() => navigate('/')}
                    className="self-start mb-8 flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                    <span className="text-sm font-medium">Voltar</span>
                </button>

                {/* Header Section */}
                <div className="mb-10 flex flex-col items-center text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 border border-white/10 shadow-glow mb-6 group">
                        <span className="material-symbols-outlined text-primary text-5xl transition-transform group-hover:scale-110">lock_reset</span>
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Recuperar Senha</h1>
                    <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mt-3">Redefina seu acesso com segurança</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="w-full mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3">
                        <span className="material-symbols-outlined text-red-400">error</span>
                        <p className="text-red-400 text-sm font-medium">{error}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="w-full space-y-5">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Email Cadastrado</label>
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

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-16 bg-primary text-background-dark font-black text-sm rounded-2xl shadow-glow active:scale-[0.98] transition-all uppercase tracking-[0.2em] flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-neon"
                    >
                        {loading ? (
                            <span className="animate-spin material-symbols-outlined font-black">progress_activity</span>
                        ) : (
                            'ENVIAR LINK DE RECUPERAÇÃO'
                        )}
                    </button>
                </form>

            </div>
        </div>
    );
};

export default ForgotPasswordView;
