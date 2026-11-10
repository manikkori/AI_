import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../features/auth/hooks/useAuth';
import { Sparkles, LayoutGrid, LogOut, User, ArrowUpRight } from 'lucide-react';

const TopHeader = () => {
    const { user, handleLogout } = useAuth();
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000 * 30);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-4 flex items-center justify-between text-neutral-400 text-xs">
            {/* Left: Brand Logo & Live Engine Status */}
            <div className="flex items-center gap-3">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-950 border border-white/10 flex items-center justify-center text-white shadow-md group-hover:border-white/30 transition-all">
                        <Sparkles size={16} className="text-orange-500" />
                    </div>
                    <span className="text-white font-semibold text-sm tracking-tight">
                        Resume<span className="text-orange-500">Forge</span>
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/5 text-[11px] text-neutral-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Groq Llama 3.3 • Live Engine</span>
                </div>
            </div>

            {/* Center / Right: Time, Location & User Area */}
            <div className="flex items-center gap-4">
                <span className="hidden sm:inline-block font-mono text-neutral-400">
                    Global AI Cloud {currentTime && `• ${currentTime}`}
                </span>

                {user ? (
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-white text-xs">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-black font-bold text-[10px] flex items-center justify-center">
                                {user.username?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <span className="font-medium max-w-[120px] truncate">{user.username}</span>
                        </div>
                        <button
                            onClick={async () => {
                                await handleLogout();
                                navigate('/login');
                            }}
                            className="p-2 rounded-full bg-white/[0.04] border border-white/10 hover:border-red-500/30 hover:text-red-400 text-neutral-400 transition"
                            title="Log Out"
                        >
                            <LogOut size={14} />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Link
                            to="/login"
                            className="px-4 py-1.5 rounded-full text-xs font-medium text-neutral-300 hover:text-white transition"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/register"
                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition shadow-sm"
                        >
                            <span>Get Started</span>
                            <ArrowUpRight size={13} />
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
};

export default TopHeader;
