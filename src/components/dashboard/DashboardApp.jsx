import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { initFirebase } from '../../lib/firebase';
import Login from './Login';
import CMSManager from './CMSManager';
import { ErrorBoundary } from './ErrorBoundary';

export default function DashboardApp() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribe;

        const setupAuth = async () => {
            const { auth } = await initFirebase();
            if (!auth) {
                setLoading(false);
                return;
            }

            unsubscribe = onAuthStateChanged(auth, (currentUser) => {
                setUser(currentUser);
                setLoading(false);
            });
        };

        setupAuth();

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-primary flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-white/10 border-t-brand-light rounded-full animate-spin"></div>
                <span className="text-text-muted text-sm tracking-widest uppercase animate-pulse">Loading environment...</span>
            </div>
        );
    }

    // Pass the user context down if authenticated
    return (
        <ErrorBoundary>
            {user ? <CMSManager user={user} /> : <Login />}
        </ErrorBoundary>
    );
}
