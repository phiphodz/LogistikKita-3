// src/pages/DashboardPage.jsx (UPDATED VERSION)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, PackagePlus, History, User, LogOut, 
    Menu, X, Bell, ChevronRight, Search, Truck, Package
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const DashboardPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(true);

    // Cek Login dengan JWT token
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('accessToken');
            const userIdentifier = localStorage.getItem('userIdentifier');
            const userType = localStorage.getItem('userType');

            if (!token || !userIdentifier) {
                navigate('/login', { 
                    replace: true,
                    state: { message: 'Sesi Anda telah habis. Silakan login kembali.' }
                });
                return;
            }

            // Untuk development, kita buat user object dari localStorage
            // Di production, bisa fetch user data dari API
            setUser({
                name: userIdentifier.includes('@') 
                    ? userIdentifier.split('@')[0] 
                    : userIdentifier,
                email: userIdentifier.includes('@') ? userIdentifier : '',
                phone: !userIdentifier.includes('@') ? userIdentifier : '',
                type: userType || 'customer'
            });

            setLoading(false);
        };

        checkAuth();
    }, [navigate]);

    const handleLogout = () => {
        if(window.confirm("Yakin ingin keluar dari dashboard?")) {
            // Hapus semua auth data
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userIdentifier');
            localStorage.removeItem('userType');
            
            // Redirect ke login
            navigate('/login', { 
                replace: true,
                state: { message: 'Anda telah logout.' }
            });
        }
    };

    // --- SIDEBAR MENU ITEMS ---
    const menuItems = [
        { id: 'dashboard', label: 'Ringkasan', icon: <LayoutDashboard size={20} /> },
        { id: 'new-order', label: 'Buat Pesanan', icon: <PackagePlus size={20} /> },
        { id: 'history', label: 'Riwayat Order', icon: <History size={20} /> },
        { id: 'profile', label: 'Profil Saya', icon: <User size={20} /> },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
                <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-6">
                        <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse"></div>
                        <LayoutDashboard size={40} className="text-primary animate-pulse relative z-10" />
                    </div>
                    <p className="text-text-muted dark:text-gray-400">
                        Memuat dashboard...
                    </p>
                </div>
            </div>
        );
    }

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
                bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-500"></div>
                        <h2 className="text-xl font-black text-primary tracking-tighter">
                            <span className="text-primary">LOGISTIK</span>
                            <span className="text-text-main dark:text-white">KITA</span>
                        </h2>
                    </div>
                    <button 
                        onClick={() => setSidebarOpen(false)} 
                        className="lg:hidden text-gray-500 hover:text-text-main"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                            <p className="text-sm font-bold leading-none">{user?.name || 'User'}</p>
                            <p className="text-xs text-gray-500 mt-1 capitalize">{user?.type || 'customer'} account</p>
                        </div>
                    </div>
                </div>

                <nav className="p-4 space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id);
                                setSidebarOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                                activeTab === item.id 
                                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400 hover:text-text-main'
                            }`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                            {activeTab === item.id && (
                                <ChevronRight size={16} className="ml-auto" />
                            )}
                        </button>
                    ))}
                </nav>

                <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-200 dark:border-gray-700">
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors font-medium"
                    >
                        <LogOut size={18} />
                        <span>Keluar</span>
                    </button>
                </div>
            </aside>

            {/* === MAIN CONTENT (KANAN) === */}
            <main className="flex-1 min-w-0 overflow-y-auto">
                
                {/* TOP HEADER */}
                <header className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setSidebarOpen(true)} 
                            className="lg:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                            <Menu size={20} />
                        </button>
                        <h1 className="text-xl font-bold capitalize">
                            {menuItems.find(i => i.id === activeTab)?.label || 'Dashboard'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 relative">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
                        </button>
                    </div>
                </header>

                {/* CONTENT AREA */}
                <div className="p-6 md:p-8 max-w-7xl mx-auto">
                    
                    {/* TAB: DASHBOARD / RINGKASAN */}
                    {activeTab === 'dashboard' && (
                        <div className="animate-fade-in">
                            {/* Welcome Banner */}
                            <div className="rounded-2xl bg-gradient-to-r from-primary to-blue-600 p-8 text-white shadow-2xl mb-8 relative overflow-hidden">
                                <div className="relative z-10">
                                    <h2 className="text-3xl font-black mb-2">Halo, {user?.name}! 👋</h2>
                                    <p className="text-blue-100 max-w-xl mb-6">
                                        Selamat datang di dashboard Logistik Kita. Siap mengirim muatan hari ini?
                                    </p>
                                    <button 
                                        onClick={() => setActiveTab('new-order')}
                                        className="bg-white text-primary hover:bg-blue-50 px-6 py-3 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2"
                                    >
                                        <PackagePlus size={18} />
                                        Buat Pesanan Baru
                                    </button>
                                </div>
                                <div className="absolute right-0 bottom-0 opacity-10 transform translate-y-1/4 translate-x-1/4">
                                    <Truck size={200} />
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Pesanan</p>
                                            <p className="text-2xl font-bold mt-2">0</p>
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                            <Package size={24} className="text-blue-500" />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Dalam Pengiriman</p>
                                            <p className="text-2xl font-bold mt-2">0</p>
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                            <Truck size={24} className="text-green-500" />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Selesai</p>
                                            <p className="text-2xl font-bold mt-2">0</p>
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                            <LayoutDashboard size={24} className="text-purple-500" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Empty State Order */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                                    <PackagePlus size={40} />
                                </div>
                                <h3 className="text-xl font-bold text-text-main dark:text-white mb-3">Belum ada aktifitas</h3>
                                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
                                    Riwayat pengiriman dan status muatanmu akan muncul di sini setelah kamu melakukan pemesanan.
                                </p>
                                <button 
                                    onClick={() => setActiveTab('new-order')}
                                    className="btn-primary px-8 py-3"
                                >
                                    Buat Pesanan Pertama
                                </button>
                            </div>
                        </div>
                    )}

                    {/* TAB: BUAT PESANAN */}
                    {activeTab === 'new-order' && (
                        <div className="animate-fade-in">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                                <div className="text-center max-w-2xl mx-auto">
                                    <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <PackagePlus size={32} className="text-primary" />
                                    </div>
                                    <h2 className="text-2xl font-bold mb-3">Marketplace Armada Segera Hadir! 🚀</h2>
                                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                                        Fitur marketplace armada sedang dalam pengembangan. 
                                        Di sini nanti Anda bisa memilih armada langsung dari berbagai mitra.
                                    </p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                                        <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl">
                                            <h3 className="font-bold mb-2">📦 Simulasi Harga</h3>
                                            <p className="text-sm text-gray-500">Estimasi biaya pengiriman instan</p>
                                        </div>
                                        <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl">
                                            <h3 className="font-bold mb-2">🚚 Pilih Armada</h3>
                                            <p className="text-sm text-gray-500">Dari berbagai jenis kendaraan</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: RIWAYAT ORDER */}
                    {activeTab === 'history' && (
                        <div className="animate-fade-in">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                                        <History size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">Belum ada riwayat</h3>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Pesanan yang Anda buat akan muncul di sini
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: PROFIL SAYA */}
                    {activeTab === 'profile' && (
                        <div className="animate-fade-in">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                                <div className="max-w-2xl mx-auto">
                                    <h2 className="text-2xl font-bold mb-8">Profil Saya</h2>
                                    
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Nama
                                            </label>
                                            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                <p className="font-medium">{user?.name || 'Belum diatur'}</p>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Email / Nomor WA
                                            </label>
                                            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                <p className="font-medium">{user?.email || user?.phone || '-'}</p>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Tipe Akun
                                            </label>
                                            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                <p className="font-medium capitalize">{user?.type || 'customer'}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                                            <button className="btn-outline">
                                                Edit Profil
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
