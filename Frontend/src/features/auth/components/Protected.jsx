import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import React from 'react';
import { Loader2 } from 'lucide-react';

const Protected = ({ children }) => {
    const { loading, user } = useAuth();

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                background: '#080b12',
                color: '#94a3b8'
            }}>
                <Loader2 size={32} className="animate-spin" style={{ color: '#3b82f6' }} />
                <p style={{ fontSize: '0.95rem' }}>Verifying authentication...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default Protected;
