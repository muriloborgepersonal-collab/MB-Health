import React from 'react';
import { cn } from '../../lib/utils';

interface LogoProps {
    className?: string;
    iconOnly?: boolean;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
    className,
    iconOnly = false,
    size = 'md',
    showTagline = false
}) => {
    const iconContainerClasses = {
        sm: 'w-8 h-8 rounded-lg',
        md: 'w-12 h-12 rounded-xl',
        lg: 'w-20 h-20 rounded-2xl',
        xl: 'w-28 h-28 rounded-3xl'
    };

    const iconSizeClasses = {
        sm: 'w-5 h-5',
        md: 'w-8 h-8',
        lg: 'w-14 h-14',
        xl: 'w-20 h-20'
    };

    const bTextClasses = {
        sm: 'text-xl',
        md: 'text-3xl',
        lg: 'text-5xl',
        xl: 'text-6xl'
    };

    const healthTextClasses = {
        sm: 'text-xl',
        md: 'text-3xl',
        lg: 'text-5xl',
        xl: 'text-6xl'
    };

    const powerTextClasses = {
        sm: 'text-[6px] tracking-[0.15em]',
        md: 'text-[8px] tracking-[0.2em]',
        lg: 'text-[10px] tracking-[0.25em]',
        xl: 'text-xs tracking-[0.3em]'
    };

    const lineWidthClasses = {
        sm: 'w-4',
        md: 'w-6',
        lg: 'w-10',
        xl: 'w-14'
    };

    return (
        <div className={cn("flex flex-col select-none", className)}>
            {/* Main Logo Row */}
            <div className="flex items-center gap-3">
                {/* Icon with dark rounded background */}
                <div className={cn(
                    "relative flex-shrink-0 flex items-center justify-center bg-[#1a1a1a] group",
                    iconContainerClasses[size]
                )}>
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                    {/* SVG Logo Icon - M with Lightning Bolt */}
                    <svg
                        viewBox="0 0 100 100"
                        className={cn(
                            "relative z-10 drop-shadow-[0_0_8px_rgba(0,212,255,0.3)] group-hover:drop-shadow-[0_0_12px_rgba(0,212,255,0.5)] transition-all duration-500",
                            iconSizeClasses[size]
                        )}
                        aria-label="MB Health Logo"
                    >
                        {/* M Shape - Left pillar */}
                        <path
                            d="M5,5 L25,5 L25,95 L5,95 Z"
                            fill="white"
                        />
                        {/* M Shape - Right pillar */}
                        <path
                            d="M75,5 L95,5 L95,95 L75,95 Z"
                            fill="white"
                        />
                        {/* M Shape - Left diagonal */}
                        <path
                            d="M25,5 L50,45 L50,55 L25,20 Z"
                            fill="white"
                        />
                        {/* M Shape - Right diagonal */}
                        <path
                            d="M75,5 L50,45 L50,55 L75,20 Z"
                            fill="white"
                        />
                        {/* Lightning Bolt cutting through center */}
                        <path
                            d="M55,0 L35,42 L48,42 L40,100 L65,50 L52,50 L70,0 Z"
                            fill="#0a0a0a"
                        />
                    </svg>
                </div>

                {!iconOnly && (
                    <div className="flex flex-col leading-none">
                        {/* B */}
                        <span className={cn(
                            "font-['Kanit'] font-black italic tracking-tight text-white -mb-1",
                            bTextClasses[size]
                        )}>
                            B
                        </span>

                        {/* HEALTH */}
                        <span className={cn(
                            "font-['Kanit'] font-black italic tracking-tight text-primary",
                            healthTextClasses[size]
                        )}>
                            HEALTH
                        </span>

                        {/* Cyan line under HEALTH */}
                        <div className={cn("h-[2px] bg-primary mt-1", lineWidthClasses[size])}></div>

                        {/* POWER & PERFORMANCE */}
                        <div className="flex items-center gap-2 mt-2">
                            <div className={cn("h-[1px] bg-primary", lineWidthClasses[size])}></div>
                            <span className={cn(
                                "font-bold uppercase text-white whitespace-nowrap",
                                powerTextClasses[size]
                            )}>
                                Power & Performance
                            </span>
                            <div className={cn("h-[1px] bg-primary", lineWidthClasses[size])}></div>
                        </div>
                    </div>
                )}
            </div>

            {/* PERFORMANCE INTELLIGENCE - Only on XL with showTagline */}
            {showTagline && size === 'xl' && (
                <div className="flex items-center gap-3 mt-6">
                    <div className="h-[1px] flex-1 bg-primary"></div>
                    <span className="text-sm font-bold uppercase tracking-[0.4em] text-primary whitespace-nowrap">
                        Performance Intelligence
                    </span>
                    <div className="h-[1px] flex-1 bg-primary"></div>
                </div>
            )}
        </div>
    );
};
