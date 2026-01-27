
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudent } from '../contexts/StudentContext';

const WorkoutUpdatesView: React.FC = () => {
    const navigate = useNavigate();
    const { notifications, markNotificationAsRead } = useStudent();

    return (
        <div className="flex flex-col min-h-screen bg-background-dark text-white p-6 pb-24">
            <header className="flex items-center justify-between mb-8">
                <button onClick={() => navigate(-1)} className="text-white hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-3xl">arrow_back_ios</span>
                </button>
                <h1 className="text-xl font-black uppercase tracking-wider">Atualizações: Treinos</h1>
                <div className="w-8"></div>
            </header>

            <main className="flex-1 space-y-4 max-w-lg mx-auto w-full">
                {notifications.length === 0 ? (
                    <div className="text-center py-20 opacity-50">
                        <span className="material-symbols-outlined text-6xl mb-4">notifications_off</span>
                        <p>Nenhuma atualização de treino no momento.</p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div key={notification.id} className="bg-card-dark border border-white/5 p-5 rounded-2xl shadow-lg relative overflow-hidden">
                            {/* Background Icon */}
                            <span className="material-symbols-outlined absolute -right-4 -top-4 text-9xl text-white/5 pointer-events-none">fitness_center</span>

                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-6">
                                    <img
                                        src={notification.studentImage}
                                        alt={notification.studentName}
                                        className="w-16 h-16 rounded-full border-2 border-primary/30 object-cover"
                                    />
                                    <div>
                                        <h3 className="font-black text-lg leading-tight mb-1">{notification.studentName}</h3>
                                        <p className="text-xs text-orange-400 font-bold uppercase tracking-wider mb-0.5">Vence em: {new Date(notification.expirationDate).toLocaleDateString()}</p>
                                        <p className="text-sm text-slate-400">{notification.workoutName}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => navigate(`/student/${notification.studentId}`)}
                                        className="flex-1 h-12 bg-primary/10 text-primary border border-primary/20 rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-primary hover:text-background-dark transition-all active:scale-[0.98]"
                                    >
                                        Ver Treino
                                    </button>
                                    <button
                                        onClick={() => markNotificationAsRead(notification.id)}
                                        className="flex-1 h-12 bg-white/5 text-slate-400 border border-white/10 rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-white/10 hover:text-white transition-all active:scale-[0.98]"
                                    >
                                        Marcar Lido
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </main>
        </div>
    );
};

export default WorkoutUpdatesView;
