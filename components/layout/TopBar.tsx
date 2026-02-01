import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TopBarProps {
    title?: React.ReactNode;
    showBack?: boolean;
    rightAction?: React.ReactNode;
    className?: string;
}

export const TopBar = ({ title, showBack, rightAction, className }: TopBarProps) => {
    const navigate = useNavigate();

    return (
        <header className={`sticky top-0 z-40 flex h-16 items-center justify-between bg-gradient-to-b from-background to-background/95 px-4 backdrop-blur-md ${className}`}>
            <div className="flex items-center gap-3">
                {showBack && (
                    <button
                        onClick={() => navigate(-1)}
                        className="rounded-full p-2 -ml-2 text-white hover:bg-white/10 active:scale-95 transition-all"
                    >
                        <ChevronLeft size={24} />
                    </button>
                )}
                {title && <div className="font-bold text-lg text-white">{title}</div>}
            </div>
            {rightAction && <div>{rightAction}</div>}
        </header>
    );
};
