import React, { useState, useEffect } from 'react';

const Preloader = ({ loading }) => {
    // State agar saat loading jadi false, ada jeda untuk animasi keluar
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (!loading) {
            const timer = setTimeout(() => setIsVisible(false), 600); 
            return () => clearTimeout(timer);
        }
    }, [loading]);

    if (!isVisible) return null;

    return (
        <div className={`fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center transition-all duration-500 ${loading ? 'opacity-100' : 'opacity-0 pointer-events-none scale-110'}`}>
            <div className="relative flex items-center justify-center">
                
                {/* 1. Cincin Luar Merah (Lambat) */}
                <div className="absolute w-44 h-44 border-4 border-transparent border-t-red-600/80 border-b-red-600/20 rounded-full animate-spin-slow"></div>
                
                {/* 2. Cincin Dalam Putih (Cepat Berlawanan Arah) */}
                <div className="absolute w-36 h-36 border-2 border-transparent border-l-white/60 border-r-white/10 rounded-full animate-spin-reverse-fast"></div>
                
                {/* 3. GAMBAR TENGAH */}
                <div className="relative z-10 w-32 h-32 bg-slate-900 rounded-full border-2 border-red-600/50 shadow-2xl animate-pulse-glow-red flex items-center justify-center overflow-hidden">
                    <img 
                        src="/background-lk.jpg" 
                        alt="Loading..." 
                        className="w-full h-full object-cover rounded-full opacity-80" 
                        onError={(e) => {
                            e.target.style.display = 'none'; 
                            // Fallback jika gambar error
                            e.target.parentElement.innerHTML = '<span class="text-xs text-white">Logistik Kita</span>';
                        }} 
                    />
                </div>
            </div>
            
            {/* Teks Loading */}
            <div className="mt-12 text-center">
                <h2 className="text-2xl font-black tracking-tighter text-white mb-3 animate-pulse">
                    <span className="text-red-600">LOGISTIK</span> KITA
                </h2>
                <div className="flex items-center justify-center gap-2 opacity-80">
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                    </span>
                    <p className="text-red-500 text-xs font-bold tracking-[0.3em] uppercase animate-pulse">Memuat Sistem...</p>
                </div>
            </div>
        </div>
    );
};

export default Preloader;
