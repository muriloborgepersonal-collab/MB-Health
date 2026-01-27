
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CreateNotificationSelectionView: React.FC = () => {
    const navigate = useNavigate();

    const options = [
        {
            title: 'Enviar Agora',
            subtitle: 'Seu aluno receberá a notificação imediatamente',
            icon: 'send',
            color: 'text-primary',
            bgColor: 'bg-primary/20',
            borderColor: 'border-primary/50'
        },
        {
            title: 'Agendar',
            subtitle: 'Defina um dia e um horario especifico para envio',
            icon: 'event',
            color: 'text-purple-400',
            bgColor: 'bg-purple-500/20',
            borderColor: 'border-purple-500/50'
        },
        {
            title: 'Recorrentes',
            subtitle: 'Defina dias e horarios recorrentes para envio',
            icon: 'update',
            color: 'text-orange-400',
            bgColor: 'bg-orange-500/20',
            borderColor: 'border-orange-500/50'
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-background-dark text-white p-6">
            <header className="flex items-center justify-between mb-8">
                <button onClick={() => navigate(-1)} className="text-white hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-3xl">arrow_back_ios</span>
                </button>
                <h1 className="text-lg font-black uppercase tracking-wider">Nova Notificação</h1>
                <div className="w-8"></div>
            </header>

            <main className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full gap-4">
                {options.map((option, index) => (
                    <button
                        key={index}
                        className={`flex items-center gap-5 p-6 rounded-3xl bg-card-dark border border-white/10 hover:border-white/30 active:scale-[0.98] transition-all text-left shadow-lg group`}
                    >
                        <div className={`h-16 w-16 rounded-2xl ${option.bgColor} border ${option.borderColor} flex items-center justify-center shrink-0 shadow-lg`}>
                            <span className={`material-symbols-outlined text-3xl ${option.color}`}>{option.icon}</span>
                        </div>

                        <div className="flex-1">
                            <h3 className="text-xl font-black text-white mb-1 group-hover:text-primary transition-colors">{option.title}</h3>
                            <p className="text-xs text-slate-400 font-medium leading-relaxed uppercase tracking-wide">{option.subtitle}</p>
                        </div>
                    </button>
                ))}
            </main>
        </div>
    );
};

export default CreateNotificationSelectionView;
