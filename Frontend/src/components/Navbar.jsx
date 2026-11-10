import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../features/auth/hooks/useAuth';
import { Sparkles, FileText, LogOut, User, LayoutDashboard, PlusCircle } from 'lucide-react';
import './navbar.scss';

const Navbar = () => {
    const { user, handleLogout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const onLogout = async () => {
        await handleLogout();
        navigate('/login');
    };

    return (
        <header className="site-navbar">
            <div className="navbar-container">
                {/* Brand Logo */}
                <Link to="/" className="navbar-brand">
                    <div className="brand-icon">
                        <Sparkles size={20} className="icon-sparkle" />
                    </div>
                    <div className="brand-text">
                        <span className="brand-title">Resume<span className="brand-accent">Forge</span></span>
                        <span className="brand-badge">AI</span>
                    </div>
                </Link>

                {/* Navigation Links */}
                <nav className="navbar-links">
                    <Link
                        to="/"
                        className={`nav-link ${location.pathname === '/' ? 'nav-link--active' : ''}`}
                    >
                        <LayoutDashboard size={16} />
                        <span>Dashboard</span>
                    </Link>
                    {user && (
                        <a
                            href="/#recent-reports"
                            className="nav-link"
                            onClick={(e) => {
                                if (location.pathname === '/') {
                                    e.preventDefault();
                                    document.getElementById('recent-reports')?.scrollIntoView({ behavior: 'smooth' });
                                }
                            }}
                        >
                            <FileText size={16} />
                            <span>My Reports</span>
                        </a>
                    )}
                </nav>

                {/* Right Action / Auth */}
                <div className="navbar-actions">
                    {user ? (
                        <div className="user-profile">
                            <div className="user-badge" title={user.email}>
                                <div className="user-avatar">
                                    {user.username?.charAt(0).toUpperCase() || <User size={14} />}
                                </div>
                                <span className="user-name">{user.username}</span>
                            </div>
                            <button
                                onClick={onLogout}
                                className="logout-btn"
                                title="Log Out"
                            >
                                <LogOut size={16} />
                                <span className="logout-text">Logout</span>
                            </button>
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="btn-secondary">
                                Sign In
                            </Link>
                            <Link to="/register" className="btn-primary">
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
