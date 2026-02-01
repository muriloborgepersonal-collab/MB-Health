import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'active' | 'inactive' | 'deleted' | 'outline';
}

export const Badge = ({ className, variant = 'default', ...props }: BadgeProps) => {
    return (
        <div
            className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                {
                    'bg-primary/20 text-primary': variant === 'default',
                    'bg-status-active/20 text-status-active': variant === 'active',
                    'bg-status-inactive/20 text-status-inactive': variant === 'inactive',
                    'bg-status-deleted/20 text-status-deleted': variant === 'deleted',
                    'border border-text-muted text-text-muted': variant === 'outline',
                },
                className
            )}
            {...props}
        />
    );
};
