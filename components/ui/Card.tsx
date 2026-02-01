import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    gradient?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, gradient, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'rounded-xl bg-surface p-4 shadow-md transition-all',
                    gradient && 'bg-gradient-to-br from-surface to-background border border-white/5',
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';
