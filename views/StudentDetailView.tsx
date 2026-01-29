
import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudent } from '../contexts/StudentContext';

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
      <div className="min-h-screen bg-[#1e2d40] flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-white text-5xl">progress_activity</span>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-[#1e2d40] flex flex-col items-center justify-center p-6 text-center">
        <span className="material-symbols-outlined text-6xl text-white/50 mb-4">person_off</span>
        <h2 className="text-2xl font-bold text-white mb-2">Aluno não encontrado</h2>
        <button onClick={() => navigate('/students')} className="text-[#0ea5e9] font-bold hover:underline">Voltar para a lista</button>
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
    { label: 'Treinos', icon: 'fitness_center', color: 'bg-[#e0f2fe]', iconColor: 'text-[#0ea5e9]' },
    { label: 'Avaliações', icon: 'assignment', color: 'bg-[#e0f2fe]', iconColor: 'text-[#0ea5e9]' },
    { label: 'Posição financeira', icon: 'attach_money', color: 'bg-[#e0f2fe]', iconColor: 'text-[#0ea5e9]' },
    { label: 'Progresso do aluno', icon: 'assignment_turned_in', color: 'bg-[#e0f2fe]', iconColor: 'text-[#0ea5e9]' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#f3f4f6]">
      {/* Navy Header */}
      <header className="bg-[#1e2d40] px-6 pt-10 pb-20">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-white mb-8 hover:opacity-80 transition-opacity"
        >
          <span className="material-symbols-outlined !text-xl">chevron_left</span>
          <span className="text-sm font-medium">Voltar</span>
        </button>

        <div className="flex items-center gap-4">
          {/* Editable Photo */}
          <div className="relative cursor-pointer group" onClick={handlePhotoClick}>
            <img
              src={student.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random`}
              alt={student.name}
              className={`size-16 rounded-full border-2 border-white/20 object-cover transition-opacity ${updatingPhoto ? 'opacity-50' : 'group-hover:opacity-80'}`}
            />
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-white text-xl">photo_camera</span>
            </div>
            {updatingPhoto && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined animate-spin text-white text-xl">progress_activity</span>
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
          <h1 className="text-2xl font-medium text-white">{student.name}</h1>
        </div>
      </header>

      {/* Main Content (Shifted up with negative margin to overlay header slightly) */}
      <main className="flex-1 px-4 -mt-10 pb-24">
        {/* Tabs Container */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('inicio')}
            className={`flex-1 h-14 rounded-t-xl font-medium text-lg transition-all ${activeTab === 'inicio' ? 'bg-white text-slate-800' : 'bg-[#3b82f6] text-white'
              }`}
          >
            Início
          </button>
          <button
            onClick={() => setActiveTab('opcoes')}
            className={`flex-1 h-14 rounded-t-xl font-medium text-lg transition-all ${activeTab === 'opcoes' ? 'bg-white text-slate-800' : 'bg-[#3b82f6] text-white'
              }`}
          >
            Opções
          </button>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-b-xl rounded-t-none p-6 shadow-sm space-y-8">
          {/* Frequência de Treinos Section */}
          <div>
            <h3 className="text-slate-800 font-bold mb-6">Frequência de Treinos</h3>
            <div className="flex justify-between items-center px-2">
              {days.map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-3">
                  <div className={`size-11 rounded-full border-2 flex items-center justify-center transition-all ${day.active
                    ? 'bg-[#0ea5e9] border-[#0ea5e9] text-white'
                    : 'bg-white border-[#0ea5e9] text-transparent'
                    }`}>
                    <span className="material-symbols-outlined text-xl font-bold">check</span>
                  </div>
                  <span className="text-sm font-bold text-slate-700">{day.label}</span>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Menu Items List */}
          <div className="space-y-0 divide-y divide-slate-100">
            {menuItems.map((item, i) => (
              <button
                key={i}
                className="w-full flex items-center gap-4 py-4 hover:bg-slate-50 transition-colors group"
              >
                <div className={`size-12 rounded-full flex items-center justify-center ${item.color} ${item.iconColor} group-active:scale-95 transition-transform`}>
                  <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                </div>
                <span className="text-lg text-slate-700 font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDetailView;
