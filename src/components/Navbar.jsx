// src/components/Navbar.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; 
import { Menu, X, Truck, Moon, Sun, ChevronDown, ChevronRight } from 'lucide-react'; 

const Navbar = ({ darkMode, toggleTheme }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeMobileSubmenu, setActiveMobileSubmenu] = useState(null);
    const [logoError, setLogoError] = useState(false); // State untuk cek error logo gambar
    
    const navigate = useNavigate();
    const location = useLocation();

    // --- DATA STRUKTUR MENU (SUPER LENGKAP) ---
    const NAVIGATION_MENU = [
        { label: 'Beranda', path: '/', type: 'link' },
        { 
            label: 'Layanan & Armada', 
            type: 'dropdown',
            children: [
                { label: 'Kapasitas Armada', path: '/maintenance' },
                { label: 'Jangkauan Pengiriman', path: '/maintenance' },
                { label: 'Prosedur Keamanan', path: '/maintenance' },
                { label: 'Simulasi Harga Estimasi', path: '/simulasi-harga' }, 
                { label: 'Jenis Layanan', path: '/maintenance' },
            ]
        },
        { 
            label: 'Galeri & Portofolio', 
            type: 'dropdown',
            children: [
                { label: 'Dokumentasi Pengiriman', path: '/maintenance' },
                { label: 'Kisah Sukses Lokal', path: '/maintenance' },
                { label: 'Testimoni Klien', path: '/maintenance' },
            ]
        },
        { 
            label: 'Tentang Kami', 
            type: 'dropdown',
            children: [
                { label: 'Visi, Misi, & Nilai', path: '/maintenance' },
                { label: 'Profil & Legalitas', path: '/maintenance' },
                { label: 'Penanganan Risiko', path: '/maintenance' },
            ]
        },
        { 
            label: 'Hubungi Kami', 
            type: 'dropdown',
            children: [
                { label: 'Lacak Resi (Tracking)', path: '/#tracking' }, 
                { label: 'Formulir RFQ', path: '/maintenance' },
                { label: 'Informasi Kontak', path: '/maintenance' },
                { label: 'Lokasi Kantor', path: '/maintenance' },
            ]
        },
        { 
            label: 'Blog / Berita', 
            type: 'dropdown',
            children: [
                { label: 'Berita Terbaru', path: '/maintenance' },
                { label: 'Tips Logistik', path: '/maintenance' },
            ]
        }
    ];

    const MITRA_MENU = [
        { label: 'Pendaftaran Mitra', path: '/gabung-mitra' },
        { label: 'Info Muatan Balik', path: '/maintenance' },
        { label: 'Driver Terbaik Bulan Ini', path: '/maintenance' },
        { label: 'SOP Mitra', path: '/maintenance' },
        { label: 'Masuk Akun', path: '/login' },
    ];

    // --- LOGIC: DETEKSI SCROLL ---
    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 20;
            if (isScrolled !== scrolled) setScrolled(isScrolled);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [scrolled]);

    // Tutup menu saat pindah halaman
    useEffect(() => {
        setIsOpen(false);
        setActiveMobileSubmenu(null);
    }, [location]);
    
    // Logic Scroll ke Bagian Tracking (Hash Link)
    const scrollToSection = (id) => {
        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(() => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); }, 300);
        } else {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }
        setIsOpen(false);
    };

    // --- WARNA NAVBAR FIXED (NAVY ELEGAN) ---
    const navbarBg = scrolled 
        ? 'bg-background-dark/95 backdrop-blur-md shadow-lg py-2' 
        : 'bg-transparent py-4';

    return (
        <nav className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ease-in-out ${navbarBg}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    
                    {/* 1. LOGO BRANDING (GAMBAR MURNI) 🇮🇩 */}
                    <div className="flex items-center gap-3 cursor-pointer group flex-shrink-0" onClick={() => navigate('/')}>
                        
                        {/* TAMPILKAN GAMBAR MURNI TANPA KOTAK DAN NEON */}
                        {logoError ? (
                            // FALLBACK: Jika gambar gagal dimuat
                            <Truck size={32} className="text-primary" />
                        ) : (
                            // COBA MUAT GAMBAR DARI FOLDER PUBLIC (UKURAN LEBIH BESAR AGAR DETAIL)
                            <img
                                src="/Logistik-Kita.png" 
                                alt="Logo Logistik Kita"
                                // Memberi height fix agar sejajar dengan teks
                                className="h-8 w-auto object-contain relative z-10" 
                                onError={() => setLogoError(true)} 
                            />
                        )}

                        <div className="flex flex-col">
                            <span className="font-extrabold text-xl leading-none tracking-tight">
                                <span className="text-primary">LOGISTIK</span>
                                <span className="text-white">KITA</span>
                            </span>
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase mt-0.5 text-text-muted-dark">
                                MOJOKERTO
                            </span>
                        </div>
                    </div>

                    {/* 2. DESKTOP MENU (TEXT SELALU LIGHT) */}
                    <div className="hidden xl:flex items-center gap-6">
                        {NAVIGATION_MENU.map((item, index) => (
                            <div key={index} className="relative group h-16 flex items-center">
                                {item.type === 'link' ? (
                                    <Link 
                                        to={item.path}
                                        className="text-sm font-bold text-text-main-dark hover:text-primary transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                ) : (
                                    <button className="flex items-center gap-1 text-sm font-bold text-text-main-dark group-hover:text-primary transition-colors">
                                        {item.label}
                                        <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
                                    </button>
                                )}

                                {/* Dropdown Content */}
                                {item.children && (
                                    <div className="absolute top-12 left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                                        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-xl border border-border-light dark:border-border-dark p-2 min-w-[220px]">
                                            {item.children.map((sub, idx) => (
                                                sub.path.includes('#') ? (
                                                    <a 
                                                        key={idx}
                                                        href={sub.path}
                                                        onClick={(e) => { e.preventDefault(); scrollToSection('tracking'); }}
                                                        className="block px-4 py-2.5 text-sm text-text-muted dark:text-text-muted-dark hover:bg-surface-light dark:hover:bg-background-dark hover:text-primary rounded-lg transition-colors font-medium"
                                                    >
                                                        {sub.label}
                                                    </a>
                                                ) : (
                                                    <Link 
                                                        key={idx}
                                                        to={sub.path}
                                                        className="block px-4 py-2.5 text-sm text-text-muted dark:text-text-muted-dark hover:bg-surface-light dark:hover:bg-background-dark hover:text-primary rounded-lg transition-colors font-medium"
                                                    >
                                                        {sub.label}
                                                    </Link>
                                                )
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* 3. BUTTONS KANAN */}
                    <div className="hidden xl:flex items-center gap-3">
                        {/* Tombol Theme */}
                        <button 
                            onClick={toggleTheme} 
                            className="p-2 rounded-full transition-all hover:bg-white/10 text-gray-300 hover:text-white"
                        >
                            {darkMode ? <Sun size={20} className="text-yellow-400"/> : <Moon size={20} />}
                        </button>

                        {/* Mitra Button (Dropdown) */}
                        <div className="relative group">
                            <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary hover:bg-red-700 text-white text-sm font-bold shadow-md shadow-red-900/20 transition-all active:scale-95">
                                <span>Mitra Armada</span>
                                <ChevronDown size={16} />
                            </button>
                            <div className="absolute top-full right-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-xl border border-border-light dark:border-border-dark p-2 min-w-[200px]">
                                    {MITRA_MENU.map((sub, idx) => (
                                        <Link 
                                            key={idx}
                                            to={sub.path}
                                            className={`block px-4 py-2.5 text-sm rounded-lg transition-colors font-medium ${
                                                sub.label === 'Masuk Akun'
                                                ? 'bg-primary text-white font-bold hover:bg-primary-hover' 
                                                : (sub.label === 'Pendaftaran Mitra' 
                                                    ? 'bg-surface-light dark:bg-surface-dark text-text-main dark:text-text-main-dark hover:bg-surface-light/80 dark:hover:bg-background-dark'
                                                    : 'text-text-muted dark:text-text-muted-dark hover:bg-gray-50 dark:hover:bg-background-dark'
                                                )
                                            }`}
                                        >
                                            {sub.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 4. MOBILE HAMBURGER (Selalu Putih) */}
                    <div className="xl:hidden flex items-center gap-4">
                        <button onClick={toggleTheme} className="p-2 rounded-full text-gray-300">
                            {darkMode ? <Sun size={20} className="text-yellow-400"/> : <Moon size={20} />}
                        </button>
                        <button 
                            onClick={() => setIsOpen(!isOpen)} 
                            className="p-1 text-white"
                        >
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* --- 5. MOBILE MENU SIDEBAR (Fixed Dark Navy) --- */}
            <div className={`xl:hidden absolute top-full left-0 w-full bg-background-dark border-t border-border-dark shadow-xl transition-all duration-300 ease-in-out origin-top overflow-hidden ${
                isOpen ? 'max-h-[85vh] opacity-100' : 'max-h-0 opacity-0'
            }`}>
                <div className="px-4 py-6 pb-20 space-y-1 flex flex-col overflow-y-auto max-h-[80vh]">
                    {NAVIGATION_MENU.map((item, index) => (
                        <div key={index} className="border-b border-border-dark last:border-none">
                            {item.type === 'link' ? (
                                <Link 
                                    to={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full text-left py-4 px-2 text-base font-bold text-text-main-dark hover:text-primary"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <div>
                                    <button 
                                        onClick={() => setActiveMobileSubmenu(activeMobileSubmenu === index ? null : index)}
                                        className="flex items-center justify-between w-full py-4 px-2 text-base font-bold text-text-main-dark hover:text-primary"
                                    >
                                        {item.label}
                                        <ChevronRight size={16} className={`transition-transform duration-200 ${activeMobileSubmenu === index ? 'rotate-90 text-primary' : 'text-text-muted-dark'}`} />
                                    </button>
                                    
                                    {/* Mobile Submenu */}
                                    <div className={`pl-4 bg-surface-dark/50 rounded-lg overflow-hidden transition-all duration-300 ${
                                        activeMobileSubmenu === index ? 'max-h-96 py-2 opacity-100' : 'max-h-0 opacity-0'
                                    }`}>
                                        {item.children.map((sub, idx) => (
                                            sub.path.includes('#') ? (
                                                <a
                                                    key={idx}
                                                    href={sub.path}
                                                    onClick={(e) => { e.preventDefault(); scrollToSection('tracking'); }}
                                                    className="block py-3 px-2 text-sm text-text-muted-dark font-medium hover:text-primary"
                                                >
                                                    • {sub.label}
                                                </a>
                                            ) : (
                                                <Link 
                                                    key={idx}
                                                    to={sub.path}
                                                    onClick={() => setIsOpen(false)}
                                                    className="block py-3 px-2 text-sm text-text-muted-dark font-medium hover:text-primary"
                                                >
                                                    • {sub.label}
                                                </Link>
                                            )
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Mobile Mitra Area */}
                    <div className="pt-6 mt-4">
                        <div className="bg-primary/10 rounded-xl p-4 border border-border-dark">
                            <h4 className="text-xs font-extrabold text-primary uppercase tracking-wider mb-3">Area Mitra Driver</h4>
                            <div className="space-y-3">
                                {MITRA_MENU.map((sub, idx) => (
                                    <Link 
                                        key={idx}
                                        to={sub.path}
                                        onClick={() => setIsOpen(false)}
                                        className={`block w-full py-3 px-4 rounded-lg text-center text-sm font-bold shadow-sm ${
                                            sub.label === 'Masuk Akun'
                                            ? 'bg-primary text-white hover:bg-primary-hover' 
                                            : (sub.label === 'Pendaftaran Mitra' 
                                                ? 'bg-surface-light dark:bg-surface-dark text-text-main dark:text-text-main-dark hover:bg-surface-light/80 dark:hover:bg-background-dark'
                                                : 'bg-surface-dark/50 text-text-muted-dark hover:bg-background-dark/50'
                                            )
                                        }`}
                                    >
                                        {sub.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
