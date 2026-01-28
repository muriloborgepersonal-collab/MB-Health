import React, { useState } from 'react';
import { TopBar } from '../components/layout/TopBar';
import { Input } from '../components/ui/Input';
import { Search, UserPlus, MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

const MOCK_STUDENTS = [
    { id: 1, name: 'Alice Silva', status: 'active', avatar: null },
    { id: 2, name: 'Bruno Santos', status: 'inactive', avatar: null },
    { id: 3, name: 'Carla Dias', status: 'active', avatar: null },
    { id: 4, name: 'Daniel Costa', status: 'active', avatar: null },
    { id: 5, name: 'Eduardo Lima', status: 'deleted', avatar: null },
];

export default function StudentList() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState<'active' | 'inactive' | 'deleted'>('active');
    const [search, setSearch] = useState('');

    const filteredStudents = MOCK_STUDENTS.filter(student =>
        student.status === filter && student.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex flex-col min-h-screen bg-black text-white selection:bg-primary/30">
            <TopBar
                title={<span className="font-black text-lg tracking-[0.2em] italic uppercase">ALUNOS</span>}
                showBack
                className="bg-surface border-b border-primary/10 rounded-b-[40px] shadow-neon z-10"
            />

            <div className="flex-1 p-6 space-y-8 animate-kinetic-reveal">
                {/* Search */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity rounded-full"></div>
                    <Input
                        placeholder="Pesquisar por nome ou status..."
                        icon={<Search className="h-5 w-5 text-primary" />}
                        className="rounded-3xl bg-surface text-white placeholder:text-text-muted border-white/5 focus:border-primary/50 transition-all h-14 pl-12"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Filters */}
                <div className="flex gap-3 justify-center overflow-x-auto hide-scrollbar py-2">
                    <FilterPill label={`Ativos: 71`} active={filter === 'active'} onClick={() => setFilter('active')} />
                    <FilterPill label={`Inativos: 77`} active={filter === 'inactive'} onClick={() => setFilter('inactive')} />
                    <FilterPill label="Excluídos" active={filter === 'deleted'} onClick={() => setFilter('deleted')} />
                </div>

                {/* Add Button */}
                <div className="flex justify-center">
                    <Button
                        variant="ghost"
                        className="text-primary hover:text-white hover:bg-primary/10 gap-3 px-8 h-12 rounded-2xl border-2 border-primary/20 border-dashed hover:border-solid hover:border-primary transition-all duration-500 font-black uppercase tracking-widest text-xs"
                        size="sm"
                    >
                        <UserPlus className="h-5 w-5" />
                        <span>+ Adicionar aluno</span>
                    </Button>
                </div>

                {/* List */}
                <div className="space-y-4">
                    {filteredStudents.map((student, index) => (
                        <Card
                            key={student.id}
                            className="bg-surface border-white/5 hover:border-primary/40 cursor-pointer flex items-center justify-between p-4 rounded-3xl active:scale-[0.98] transition-all duration-500 group relative overflow-hidden animate-kinetic-reveal"
                            style={{ animationDelay: `${index * 50}ms` }}
                            onClick={() => navigate('/student')} // Navigate to mock profile
                        >
                            <div className="flex items-center gap-5">
                                <div className="h-16 w-16 rounded-2xl bg-black border border-white/10 flex items-center justify-center overflow-hidden shadow-glow group-hover:border-primary/50 transition-all">
                                    {/* Placeholder avatar */}
                                    <span className="text-primary font-black text-2xl tracking-tighter italic">{student.name.charAt(0)}</span>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-white font-black text-lg tracking-tight uppercase group-hover:text-primary transition-colors">{student.name}</span>
                                    <span className="text-[10px] font-black tracking-widest uppercase text-text-muted group-hover:text-white/50 transition-colors">ID: #00{student.id}</span>
                                </div>
                            </div>
                            <button
                                className="p-3 rounded-2xl bg-primary/5 text-primary hover:bg-primary hover:text-black transition-all duration-500 shadow-glow"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // Handle WhatsApp click
                                }}
                            >
                                <MessageCircle className="h-6 w-6" />
                            </button>
                        </Card>
                    ))}
                    {filteredStudents.length === 0 && (
                        <div className="text-center text-text-muted py-12 flex flex-col items-center gap-4 opacity-50">
                            <Search className="h-12 w-12 text-primary" />
                            <p className="font-black uppercase tracking-widest text-xs">Nenhum aluno encontrado</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function FilterPill({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "px-6 py-2.5 rounded-2xl text-[10px] uppercase tracking-widest font-black transition-all duration-500 border whitespace-nowrap",
                active
                    ? "bg-primary text-black border-primary shadow-neon-strong translate-y-[-2px]"
                    : "bg-surface text-text-muted border-white/5 hover:border-primary/30 hover:text-white"
            )}
        >
            {label}
        </button>
    )
}
