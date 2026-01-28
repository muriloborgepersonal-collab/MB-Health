
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudent } from '../contexts/StudentContext';

const StudentsView: React.FC = () => {
  const navigate = useNavigate();
  const { students, loading } = useStudent();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'active' | 'inactive'>('active');

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) && s.status === filter
  );

  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-primary/30">
      <header className="sticky top-0 z-50 bg-surface p-6 pb-4 border-b border-primary/10 rounded-b-[40px] shadow-neon">
        <div className="flex items-center justify-between mb-8 animate-kinetic-reveal">
          <button onClick={() => navigate('/home')} className="p-2.5 bg-black/20 border border-white/5 rounded-xl hover:border-primary/50 transition-all active:scale-90 text-primary">
            <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
          </button>
          <h2 className="text-xl font-black uppercase tracking-[0.2em] italic text-white">MFITPERSONAL</h2>
          <button className="text-text-muted hover:text-primary transition-colors">
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        </div>

        {/* Search */}
        <div className="mb-6 animate-kinetic-reveal [animation-delay:100ms]">
          <div className="flex w-full items-stretch rounded-3xl h-14 bg-black border border-white/10 px-4 group focus-within:border-primary/50 transition-all shadow-inner">
            <div className="flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input
              className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-text-muted font-black uppercase tracking-widest text-[10px] px-4"
              placeholder="Pesquisar aluno..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 animate-kinetic-reveal [animation-delay:200ms]">
          <button
            onClick={() => setFilter('active')}
            className={`flex h-11 shrink-0 items-center justify-center gap-x-2 rounded-2xl px-6 transition-all duration-500 font-black uppercase tracking-widest text-[10px] border ${filter === 'active' ? 'bg-primary text-black border-primary shadow-neon-strong translate-y-[-2px]' : 'bg-black text-text-muted border-white/5 hover:border-primary/30'}`}
          >
            Ativos: {students.filter(s => s.status === 'active').length}
          </button>
          <button
            onClick={() => setFilter('inactive')}
            className={`flex h-11 shrink-0 items-center justify-center gap-x-2 rounded-2xl px-6 transition-all duration-500 font-black uppercase tracking-widest text-[10px] border ${filter === 'inactive' ? 'bg-primary text-black border-primary shadow-neon-strong translate-y-[-2px]' : 'bg-black text-text-muted border-white/5 hover:border-primary/30'}`}
          >
            Inativos: {students.filter(s => s.status === 'inactive').length}
          </button>
        </div>
      </header>

      <main className="px-6 py-10 space-y-8 pb-32 animate-kinetic-reveal [animation-delay:300ms]">
        <button
          onClick={() => navigate('/students/new')}
          className="w-full h-16 border-2 border-primary/20 border-dashed rounded-3xl text-primary font-black uppercase tracking-widest text-xs hover:border-solid hover:border-primary hover:bg-primary/5 hover:text-white transition-all duration-500 active:scale-[0.95] shadow-lg group"
        >
          <span className="group-hover:scale-125 transition-transform inline-block mr-2">+</span> ADICIONAR ALUNO
        </button>

        <div className="flex items-baseline justify-between px-2">
          <h3 className="text-2xl font-black tracking-tighter text-white uppercase italic">Meus Alunos</h3>
          <span className="text-primary text-[10px] font-black uppercase tracking-widest opacity-50">Ordem A-Z</span>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <span className="material-symbols-outlined animate-spin text-primary text-4xl shadow-glow">progress_activity</span>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-20 opacity-30 flex flex-col items-center gap-4">
              <span className="material-symbols-outlined text-7xl">group_off</span>
              <p className="text-white font-black uppercase tracking-widest text-xs">Nenhum aluno encontrado</p>
            </div>
          ) : (
            filteredStudents.map((student, index) => (
              <div
                key={student.id}
                onClick={() => navigate(`/student/${student.id}`)}
                className="flex items-center justify-between bg-surface p-5 rounded-4xl border border-white/5 shadow-lg active:scale-[0.98] transition-all duration-500 cursor-pointer group hover:border-primary/40 hover:shadow-neon relative overflow-hidden animate-kinetic-reveal"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <img
                      className="size-16 rounded-2xl object-cover border-2 border-primary/20 group-hover:border-primary group-hover:scale-105 transition-all shadow-glow"
                      src={student.image_url}
                      alt={student.name}
                    />
                    <div className="absolute -bottom-1 -right-1 size-4 bg-status-active rounded-full border-2 border-surface animate-pulse"></div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-white font-black text-lg uppercase tracking-tight group-hover:text-primary transition-all italic">{student.name}</p>
                    <p className="text-primary/60 text-[10px] font-black uppercase tracking-widest">{student.plan}</p>
                  </div>
                </div>
                <button className="text-primary p-3 bg-primary/10 rounded-2xl hover:bg-primary hover:text-black transition-all duration-500 shadow-glow group-hover:scale-110">
                  <span className="material-symbols-outlined fill-1 text-2xl">chat</span>
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentsView;
