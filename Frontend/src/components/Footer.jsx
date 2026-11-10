import React from 'react';
import { Sparkles, Shield, Cpu, ExternalLink, Heart } from 'lucide-react';
import './footer.scss';

const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="footer-container">
                {/* Top Section */}
                <div className="footer-grid">
                    <div className="footer-col footer-col--brand">
                        <div className="footer-brand">
                            <div className="brand-icon">
                                <Sparkles size={18} />
                            </div>
                            <span className="brand-title">Resume<span className="brand-accent">Forge</span> AI</span>
                        </div>
                        <p className="brand-desc">
                            Next-generation career strategy engine. Evaluates your profile against target roles, identifies skill deficiencies, and drafts precision-engineered ATS resumes using Groq AI.
                        </p>
                        <div className="engine-badge">
                            <Cpu size={14} />
                            <span>Powered by Groq Llama 3.3 Engine</span>
                        </div>
                    </div>

                    <div className="footer-col">
                        <h4>Platform</h4>
                        <ul className="footer-links">
                            <li><a href="/#job-description">Skill Gap Analysis</a></li>
                            <li><a href="/#job-description">ATS Resume Generator</a></li>
                            <li><a href="/#recent-reports">Interview Question Bank</a></li>
                            <li><a href="/#recent-reports">7-Day Prep Roadmap</a></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>ATS Best Practices</h4>
                        <ul className="footer-links">
                            <li><span className="footer-tip">✓ Standard semantic headers</span></li>
                            <li><span className="footer-tip">✓ Zero multi-column tables</span></li>
                            <li><span className="footer-tip">✓ Natural keyword integration</span></li>
                            <li><span className="footer-tip">✓ Quantified impact bullet points</span></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Security & Privacy</h4>
                        <div className="security-note">
                            <Shield size={16} className="security-icon" />
                            <p>
                                Documents are processed in memory and encrypted. We never train public AI models on your personal resume data.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="footer-bottom">
                    <p className="copyright">
                        © {new Date().getFullYear()} ResumeForge AI. All rights reserved.
                    </p>
                    <div className="status-indicator">
                        <span className="status-dot"></span>
                        <span className="status-text">All AI Services Operational</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
