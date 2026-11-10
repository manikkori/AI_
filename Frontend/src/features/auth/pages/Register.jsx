import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { Sparkles, User, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import '../auth.form.scss';

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
            // Error is handled in hook
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="auth-page">
            <div className="form-container">
                <div className="auth-header">
                    <div className="auth-icon-badge">
                        <Sparkles size={22} />
                    </div>
                    <h1>Create Account</h1>
                    <p>Start generating tailored ATS resumes & interview game plans</p>
                </div>

                {authError && (
                    <div className="auth-error-alert">
                        <AlertCircle size={18} />
                        <span>{authError}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Full Name or Username</label>
                        <div className="input-wrapper">
                            <User size={16} className="field-icon" />
                            <input
                                id="username"
                                type="text"
                                name="username"
                                placeholder="alex_dev"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoFocus
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="email">Email Address</label>
                        <div className="input-wrapper">
                            <Mail size={16} className="field-icon" />
                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="alex@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-wrapper">
                            <Lock size={16} className="field-icon" />
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Min. 6 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                                title={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || loading}
                        className="button primary-button submit-button"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                <span>Creating Account...</span>
                            </>
                        ) : (
                            <>
                                <span>Create Free Account</span>
                                <ArrowRight size={16} />
                            </>
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <span>Already have an account?</span>
                    <Link to="/login">Sign In</Link>
                </div>
            </div>
        </main>
    );
};

export default Register;
