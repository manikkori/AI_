import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import Layout from '../../../components/Layout';
import { Sparkles, User, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowUpRight, Loader2 } from 'lucide-react';

const Register = () => {
    const { loading, handleRegister, authError, setAuthError } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username.trim() || !email.trim() || !password.trim()) {
            setAuthError('Please fill in all fields.');
            return;
        }

        if (password.length < 6) {
            setAuthError('Password must be at least 6 characters long.');
            return;
        }

        setIsSubmitting(true);
        try {
            await handleRegister({ username, email, password });
            navigate('/');
        } catch (err) {
            // Handled in hook
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout>
            <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md bg-[#121214] border border-white/5 rounded-3xl p-8 sm:p-9 shadow-2xl flex flex-col gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none"></div>

                    <div className="flex flex-col gap-2 text-center items-center">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-950 border border-white/10 flex items-center justify-center text-orange-500 shadow-lg">
                            <Sparkles size={22} />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-white mt-1">
                            Create Account
                        </h1>
                        <p className="text-sm text-neutral-400 font-light max-w-xs leading-relaxed">
                            Start generating tailored ATS resumes and targeted technical preparation roadmaps.
                        </p>
                    </div>

                    {authError && (
                        <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                            <AlertCircle size={16} className="shrink-0" />
                            <span>{authError}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-mono text-neutral-300" htmlFor="username">
                                Username or Full Name
                            </label>
                            <div className="relative">
                                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="alex_dev"
                                    className="w-full pl-10 pr-4 py-3 bg-[#09090b] border border-white/5 rounded-xl text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-white/20 transition-colors"
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-mono text-neutral-300" htmlFor="email">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="alex@example.com"
                                    className="w-full pl-10 pr-4 py-3 bg-[#09090b] border border-white/5 rounded-xl text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-white/20 transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-mono text-neutral-300" htmlFor="password">
                                Password
                            </label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Min. 6 characters"
                                    className="w-full pl-10 pr-10 py-3 bg-[#09090b] border border-white/5 rounded-xl text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-white/20 transition-colors"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || loading}
                            className="mt-2 w-full flex items-center justify-between p-2 pl-6 rounded-full bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition shadow-xl group disabled:opacity-60"
                        >
                            <span>{isSubmitting ? "Creating Account..." : "Create Free Account"}</span>
                            <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                                {isSubmitting ? (
                                    <Loader2 size={16} className="animate-spin text-orange-400" />
                                ) : (
                                    <ArrowUpRight size={17} />
                                )}
                            </div>
                        </button>
                    </form>

                    <div className="text-center text-sm text-neutral-400 font-light">
                        Already have an account?{' '}
                        <Link to="/login" className="text-white font-medium hover:underline">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Register;
