// src/pages/MaintenancePage.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ServerCrash } from 'lucide-react';

const MaintenancePage = () => {
    // State untuk fallback jika gambar kurir gagal dimuat
    const [imageError, setImageError] = useState(false);

    return (
        // Container Utama: FULL VIEWPORT (100% tinggi dan lebar)
        <div className="relative min-h-screen flex flex-col items-center justify-center text-white text-center">
            
            {/* 1. LAYER GAMBAR KURIR (FULL BACKGROUND DENGAN ANIMASI PULSE) */}
            <div className="absolute inset-0 w-full h-full">
                
                {imageError ? (
                    // FALLBACK: Jika gambar gagal dimuat, tampilkan background solid
                    <div className="w-full h-full bg-background-dark flex items-center justify-center">
                        <ServerCrash size={60} className="text-primary animate-spin-slow" />
                        <p className="ml-4 text-lg text-text-muted-dark">Layanan Offline.</p>
                    </div>
                ) : (
                    // GAMBAR KURIR sebagai FULL COVER DENGAN ANIMASI PULSE
                    <img
                        src="/Kurir-Logistik-Kita1.png"
                        alt="Kurir Logistik Kita sedang bekerja"
                        // object-cover memastikan gambar menutupi seluruh div
                        // animate-image-pulse (Animasi baru kita)
                        className="w-full h-full object-cover animate-image-pulse" 
                        onError={() => setImageError(true)} 
                    />
                )}
                
                {/* 2. LAYER OVERLAY GELAP (Memastikan Teks Putih Terbaca Jelas) */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
            </div>

            {/* 3. LAYER KONTEN TEKS & TOMBOL (Paling Depan) */}
            <div className="relative z-20 p-6 max-w-xl w-full">
                
                {/* HEADLINE */}
                <h1 className="text-5xl font-extrabold mb-4 drop-shadow-xl leading-tight">
                    <span className="text-primary-dark">SISTEM</span> SEDANG PERBAIKAN
                </h1>
                
                {/* TULISAN UTAMA */}
                <p className="text-xl font-medium mb-10 drop-shadow-lg text-white">
                    Halaman ini sedang dalam pengembangan, silahkan kembali lagi nanti.
                </p>

                {/* Tombol Kembali menggunakan class btn-primary (warna solid) */}
                <Link 
                    to="/" 
                    // Gunakan kelas yang memastikan tombol terlihat bagus di atas gambar
                    className="w-full max-w-xs py-3.5 rounded-xl font-bold transition-all transform active:scale-95 shadow-xl shadow-primary/30 
                               bg-primary hover:bg-primary-hover text-white text-lg flex items-center justify-center gap-3 mx-auto"
                >
                    <ArrowLeft size={20} /> Kembali ke Beranda
                </Link>

            </div>
            
            {/* Footer Kecil */}
            <p className="absolute bottom-4 text-xs text-white/70 z-20">
                Layanan akan segera beroperasi dengan fitur-fitur terbaru.
            </p>
        </div>
    );
};

export default MaintenancePage;
