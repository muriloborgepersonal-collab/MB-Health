
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { label: 'Início', icon: 'home', path: '/' },
    { label: 'Assinatura', icon: 'fitness_center', path: '/subscriptions' },
    { label: 'Alunos', icon: 'group', path: '/students' },
    { label: 'Perfil', icon: 'person', path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background-dark border-t border-white/5 pt-3 pb-8 px-6 flex justify-between items-center max-w-lg mx-auto md:rounded-t-3xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,1)]">
      {navItems.map((item) => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          className={`flex flex-col items-center gap-1 transition-all relative ${isActive(item.path) ? 'text-white scale-110' : 'text-white/40 hover:text-white/80'
            }`}
        >
          <span className={`material-symbols-outlined text-[28px] ${isActive(item.path) ? 'fill-1' : ''}`}>
            {item.icon}
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
          {isActive(item.path) && (
            <div className="absolute -bottom-2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
          )}
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
