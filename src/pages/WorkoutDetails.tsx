import React, { useState } from 'react';
import { TopBar } from '../components/layout/TopBar';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { cn } from '../lib/utils';
import {
    FileDown, Eye, BarChart, ScanQrCode,
    ChevronDown, ChevronUp, MoreVertical,
    Play, Trash2, Plus, Copy, Menu
} from 'lucide-react';

export default function WorkoutDetails() {
    return (
        <div className="flex flex-col min-h-screen pb-24 relative">
            <TopBar
                showBack
                className="bg-surface border-b border-white/5"
            />

            <div className="flex-1 p-4 space-y-6">

                {/* Action Icons */}
                <div className="grid grid-cols-4 gap-2 text-center">
                    <ActionIcon icon={FileDown} label="Baixar treino" />
                    <ActionIcon icon={Eye} label="Visão do aluno" />
                    <ActionIcon icon={BarChart} label="Evolução de cargas" />
                    <ActionIcon icon={ScanQrCode} label="Prescrever com MFITIA" active />
                </div>

                {/* General Guidelines */}
                <Card className="bg-white p-4 flex justify-between items-center cursor-pointer">
                    <span className="font-bold text-black">Orientações gerais</span>
                    <ChevronDown className="text-gray-400 h-5 w-5" />
                </Card>

                {/* Add Exercise Button */}
                <Button className="w-full gap-2 text-lg font-bold shadow-lg shadow-primary/20">
                    <Plus className="h-5 w-5" />
                    Adicionar Exercício
                </Button>

                {/* Title */}
                <h2 className="text-2xl font-bold text-white">Treino 1</h2>

                {/* Muscle Group */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center bg-white p-3 rounded-lg">
                        <span className="font-bold text-black">Peito/ ombro e tríceps</span>
                        <span className="text-primary text-sm font-bold cursor-pointer">Recolher todos ^</span>
                    </div>

                    {/* Exercise List */}
                    <div className="space-y-4">
                        <ExerciseCard
                            name="Supino inclinado halter"
                        // videoUrl="..." 
                        />
                    </div>
                </div>

            </div>

            {/* FAB */}
            <button className="fixed bottom-24 right-4 h-16 w-16 bg-gradient-to-tr from-primary to-purple-500 rounded-full shadow-xl shadow-primary/30 flex items-center justify-center z-50 animate-bounce-subtle">
                <ScanQrCode className="h-8 w-8 text-white" />
            </button>
        </div>
    );
}

function ActionIcon({ icon: Icon, label, active }: { icon: any, label: string, active?: boolean }) {
    return (
        <div className="flex flex-col items-center gap-2 cursor-pointer hover:scale-105 transition-transform">
            <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center">
                <Icon className={cn("h-6 w-6", active ? "text-primary" : "text-primary")} />
            </div>
            <span className={cn("text-[10px] font-bold leading-tight", active ? "text-primary" : "text-gray-400")}>
                {label}
            </span>
        </div>
    )
}

function ExerciseCard({ name }: { name: string }) {
    const [expanded, setExpanded] = useState(true);

    return (
        <Card className="bg-white p-0 overflow-hidden">
            {/* Header */}
            <div className="p-4 flex items-center gap-3 border-b border-gray-100">
                <div className="h-5 w-5 rounded border-2 border-gray-300" /> {/* Checkbox placeholder */}
                <span className="flex-1 font-bold text-black text-lg">{name}</span>
                <MoreVertical className="text-gray-400 h-5 w-5" />
                <button onClick={() => setExpanded(!expanded)}>
                    {expanded ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
                </button>
            </div>

            {expanded && (
                <div className="p-4 space-y-4 bg-white">
                    <div className="flex gap-4">
                        <Menu className="text-gray-300 h-6 w-6 mt-2" /> {/* Drag Handle */}

                        <div className="flex-1 space-y-4">
                            {/* Video Placeholder */}
                            <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden group cursor-pointer">
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                                <Play className="text-white fill-white h-12 w-12 z-10" />
                                {/* Image would go here */}
                            </div>

                            {/* Inputs Grid */}
                            <div className="grid grid-cols-[1fr,1fr,1fr,auto] gap-3 items-end">
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-500 font-medium">Série/rep</label>
                                    <input className="w-full bg-gray-100 rounded-md p-2 text-center font-bold text-black" defaultValue="5/5" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-500 font-medium">Carga</label>
                                    <input className="w-full bg-gray-100 rounded-md p-2 text-center font-bold text-black" defaultValue="24" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-500 font-medium">Intervalo</label>
                                    <input className="w-full bg-gray-100 rounded-md p-2 text-center font-bold text-black" defaultValue="180" />
                                </div>
                                <button className="p-2 mb-1 text-status-deleted hover:bg-red-50 rounded-lg transition-colors">
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3">
                                <Button className="flex-1 h-10 text-sm font-bold bg-primary hover:bg-primary-dark border-none">
                                    Adicionar série
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1 h-10 text-sm font-bold border-primary text-primary hover:bg-primary/5 flex items-center justify-center gap-1"
                                >
                                    <Copy className="h-4 w-4" />
                                    Replicar séries
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    )
}
