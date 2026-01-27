
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { label: 'Início', icon: 'home', path: '/' },
    { label: 'Treinos', icon: 'fitness_center', path: '/workouts' },
    { label: 'Alunos', icon: 'group', path: '/students' },
    { label: 'Perfil', icon: 'person', path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass-nav border-t border-white/5 pt-3 pb-8 px-6 flex justify-between items-center max-w-lg mx-auto md:rounded-t-3xl">
      {navItems.map((item) => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          className={`flex flex-col items-center gap-1 transition-all ${
            isActive(item.path) ? 'text-primary' : 'text-slate-500 hover:text-white'
          }`}
        >
          <span className={`material-symbols-outlined text-[28px] ${isActive(item.path) ? 'fill-1' : ''}`}>
            {item.icon}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-tight">{item.label}</span>
          {isActive(item.path) && (
             <div className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full"></div>
          )}
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
