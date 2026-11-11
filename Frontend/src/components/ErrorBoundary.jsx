import React from 'react';
import { useRouteError, useNavigate } from 'react-router';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';
import Layout from './Layout';

const RouteErrorBoundary = () => {
    const error = useRouteError();
    const navigate = useNavigate();

    console.error("Application Route Error:", error);

    return (
        <Layout>
            <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12 text-center">
                <div className="w-16 h-16 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mb-6 shadow-2xl">
                    <AlertCircle size={32} />
                </div>

                <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mb-2">
                    Something went wrong
                </h1>

                <p className="text-sm sm:text-base text-neutral-400 max-w-md mb-8 leading-relaxed font-light">
                    {error?.statusText || error?.message || "An unexpected error occurred while rendering this page."}
                </p>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-sm font-medium text-white transition"
                    >
                        <RotateCcw size={16} />
                        <span>Reload Page</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-neutral-200 transition shadow-lg"
                    >
                        <Home size={16} />
                        <span>Return to Dashboard</span>
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default RouteErrorBoundary;
