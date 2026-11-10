import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import React from 'react';
import { Loader2 } from 'lucide-react';

const Protected = ({ children }) => {
    const { loading, user } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#070709] flex flex-col items-center justify-center gap-3 text-neutral-400">
                <Loader2 size={32} className="animate-spin text-orange-500" />
                <p className="text-xs font-mono text-neutral-400">Verifying session token...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default Protected;
