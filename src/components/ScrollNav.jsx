import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, MessageCircle } from 'lucide-react';

const ScrollNav = ({ darkMode }) => {
    const [show, setShow] = useState(false);
    
    // Nomor WA Admin (Ganti dengan nomor aslimu)
    const WHATSAPP_NUMBER = "6285813487753"; 

    useEffect(() => {
        const handleScroll = () => {
            // Tampilkan tombol jika scroll lebih dari 300px
            setShow(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    const scrollToBottom = () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

    // Tombol hanya muncul setelah user scroll
    if (!show) return null;

    return (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3 transition-opacity duration-300 animate-fade-in">
            
            {/* 1. TOMBOL CHAT WHATSAPP (Warna Hijau & Lebih Menonjol) */}
            <a 
                href={`https://wa.me/${WHATSAPP_NUMBER}`} 
                target="_blank" 
                rel="noopener noreferrer"
                title="Hubungi Admin Logistik Kita"
                className="p-3.5 rounded-full shadow-2xl transition transform hover:scale-110 bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300/50 flex items-center justify-center group"
            >
                <MessageCircle className="w-6 h-6 group-hover:animate-ping-once" />
            </a>

            {/* 2. TOMBOL NAIK (Desain Glassmorphism Ringan) */}
            <button 
                onClick={scrollToTop}
                title="Scroll ke Atas"
                className={`p-3 rounded-full shadow-lg transition transform hover:scale-110 backdrop-blur-md focus:outline-none ${
                    darkMode 
                    ? 'bg-slate-700/60 text-white border border-white/10 hover:bg-slate-600' 
                    : 'bg-white/70 text-slate-800 border border-gray-200 hover:bg-white'
                }`}
            >
                <ArrowUp className="w-5 h-5" />
            </button>
            
            {/* 3. TOMBOL TURUN (Glassmorphism Ringan) */}
            <button 
                onClick={scrollToBottom}
                title="Scroll ke Bawah"
                className={`p-3 rounded-full shadow-lg transition transform hover:scale-110 backdrop-blur-md focus:outline-none ${
                    darkMode 
                    ? 'bg-slate-700/60 text-white border border-white/10 hover:bg-slate-600' 
                    : 'bg-white/70 text-slate-800 border border-gray-200 hover:bg-white'
                }`}
            >
                <ArrowDown className="w-5 h-5" />
            </button>
        </div>
    );
};

export default ScrollNav;
