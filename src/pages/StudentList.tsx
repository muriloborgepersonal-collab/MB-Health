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
        <div className="flex flex-col min-h-screen">
            <TopBar
                title={<span className="font-bold text-lg">MFITPERSONAL</span>}
                showBack
                className="bg-surface border-b border-white/5"
            />

            <div className="flex-1 p-4 space-y-6">
                {/* Search */}
                <Input
                    placeholder="Pesquise por nome, email ou telefone"
                    icon={<Search className="h-5 w-5" />}
                    className="rounded-full bg-white text-black placeholder:text-gray-500 border-none"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {/* Filters */}
                <div className="flex gap-2 justify-center">
                    <FilterPill label="Ativos: 71" active={filter === 'active'} onClick={() => setFilter('active')} />
                    <FilterPill label="Inativos: 77" active={filter === 'inactive'} onClick={() => setFilter('inactive')} />
                    <FilterPill label="Excluídos" active={filter === 'deleted'} onClick={() => setFilter('deleted')} />
                </div>

                {/* Add Button */}
                <div className="flex justify-center">
                    <Button variant="ghost" className="text-primary hover:text-primary-dark hover:bg-primary/5 gap-2" size="sm">
                        <UserPlus className="h-5 w-5" />
                        <span className="font-bold">+ Adicionar aluno</span>
                    </Button>
                </div>

                {/* List */}
                <div className="space-y-3">
                    {filteredStudents.map(student => (
                        <Card
                            key={student.id}
                            className="bg-white hover:bg-white/90 cursor-pointer flex items-center justify-between p-3 active:scale-[0.98]"
                            onClick={() => navigate('/profile')} // Navigate to mock profile
                        >
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                    {/* Placeholder avatar */}
                                    <span className="text-gray-500 font-bold text-lg">{student.name.charAt(0)}</span>
                                </div>
                                <span className="text-black font-bold text-base">{student.name}</span>
                            </div>
                            <button
                                className="p-2 rounded-full hover:bg-green-100 transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // Handle WhatsApp click
                                }}
                            >
                                <MessageCircle className="h-6 w-6 text-status-active fill-current" />
                            </button>
                        </Card>
                    ))}
                    {filteredStudents.length === 0 && (
                        <div className="text-center text-text-muted py-8">
                            Nenhum aluno encontrado.
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
                "px-4 py-1.5 rounded-full text-xs font-medium transition-all",
                active
                    ? "bg-primary text-black font-bold shadow-lg shadow-primary/20"
                    : "bg-surface text-text-muted hover:bg-surface/80"
            )}
        >
            {label}
        </button>
    )
}
