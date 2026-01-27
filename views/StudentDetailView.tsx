
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudent } from '../contexts/StudentContext';

const StudentDetailView: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { students, loading } = useStudent();
  const [activeTab, setActiveTab] = useState<'routines' | 'aerobic'>('routines');

  const student = students.find(s => s.id === id);

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-primary text-5xl">progress_activity</span>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center p-6 text-center">
        <span className="material-symbols-outlined text-6xl text-slate-600 mb-4">person_off</span>
        <h2 className="text-2xl font-black text-white mb-2">Aluno não encontrado</h2>
        <button onClick={() => navigate('/students')} className="text-primary font-bold hover:underline">Voltar para a lista</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 glass-nav p-6 border-b border-white/5">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-primary font-bold">
            <span className="material-symbols-outlined">arrow_back_ios</span>
            <span>Alunos</span>
          </button>
          <h2 className="text-lg font-black tracking-tight text-white uppercase tracking-widest">Perfil</h2>
          <button className="text-primary">
            <span className="material-symbols-outlined">more_horiz</span>
          </button>
        </div>
      </header>

      <main className="px-6 py-8 space-y-8 pb-24">
        {/* Profile Header */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <img
              src={student.image_url}
              alt={student.name}
              className="rounded-full h-28 w-28 border-4 border-primary/20 shadow-glow object-cover"
            />
            <div className={`absolute bottom-1 right-1 w-6 h-6 rounded-full border-4 border-background-dark shadow-lg ${student.status === 'active' ? 'bg-green-500' : 'bg-slate-500'}`}></div>
          </div>
          <div className="flex flex-col">
            <p className="text-3xl font-black leading-tight tracking-tighter text-white">{student.name}</p>
            <p className="text-primary text-sm font-bold uppercase tracking-widest mt-1">
              Aluno {student.status === 'active' ? 'Ativo' : 'Inativo'}
            </p>
            <p className="text-slate-500 text-xs font-medium mt-1">
              {student.group_type || 'Individual'} • {student.plan}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-white/5">
          <div className="flex gap-10">
            <button
              onClick={() => setActiveTab('routines')}
              className={`pb-4 pt-2 text-sm font-black transition-all border-b-2 ${activeTab === 'routines' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
            >
              Rotinas de Treino
            </button>
            <button
              onClick={() => setActiveTab('aerobic')}
              className={`pb-4 pt-2 text-sm font-black transition-all border-b-2 ${activeTab === 'aerobic' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
            >
              Aeróbico
            </button>
          </div>
        </div>

        {/* Action Button */}
        <button className="w-full flex items-center justify-center gap-3 rounded-2xl h-16 bg-white text-background-dark font-black text-lg shadow-glow shadow-primary/20 active:scale-[0.98] transition-all border-2 border-primary group">
          <span className="material-symbols-outlined text-primary text-3xl group-hover:rotate-90 transition-transform">add_circle</span>
          <span>Criar Nova Rotina</span>
        </button>

        {/* Routine Cards - Still static for now but could be fetched */}
        <div className="space-y-4">
          {[
            { name: student.plan !== 'Sem treino definido' ? student.plan : 'Nova Rotina de Força', period: '01 Jan - 30 Mar', tags: ['Hipertrofia', 'Intermediário'], active: true },
          ].map((routine, i) => (
            <div
              key={i}
              onClick={() => navigate(`/editor/${i}`)}
              className="bg-white rounded-3xl p-6 shadow-xl relative group overflow-hidden cursor-pointer active:scale-[0.98] transition-all"
            >
              <div className={`absolute top-0 left-0 w-2 h-full ${routine.active ? 'bg-primary shadow-glow' : 'bg-slate-300'}`}></div>
              <div className="flex justify-between items-start mb-4 pl-4">
                <div>
                  <h3 className="text-slate-900 text-xl font-black tracking-tight leading-tight uppercase">{routine.name}</h3>
                  <p className="text-slate-500 text-sm mt-2 flex items-center gap-2 font-medium">
                    <span className="material-symbols-outlined text-sm">calendar_today</span>
                    {routine.period}
                  </p>
                </div>
                <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2 pl-4">
                {routine.tags.map((tag, j) => (
                  <span key={j} className={`text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest ${j === 0 ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-600'}`}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default StudentDetailView;
