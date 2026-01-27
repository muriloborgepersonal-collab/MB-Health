
import React from 'react';
import { useNavigate } from 'react-router-dom';

const WorkoutsView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      <header className="sticky top-0 z-50 bg-background-dark/80 backdrop-blur-md px-6 pt-12 pb-6 border-b border-white/5">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="text-white hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-3xl">chevron_left</span>
          </button>
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-slate-400 hover:text-white cursor-pointer transition-colors">search</span>
            <span className="material-symbols-outlined text-slate-400 hover:text-white cursor-pointer transition-colors">settings</span>
          </div>
        </div>
        <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">Treinos</h1>
      </header>

      <main className="px-6 py-8 space-y-6">
        {/* Highlight Card */}
        <div className="relative group cursor-pointer overflow-hidden rounded-[2.5rem] border-4 border-primary bg-white shadow-2xl transition-all active:scale-[0.98] p-8">
          <div className="flex justify-between items-start mb-8">
            <div className="p-4 bg-primary/10 rounded-2xl">
              <span className="material-symbols-outlined text-primary text-5xl">fitness_center</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
               <span className="material-symbols-outlined text-slate-400 text-lg">arrow_forward_ios</span>
            </div>
          </div>
          <div>
            <h2 className="text-primary text-3xl font-black mb-3 uppercase tracking-tighter leading-tight">Biblioteca de Treinos</h2>
            <p className="text-slate-500 text-sm font-bold leading-relaxed">
              Crie, edite e organize rotinas personalizadas para cada perfil de aluno.
            </p>
          </div>
          <div className="absolute -right-6 -bottom-6 opacity-5 pointer-events-none">
            <span className="material-symbols-outlined text-[150px]">exercise</span>
          </div>
        </div>

        {/* Small Cards Grid */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Relatório de Frequência', icon: 'monitoring', desc: 'Acompanhe a constância' },
            { label: 'Biblioteca de Exercícios', icon: 'menu_book', desc: 'Base de movimentos' }
          ].map((card, i) => (
            <div key={i} className="flex flex-col rounded-3xl bg-white p-6 shadow-xl border border-slate-100 transition-all active:scale-[0.96] cursor-pointer group">
              <div className="mb-6">
                <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-xl group-hover:bg-primary transition-all group-hover:text-white text-primary">
                  <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">{card.icon}</span>
                </div>
              </div>
              <h3 className="text-slate-900 text-base font-black leading-tight uppercase tracking-tight">{card.label}</h3>
              <p className="mt-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* Recent Workouts */}
        <div className="pt-4">
          <h4 className="text-xl font-black mb-6 tracking-tight">Treinos Recentes</h4>
          <div className="space-y-4">
            {[
              { name: 'Hipertrofia - Pernas A', time: 'Atualizado há 2 horas', icon: 'sprint' },
              { name: 'Cardio Intermediário', time: 'Criado ontem', icon: 'pool' }
            ].map((workout, i) => (
              <div key={i} className="flex items-center p-5 bg-card-dark rounded-3xl border border-white/5 shadow-lg active:scale-[0.98] transition-all cursor-pointer group">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mr-5 group-hover:border-primary transition-all">
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-all">{workout.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="text-white font-black text-lg group-hover:text-primary transition-all">{workout.name}</p>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{workout.time}</p>
                </div>
                <span className="material-symbols-outlined text-slate-600">more_vert</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WorkoutsView;
