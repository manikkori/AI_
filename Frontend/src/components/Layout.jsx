import React from 'react';
import TopHeader from './TopHeader';
import FloatingDock from './FloatingDock';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-[#070709] text-neutral-100 flex flex-col relative selection:bg-orange-500/30 selection:text-orange-200">
            {/* Ambient liquid backdrop glow */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-br from-orange-600/[0.04] to-red-600/[0.02] blur-[140px]"></div>
                <div className="absolute bottom-[-15%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tl from-neutral-800/[0.08] to-transparent blur-[160px]"></div>
            </div>

            {/* Top Bar */}
            <div className="relative z-10">
                <TopHeader />
            </div>

            {/* Floating Navigation Dock (Right side) */}
            <FloatingDock />

            {/* Page Main Content */}
            <main className="flex-1 relative z-10 w-full">
                {children}
            </main>

            {/* Footer */}
            <div className="relative z-10">
                <Footer />
            </div>
        </div>
    );
};

export default Layout;
