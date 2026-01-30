import React from 'react';
// Trigger Vercel Deployment
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

                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-full h-full relative z-10 drop-shadow-[0_0_12px_rgba(0,212,255,0.3)] hover:drop-shadow-[0_0_18px_rgba(0,212,255,0.5)] transition-all duration-500", color)}>
                    {/* Refined M - Sharper and Segmented approach */}
                    <path
                        d="M10 80L35 20H55L42 50H58L70 20H90L65 80H45L55 50H40L25 80H10Z"
                        fill="currentColor"
                    />

                    {/* Electric Blue Accents in the center notch */}
                    <path
                        d="M48 45H52L48 55H44L48 45Z"
                        fill="#00d4ff"
                        className="animate-pulse"
                    />
                </svg>
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
