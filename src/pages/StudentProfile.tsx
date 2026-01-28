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
        <div className="flex flex-col min-h-screen bg-black text-white selection:bg-primary/30">
            <TopBar
                title={
                    <div className="flex items-center gap-4 animate-kinetic-reveal">
                        <div className="h-12 w-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center overflow-hidden shadow-glow">
                            <span className="text-primary font-black text-xl italic tracking-tighter">A</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white font-black text-sm uppercase tracking-tight">Adriano Albino</span>
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] opacity-70">Aluno Premium</span>
                        </div>
                    </div>
                }
                showBack
                className="bg-surface border-b border-primary/10 rounded-b-[40px] shadow-neon z-10 h-20"
            />

            <div className="flex-1 p-6 space-y-8 animate-kinetic-reveal [animation-delay:200ms]">

                {/* Tabs */}
                <div className="flex p-1.5 bg-surface/50 rounded-3xl border border-white/5">
                    <button
                        onClick={() => setActiveTab('rotinas')}
                        className={cn(
                            "flex-1 py-3.5 text-xs font-black rounded-2xl transition-all duration-500 uppercase tracking-widest",
                            activeTab === 'rotinas' ? "bg-primary text-black shadow-neon-strong translate-y-[-2px]" : "text-text-muted hover:text-white"
                        )}
                    >
                        Rotinas de treino
                    </button>
                    <button
                        onClick={() => setActiveTab('aerobico')}
                        className={cn(
                            "flex-1 py-3.5 text-xs font-black rounded-2xl transition-all duration-500 uppercase tracking-widest",
                            activeTab === 'aerobico' ? "bg-primary text-black shadow-neon-strong translate-y-[-2px]" : "text-text-muted hover:text-white"
                        )}
                    >
                        Aeróbico
                    </button>
                </div>

                {/* Create Button */}
                <Button
                    className="w-full bg-surface border-2 border-primary/20 border-dashed text-primary hover:border-solid hover:border-primary hover:bg-primary/5 hover:text-white h-20 rounded-3xl flex items-center justify-center gap-4 transition-all duration-500 group shadow-lg"
                    variant="ghost"
                >
                    <div className="p-2 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform">
                        <Plus className="h-7 w-7" />
                    </div>
                    <span className="text-lg font-black uppercase tracking-[0.1em] italic">Criar rotina</span>
                </Button>

                {/* Filters */}
                <div className="grid grid-cols-2 gap-4">
                    <Button variant="secondary" className="bg-surface border border-white/5 text-primary rounded-2xl h-12 uppercase font-black text-[10px] tracking-widest hover:border-primary/50 transition-all">Arquivadas</Button>
                    <Button variant="secondary" className="bg-surface border border-white/5 text-primary rounded-2xl h-12 uppercase font-black text-[10px] tracking-widest hover:border-primary/50 transition-all">Excluídas</Button>
                </div>

                {/* List */}
                <div className="space-y-4">
                    {MOCK_ROUTINES.map((routine, index) => (
                        <Card
                            key={routine.id}
                            className="bg-surface border-white/5 p-6 space-y-5 rounded-4xl cursor-pointer active:scale-[0.98] hover:border-primary/40 hover:shadow-neon transition-all duration-500 group relative overflow-hidden animate-kinetic-reveal"
                            style={{ animationDelay: `${index * 100}ms` }}
                            onClick={() => navigate('/routine')} // Navigate to details
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex gap-5">
                                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
                                        <Activity className="text-primary h-7 w-7" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <h3 className="text-white font-black text-xl tracking-tight uppercase italic group-hover:text-primary transition-colors">{routine.title}</h3>
                                        <div className="flex items-center gap-2 text-text-muted text-[10px] font-black tracking-widest uppercase">
                                            <Calendar className="h-3.5 w-3.5 text-primary" />
                                            <span>{routine.dateRange}</span>
                                        </div>
                                        <div className="pt-2">
                                            <span className="text-[10px] font-black tracking-[0.1em] text-primary/80 bg-primary/5 px-2.5 py-1 rounded-lg border border-primary/20 uppercase">{routine.tags}</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="p-2 bg-white/5 rounded-xl hover:bg-primary hover:text-black transition-all">
                                    <MoreVertical className="h-5 w-5" />
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>

            </div>
        </div>
    );
}
