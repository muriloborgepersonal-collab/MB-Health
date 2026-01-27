import React from 'react';
import { ScanQrCode, Book, ClipboardList, PlaySquare } from 'lucide-react';
import { Card } from '../components/ui/Card';

export default function Library() {
    return (
        <div className="flex flex-col min-h-screen pb-24 relative p-4 space-y-4">
            <h1 className="text-2xl font-bold text-black bg-white -mx-4 px-4 pt-12 pb-4">Treinos</h1>

            <Card className="bg-white border-2 border-primary p-6 flex flex-col items-center justify-center gap-4 py-8 cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <Book className="h-10 w-10 text-primary" />
                </div>
                <span className="text-primary font-bold text-xl">Biblioteca de treinos</span>
            </Card>

            <div className="flex gap-4">
                <Card className="flex-1 bg-white border-2 border-primary p-4 flex flex-col items-center justify-center gap-3 py-6 cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <ClipboardList className="h-8 w-8 text-primary" />
                    </div>
                    <span className="text-primary font-bold text-center leading-tight">Relatório de frequência</span>
                </Card>

                <Card className="flex-1 bg-white border-2 border-primary p-4 flex flex-col items-center justify-center gap-3 py-6 cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <PlaySquare className="h-8 w-8 text-primary" />
                    </div>
                    <span className="text-primary font-bold text-center leading-tight">Biblioteca de exercícios</span>
                </Card>
            </div>

            {/* FAB */}
            <button className="fixed bottom-24 right-4 h-16 w-16 bg-gradient-to-tr from-primary to-purple-500 rounded-full shadow-xl shadow-primary/30 flex items-center justify-center z-50 animate-bounce-subtle">
                <ScanQrCode className="h-8 w-8 text-white" />
            </button>
        </div>
    );
}
