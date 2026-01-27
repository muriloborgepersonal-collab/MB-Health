import React, { useState } from 'react';
import { TopBar } from '../components/layout/TopBar';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { cn } from '../lib/utils';
import { MoreVertical, Calendar, Activity, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MOCK_ROUTINES = [
    {
        id: 1,
        title: 'POWERBUILDING 5x bloco 5',
        dateRange: '02/01/2026 - 02/02/2026',
        tags: 'Hipertrofia | Intermediário',
        active: true
    }
];

export default function StudentProfile() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'rotinas' | 'aerobico'>('rotinas');

    return (
        <div className="flex flex-col min-h-screen">
            <TopBar
                title={
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            <span className="text-gray-500 font-bold text-sm">A</span>
                        </div>
                        <span className="font-bold text-lg">Adriano Albino</span>
                    </div>
                }
                showBack
                className="bg-surface border-b border-white/5"
            />

            <div className="flex-1 p-4 space-y-6">

                {/* Tabs */}
                <div className="flex p-1 bg-surface/50 rounded-xl">
                    <button
                        onClick={() => setActiveTab('rotinas')}
                        className={cn(
                            "flex-1 py-3 text-sm font-bold rounded-lg transition-all",
                            activeTab === 'rotinas' ? "bg-white text-black shadow-sm" : "text-text-muted"
                        )}
                    >
                        Rotinas de treino
                    </button>
                    <button
                        onClick={() => setActiveTab('aerobico')}
                        className={cn(
                            "flex-1 py-3 text-sm font-bold rounded-lg transition-all",
                            activeTab === 'aerobico' ? "bg-primary text-white shadow" : "text-text-muted"
                        )}
                    >
                        Aeróbico
                    </button>
                </div>

                {/* Create Button */}
                <Button
                    className="w-full bg-white border border-primary text-primary hover:bg-primary/5 h-16 rounded-xl flex items-center justify-center gap-2"
                    variant="ghost"
                >
                    <Plus className="h-6 w-6" />
                    <span className="text-lg font-bold">Criar rotina</span>
                </Button>

                {/* Filters */}
                <div className="grid grid-cols-2 gap-4">
                    <Button variant="secondary" className="bg-primary/10 border-none text-primary">Arquivadas</Button>
                    <Button variant="secondary" className="bg-primary/10 border-none text-primary">Excluídas</Button>
                </div>

                {/* List */}
                <div className="space-y-4">
                    {MOCK_ROUTINES.map(routine => (
                        <Card
                            key={routine.id}
                            className="bg-white p-5 space-y-4 cursor-pointer active:scale-[0.99]"
                            onClick={() => navigate('/routine')} // Navigate to details
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex gap-4">
                                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                                        <Activity className="text-primary h-6 w-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-black font-bold text-lg leading-tight">{routine.title}</h3>
                                        <div className="flex items-center gap-1 text-gray-500 text-sm">
                                            <Calendar className="h-4 w-4" />
                                            <span>{routine.dateRange}</span>
                                        </div>
                                        <p className="text-gray-400 text-sm">{routine.tags}</p>
                                    </div>
                                </div>
                                <button className="p-1">
                                    <MoreVertical className="text-gray-400 h-5 w-5" />
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>

            </div>
        </div>
    );
}
