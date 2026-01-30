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
        <div className="flex flex-col min-h-screen pb-20 bg-background-dark text-white">
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
                <Card className="bg-card-dark border-white/5 p-5 space-y-4 rounded-3xl">
                    <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-primary text-background-dark flex items-center justify-center shadow-glow">
                                <Activity className="h-6 w-6 font-bold" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-white font-black text-xl leading-tight uppercase tracking-tight">POWERBUILDING 5x bloco 5</h3>
                                <div className="flex items-center gap-1 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                                    <Calendar className="h-4 w-4" />
                                    <span>02/01/2026 - 02/02/2026</span>
                                </div>
                                <p className="text-primary text-[10px] font-black uppercase tracking-widest">Hipertrofia | Intermediário</p>
                            </div>
                        </div>
                        <button className="p-1">
                            <MoreVertical className="text-slate-500 h-5 w-5" />
                        </button>
                    </div>

                    <div className="space-y-3 text-xs">
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-slate-400 font-bold uppercase tracking-widest">Tipo de treino:</span>
                            <span className="text-white font-black uppercase">Numérico</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-slate-400 font-bold uppercase tracking-widest">Mostrar para o aluno:</span>
                            <span className="text-white font-black uppercase">Sempre</span>
                        </div>
                        <div className="flex justify-between pb-2">
                            <span className="text-slate-400 font-bold uppercase tracking-widest">Arquivar automaticamente:</span>
                            <span className="text-white font-black uppercase">Não</span>
                        </div>
                    </div>

                    <button className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 flex justify-between items-center text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-colors">
                        <span>Orientações gerais</span>
                        <Eye className="h-4 w-4" />
                    </button>
                </Card>

                {/* Actions */}
                <div className="flex gap-4">
                    <Button variant="glass" className="flex-1 gap-2 h-14 rounded-2xl text-[10px]">
                        <ArrowUpDown className="h-4 w-4 text-primary" />
                        Reordenar treinos
                    </Button>
                    <Button variant="premium" className="flex-1 gap-2 h-14 rounded-2xl text-[10px]">
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
        <Card className="bg-card-dark border-white/5 p-0 overflow-hidden rounded-[2.5rem] shadow-2xl relative">
            <div
                className="p-6 flex items-center justify-between cursor-pointer group"
                onClick={onClick}
            >
                <div>
                    <h4 className="text-white font-black text-xl uppercase tracking-tight group-hover:text-primary transition-colors">{title}</h4>
                    <p className="text-slate-500 text-sm font-bold mt-1">{subtitle}</p>
                </div>
                <MoreVertical className="text-slate-500 h-5 w-5" />
            </div>

            <div className="px-6 pb-4">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setExpanded(!expanded);
                    }}
                    className="w-full flex bg-white/5 border border-white/10 rounded-2xl py-3 px-4 justify-between items-center text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-colors mb-4"
                >
                    <span>Orientações gerais</span>
                    {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                {expanded && (
                    <div className="mb-4 text-xs font-bold text-slate-400 bg-white/5 p-4 rounded-2xl border border-white/5 animate-kinetic-reveal">
                        Realizar pré-exaustão antes de cargas máximas.
                    </div>
                )}

                <div className="flex gap-4">
                    <Button variant="premium" className="flex-1 h-12 rounded-2xl text-[10px] gap-2">
                        <Activity className="h-4 w-4" />
                        Evolução
                    </Button>
                    <Button variant="glass" className="flex-1 h-12 rounded-2xl text-[10px] gap-2">
                        <Eye className="h-4 w-4 text-primary" />
                        Feedbacks
                    </Button>
                </div>
            </div>
        </Card>
    )
}
