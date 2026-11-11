import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../features/auth/hooks/useAuth';
import { Sparkles, LogOut, ArrowUpRight, AlertCircle, X } from 'lucide-react';

const TopHeader = () => {
    const { user, handleLogout } = useAuth();
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

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
            <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-4 flex items-center justify-between text-neutral-300">
                {/* Left: Brand Logo */}
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-950 border border-white/10 flex items-center justify-center text-white shadow-md group-hover:border-white/30 transition-all">
                        <Sparkles size={18} className="text-orange-500" />
                    </div>
                    <span className="text-white font-semibold text-base sm:text-lg tracking-tight">
                        Resume<span className="text-orange-500">Forge</span>
                    </span>
                </Link>

                {/* Right: User Profile & Actions (Clutter removed: no Live Engine or Cloud Clock) */}
                <div className="flex items-center gap-3">
                    {user ? (
                        <div className="flex items-center gap-2.5">
                            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-white text-sm">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-black font-bold text-xs flex items-center justify-center">
                                    {user.username?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <span className="font-medium max-w-[140px] truncate">{user.username}</span>
                            </div>

                            <button
                                onClick={() => setShowLogoutModal(true)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 hover:border-red-500/30 hover:bg-red-500/10 text-neutral-300 hover:text-red-400 text-xs font-medium transition"
                                title="Log Out"
                            >
                                <LogOut size={14} />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link
                                to="/login"
                                className="px-4 py-2 rounded-full text-sm font-medium text-neutral-300 hover:text-white transition"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-black text-sm font-semibold hover:bg-neutral-200 transition shadow-sm"
                            >
                                <span>Get Started</span>
                                <ArrowUpRight size={14} />
                            </Link>
                        </div>
                    )}
                </div>
            </header>

            {/* ── Logout Confirmation Modal ── */}
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
                                Are you sure you want to end your current session? You will need to sign in again to view your resumes.
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

export default TopHeader;
