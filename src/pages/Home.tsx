import React, { useState } from 'react';
import { Dumbbell, MessageCircle, Calendar, Send, Users, UserPlus, Link as LinkIcon, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { cn } from '../lib/utils'; // Assuming cn utility exists

export default function Home() {
    const [activeTab, setActiveTab] = useState<'inicio' | 'financas'>('inicio');

    return (
        <div className="flex flex-col min-h-screen pb-20">
            {/* Header */}
            <header className="bg-gradient-to-b from-surface to-background px-6 pt-12 pb-6 rounded-b-3xl shadow-lg border-b border-white/5">
                <div className="flex flex-col items-center space-y-6">
                    <div className="flex items-center gap-2">
                        <Dumbbell className="text-primary h-8 w-8" />
                        <h1 className="text-2xl font-bold tracking-tight text-white">MFITPERSONAL</h1>
                    </div>

                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-surface border-2 border-primary flex items-center justify-center overflow-hidden">
                                <UserPlus className="h-6 w-6 text-text-muted" /> {/* Placeholder for profile image */}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-text-muted text-sm">Boa tarde,</span>
                                <span className="text-white font-bold text-lg">Adriano Albino</span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="grid grid-cols-2 w-full gap-4 bg-surface/50 p-1.5 rounded-xl">
                        <button
                            onClick={() => setActiveTab('inicio')}
                            className={cn(
                                "py-2.5 px-4 rounded-lg text-sm font-bold transition-all",
                                activeTab === 'inicio'
                                    ? "bg-white text-black shadow-sm"
                                    : "text-text-muted hover:text-white"
                            )}
                        >
                            Início
                        </button>
                        <button
                            onClick={() => setActiveTab('financas')}
                            className={cn(
                                "py-2.5 px-4 rounded-lg text-sm font-bold transition-all",
                                activeTab === 'financas'
                                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                                    : "text-text-muted hover:text-white"
                            )}
                        >
                            Finanças
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 px-4 py-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Notifications Grid */}
                <section className="grid grid-cols-3 gap-3">
                    <NotificationCard icon={MessageCircle} count={99} label="Feedbacks" />
                    <NotificationCard icon={Calendar} count={7} label="Atualizações" />
                    <NotificationCard icon={Send} label="Notificações" />
                </section>

                {/* Students Section */}
                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-white">Seus alunos</h2>

                    <div className="grid grid-cols-2 gap-4">
                        <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20 flex flex-col items-center justify-center p-4 gap-3 cursor-pointer hover:bg-primary/20 transition-colors">
                            <UserPlus className="h-8 w-8 text-primary" />
                            <span className="text-sm font-bold text-white">Adicionar alunos</span>
                        </Card>

                        <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20 flex flex-col items-center justify-center p-4 gap-3 cursor-pointer hover:bg-primary/20 transition-colors relative">
                            <div className="absolute top-2 right-2 bg-status-deleted text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">1</div>
                            <LinkIcon className="h-8 w-8 text-primary" />
                            <span className="text-sm font-bold text-white">Link de cadastro</span>
                        </Card>
                    </div>

                    <Card className="bg-gradient-to-r from-surface to-surface/80 border-white/5 p-0 overflow-hidden cursor-pointer hover:border-primary/30 transition-all">
                        <div className="p-5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Users className="text-primary h-6 w-6" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-lg font-bold text-white">Alunos</span>
                                    <div className="flex items-center gap-2 text-xs font-medium">
                                        <span className="text-status-active bg-status-active/10 px-2 py-0.5 rounded text-nowrap">Ativos: 71</span>
                                        <span className="text-status-inactive bg-status-inactive/10 px-2 py-0.5 rounded text-nowrap">Inativos: 77</span>
                                    </div>
                                </div>
                            </div>
                            <ChevronRight className="text-text-muted h-5 w-5" />
                        </div>
                    </Card>
                </section>

            </main>
        </div>
    );
}

function NotificationCard({ icon: Icon, count, label }: { icon: any, count?: number, label: string }) {
    return (
        <div className="flex flex-col items-center gap-2">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center relative cursor-pointer hover:bg-primary/20 transition-colors">
                {count && (
                    <div className="absolute -top-1 -right-1 bg-status-deleted text-white text-[10px] font-bold h-5 min-w-[20px] px-1 flex items-center justify-center rounded-full border-2 border-background">
                        {count > 99 ? '99+' : count}
                    </div>
                )}
                <Icon className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xs font-medium text-text-secondary">{label}</span>
        </div>
    )
}
