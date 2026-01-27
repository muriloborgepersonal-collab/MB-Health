
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      <header className="p-6 pt-12 pb-4 border-b border-white/5">
        <h2 className="text-3xl font-black uppercase tracking-tighter">Meu Perfil</h2>
      </header>

      <main className="p-6 space-y-8">
        <div className="flex items-center gap-6 p-6 bg-card-dark rounded-[2rem] border border-white/5 shadow-2xl">
          <div className="size-24 rounded-full border-4 border-primary/20 shadow-glow overflow-hidden">
            <img src="https://picsum.photos/200/200?coach" alt="Coach" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <p className="text-2xl font-black tracking-tighter">Marcus Treinador</p>
            <p className="text-primary text-xs font-black uppercase tracking-widest">Premium Coach</p>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { label: 'Minhas Assinaturas', icon: 'payments' },
            { label: 'Configurações do App', icon: 'settings' },
            { label: 'Central de Ajuda', icon: 'help_center' },
            { label: 'Sair da Conta', icon: 'logout', danger: true }
          ].map((item, i) => (
            <button 
              key={i}
              className={`w-full flex items-center justify-between p-6 rounded-2xl border transition-all active:scale-[0.98] ${
                item.danger 
                ? 'bg-red-500/10 border-red-500/20 text-red-500' 
                : 'bg-card-dark border-white/5 text-white hover:border-primary/30'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined">{item.icon}</span>
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
