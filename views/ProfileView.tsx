
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
    <div className="flex flex-col">
      <header className="p-6 pt-12 pb-4 border-b border-white/5">
        <h2 className="text-3xl font-black uppercase tracking-tighter">Meu Perfil</h2>
      </header>

      <main className="p-6 space-y-8">
        <div className="flex items-center gap-6 p-6 bg-card-dark rounded-[2rem] border border-white/5 shadow-2xl">
          <div className="size-24 rounded-full border-4 border-primary/20 shadow-glow overflow-hidden bg-primary/10 flex items-center justify-center">
            {user?.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} alt="Coach" className="w-full h-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-primary text-5xl">person</span>
            )}
          </div>
          <div className="flex flex-col">
            <p className="text-2xl font-black tracking-tighter">{userName}</p>
            <p className="text-slate-400 text-sm">{userEmail}</p>
            <p className="text-primary text-xs font-black uppercase tracking-widest mt-1">Premium Coach</p>
          </div>
        </div>

        <div className="space-y-3">
          {menuItems.map((item, i) => (
            <button
              key={i}
              onClick={item.action}
              disabled={item.danger && loggingOut}
              className={`w-full flex items-center justify-between p-6 rounded-2xl border transition-all active:scale-[0.98] ${item.danger
                  ? 'bg-red-500/10 border-red-500/20 text-red-500'
                  : 'bg-card-dark border-white/5 text-white hover:border-primary/30'
                } ${loggingOut && item.danger ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center gap-4">
                {item.danger && loggingOut ? (
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined">{item.icon}</span>
                )}
                <span className="font-black text-sm uppercase tracking-widest">{item.label}</span>
              </div>
              <span className="material-symbols-outlined opacity-30">chevron_right</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ProfileView;
