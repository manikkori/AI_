import React from 'react';
import { Sparkles, Shield, Cpu } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-12 mt-auto border-t border-white/[0.06] text-neutral-400 text-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center text-orange-500">
                        <Sparkles size={14} />
                    </div>
                    <span className="text-neutral-200 font-medium">ResumeForge AI</span>
                    <span className="text-neutral-600">•</span>
                    <span>99% ATS Pass Architecture</span>
                </div>

                <div className="flex items-center gap-6 text-neutral-400">
                    <span className="flex items-center gap-2">
                        <Shield size={15} className="text-emerald-500" />
                        <span>Client Data Encrypted</span>
                    </span>
                    <span className="flex items-center gap-2">
                        <Cpu size={15} className="text-orange-500" />
                        <span>Powered by Groq AI</span>
                    </span>
                </div>

                <p className="text-neutral-500 text-xs sm:text-sm">
                    © {new Date().getFullYear()} ResumeForge. Pure ATS Precision.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
