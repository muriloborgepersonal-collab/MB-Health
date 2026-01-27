import React from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, icon, ...props }, ref) => {
        return (
            <div className="w-full space-y-1">
                {label && (
                    <label className="text-sm font-medium text-text-muted">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={cn(
                            'flex h-12 w-full rounded-lg border border-transparent bg-white/5 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted/50 focus:border-primary focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all',
                            icon && 'pl-10',
                            error && 'border-status-deleted focus:border-status-deleted focus:ring-status-deleted',
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && <p className="text-xs text-status-deleted">{error}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';
