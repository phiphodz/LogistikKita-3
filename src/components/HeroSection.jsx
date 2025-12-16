import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { ArrowRight, TicketPercent, Globe } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const HeroSection = ({ darkMode }) => {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);

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
                navigate('/signup/customer');
            }
        }
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000); 
        return () => clearInterval(timer);
    }, [slides.length]);

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
        // PERBAIKAN: Kurangi padding top (pt-16 bukan pt-24), tambah min-height
        <div className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 pt-16 pb-20">
            
            <Helmet>
                <title>Logistik Kita | Indonesia Freight Forwarding Network</title>
                <meta name="description" content="Platform logistik digital B2B terpercaya di Indonesia. Melayani sewa truk (Trucking), distribusi kargo antar pulau, dan manajemen rantai pasok." />
                <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
            </Helmet>

            {/* BACKGROUND CAROUSEL */}
            {slides.map((slide, index) => (
                <div 
                    key={slide.id}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                        index === currentSlide ? 'opacity-50' : 'opacity-0'
                    }`}
                >
                    <img 
                        src={slide.image} 
                        alt={slide.alt} 
                        className="w-full h-full object-cover object-center"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/50"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                </div>
            ))}

            {/* KONTEN UTAMA */}
            <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center w-full">
                
                {/* Badge */}
                <div className="mb-4 sm:mb-6 animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-md text-xs font-bold tracking-widest text-white uppercase shadow-lg">
                        <Globe className="w-3 h-3 text-green-400" />
                        <span className="text-xs sm:text-sm">Jangkauan Nasional</span>
                    </div>
                </div>

                {/* Headline - PERBAIKAN: Pastikan "Tanpa" bukan "Tampa" */}
                <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-4 sm:mb-6 drop-shadow-2xl max-w-4xl leading-[1.1]">
                    Kirim Kargo 
                    <span className="block mt-1 sm:mt-2">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
                            Tanpa Cemas.
                        </span>
                    </span>
                </h1>

                {/* Subheadline */}
                <p className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-200 mb-6 sm:mb-10 max-w-2xl font-normal leading-relaxed drop-shadow-md px-2">
                    Platform manajemen logistik B2B untuk pengiriman FTL, LTL, dan Project Cargo.<br className="hidden sm:block" />
                    Cek estimasi harga dalam hitungan detik.
                </p>

                {/* Action Buttons - PERBAIKAN: "Pelajari" bukan "Pelajarī" */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center w-full max-w-md sm:max-w-none justify-center mb-8 sm:mb-12 px-2">
                    <button 
                        onClick={() => navigate('/simulasi-harga')}
                        className="btn-primary w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 flex items-center justify-center gap-2 group shadow-xl shadow-primary/30 text-sm sm:text-base"
                    >
                        Cek Tarif Sekarang
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button 
                        onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                        className="w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold text-sm sm:text-base transition-all hover:border-white/60 active:scale-95"
                    >
                        Pelajari Layanan
                    </button>
                </div>

                {/* VOUCHER CARD */}
                <div 
                    className="relative group overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-black/50 backdrop-blur-xl p-1 max-w-xs xs:max-w-sm sm:max-w-md cursor-pointer transition-all hover:border-primary/50 shadow-2xl active:scale-95 mb-8"
                    onClick={handleClaimPromo}
                >
                    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4">
                        <div className="bg-primary/20 p-2 sm:p-3 rounded-lg sm:rounded-xl text-primary flex-shrink-0">
                            <TicketPercent size={20} className="sm:w-6 sm:h-6" />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                            <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1 sm:gap-2 truncate">
                                {activePromo.title}
                                <span className="bg-red-500 text-[9px] xs:text-[10px] px-1.5 py-0.5 rounded text-white font-extrabold flex-shrink-0">
                                    NEW
                                </span>
                            </h3>
                            <p className="text-[10px] xs:text-xs text-gray-300 mt-0.5 sm:mt-1 truncate">
                                {activePromo.desc}
                            </p>
                        </div>
                        <div className="px-2 sm:px-3 py-1.5 bg-primary rounded-lg text-xs font-bold text-white group-hover:bg-red-600 transition-colors shadow-lg shadow-primary/30 whitespace-nowrap">
                            KLAIM
                        </div>
                    </div>
                </div>

                {/* Indikator Slide - PERBAIKAN: Naikkan lebih tinggi */}
                <div className="absolute bottom-20 sm:bottom-24 flex gap-2 sm:gap-3 z-30">
                    {slides.map((_, idx) => (
                        <button 
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            aria-label={`Slide ${idx + 1}`}
                            className={`h-1.5 rounded-full transition-all duration-500 shadow-sm ${
                                idx === currentSlide 
                                    ? 'w-8 sm:w-12 bg-primary' 
                                    : 'w-2 sm:w-2 bg-white/40 hover:bg-white/60'
                            }`}
                        />
                    ))}
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 sm:bottom-12 animate-bounce">
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
