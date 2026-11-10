import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../features/auth/hooks/useAuth';
import { Home, User, Briefcase, FileText, LogOut, LogIn } from 'lucide-react';

const FloatingDock = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, handleLogout } = useAuth();

    const isHome = location.pathname === '/';
    const isInterview = location.pathname.startsWith('/interview');

    const scrollToReports = () => {
        if (!isHome) {
            navigate('/#reports');
        } else {
            const el = document.getElementById('recent-reports');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <aside className="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-50 hidden sm:flex flex-col items-center bg-[#141416]/90 backdrop-blur-xl border border-white/10 rounded-full py-3 px-2 gap-3 shadow-2xl">
            {/* Home button */}
            <button
                onClick={() => navigate('/')}
                title="Dashboard"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                    isHome && !location.hash
                        ? 'bg-white text-black shadow-lg scale-105'
                        : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
            >
                <Home size={18} />
            </button>

            {/* Saved Reports button */}
            <button
                onClick={scrollToReports}
                title="Saved Reports"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                    isHome && location.hash === '#reports'
                        ? 'bg-white text-black shadow-lg scale-105'
                        : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
            >
                <Briefcase size={18} />
            </button>

            {/* Current Active Report / Resumes */}
            {isInterview && (
                <button
                    onClick={() => {}}
                    title="Active Report"
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-white text-black shadow-lg scale-105 transition-all duration-200"
                >
                    <FileText size={18} />
                </button>
            )}

            <div className="w-5 h-[1px] bg-white/10 my-0.5"></div>

            {/* User Profile / Logout */}
            {user ? (
                <button
                    onClick={async () => {
                        await handleLogout();
                        navigate('/login');
                    }}
                    title={`Logged in as ${user.username} (Click to Logout)`}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                >
                    <LogOut size={18} />
                </button>
            ) : (
                <button
                    onClick={() => navigate('/login')}
                    title="Login"
                    className="w-10 h-10 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/5 transition-all duration-200"
                >
                    <LogIn size={18} />
                </button>
            )}
        </aside>
    );
};

export default FloatingDock;
