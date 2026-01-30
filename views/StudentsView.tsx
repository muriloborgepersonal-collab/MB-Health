
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudent } from '../contexts/StudentContext';
import { Button } from '../src/components/ui/Button';

const StudentsView: React.FC = () => {
  const navigate = useNavigate();
  const { students, loading } = useStudent();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'active' | 'inactive' | 'deleted'>('active');

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.email && s.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.whatsapp && s.whatsapp.includes(searchTerm));

    // For now, 'deleted' will show nothing as the type doesn't support it yet
    if (filter === 'deleted') return false;
    return matchesSearch && s.status === filter;
  });

  const activeCount = students.filter(s => s.status === 'active').length;
  const inactiveCount = students.filter(s => s.status === 'inactive').length;

  const handleWhatsAppClick = (e: React.MouseEvent, student: any) => {
    e.stopPropagation();
    if (student.whatsapp) {
      const phone = student.whatsapp.replace(/\D/g, '');
      window.open(`https://wa.me/55${phone}`, '_blank');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-dark">
      {/* Dark Header */}
      <header className="sticky top-0 z-50 bg-card-header/80 backdrop-blur-md px-6 pt-12 pb-8 border-b border-white/5">
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-1 text-primary mb-6 hover:text-white transition-all group"
        >
          <span className="material-symbols-outlined !text-xl group-hover:-translate-x-1 transition-transform">chevron_left</span>
          <span className="text-sm font-black uppercase tracking-widest">Painel</span>
        </button>
        <h2 className="text-white text-4xl font-black uppercase tracking-tighter leading-none">Meus Alunos</h2>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8 pb-32 space-y-8">
        {/* Search Bar */}
        <div className="relative group">
          <input
            type="text"
            className="w-full h-16 bg-card-dark border border-white/10 rounded-2xl px-6 pr-14 text-white placeholder:text-slate-500 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all shadow-2xl"
            placeholder="Pesquisar por nome ou celular..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 size-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary">
            <span className="material-symbols-outlined">search</span>
          </div>
        </div>

        {/* Filters and Add Button */}
        <div className="flex flex-col gap-6">
          <div className="flex gap-3 overflow-x-auto hide-scrollbar">
            <button
              onClick={() => setFilter('active')}
              className={`flex h-10 items-center px-6 rounded-xl border font-black uppercase tracking-tighter text-xs whitespace-nowrap transition-all ${filter === 'active'
                ? 'bg-primary border-primary text-background-dark shadow-glow'
                : 'bg-white/5 border-white/10 text-slate-400 hover:border-primary/50'
                }`}
            >
              Ativos ({activeCount})
            </button>
            <button
              onClick={() => setFilter('inactive')}
              className={`flex h-10 items-center px-6 rounded-xl border font-black uppercase tracking-tighter text-xs whitespace-nowrap transition-all ${filter === 'inactive'
                ? 'bg-primary border-primary text-background-dark shadow-glow'
                : 'bg-white/5 border-white/10 text-slate-400 hover:border-primary/50'
                }`}
            >
              Inativos ({inactiveCount})
            </button>
          </div>

          <Button
            onClick={() => navigate('/students/new')}
            variant="premium"
            className="w-full h-14 rounded-2xl text-xs"
          >
            <span className="material-symbols-outlined mr-3">person_add</span>
            Adicionar Novo Aluno
          </Button>
        </div>

        {/* Student List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <span className="material-symbols-outlined animate-spin text-primary text-5xl">progress_activity</span>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Carregando atletas...</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="bg-card-dark border border-white/5 rounded-3xl py-20 text-center shadow-xl">
              <span className="material-symbols-outlined text-slate-700 text-6xl mb-4">person_off</span>
              <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Nenhum aluno nesta lista</p>
            </div>
          ) : (
            filteredStudents.map((student) => (
              <div
                key={student.id}
                onClick={() => navigate(`/student/${student.id}`)}
                className="flex items-center justify-between p-5 bg-card-dark border border-white/5 rounded-3xl shadow-xl hover:border-primary/30 active:scale-[0.98] transition-all cursor-pointer group relative overflow-hidden"
              >
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-primary rounded-full -ml-[2px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <img
                      className="size-16 rounded-2xl object-cover bg-white/5 border border-white/10 group-hover:border-primary/50 transition-all"
                      src={student.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random`}
                      alt={student.name}
                    />
                    <div className={`absolute -bottom-1 -right-1 size-5 rounded-full border-4 border-card-dark ${student.status === 'active' ? 'bg-status-active shadow-[0_0_10px_rgba(0,255,170,0.5)]' : 'bg-status-inactive'}`}></div>
                  </div>
                  <div>
                    <p className="text-white font-black text-xl leading-tight group-hover:text-primary transition-colors">
                      {student.name}
                    </p>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                      {student.whatsapp || student.email || 'Sem contato'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => handleWhatsAppClick(e, student)}
                  className="size-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-primary hover:bg-primary/20 hover:border-primary/50 transition-all active:scale-90"
                >
                  <span className="material-symbols-outlined text-2xl">chat</span>
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
