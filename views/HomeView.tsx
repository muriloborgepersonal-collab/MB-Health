
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudent } from '../contexts/StudentContext';

const HomeView: React.FC = () => {
  const navigate = useNavigate();
  const { students } = useStudent();

  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'active').length;
  const inactiveStudents = students.filter(s => s.status === 'inactive').length;

  return (
    <div className="flex flex-col">
      {/* Top Header */}
      <header className="bg-card-header sticky top-0 z-50 px-4 pt-8 pb-4 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 shadow-glow">
              <span className="material-symbols-outlined text-primary text-3xl">fitness_center</span>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-primary font-black">MBHealth</p>
              <h2 className="text-white text-xl font-extrabold leading-tight tracking-tight">Olá, Treinador</h2>
            </div>
          </div>
          <button onClick={() => navigate('/profile')} className="flex size-11 items-center justify-center rounded-full bg-card-dark text-white border border-primary/20 hover:border-primary transition-all">
            <span className="material-symbols-outlined">person</span>
          </button>
        </div>
      </header>

      <main className="px-4 py-6 space-y-8">
        {/* Quick Stats Carousel */}
        <section>
          <div className="flex overflow-x-auto hide-scrollbar gap-4 pb-2">
            {[
              { label: 'Feedbacks', value: '99+', icon: 'chat_bubble', hasAlert: true },
              { label: 'Atualizações', value: '7', icon: 'update' },
              { label: 'Enviar msg', value: 'Nova', icon: 'send' }
            ].map((stat, i) => (
              <div
                key={i}
                onClick={() => {
                  if (stat.label === 'Feedbacks') navigate('/feedbacks');
                  if (stat.label === 'Atualizações') navigate('/updates-menu');
                  if (stat.label === 'Enviar msg') navigate('/notifications/dashboard');
                }}
                className="relative flex h-36 min-w-36 flex-col justify-between rounded-2xl bg-card-dark border border-white/5 p-5 shadow-xl hover:border-primary/30 transition-all cursor-pointer group"
              >
                <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">{stat.icon}</span>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{stat.label}</span>
                  <span className="text-2xl font-black text-white">{stat.value}</span>
                </div>
                {stat.hasAlert && <div className="absolute top-4 right-4 h-2.5 w-2.5 rounded-full bg-primary shadow-glow"></div>}
              </div>
            ))}
          </div>
        </section>

        {/* Action Grid */}
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => navigate('/students')} className="flex flex-col gap-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 p-5 active:scale-95 transition-transform text-left">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-background-dark shadow-glow">
              <span className="material-symbols-outlined font-bold">person_add</span>
            </div>
            <h3 className="text-white text-lg font-black leading-tight">Adicionar<br />Alunos</h3>
          </button>
          <button onClick={() => navigate('/share-link')} className="flex flex-col gap-4 rounded-2xl bg-white/5 border border-white/10 p-5 active:scale-95 transition-transform text-left">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-primary border border-primary/30">
              <span className="material-symbols-outlined font-bold">link</span>
            </div>
            <h3 className="text-white text-lg font-black leading-tight">Link de<br />Cadastro</h3>
          </button>
        </div>

        {/* Main Analytics Card */}
        <section>
          <div
            onClick={() => navigate('/students')}
            className="bg-card-dark rounded-[2.5rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden cursor-pointer hover:border-primary/30 transition-all active:scale-[0.99] group"
          >
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <span className="material-symbols-outlined text-8xl text-white">analytics</span>
            </div>
            <div className="flex flex-col gap-8">
              <div>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Total de Alunos</p>
                <h4 className="text-5xl font-black text-white tracking-tighter">{totalStudents}</h4>
              </div>
              <div className="flex items-center gap-10 border-t border-white/10 pt-8">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-1.5 flex-shrink-0 bg-primary rounded-full shadow-glow"></div>
                  <div>
                    <p className="text-primary text-3xl font-black">{activeStudents}</p>
                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Ativos</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-1.5 flex-shrink-0 bg-white/20 rounded-full"></div>
                  <div>
                    <p className="text-white/60 text-3xl font-black">{inactiveStudents}</p>
                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Inativos</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full mt-10 bg-white/5 group-hover:bg-white/10 border border-white/10 text-white text-sm font-bold py-4 rounded-2xl text-center transition-all">
              Ver Lista Completa
            </div>
          </div>
        </section>

        {/* Promotional Banner */}
        <section className="pb-8">
          <div
            className="rounded-3xl h-32 bg-cover bg-center flex items-center p-8 relative group cursor-pointer overflow-hidden shadow-xl"
            style={{ backgroundImage: `linear-gradient(90deg, rgba(26,26,46,1) 0%, rgba(26,26,46,0.7) 100%), url('https://picsum.photos/800/400?gym')` }}
          >
            <div className="flex flex-col">
              <span className="text-primary text-xs font-black uppercase tracking-widest mb-1">Planilha Mensal</span>
              <span className="text-white text-xl font-black">Relatório de Desempenho</span>
            </div>
            <div className="ml-auto w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-primary">chevron_right</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomeView;
