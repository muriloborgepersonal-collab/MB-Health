import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, DollarSign, MessageCircle, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export const BottomNav = () => {
    const navItems = [
        { icon: Home, label: 'Início', path: '/' },
        { icon: DollarSign, label: 'Assinatura', path: '/subscription' },
        { icon: MessageCircle, label: 'Ajuda', path: '/help' },
        { icon: User, label: 'Perfil', path: '/profile' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 h-24 bg-surface border-t border-primary/10 rounded-t-[40px] shadow-neon pb-6">
            <div className="flex h-full items-center justify-around px-4">
                {navItems.map(({ icon: Icon, label, path }) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) =>
                            cn(
                                'flex flex-col items-center justify-center gap-1.5 w-full h-full transition-all duration-500 group',
                                isActive ? 'text-primary scale-110' : 'text-text-muted hover:text-white'
                            )
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <div className={cn(
                                    "p-2.5 rounded-2xl transition-all duration-500",
                                    isActive ? "bg-primary/10 shadow-glow" : "group-hover:bg-white/5"
                                )}>
                                    <Icon size={24} strokeWidth={isActive ? 3 : 2} className={cn(isActive && "animate-pulse-neon")} />
                                </div>
                                <span className={cn(
                                    "text-[9px] font-black uppercase tracking-widest transition-all",
                                    isActive ? "opacity-100" : "opacity-50 group-hover:opacity-80"
                                )}>
                                    {label}
                                </span>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};
