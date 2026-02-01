import React from 'react';
import { cn } from '../../lib/utils';

interface LogoProps {
    className?: string;
    iconOnly?: boolean;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    color?: string;
}

export const Logo: React.FC<LogoProps> = ({ className, iconOnly = false, size = 'md', color = 'text-white' }) => {
    const iconSizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-10 h-10',
        lg: 'w-16 h-16',
        xl: 'w-24 h-24'
    };

    const textSizeClasses = {
        sm: 'text-lg',
        md: 'text-2xl',
        lg: 'text-4xl',
        xl: 'text-6xl'
    };

    return (
        <div className={cn("flex items-center gap-3 select-none", className)}>
            <div className={cn("relative flex-shrink-0 group", iconSizeClasses[size])}>
                {/* Background Shadow Glow */}
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                <img
                    src="/logo.png"
                    alt="MB Health Logo"
                    className={cn("w-full h-full relative z-10 drop-shadow-[0_0_12px_rgba(0,212,255,0.3)] hover:drop-shadow-[0_0_18px_rgba(0,212,255,0.5)] transition-all duration-500 object-contain")}
                />
            </div>

            {!iconOnly && (
                <div className="flex flex-col leading-none -space-y-1">
                    <span className={cn("font-['Kanit'] font-black uppercase italic tracking-tighter text-white", textSizeClasses[size])}>
                        MB <span className="text-primary">HEALTH</span>
                    </span>
                    <div className="flex items-center gap-2">
                        <div className="h-[2px] w-4 bg-primary/40 rounded-full"></div>
                        <span className="text-[7px] font-black uppercase tracking-[0.3em] text-primary/60">Power & Performance</span>
                    </div>
                </div>
            )}
        </div>
    );
};
