
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudent } from '../contexts/StudentContext';

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
    <div className="flex flex-col min-h-screen bg-[#1e2d40]">
      {/* Navy Header */}
      <header className="px-6 pt-10 pb-16">
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-1 text-white mb-6 hover:opacity-80 transition-opacity"
        >
          <span className="material-symbols-outlined !text-xl">chevron_left</span>
          <span className="text-sm font-medium">Voltar</span>
        </button>
        <h2 className="text-white text-[2.5rem] font-bold leading-none">Seus alunos</h2>
      </header>

      {/* Main Content Card */}
      <main className="flex-1 bg-white rounded-t-[2.5rem] px-6 pt-8 pb-32">
        {/* Search Bar */}
        <div className="relative mb-6">
          <input
            type="text"
            className="w-full h-14 bg-white border border-slate-200 rounded-xl px-4 pr-12 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
            placeholder="Pesquise por nome, email ou telefone"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-700">search</span>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-8">
          <button
            onClick={() => setFilter('active')}
            className={`flex h-8 items-center px-4 rounded-full border text-[11px] font-bold whitespace-nowrap transition-all ${filter === 'active'
                ? 'bg-[#e0f2fe] border-[#0ea5e9] text-[#0ea5e9]'
                : 'bg-slate-100 border-[#cbd5e1] text-slate-500'
              }`}
          >
            Ativos: {activeCount}
          </button>
          <button
            onClick={() => setFilter('inactive')}
            className={`flex h-8 items-center px-4 rounded-full border text-[11px] font-bold whitespace-nowrap transition-all ${filter === 'inactive'
                ? 'bg-[#e0f2fe] border-[#0ea5e9] text-[#0ea5e9]'
                : 'bg-slate-100 border-[#cbd5e1] text-slate-500'
              }`}
          >
            Inativos: {inactiveCount}
          </button>
          <button
            onClick={() => setFilter('deleted')}
            className={`flex h-8 items-center px-4 rounded-full border text-[11px] font-bold whitespace-nowrap transition-all ${filter === 'deleted'
                ? 'bg-[#e0f2fe] border-[#0ea5e9] text-[#0ea5e9]'
                : 'bg-slate-100 border-[#cbd5e1] text-slate-500'
              }`}
          >
            Excluídos
          </button>
        </div>

        {/* Add Student Link */}
        <button
          onClick={() => navigate('/students/new')}
          className="flex items-center justify-center gap-2 w-full text-[#0ea5e9] font-bold text-lg mb-8"
        >
          <span className="material-symbols-outlined">person_add</span>
          Adicionar aluno
        </button>

        {/* Student List */}
        <div className="space-y-0 divide-y divide-slate-100">
          {loading ? (
            <div className="flex justify-center py-12">
              <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <p className="font-medium">Nenhum aluno encontrado</p>
            </div>
          ) : (
            filteredStudents.map((student) => (
              <div
                key={student.id}
                onClick={() => navigate(`/student/${student.id}`)}
                className="flex items-center justify-between py-5 group cursor-pointer active:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <img
                    className="size-14 rounded-full object-cover bg-slate-100 border border-slate-100"
                    src={student.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random`}
                    alt={student.name}
                  />
                  <p className="text-[#1a2d40] font-bold text-lg leading-tight truncate max-w-[200px]">
                    {student.name}
                  </p>
                </div>
                <button
                  onClick={(e) => handleWhatsAppClick(e, student)}
                  className="size-10 flex items-center justify-center rounded-full bg-white border border-slate-200 text-[#25d366] hover:bg-[#25d366] hover:text-white transition-all shadow-sm"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-1.557-.594-2.662-1.726-1.104-1.132-1.607-2.446-1.685-2.697-.077-.251-.041-.392.098-.534.14-.14.307-.365.462-.539.154-.174.205-.297.307-.493.102-.197.051-.37-.026-.544-.077-.174-.691-1.671-.947-2.288-.248-.599-.501-.519-.691-.529-.174-.009-.373-.01-.571-.01-.199 0-.523.074-.797.371-.274.298-1.045 1.021-1.045 2.491 0 1.47 1.07 2.89 1.219 3.088.149.199 2.107 3.216 5.101 4.51.712.308 1.268.491 1.701.629.714.227 1.365.195 1.879.119.573-.085 1.761-.719 2.011-1.414.25-.694.25-1.289.174-1.414-.076-.125-.282-.199-.589-.353z" />
                  </svg>
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
