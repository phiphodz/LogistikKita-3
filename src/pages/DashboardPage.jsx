// src/pages/DashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, PackagePlus, History, User, LogOut, 
    Menu, X, Bell, ChevronRight, Search 
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const DashboardPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');

    // Cek Login saat halaman dimuat
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            navigate('/login'); // Tendang balik ke login kalau belum login
        } else {
            setUser(JSON.parse(userData));
        }
    }, [navigate]);

    const handleLogout = () => {
        if(window.confirm("Yakin ingin keluar?")) {
            localStorage.removeItem('user');
            navigate('/login');
        }
    };

    // --- SIDEBAR MENU ITEMS ---
    const menuItems = [
        { id: 'dashboard', label: 'Ringkasan', icon: <LayoutDashboard size={20} /> },
        { id: 'new-order', label: 'Buat Pesanan', icon: <PackagePlus size={20} /> }, // Ini nanti ke Marketplace Armada
        { id: 'history', label: 'Riwayat Order', icon: <History size={20} /> },
        { id: 'profile', label: 'Profil Saya', icon: <User size={20} /> },
    ];

    if (!user) return null; // Jangan tampilkan apa-apa sebelum cek login selesai

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex text-text-main dark:text-text-main-dark font-sans">
            <Helmet>
                <title>Dashboard Shipper | Logistik Kita</title>
            </Helmet>

            {/* === MOBILE SIDEBAR OVERLAY === */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* === SIDEBAR (KIRI) === */}
            <aside className={`
                fixed lg:sticky top-0 left-0 z-50 h-screen w-64 
                bg-white dark:bg-surface-dark border-r border-gray-200 dark:border-gray-700
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-6 flex items-center justify-between">
                    <h2 className="text-2xl font-black text-primary tracking-tighter">LOGISTIK<span className="text-text-main dark:text-white">KITA</span></h2>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500">
                        <X size={24} />
                    </button>
                </div>

                <nav className="px-4 space-y-2 mt-4">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id);
                                setSidebarOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                                activeTab === item.id 
                                ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400'
                            }`}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="absolute bottom-6 left-0 w-full px-4">
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors font-medium"
                    >
                        <LogOut size={20} />
                        Keluar
                    </button>
                </div>
            </aside>

            {/* === MAIN CONTENT (KANAN) === */}
            <main className="flex-1 min-w-0 overflow-y-auto">
                
                {/* TOP HEADER */}
                <header className="sticky top-0 z-30 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                            <Menu size={20} />
                        </button>
                        <h1 className="text-xl font-bold capitalize hidden sm:block">
                            {menuItems.find(i => i.id === activeTab)?.label}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 relative">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
                            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                {user.name.charAt(0)}
                            </div>
                            <div className="hidden md:block">
                                <p className="text-sm font-bold leading-none">{user.name}</p>
                                <p className="text-xs text-gray-500 mt-1">Shipper Account</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* CONTENT AREA */}
                <div className="p-6 md:p-8 max-w-7xl mx-auto">
                    
                    {/* TAB: DASHBOARD / RINGKASAN */}
                    {activeTab === 'dashboard' && (
                        <div className="animate-fade-in">
                            {/* Welcome Banner */}
                            <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 dark:from-black dark:to-slate-900 p-8 text-white shadow-2xl mb-10 relative overflow-hidden">
                                <div className="relative z-10">
                                    <h2 className="text-3xl font-black mb-2">Halo, {user.name}! 👋</h2>
                                    <p className="text-gray-300 max-w-xl">
                                        Siap mengirim muatan hari ini? Cek status pengirimanmu atau buat pesanan baru sekarang.
                                    </p>
                                    <button 
                                        onClick={() => setActiveTab('new-order')}
                                        className="mt-6 bg-primary hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/30 transition-all flex items-center gap-2"
                                    >
                                        <PackagePlus size={18} />
                                        Buat Pesanan Baru
                                    </button>
                                </div>
                                {/* Dekorasi Background */}
                                <div className="absolute right-0 bottom-0 opacity-10 transform translate-y-1/4 translate-x-1/4">
                                    <Truck size={200} />
                                </div>
                            </div>

                            {/* Empty State Order */}
                            <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-3xl">
                                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                    <PackagePlus size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-text-main dark:text-white">Belum ada aktifitas</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto mt-2">
                                    Riwayat pengiriman dan status muatanmu akan muncul di sini setelah kamu melakukan pemesanan.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* TAB: BUAT PESANAN (Placeholder untuk Marketplace) */}
                    {activeTab === 'new-order' && (
                        <div className="animate-fade-in text-center py-20">
                            <h2 className="text-2xl font-bold mb-4">Marketplace Armada Segera Hadir! 🚀</h2>
                            <p>Di sini nanti akan muncul katalog armada seperti yang kamu rencanakan.</p>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
