// src/components/Footer.jsx

import React, { useState } from 'react'; 
// Import ikon Share2 (atau Share)
import { Truck, MapPin, Phone, Mail, Instagram, Facebook, Globe, Share2, Linkedin } from 'lucide-react'; 
import { Link } from 'react-router-dom';

const Footer = () => {
    // State untuk mendeteksi apakah gambar logo gagal dimuat (dipertahankan untuk robustness)
    const [logoError, setLogoError] = useState(false); 

    // Data Sosial Media dengan URL LENGKAP + Ikon Share
    const SOCIAL_LINKS = [
        { Icon: Facebook, url: "https://www.facebook.com/share/1GcfR8K9qJ/" },
        { Icon: Instagram, url: "https://www.instagram.com/logistikkita.official?igsh=cm80Z25zaXp5dHg=" },
        { Icon: Linkedin, url: "https://www.linkedin.com/in/puput-wicaksana" },
        // Aksi Share (menggunakan API browser)
        { Icon: Share2, action: () => { 
            if (navigator.share) {
                navigator.share({
                    title: 'LogistikKita Mojokerto',
                    text: 'Mitra logistik terpercaya di Jawa Timur!',
                    url: window.location.href,
                });
            } else {
                alert('Fitur Share tidak didukung di browser ini.');
            }
        }},
    ];
    
    // Data Menu yang Disederhanakan
    const MAIN_MENU = [
        { label: 'Beranda', path: '/' },
        { label: 'Gabung Mitra', path: '/gabung-mitra' },
        { label: 'Tentang Kami', path: '/maintenance' },
        { label: 'Lacak Resi', path: '/#tracking' },
    ];

    // Data Kontak Lengkap
    const CONTACT_INFO = [
        { Icon: MapPin, text: "Jl. Terusan Irian No.8, Gedangklutuk RT004 RW009, Banjaragung, Puri, Kab. Mojokerto, Jawa Timur 61363", href: "https://maps.app.goo.gl/zEMFX9eYsiiBgvNR8" },
        { Icon: Phone, text: "+62 858-1348-7753", href: "tel:+6285813487753" },
        { Icon: Mail, text: "logistikkita.assist@gmail.com", href: "mailto:logistikkita.assist@gmail.com" },
    ];

    // FOOTER SELALU DARK MODE
    return (
        <footer className="bg-background-dark text-text-muted-dark pt-16 pb-8 border-t border-border-dark">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* GRID 3 KOLOM */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    
                    {/* 1. BRANDING & MOTO */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            
                            {/* LOGO MURNI TANPA KOTAK/NEON */}
                            {logoError ? (
                                <Truck size={32} className="text-primary flex-shrink-0" />
                            ) : (
                                <img
                                    src="/Logistik-Kita.png" 
                                    alt="Logo Logistik Kita"
                                    className="h-8 w-auto object-contain flex-shrink-0" 
                                    onError={() => setLogoError(true)} 
                                />
                            )}
                            
                            <div className="flex flex-col">
                                <span className="font-black text-2xl leading-none tracking-tight text-white">
                                    <span className="text-primary">LOGISTIK</span>KITA
                                </span>
                                <span className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase mt-1">
                                    MOJOKERTO
                                </span>
                            </div>
                        </div>
                        <p className="text-text-muted-dark text-sm leading-relaxed max-w-sm">
                            Mitra logistik terpercaya. Menghubungkan Anda dengan armada terbaik di Jawa Timur.
                        </p>
                    </div>

                    {/* 2. MENU UTAMA */}
                    <div>
                        <h4 className="text-text-main-dark font-bold text-lg mb-6">Navigasi Cepat</h4>
                        <ul className="space-y-4 text-sm">
                            {MAIN_MENU.map((item) => (
                                <li key={item.label}>
                                    <Link to={item.path} className="hover:text-primary transition-colors flex items-center gap-2">
                                        <span className="text-primary">•</span> {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 3. KONTAK & LOKASI */}
                    <div>
                        <h4 className="text-text-main-dark font-bold text-lg mb-6">Hubungi Kami</h4>
                        <ul className="space-y-4 text-sm">
                            {CONTACT_INFO.map((item, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <item.Icon size={18} className="text-primary mt-1 flex-shrink-0" />
                                    {item.href ? (
                                        <a href={item.href} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                                            <span>{item.text}</span>
                                        </a>
                                    ) : (
                                        <span>{item.text}</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* COPYWRIGHT & SOSIAL MEDIA */}
                <div className="border-t border-border-dark pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-text-muted-dark text-center md:text-left">
                        &copy; {new Date().getFullYear()} LogistikKita Mojokerto. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        {SOCIAL_LINKS.map((item, i) => (
                            <button
                                key={i}
                                // Jika ada 'action', gunakan onClick, jika tidak, gunakan <a>
                                onClick={item.action ? item.action : undefined}
                                className="w-8 h-8 rounded-full bg-surface-dark flex items-center justify-center hover:bg-primary text-white transition-all"
                            >
                                {item.action ? (
                                    <item.Icon size={14} />
                                ) : (
                                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full h-full">
                                        <item.Icon size={14} />
                                    </a>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
