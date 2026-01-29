
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const WorkoutEditorView: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      <header className="sticky top-0 z-50 bg-background-dark p-6 border-b border-white/5">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <button onClick={() => navigate(-1)} className="text-white hover:text-primary">
            <span className="material-symbols-outlined">arrow_back_ios</span>
          </button>
          <h2 className="text-lg font-black tracking-tight uppercase">Editor de Exercícios</h2>
          <button className="text-white">
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        </div>
      </header>

      <main className="px-6 py-6 space-y-6">
        {/* Actions Bar */}
        <div className="overflow-x-auto hide-scrollbar">
          <div className="flex gap-6 min-w-max pb-2">
            {[
              { label: 'Baixar treino', icon: 'download' },
              { label: 'Visão aluno', icon: 'visibility' },
              { label: 'Evolução', icon: 'trending_up' },
              { label: 'Criar Rotina', icon: 'add_task', action: () => navigate(`/routine/new/${id}`) },
              { label: 'MFITIA', icon: 'auto_awesome', highlight: true }
            ].map((action, i) => (
              <div
                key={i}
                onClick={action.action}
                className="flex flex-col items-center gap-2 py-2 w-24 cursor-pointer group"
              >
                <div className={`rounded-full p-4 transition-all ${action.highlight ? 'bg-gradient-to-tr from-primary to-purple-500 shadow-glow' : 'bg-white/5 hover:bg-white/10'}`}>
                  <span className="material-symbols-outlined text-white">{action.icon}</span>
                </div>
                <p className={`text-[10px] font-black uppercase tracking-widest ${action.highlight ? 'text-primary' : 'text-slate-400 group-hover:text-white'}`}>
                  {action.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Add Button */}
        <button className="w-full flex items-center justify-center gap-3 rounded-2xl h-16 bg-primary text-background-dark font-black text-lg shadow-glow active:scale-[0.98] transition-all">
          <span className="material-symbols-outlined text-3xl">add_circle</span>
          <span>Adicionar Exercício</span>
        </button>

        {/* Active Exercise Card */}
        <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
          <div className="flex items-center p-6 pb-2">
            <span className="material-symbols-outlined text-slate-600 cursor-grab active:cursor-grabbing">drag_indicator</span>
            <h3 className="text-white text-xl font-black tracking-tight ml-4 flex-1">Supino Inclinado Halter</h3>
            <button className="text-slate-400 hover:text-white">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>

          <div className="p-6 pt-2">
            <div
              className="relative flex items-center justify-center bg-zinc-800 bg-cover bg-center aspect-video rounded-3xl overflow-hidden group shadow-inner border border-white/5"
              style={{ backgroundImage: `url("https://picsum.photos/600/400?fitness")` }}
            >
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all"></div>
              <button className="relative z-10 flex items-center justify-center rounded-full size-20 bg-white/10 backdrop-blur-xl text-white border border-white/20 hover:scale-110 transition-transform shadow-2xl">
                <span className="material-symbols-outlined text-4xl fill-1">play_arrow</span>
              </button>

              {/* Fake Player Progress */}
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex h-1.5 items-center mb-3">
                  <div className="h-full w-[40%] rounded-full bg-primary shadow-glow"></div>
                  <div className="size-4 rounded-full bg-primary border-2 border-white shadow-glow -ml-2"></div>
                  <div className="h-full flex-1 rounded-full bg-white opacity-20"></div>
                </div>
                <div className="flex items-center justify-between text-[10px] font-black tracking-widest text-white/70">
                  <p>0:37</p>
                  <p>2:23</p>
                </div>
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-3 gap-4 mt-8 mb-6">
              {[
                { label: 'Série/Rep', val: '3 x 12' },
                { label: 'Carga (kg)', val: '24' },
                { label: 'Intervalo', val: '60s' }
              ].map((field, i) => (
                <div key={i} className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-slate-500 ml-1">{field.label}</label>
                  <input
                    className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 px-4 text-white text-sm font-bold focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-center"
                    defaultValue={field.val}
                  />
                </div>
              ))}
            </div>

            {/* Sub-Actions */}
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 bg-primary/10 text-primary font-black text-xs py-4 rounded-2xl border border-primary/20 hover:bg-primary/20 transition-all active:scale-[0.98]">
                <span className="material-symbols-outlined text-lg">add</span>
                ADICIONAR SÉRIE
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-white/5 text-white font-black text-xs py-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-all active:scale-[0.98]">
                <span className="material-symbols-outlined text-lg">content_copy</span>
                REPLICAR SÉRIES
              </button>
            </div>
          </div>
        </div>

        {/* Placeholder for Next Exercise */}
        <div className="opacity-40">
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 flex items-center group cursor-not-allowed">
            <span className="material-symbols-outlined text-slate-600">drag_indicator</span>
            <p className="font-black tracking-tight text-xl ml-4">Crucifixo Reto</p>
            <span className="material-symbols-outlined ml-auto">expand_more</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WorkoutEditorView;
