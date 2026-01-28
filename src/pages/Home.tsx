import React, { useState } from 'react';
import { Dumbbell, MessageCircle, Calendar, Send, Users, UserPlus, Link as LinkIcon, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { cn } from '../lib/utils'; // Assuming cn utility exists

export default function Home() {
    const [activeTab, setActiveTab] = useState<'inicio' | 'financas'>('inicio');

    return (
        <div className="flex flex-col min-h-screen pb-24 bg-black text-white selection:bg-primary/30">
            {/* Header */}
            <header className="px-6 pt-12 pb-8 bg-surface border-b border-primary/10 rounded-b-[40px] shadow-neon animate-kinetic-reveal">
                <div className="flex flex-col items-center space-y-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl shadow-glow">
                            <Dumbbell className="text-primary h-8 w-8 animate-pulse-neon" />
                        </div>
                        <h1 className="text-2xl font-black tracking-[0.2em] text-white uppercase italic">MBHealth</h1>
                    </div>

                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-5">
                            <div className="h-16 w-16 rounded-3xl bg-surface border-2 border-primary/20 flex items-center justify-center overflow-hidden shadow-neon group hover:border-primary transition-all duration-500">
                                <UserPlus className="h-8 w-8 text-text-muted group-hover:text-primary transition-colors" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-primary font-black text-xs uppercase tracking-widest mb-1">Status: Online</span>
                                <span className="text-white font-black text-2xl tracking-tight">Adriano Albino</span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="grid grid-cols-2 w-full gap-4 bg-black/40 p-1.5 rounded-3xl border border-white/5">
                        <button
                            onClick={() => setActiveTab('inicio')}
                            className={cn(
                                "py-3.5 px-6 rounded-2xl text-sm font-black transition-all duration-500 uppercase tracking-widest",
                                activeTab === 'inicio'
                                    ? "bg-primary text-black shadow-neon-strong translate-y-[-2px]"
                                    : "text-text-muted hover:text-white hover:bg-white/5"
                            )}
                        >
                            Início
                        </button>
                        <button
                            onClick={() => setActiveTab('financas')}
                            className={cn(
                                "py-3.5 px-6 rounded-2xl text-sm font-black transition-all duration-500 uppercase tracking-widest",
                                activeTab === 'financas'
                                    ? "bg-primary text-black shadow-neon-strong translate-y-[-2px]"
                                    : "text-text-muted hover:text-white hover:bg-white/5"
                            )}
                        >
                            Finanças
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 px-4 py-8 space-y-10 animate-kinetic-reveal [animation-delay:200ms]">

                {/* Notifications Grid */}
                <section className="grid grid-cols-3 gap-4">
                    <NotificationCard icon={MessageCircle} count={99} label="FEEDBACKS" />
                    <NotificationCard icon={Calendar} count={7} label="ATUALIZAR" />
                    <NotificationCard icon={Send} label="ENVIAR" />
                </section>

                {/* Students Section */}
                <section className="space-y-6">
                    <div className="flex items-baseline justify-between px-2">
                        <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Seus alunos</h2>
                        <span className="text-primary text-[10px] font-black tracking-widest uppercase opacity-50">Painel Geral</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Card className="bg-surface border-white/5 flex flex-col items-center justify-center p-6 gap-4 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all duration-500 active:scale-95 group rounded-3xl">
                            <div className="p-3 bg-primary/10 rounded-2xl group-hover:shadow-glow transition-all">
                                <UserPlus className="h-8 w-8 text-primary" />
                            </div>
                            <span className="text-xs font-black text-white uppercase tracking-widest">Novo Aluno</span>
                        </Card>

                        <Card className="bg-surface border-white/5 flex flex-col items-center justify-center p-6 gap-4 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all duration-500 active:scale-95 group relative rounded-3xl">
                            <div className="absolute top-3 right-3 bg-status-deleted text-white text-[10px] font-black px-2 py-1 rounded-lg animate-pulse shadow-glow">1</div>
                            <div className="p-3 bg-primary/10 rounded-2xl group-hover:shadow-glow transition-all">
                                <LinkIcon className="h-8 w-8 text-primary" />
                            </div>
                            <span className="text-xs font-black text-white uppercase tracking-widest">Link Registro</span>
                        </Card>
                    </div>

                    <Card className="bg-surface border-white/5 p-2 rounded-4xl overflow-hidden cursor-pointer hover:border-primary/30 hover:shadow-neon transition-all duration-500 group">
                        <div className="p-5 flex items-center justify-between">
                            <div className="flex items-center gap-5">
                                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
                                    <Users className="text-primary h-7 w-7" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-xl font-black text-white tracking-tight uppercase">Meus Alunos</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black tracking-widest uppercase text-status-active/80 px-2.5 py-1 bg-status-active/5 rounded-full border border-status-active/20">71 Ativos</span>
                                        <span className="text-[10px] font-black tracking-widest uppercase text-status-inactive/80 px-2.5 py-1 bg-status-inactive/5 rounded-full border border-status-inactive/20">77 Inativos</span>
                                    </div>
                                </div>
                            </div>
                            <ChevronRight className="text-primary h-6 w-6 opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all" />
                        </div>
                    </Card>
                </section>

            </main>
        </div>
    );
}

function NotificationCard({ icon: Icon, count, label }: { icon: any, count?: number, label: string }) {
    return (
        <div className="flex flex-col items-center gap-3 group cursor-pointer active:scale-90 transition-all">
            <div className="h-20 w-20 rounded-[32px] bg-surface border border-white/5 flex items-center justify-center relative hover:border-primary/40 hover:shadow-neon transition-all duration-500">
                {count && (
                    <div className="absolute -top-1.5 -right-1.5 bg-status-deleted text-white text-[10px] font-black h-6 min-w-[24px] px-1.5 flex items-center justify-center rounded-xl border-2 border-black shadow-glow">
                        {count > 99 ? '99+' : count}
                    </div>
                )}
                <Icon className="h-8 w-8 text-text-muted group-hover:text-primary transition-colors" />
            </div>
            <span className="text-[10px] font-black text-primary tracking-[0.2em] uppercase opacity-70 group-hover:opacity-100 transition-opacity">{label}</span>
        </div>
    )
}
