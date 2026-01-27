import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { BottomNav } from './BottomNav';

export const MainLayout = () => {
    // Hide bottom nav on specific details changes if needed, but for now we keep it simple
    // or maybe we want bottom nav everywhere.
    // Based on "Screen 2" having "Back" button, it might still have bottom nav?
    // Usually deep nested screens might hide it, but the prompt says "Fixed bottom navigation".
    // I will assume it's always visible for now.
    return (
        <div className="flex min-h-screen flex-col bg-background pb-24 text-text-primary">
            <div className="flex-1">
                <Outlet />
            </div>
            <BottomNav />
        </div>
    );
};
