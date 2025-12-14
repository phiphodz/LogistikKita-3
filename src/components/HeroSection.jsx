// src/components/HeroSection.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { ArrowRight, TicketPercent, Globe } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const HeroSection = () => {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);

    // --- 1. DATA GAMBAR CAROUSEL ---
    const slides = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=2070&auto=format&fit=crop", 
            alt: "Armada Logistik Wingbox"
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?q=80&w=2070&auto=format&fit=crop", 
            alt: "Manajemen Gudang & Kargo"
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=2075&auto=format&fit=crop", 
            alt: "Pengiriman Cepat Antar Pulau"
        }
    ];

    // --- 2. LOGIC PROMO ---
    const [activePromo] = useState({
        id: 1,
        title: "Diskon Kargo Lintas Pulau",
        desc: "Potongan 20% pengiriman Jawa-Bali & Sumatera.",
        code: "NASIONAL20",
        valid: "Terbatas"
    });

    const handleClaimPromo = () => {
        const isLoggedIn = localStorage.getItem('token');
        if (isLoggedIn) {
            navigate('/dashboard/new-order', { state: { promoCode: activePromo.code } });
        } else {
            const result = window.confirm("Silahkan Daftar/Masuk sebagai 'Shipper' untuk klaim voucher ini!");
            if(result) {
                navigate('/register?role=shipper&redirect=claim_promo');
            }
        }
    };

    // --- 3. AUTO SLIDE LOGIC ---
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000); 
        return () => clearInterval(timer);
    }, [slides.length]);

    // --- 4. SEO SCHEMA ---
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": "Logistik Kita Indonesia",
        "image": "https://logistikkita.com/Logistik-Kita.png",
        "description": "Platform Freight Forwarding & Manajemen Transportasi Digital terintegrasi di Indonesia.",
        "url": "https://logistikkita.com",
        "areaServed": {
            "@type": "Country",
            "name": "Indonesia"
        },
        "priceRange": "$$"
    };

    return (
        // PERBAIKAN DI SINI:
        // pb-96 (384px) pada mobile memberi ruang SANGAT LUAS agar kotak Lacak tidak menabrak tombol.
        // md:pb-64 (256px) pada desktop/laptop sudah cukup.
        <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-background-dark pb-96 md:pb-64 pt-24">
            
            <Helmet>
                <title>Logistik Kita | Indonesia Freight Forwarding Network</title>
                <meta name="description" content="Platform logistik digital B2B terpercaya di Indonesia. Melayani sewa truk (Trucking), distribusi kargo antar pulau, dan manajemen rantai pasok." />
                <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
            </Helmet>

            {/* A. BACKGROUND CAROUSEL */}
            {slides.map((slide, index) => (
                <div 
                    key={slide.id}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                        index === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    <img 
                        src={slide.image} 
                        alt={slide.alt} 
                        className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent opacity-90"></div>
                </div>
            ))}

            {/* B. KONTEN STATIS */}
            <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
                
                {/* 1. Badge */}
                <div className="mb-6 animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-xs font-bold tracking-widest text-white uppercase shadow-lg">
                        <Globe className="w-3 h-3 text-green-400 animate-pulse" />
                        Jangkauan Nasional
                    </div>
                </div>

                {/* 2. Headline */}
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 drop-shadow-2xl max-w-4xl leading-[1.1]">
                    Kirim Kargo <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
                        Tanpa Cemas.
                    </span>
                </h1>

                {/* 3. Subheadline */}
                <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-10 max-w-2xl font-light leading-relaxed drop-shadow-md">
                    Platform manajemen logistik B2B untuk pengiriman FTL, LTL, dan Project Cargo. 
                    Cek estimasi harga dalam hitungan detik.
                </p>

                {/* 4. Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 items-center w-full justify-center mb-12">
                    <button 
                        onClick={() => navigate('/simulasi-harga')}
                        className="btn-primary w-full sm:w-auto px-8 flex items-center justify-center gap-2 group shadow-xl shadow-primary/30"
                    >
                        Cek Tarif Sekarang
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
                    </button>

                    <button className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold text-lg transition-all hover:border-white/60">
                        Pelajari Layanan
                    </button>
                </div>

                {/* 5. VOUCHER CARD */}
                <div className="relative group overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-1 max-w-md cursor-pointer transition-all hover:border-primary/50 shadow-2xl" onClick={handleClaimPromo}>
                    <div className="flex items-center gap-4 p-4">
                        <div className="bg-primary/20 p-3 rounded-xl text-primary flex-shrink-0">
                            <TicketPercent size={24} />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2 truncate">
                                {activePromo.title}
                                <span className="bg-red-500 text-[10px] px-1.5 py-0.5 rounded text-white font-extrabold flex-shrink-0">NEW</span>
                            </h3>
                            <p className="text-xs text-gray-400 mt-1 truncate">{activePromo.desc}</p>
                        </div>
                        <div className="px-3 py-1.5 bg-primary rounded-lg text-xs font-bold text-white group-hover:bg-red-600 transition-colors shadow-lg shadow-primary/30">
                            KLAIM
                        </div>
                    </div>
                </div>

                {/* 6. Indikator Slide */}
                <div className="absolute bottom-10 flex gap-3 z-30">
                    {slides.map((_, idx) => (
                        <button 
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            aria-label={`Slide ${idx + 1}`}
                            className={`h-1.5 rounded-full transition-all duration-500 shadow-sm ${
                                idx === currentSlide ? 'w-12 bg-primary' : 'w-2 bg-white/40 hover:bg-white/60'
                            }`}
                        />
                    ))}
                </div>

            </div>
        </div>
    );
};

export default HeroSection;
