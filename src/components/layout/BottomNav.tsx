import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, DollarSign, MessageCircle, User } from 'lucide-react';
import { cn } from '../../lib/utils';

export const BottomNav = () => {
    const navItems = [
        { icon: Home, label: 'Início', path: '/' },
        { icon: DollarSign, label: 'Assinatura', path: '/subscription' },
        { icon: MessageCircle, label: 'Ajuda', path: '/help' },
        { icon: User, label: 'Perfil', path: '/profile' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 h-20 bg-surface border-t border-white/5 pb-safe">
            <div className="flex h-full items-center justify-around px-2">
                {navItems.map(({ icon: Icon, label, path }) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) =>
                            cn(
                                'flex flex-col items-center justify-center space-y-1 w-full h-full transition-colors',
                                isActive ? 'text-primary' : 'text-text-primary hover:text-text-secondary'
                            )
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <div className={cn("p-1.5 rounded-xl transition-all", isActive && "bg-primary/10")}>
                                    <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                </div>
                                <span className="text-xs font-medium">{label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};
