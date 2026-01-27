import React, { useState } from 'react';
import { TopBar } from '../components/layout/TopBar';
import { cn } from '../lib/utils';
import { Dumbbell, ClipboardCheck, DollarSign, FileText, FilePlus, Archive, ChevronRight, Check, X, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function StudentOptions() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'inicio' | 'opcoes'>('opcoes');

    return (
        <div className="flex flex-col min-h-screen pb-24">
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

            {/* Tabs */}
            <div className="bg-white p-4 pb-0">
                <div className="flex p-1 bg-gray-100 rounded-xl">
                    <button
                        onClick={() => navigate('/student')} // Should go back to student profile theoretically
                        className="flex-1 py-3 text-sm font-bold text-gray-500 rounded-lg transition-all hover:bg-white hover:shadow-sm"
                    >
                        Início
                    </button>
                    <button
                        onClick={() => setActiveTab('opcoes')}
                        className="flex-1 py-3 text-sm font-bold bg-primary text-white rounded-lg shadow"
                    >
                        Opções
                    </button>
                </div>
            </div>

            <div className="flex-1 p-4 space-y-6 bg-gray-50">
                {/* Frequency */}
                <div className="space-y-3">
                    <h3 className="font-bold text-black text-lg">Frequência de Treinos</h3>
                    <div className="flex justify-between">
                        <DayCircle day="S" status="checked" />
                        <DayCircle day="T" status="checked" />
                        <DayCircle day="Q" status="missed" />
                        <DayCircle day="Q" status="checked" />
                        <DayCircle day="S" status="missed" />
                        <DayCircle day="S" status="missed" />
                        <DayCircle day="D" status="alert" />
                    </div>
                </div>

                {/* Options List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden text-black">
                    <OptionItem icon={Dumbbell} label="Treinos" onClick={() => { }} />
                    <OptionItem icon={ClipboardCheck} label="Avaliações" onClick={() => { }} />
                    <OptionItem icon={DollarSign} label="Posição financeira" onClick={() => { }} />
                    <OptionItem icon={FileText} label="Progresso do aluno" onClick={() => { }} />
                    <OptionItem icon={FilePlus} label="Treinos extras" onClick={() => { }} />
                    <OptionItem icon={Archive} label="Arquivos" onClick={() => { }} border={false} />
                </div>
            </div>
        </div>
    );
}

function DayCircle({ day, status }: { day: string, status: 'checked' | 'missed' | 'alert' }) {
    return (
        <div className="flex flex-col items-center gap-1">
            <div className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center border-2",
                status === 'checked' && "bg-primary border-primary",
                status === 'missed' && "bg-white border-gray-300",
                status === 'alert' && "bg-white border-primary"
            )}>
                {status === 'checked' && <Check className="h-5 w-5 text-white" />}
                {status === 'missed' && <X className="h-5 w-5 text-gray-300" />}
                {status === 'alert' && <span className="text-primary font-bold text-lg">!</span>}
            </div>
            <span className="text-xs font-bold text-black">{day}</span>
        </div>
    )
}

function OptionItem({ icon: Icon, label, onClick, border = true }: { icon: any, label: string, onClick: () => void, border?: boolean }) {
    return (
        <div
            className={cn(
                "flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors",
                border && "border-b border-gray-100"
            )}
            onClick={onClick}
        >
            <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                </div>
                <span className="font-bold text-lg">{label}</span>
            </div>
            <ChevronRight className="text-gray-400 h-5 w-5" />
        </div>
    )
}
