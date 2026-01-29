
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProfileView: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setLoggingOut(false);
    }
  };

  const menuItems = [
    { label: 'Minhas Assinaturas', icon: 'payments', action: () => { } },
    { label: 'Configurações do App', icon: 'settings', action: () => { } },
    { label: 'Central de Ajuda', icon: 'help_center', action: () => { } },
    { label: 'Sair da Conta', icon: 'logout', danger: true, action: handleLogout }
  ];

  // Get user info
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Treinador';
  const userEmail = user?.email || '';

  return (
    <div className="flex flex-col min-h-screen bg-background-dark">
      <header className="px-6 pt-12 pb-6 border-b border-white/5 bg-card-header/80 backdrop-blur-md sticky top-0 z-50">
        <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Meu Perfil</h2>
        <div className="h-1 w-12 bg-primary mt-2 rounded-full"></div>
      </header>

      <main className="p-6 space-y-8">
        <div className="flex flex-col items-center gap-6 p-8 bg-card-dark border border-white/5 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-7xl">shield</span>
          </div>
          <div className="size-28 rounded-full border-4 border-primary/20 p-1 shadow-glow overflow-hidden bg-primary/10 relative">
            {user?.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} alt="Coach" className="w-full h-full object-cover rounded-full" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-6xl">person</span>
              </div>
            )}
            <div className="absolute bottom-0 right-0 size-8 bg-primary rounded-full border-4 border-card-dark flex items-center justify-center">
              <span className="material-symbols-outlined text-background-dark text-lg font-black">edit</span>
            </div>
          </div>
          <div className="flex flex-col items-center text-center">
            <p className="text-3xl font-black tracking-tighter uppercase text-white leading-none">{userName}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="size-2 rounded-full bg-primary animate-pulse"></span>
              <p className="text-slate-400 text-sm font-bold tracking-tight">{userEmail}</p>
            </div>
            <div className="mt-4 px-4 py-1.5 bg-primary rounded-full">
              <p className="text-background-dark text-[10px] font-black uppercase tracking-[0.2em]">Premium Coach</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Gerenciamento</p>
          {menuItems.map((item, i) => (
            <button
              key={i}
              onClick={item.action}
              disabled={item.danger && loggingOut}
              className={`w-full flex items-center justify-between p-6 rounded-[1.5rem] border transition-all active:scale-[0.98] group ${item.danger
                ? 'bg-red-500/5 border-red-500/20 text-red-500'
                : 'bg-card-dark border-white/5 text-white hover:border-primary/30'
                } ${loggingOut && item.danger ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center gap-5">
                <div className={`size-12 rounded-2xl flex items-center justify-center transition-all ${item.danger ? 'bg-red-500/10' : 'bg-white/5 group-hover:bg-primary/10'}`}>
                  {item.danger && loggingOut ? (
                    <span className="material-symbols-outlined animate-spin text-2xl font-black">progress_activity</span>
                  ) : (
                    <span className={`material-symbols-outlined text-2xl transition-colors ${item.danger ? 'text-red-500' : 'text-slate-400 group-hover:text-primary'}`}>{item.icon}</span>
                  )}
                </div>
                <span className="font-black text-xs uppercase tracking-[0.2em]">{item.label}</span>
              </div>
              <span className="material-symbols-outlined opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all">chevron_right</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ProfileView;
