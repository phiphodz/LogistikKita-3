import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { ArrowRight, TicketPercent, Globe } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const HeroSection = ({ darkMode }) => {  // TAMBAHKAN darkMode prop
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
        // FIXED: Background lebih terang di light mode, kurangi padding bottom
        <div className={`relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-blue-50 to-white'} pb-40 md:pb-32 pt-24`}>
            
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
                        index === currentSlide ? 'opacity-30' : 'opacity-0'  // FIXED: opacity lebih rendah
                    }`}
                >
                    <img 
                        src={slide.image} 
                        alt={slide.alt} 
                        className="w-full h-full object-cover object-center"
                    />
                    <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-r from-black/70 via-black/40 to-transparent' : 'bg-gradient-to-r from-white/70 via-white/40 to-transparent'}`}></div>
                </div>
            ))}

            {/* KONTEN UTAMA */}
            <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
                
                {/* Badge */}
                <div className="mb-6 animate-fade-in">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${darkMode ? 'border-white/20 bg-white/10' : 'border-blue-200 bg-blue-100'} backdrop-blur-md text-xs font-bold tracking-widest ${darkMode ? 'text-white' : 'text-blue-800'} uppercase shadow-lg`}>
                        <Globe className="w-3 h-3 text-green-500" />
                        Jangkauan Nasional
                    </div>
                </div>

                {/* Headline - FIXED Typo "Tappa" jadi "Tanpa" */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 drop-shadow-md max-w-4xl leading-[1.1]">
                    <span className={darkMode ? 'text-white' : 'text-gray-900'}>
                        Kirim Kargo <br/>
                    </span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">
                        Tanpa Cemas.
                    </span>
                </h1>

                {/* Subheadline */}
                <p className={`text-base sm:text-lg md:text-xl mb-10 max-w-2xl font-light leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Platform manajemen logistik B2B untuk pengiriman FTL, LTL, dan Project Cargo. 
                    Cek estimasi harga dalam hitungan detik.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 items-center w-full justify-center mb-12">
                    <button 
                        onClick={() => navigate('/simulasi-harga')}
                        className="btn-primary w-full sm:w-auto px-8 flex items-center justify-center gap-2 group shadow-lg"
                    >
                        Cek Tarif Sekarang
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
                    </button>

                    <button className={`w-full sm:w-auto px-8 py-3.5 rounded-xl ${darkMode ? 'bg-white/10 hover:bg-white/20 border-white/30' : 'bg-gray-100 hover:bg-gray-200 border-gray-300'} backdrop-blur-md border font-bold text-lg transition-all`}>
                        Pelajari Layanan
                    </button>
                </div>

                {/* VOUCHER CARD */}
                <div className="relative group overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 to-orange-500/5 backdrop-blur-xl p-1 max-w-md cursor-pointer transition-all hover:border-primary/50 shadow-xl" onClick={handleClaimPromo}>
                    <div className="flex items-center gap-4 p-4">
                        <div className="bg-primary/20 p-3 rounded-xl text-primary flex-shrink-0">
                            <TicketPercent size={24} />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 truncate">
                                Diskon Kargo Lintas Pulau
                                <span className="bg-red-500 text-[10px] px-1.5 py-0.5 rounded text-white font-extrabold">NEW</span>
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
                                Potongan 20% pengiriman Jawa-Bali & Sumatera.
                            </p>
                        </div>
                        <div className="px-3 py-1.5 bg-primary rounded-lg text-xs font-bold text-white group-hover:bg-red-600 transition-colors shadow-lg">
                            KLAIM
                        </div>
                    </div>
                </div>

                {/* Indikator Slide */}
                <div className="absolute bottom-8 flex gap-3 z-30">
                    {slides.map((_, idx) => (
                        <button 
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            aria-label={`Slide ${idx + 1}`}
                            className={`h-1.5 rounded-full transition-all duration-500 shadow-sm ${
                                idx === currentSlide ? 'w-12 bg-primary' : 'w-2 bg-gray-400 hover:bg-gray-600'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
