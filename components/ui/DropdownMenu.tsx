import React, { useState, useRef, useEffect } from 'react';

export interface DropdownMenuItem {
    label: string;
    icon: string;
    onClick: () => void;
    variant?: 'default' | 'danger';
}

interface DropdownMenuProps {
    items: DropdownMenuItem[];
    trigger?: React.ReactNode;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ items, trigger }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const handleItemClick = (e: React.MouseEvent, onClick: () => void) => {
        e.stopPropagation();
        onClick();
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={handleToggle}
                className="p-2 rounded-xl hover:bg-white/10 transition-all text-slate-500 hover:text-primary"
            >
                {trigger || (
                    <span className="material-symbols-outlined">more_vert</span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-[-8px] z-50 min-w-[200px] bg-black border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="py-2">
                        {items.map((item, index) => (
                            <button
                                key={index}
                                onClick={(e) => handleItemClick(e, item.onClick)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${item.variant === 'danger'
                                    ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300'
                                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <span className={`material-symbols-outlined text-xl ${item.variant === 'danger' ? 'text-red-400' : 'text-slate-500'
                                    }`}>
                                    {item.icon}
                                </span>
                                <span className="text-sm font-semibold">{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DropdownMenu;
