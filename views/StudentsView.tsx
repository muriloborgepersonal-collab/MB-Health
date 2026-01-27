
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
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 bg-background-dark p-6 pb-2 border-b border-white/5">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate('/home')} className="text-white hover:text-primary">
            <span className="material-symbols-outlined">arrow_back_ios</span>
          </button>
          <h2 className="text-lg font-black uppercase tracking-widest text-white">MFITPERSONAL</h2>
          <button className="text-white">
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="flex w-full items-stretch rounded-2xl h-14 bg-white/5 border border-white/10 px-4 group focus-within:border-primary transition-all">
            <div className="flex items-center justify-center text-slate-400">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input
              className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-slate-500 font-medium px-4"
              placeholder="Pesquisar aluno..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
          <button
            onClick={() => setFilter('active')}
            className={`flex h-11 shrink-0 items-center justify-center gap-x-2 rounded-full px-6 transition-all ${filter === 'active' ? 'bg-primary text-background-dark font-black shadow-glow' : 'bg-white/5 text-slate-400 border border-white/10'}`}
          >
            Ativos: {students.filter(s => s.status === 'active').length}
          </button>
          <button
            onClick={() => setFilter('inactive')}
            className={`flex h-11 shrink-0 items-center justify-center gap-x-2 rounded-full px-6 transition-all ${filter === 'inactive' ? 'bg-primary text-background-dark font-black shadow-glow' : 'bg-white/5 text-slate-400 border border-white/10'}`}
          >
            Inativos: {students.filter(s => s.status === 'inactive').length}
          </button>
        </div>
      </header>

      <main className="px-6 py-8 space-y-6 pb-24">
        <button
          onClick={() => navigate('/students/new')}
          className="w-full h-14 border-2 border-primary border-dashed rounded-2xl text-primary font-black hover:bg-primary/5 transition-all active:scale-[0.98]"
        >
          + ADICIONAR ALUNO
        </button>

        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black tracking-tight text-white">Meus Alunos</h3>
          <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Ordenado: A - Z</span>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="flex justify-center py-12">
              <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-12 opacity-50">
              <span className="material-symbols-outlined text-6xl mb-4">group_off</span>
              <p className="text-white font-medium">Nenhum aluno encontrado</p>
            </div>
          ) : (
            filteredStudents.map((student) => (
              <div
                key={student.id}
                onClick={() => navigate(`/student/${student.id}`)}
                className="flex items-center justify-between bg-card-dark p-4 rounded-2xl border border-white/5 shadow-lg active:scale-[0.98] transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <img
                    className="size-14 rounded-full object-cover border-2 border-primary/20 group-hover:border-primary transition-all"
                    src={student.image_url}
                    alt={student.name}
                  />
                  <div>
                    <p className="text-white font-black text-lg group-hover:text-primary transition-all">{student.name}</p>
                    <p className="text-slate-400 text-xs font-medium">{student.plan}</p>
                  </div>
                </div>
                <button className="text-primary p-2.5 bg-primary/10 rounded-xl hover:bg-primary hover:text-background-dark transition-all">
                  <span className="material-symbols-outlined fill-1">chat</span>
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
