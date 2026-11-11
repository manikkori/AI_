import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../features/auth/hooks/useAuth';
import { Home, Briefcase, FileText, LogOut, LogIn, AlertCircle, X } from 'lucide-react';

const FloatingDock = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, handleLogout } = useAuth();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const isHome = location.pathname === '/';
    const isInterview = location.pathname.startsWith('/interview');

    const scrollToReports = () => {
        if (!isHome) {
            navigate('/#recent-reports');
        } else {
            const el = document.getElementById('recent-reports');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const confirmLogout = async () => {
        setIsLoggingOut(true);
        try {
            await handleLogout();
            setShowLogoutModal(false);
            navigate('/login');
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <>
            <aside className="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col items-center bg-[#141416]/90 backdrop-blur-xl border border-white/10 rounded-full py-3 px-2 gap-3 shadow-2xl">
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
                        isHome && location.hash === '#recent-reports'
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
                        onClick={() => setShowLogoutModal(true)}
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

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-sm bg-[#141416] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 relative overflow-hidden">
                        <div className="flex items-center justify-between">
                            <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
                                <AlertCircle size={20} />
                            </div>
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-white tracking-tight">Confirm Logout</h3>
                            <p className="text-sm text-neutral-400 mt-1 font-light leading-relaxed">
                                Are you sure you want to end your current session?
                            </p>
                        </div>

                        <div className="flex items-center gap-2.5 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowLogoutModal(false)}
                                disabled={isLoggingOut}
                                className="flex-1 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-neutral-200 text-sm font-medium transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmLogout}
                                disabled={isLoggingOut}
                                className="flex-1 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition shadow-lg disabled:opacity-60"
                            >
                                {isLoggingOut ? "Logging out..." : "Yes, Log Out"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default FloatingDock;
