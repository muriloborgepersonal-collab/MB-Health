import React, { useState } from 'react';
import { TopBar } from '../components/layout/TopBar';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { cn } from '../lib/utils';
import { MoreVertical, Calendar, Activity, Eye, ArrowUpDown, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RoutineDetails() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-screen pb-20">
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

                {/* Routine Info Card */}
                <Card className="bg-white p-5 space-y-4">
                    <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                                <Activity className="text-primary h-6 w-6" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-black font-bold text-xl leading-tight">POWERBUILDING 5x bloco 5</h3>
                                <div className="flex items-center gap-1 text-gray-500 text-sm">
                                    <Calendar className="h-4 w-4" />
                                    <span>02/01/2026 - 02/02/2026</span>
                                </div>
                                <p className="text-gray-400 text-sm">Hipertrofia | Intermediário</p>
                            </div>
                        </div>
                        <button className="p-1">
                            <MoreVertical className="text-gray-400 h-5 w-5" />
                        </button>
                    </div>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between border-b border-gray-100 pb-2">
                            <span className="text-gray-600 font-bold">Tipo de treino:</span>
                            <span className="text-gray-500">Numérico</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 pb-2">
                            <span className="text-gray-600 font-bold">Mostrar para o aluno:</span>
                            <span className="text-gray-500">Sempre</span>
                        </div>
                        <div className="flex justify-between pb-2">
                            <span className="text-gray-600 font-bold">Arquivar automaticamente:</span>
                            <span className="text-gray-500">Não</span>
                        </div>
                    </div>

                    <button className="w-full bg-gray-100 rounded-lg py-3 px-4 flex justify-between items-center text-black font-bold text-sm hover:bg-gray-200 transition-colors">
                        <span>Orientações gerais</span>
                        <Eye className="h-4 w-4" />
                    </button>
                </Card>

                {/* Actions */}
                <div className="flex gap-4">
                    <Button variant="outline" className="flex-1 border-primary text-primary bg-white hover:bg-primary/5 gap-2">
                        <ArrowUpDown className="h-4 w-4" />
                        Reordenar treinos
                    </Button>
                    <Button className="flex-1 gap-2">
                        <Plus className="h-4 w-4" />
                        Adicionar treino
                    </Button>
                </div>

                {/* Workout List */}
                <div className="space-y-4">
                    <WorkoutCard
                        title="Treino 1"
                        subtitle="Peito/ ombro e tríceps"
                        onClick={() => navigate('/workout')}
                    />
                    <WorkoutCard
                        title="Treino 2"
                        subtitle="Costas e Bíceps"
                        onClick={() => navigate('/workout')}
                    />
                </div>
            </div>
        </div>
    );
}

function WorkoutCard({ title, subtitle, onClick }: { title: string, subtitle: string, onClick: () => void }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <Card className="bg-white p-0 overflow-hidden">
            <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                onClick={onClick}
            >
                <div>
                    <h4 className="text-black font-bold text-lg">{title}</h4>
                    <p className="text-gray-500 text-sm">{subtitle}</p>
                </div>
                <MoreVertical className="text-gray-400 h-5 w-5" />
            </div>

            <div className="px-4 pb-2">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setExpanded(!expanded);
                    }}
                    className="flex text-gray-500 text-xs font-bold items-center gap-1 py-2"
                >
                    Orientações gerais
                    {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                {expanded && (
                    <div className="mb-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        Realizar pré-exaustão antes de cargas máximas.
                    </div>
                )}
            </div>
        </Card>
    )
}
