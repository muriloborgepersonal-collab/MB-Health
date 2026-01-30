
import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudent } from '../contexts/StudentContext';
import { Button } from '../src/components/ui/Button';

const StudentDetailView: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { students, loading, updateStudent } = useStudent();
  const [activeTab, setActiveTab] = useState<'inicio' | 'opcoes'>('inicio');
  const [updatingPhoto, setUpdatingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const student = students.find(s => s.id === id);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && student) {
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB');
        return;
      }
      setUpdatingPhoto(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          await updateStudent(student.id, { image_url: reader.result as string });
        } catch (error) {
          console.error('Error updating photo:', error);
          alert('Erro ao atualizar foto.');
        } finally {
          setUpdatingPhoto(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center gap-4">
        <span className="material-symbols-outlined animate-spin text-primary text-5xl">progress_activity</span>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Carregando Perfil...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center p-6 text-center">
        <span className="material-symbols-outlined text-7xl text-white/5 mb-6">person_off</span>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Aluno não encontrado</h2>
        <button onClick={() => navigate('/students')} className="text-primary font-black uppercase tracking-widest text-xs hover:underline">Voltar para a lista</button>
      </div>
    );
  }

  const days = [
    { label: 'S', active: true },
    { label: 'T', active: true },
    { label: 'Q', active: false },
    { label: 'Q', active: false },
    { label: 'S', active: false },
    { label: 'S', active: false },
    { label: 'D', active: false },
  ];

  const menuItems = [
    { label: 'Treinos', icon: 'fitness_center', color: 'bg-primary/10', iconColor: 'text-primary', path: `/student/${student.id}/workouts` },
    { label: 'Avaliações', icon: 'assignment', color: 'bg-white/5', iconColor: 'text-slate-400' },
    { label: 'Posição financeira', icon: 'attach_money', color: 'bg-white/5', iconColor: 'text-slate-400' },
    { label: 'Progresso do aluno', icon: 'assignment_turned_in', color: 'bg-white/5', iconColor: 'text-slate-400' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background-dark">
      {/* Dark Header */}
      <header className="bg-card-header px-6 pt-12 pb-24 border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5">
          <span className="material-symbols-outlined text-[120px]">person</span>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-primary mb-8 hover:text-white transition-all group relative z-10"
        >
          <span className="material-symbols-outlined !text-xl group-hover:-translate-x-1 transition-transform">chevron_left</span>
          <span className="text-sm font-black uppercase tracking-widest">Voltar</span>
        </button>

        <div className="flex items-center gap-5 relative z-10">
          {/* Editable Photo */}
          <div className="relative cursor-pointer group" onClick={handlePhotoClick}>
            <img
              src={student.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random`}
              alt={student.name}
              className={`size-24 rounded-[2rem] border-4 border-white/10 group-hover:border-primary/50 object-cover shadow-2xl transition-all ${updatingPhoto ? 'opacity-50' : ''}`}
            />
            <div className="absolute inset-0 flex items-center justify-center rounded-[2rem] bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-white text-2xl">photo_camera</span>
            </div>
            {updatingPhoto && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined animate-spin text-primary text-2xl">progress_activity</span>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">{student.name}</h1>
            <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mt-1">Perfil do Atleta</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 -mt-12 pb-24 space-y-4">
        {/* Tabs Container */}
        <div className="flex gap-3 bg-card-dark/50 backdrop-blur-xl p-1.5 rounded-[1.5rem] border border-white/5 shadow-2xl">
          <Button
            onClick={() => setActiveTab('inicio')}
            variant={activeTab === 'inicio' ? 'premium' : 'glass'}
            className="flex-1 h-12 rounded-2xl text-[10px]"
          >
            Início
          </Button>
          <Button
            onClick={() => setActiveTab('opcoes')}
            variant={activeTab === 'opcoes' ? 'premium' : 'glass'}
            className="flex-1 h-12 rounded-2xl text-[10px]"
          >
            Opções
          </Button>
        </div>

        {/* Content Card */}
        <div className="bg-card-dark border border-white/5 rounded-[2rem] p-6 shadow-2xl space-y-10">
          {/* Frequência de Treinos Section */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-white font-black uppercase tracking-widest text-xs">Frequência de Treinos</h3>
              <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Últimos 7 dias</span>
            </div>
            <div className="flex justify-between items-center px-1">
              {days.map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-4">
                  <div className={`size-10 rounded-xl border flex items-center justify-center transition-all ${day.active
                    ? 'bg-primary border-primary text-background-dark shadow-glow scale-110'
                    : 'bg-white/5 border-white/10 text-transparent'
                    }`}>
                    <span className="material-symbols-outlined text-lg font-black">check</span>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-tighter ${day.active ? 'text-primary' : 'text-slate-600'}`}>
                    {day.label}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

          {/* Menu Items List */}
          <section className="space-y-4">
            {menuItems.map((item, i) => (
              <button
                key={i}
                onClick={() => item.path && navigate(item.path)}
                className="w-full flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-[1.5rem] hover:border-primary/30 hover:bg-white/[0.04] active:scale-[0.98] transition-all group"
              >
                <div className="flex items-center gap-5">
                  <div className={`size-12 rounded-2xl flex items-center justify-center ${item.color} ${item.iconColor} shadow-glow transition-all group-hover:scale-110`}>
                    <span className="material-symbols-outlined text-2xl font-light">{item.icon}</span>
                  </div>
                  <span className="text-sm text-slate-300 font-black uppercase tracking-widest group-hover:text-white transition-colors">
                    {item.label}
                  </span>
                </div>
                <span className="material-symbols-outlined text-slate-700 group-hover:text-primary transition-colors">chevron_right</span>
              </button>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
};

export default StudentDetailView;
