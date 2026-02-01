import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'premium' | 'glass';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 active:scale-95',
                    {
                        'bg-primary text-background hover:bg-primary-dark shadow-lg shadow-primary/20': variant === 'primary',
                        'bg-surface border border-primary text-primary hover:bg-primary/10': variant === 'secondary',
                        'border-2 border-primary text-primary hover:bg-primary/10': variant === 'outline',
                        'hover:bg-white/5 text-text-primary': variant === 'ghost',
                        'bg-status-deleted text-white hover:bg-red-600': variant === 'danger',
                        'bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 text-white hover:shadow-neon shadow-xl': variant === 'premium',
                        'bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-primary/30': variant === 'glass',
                        'h-9 px-4 text-sm': size === 'sm',
                        'h-12 px-6 text-base': size === 'md',
                        'h-14 px-8 text-lg': size === 'lg',
                        'h-10 w-10 p-0 rounded-full': size === 'icon',
                    },
                    className
                )}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
