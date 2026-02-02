import React from 'react';

interface DeleteWorkoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    workoutName: string;
}

export const DeleteWorkoutModal: React.FC<DeleteWorkoutModalProps> = ({ isOpen, onClose, onConfirm, workoutName }) => {
    if (!isOpen) return null;

    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleConfirm = async () => {
        setIsSubmitting(true);
        try {
            await onConfirm();
            onClose();
        } catch (error) {
            console.error('Error deleting workout:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-[400px] rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
                        <span className="material-symbols-outlined text-red-500 text-3xl">delete_forever</span>
                    </div>

                    <h2 className="text-slate-900 text-xl font-black mb-4 text-center tracking-tight leading-tight">
                        Tem certeza que deseja excluir a rotina <span className="text-red-500">"{workoutName}"</span>?
                    </h2>

                    <p className="text-slate-500 text-sm font-bold text-center mb-8">
                        Esta rotina será movida para os treinos excluídos.
                    </p>

                    <div className="w-full space-y-3">
                        <button
                            onClick={handleConfirm}
                            disabled={isSubmitting}
                            className="w-full h-14 bg-red-500 hover:bg-red-600 disabled:bg-slate-300 text-white rounded-2xl flex items-center justify-center font-black uppercase tracking-widest text-[11px] transition-all"
                        >
                            {isSubmitting ? 'Excluindo...' : 'Excluir'}
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full h-14 bg-white border-2 border-slate-200 text-slate-500 rounded-2xl flex items-center justify-center font-black uppercase tracking-widest text-[11px] hover:bg-slate-50 transition-all font-bold"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteWorkoutModal;
