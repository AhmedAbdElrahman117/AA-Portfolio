import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import Swal from 'sweetalert2';
import { initFirebase } from '../../lib/firebase';
import AnalyticsManager from './managers/AnalyticsManager';
import ProjectsManager from './managers/ProjectsManager';
import HomeManager from './managers/HomeManager';
import AboutManager from './managers/AboutManager';
import SkillsManager from './managers/SkillsManager';
import ServicesManager from './managers/ServicesManager';
import CertificatesManager from './managers/CertificatesManager';
import ContactManager from './managers/ContactManager';

export default function CMSManager({ user }) {
    const [activeTab, setActiveTab] = useState('analytics');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: 'Logout?',
            text: "Are you sure you want to end your session?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#f44336',
            cancelButtonColor: '#2196F3',
            confirmButtonText: 'Logout',
            background: '#1a1a1a',
            color: '#fff'
        });

        if (result.isConfirmed) {
            const { auth } = await initFirebase();
            try {
                await signOut(auth);
            } catch (error) {
                console.error("Logout error", error);
            }
        }
    };

    const navItems = [
        { id: 'analytics', label: 'Analytics', icon: 'fa-chart-line' },
        { id: 'home', label: 'Home', icon: 'fa-home' },
        { id: 'about', label: 'About', icon: 'fa-user' },
        { id: 'skills', label: 'Skills', icon: 'fa-cogs' },
        { id: 'services', label: 'Services', icon: 'fa-concierge-bell' },
        { id: 'projects', label: 'Projects', icon: 'fa-folder-open' },
        { id: 'certificates', label: 'Certificates', icon: 'fa-certificate' },
        { id: 'contact', label: 'Contact Info', icon: 'fa-envelope' }
    ];

    return (
        <div className="min-h-screen bg-primary text-text-primary flex overflow-hidden font-sans relative">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden animate-fadeIn"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`fixed md:relative top-0 left-0 h-full w-[260px] bg-[#0a0a0a] border-r border-white/10 flex flex-col z-50 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div className="h-[70px] flex items-center justify-between md:justify-center gap-3 px-lg border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1 animate-scaleIn">
                            <span className="text-3xl font-bold bg-gradient-to-br from-brand-light to-brand-dark bg-clip-text text-transparent">A</span>
                            <span className="text-3xl font-bold bg-gradient-to-br from-brand-light to-brand-dark bg-clip-text text-transparent transform translate-y-1">A</span>
                        </div>
                        <span className="text-lg font-semibold text-white tracking-wide">Dashboard</span>
                    </div>
                    <button className="md:hidden text-white/70 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>
                <nav className="flex-1 overflow-y-auto py-md px-3">
                    <ul className="flex flex-col gap-1">
                        {navItems.map(item => {
                            const isActive = activeTab === item.id;
                            return (
                                <li key={item.id}>
                                    <button
                                        onClick={() => {
                                            setActiveTab(item.id);
                                            // Close sidebar automatically on mobile after specific navigation
                                            if (window.innerWidth < 768) {
                                                setIsSidebarOpen(false);
                                            }
                                        }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${isActive ? 'bg-gradient-to-r from-brand-light/20 to-brand-dark/20 text-white border-l-4 border-brand-light' : 'text-text-muted hover:bg-white/5 hover:text-white border-l-4 border-transparent'}`}
                                    >
                                        <div className="w-6 flex justify-center"><i className={`fas ${item.icon} ${isActive ? 'text-brand-light drop-shadow-[0_0_8px_rgba(33,150,243,0.8)]' : ''}`}></i></div>
                                        {item.label}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
                <div className="p-4 border-t border-white/10 flex flex-col gap-2">
                    <a href="/" target="_blank" className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-white/10 text-text-primary hover:bg-white/5 hover:border-brand-light transition-all duration-300 font-medium text-sm">
                        <i className="fas fa-external-link-alt"></i> View Portfolio
                    </a>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-500 text-white hover:bg-red-600 shadow-[0_4px_10px_rgba(244,67,54,0.3)] hover:shadow-[0_6px_15px_rgba(244,67,54,0.5)] transition-all duration-300 font-medium text-sm"
                    >
                        <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-[100dvh] relative bg-primary w-full max-w-full overflow-x-hidden">
                {/* Background ambient glow matching original login/dashboard */}
                <div className="absolute top-[-150px] left-[20%] w-[500px] h-[500px] bg-brand-light/10 rounded-full blur-[120px] pointer-events-none"></div>

                <header className="h-[70px] bg-primary/80 backdrop-blur-xl border-b border-white/10 flex justify-between items-center px-4 md:px-lg sticky top-0 z-30">
                    <div className="md:hidden flex items-center gap-4">
                        <button className="text-white text-xl p-2" onClick={() => setIsSidebarOpen(true)}>
                            <i className="fas fa-bars"></i>
                        </button>
                        <span className="font-bold text-lg capitalize">{activeTab}</span>
                    </div>
                    <div className="hidden md:block">
                        <h2 className="text-xl font-semibold m-0 text-white capitalize">{activeTab} Management</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-text-muted">Welcome, <span className="text-brand-light font-medium">{user.email.split('@')[0]}</span></span>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-light to-brand-dark flex items-center justify-center shadow-glow border border-white/20">
                            <i className="fas fa-user text-white text-xs"></i>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 lg:p-10 relative z-10 scroll-smooth w-full">
                    <div className="max-w-[1200px] mx-auto animate-slideUp w-full">
                        <div className={activeTab === 'analytics' ? 'block' : 'hidden'}><AnalyticsManager /></div>
                        <div className={activeTab === 'home' ? 'block' : 'hidden'}><HomeManager /></div>
                        <div className={activeTab === 'about' ? 'block' : 'hidden'}><AboutManager /></div>
                        <div className={activeTab === 'skills' ? 'block' : 'hidden'}><SkillsManager /></div>
                        <div className={activeTab === 'services' ? 'block' : 'hidden'}><ServicesManager /></div>
                        <div className={activeTab === 'projects' ? 'block' : 'hidden'}><ProjectsManager /></div>
                        <div className={activeTab === 'certificates' ? 'block' : 'hidden'}><CertificatesManager /></div>
                        <div className={activeTab === 'contact' ? 'block' : 'hidden'}><ContactManager /></div>
                    </div>
                </div>
            </main>
        </div>
    );
}
