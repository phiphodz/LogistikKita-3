// src/pages/HomePage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Search, Package, Truck, ShieldCheck, 
    ArrowRight, CheckCircle2, MapPin, Calendar,
    Loader2, XCircle, Globe, Clock, CheckCircle
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const HomePage = () => {
    const navigate = useNavigate();
    
    // --- STATE PELACAKAN ---
    const [resi, setResi] = useState('');
    const [loading, setLoading] = useState(false);
    const [trackingResult, setTrackingResult] = useState(null);
    const [error, setError] = useState(null);

    // --- CONFIG API (Logic Canggih Kamu) ---
    // PENTING: Masukkan API KEY Gemini kamu di sini nanti ya sayang!
    const API_MODEL = 'gemini-2.0-flash-exp'; // Atau gunakan 'gemini-1.5-flash'
    const API_KEY = ""; // <--- ISI API KEY DI SINI

    // Helper Retry
    const fetchWithRetry = async (url, options, maxRetries = 3) => {
        for (let i = 0; i < maxRetries; i++) {
            try {
                const response = await fetch(url, options);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return await response.json();
            } catch (err) {
                if (i === maxRetries - 1) throw err;
                const delay = Math.pow(2, i) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    };

    // Handler Cari Resi
    const handleSearch = async (e) => {
        e.preventDefault();
        setError(null);
        setTrackingResult(null);
        
        if (!resi.trim()) {
            setError("Mohon masukkan Nomor Resi atau ID Transaksi.");
            return;
        }

        // Cek API Key dulu
        if (!API_KEY) {
            setError("API Key belum dipasang di kodingan, Sayang. 😅");
            return;
        }

        setLoading(true);
        // Prompt Engineering untuk Data Dummy Realistis
        const userQuery = `Lacak status pengiriman untuk nomor resi/ID: ${resi}. Berikan hasil dalam format JSON yang berisi currentStatus, currentLocation, dan timeline (array of objects: {status: string, location: string, time: string}). Buat data realistis untuk pengiriman FTL dari Mojokerto ke Jakarta/Surabaya/Bali.`;
        
        const payload = {
            contents: [{ parts: [{ text: userQuery }] }],
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        currentStatus: { "type": "STRING" },
                        currentLocation: { "type": "STRING" },
                        timeline: {
                            "type": "ARRAY",
                            items: {
                                type: "OBJECT",
                                properties: {
                                    status: { "type": "STRING" },
                                    location: { "type": "STRING" },
                                    time: { "type": "STRING" }
                                }
                            }
                        }
                    }
                }
            }
        };

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${API_MODEL}:generateContent?key=${API_KEY}`;
        
        try {
            const result = await fetchWithRetry(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;
            if (jsonText) {
                setTrackingResult(JSON.parse(jsonText));
            } else {
                setError("Data pelacakan tidak valid atau Resi tidak ditemukan.");
            }
        } catch (err) {
            console.error("Tracking API Error:", err);
            setError("Gagal terhubung ke sistem pelacakan. Coba beberapa saat lagi.");
        } finally {
            setLoading(false);
        }
    };

    // --- DATA LAINNYA ---
    const documentation = [
        { id: 1, title: "Muat Barang Jakarta", date: "12 Des 2025", image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop" },
        { id: 2, title: "Pengiriman Surabaya", date: "10 Des 2025", image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=800&auto=format&fit=crop" },
        { id: 3, title: "Konvoi Armada", date: "08 Des 2025", image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=800&auto=format&fit=crop" },
        { id: 4, title: "Unloading Logistik", date: "05 Des 2025", image: "https://images.unsplash.com/photo-1566576912906-600aceebca9b?q=80&w=800&auto=format&fit=crop" },
    ];

    const services = [
        { icon: <Truck size={40} />, title: "FTL (Full Truck Load)", desc: "Sewa satu truk penuh. Lebih cepat, aman, langsung sampai tujuan tanpa transit." },
        { icon: <Package size={40} />, title: "LTL (Less Truck Load)", desc: "Kirim barang eceran/gabungan. Hemat biaya untuk muatan yang tidak terlalu banyak." },
        { icon: <ShieldCheck size={40} />, title: "Project Cargo", desc: "Penanganan khusus kargo besar (over-dimension) dan alat berat dengan pengawalan." }
    ];

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark">
            <Helmet>
                <title>Logistik Kita | Jasa Pengiriman & Sewa Truk Terpercaya</title>
                <meta name="description" content="Platform logistik digital B2B. Sewa truk, cek ongkir, dan pelacakan real-time." />
            </Helmet>

            {/* 1. HERO SECTION (Gradient Clean - No Image/Animasi) */}
            <section className="relative pt-32 pb-48 md:pt-40 md:pb-64 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-black dark:to-slate-900 z-0"></div>
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-0"></div>

                <div className="relative z-10 max-w-7xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold tracking-widest uppercase mb-6">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Jangkauan Seluruh Indonesia
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                        Kirim Kargo <br className="hidden md:block"/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">
                            Tanpa Cemas.
                        </span>
                    </h1>
                    <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                        Platform manajemen logistik B2B untuk kebutuhan bisnis Anda. Cek harga instan, pesan armada, dan pantau pengiriman dalam satu aplikasi.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button onClick={() => navigate('/simulasi-harga')} className="btn-primary w-full sm:w-auto px-8 flex items-center justify-center gap-2">
                            Cek Tarif Sekarang <ArrowRight size={20} />
                        </button>
                        <button className="px-8 py-3.5 rounded-xl border border-white/30 text-white font-bold hover:bg-white/10 transition-colors w-full sm:w-auto">
                            Pelajari Layanan
                        </button>
                    </div>
                </div>
            </section>

            {/* 2. TRACKING SECTION (FLOATING CARD + LOGIC CANGGIH KAMU) */}
            <section className="relative z-20 -mt-32 px-4 sm:px-6 lg:px-8" id="tracking">
                <div className="max-w-4xl mx-auto glass-container p-6 md:p-10 shadow-2xl bg-white dark:bg-surface-dark border-t-4 border-primary">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-black text-text-main dark:text-text-main-dark">Lacak Pengiriman</h2>
                        <p className="text-text-muted dark:text-text-muted-dark text-sm mt-1">Masukkan Nomor Resi atau ID Transaksi Anda</p>
                    </div>

                    {/* FORM PENCARIAN */}
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative w-full flex-grow">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input 
                                type="text" 
                                placeholder="Contoh: LKG-20258899" 
                                value={resi}
                                onChange={(e) => setResi(e.target.value)}
                                className="input-field pl-12 py-4 text-lg"
                                disabled={loading}
                            />
                        </div>
                        <button type="submit" className="btn-primary md:w-auto px-10 py-4 h-full shadow-lg flex items-center justify-center gap-2" disabled={loading}>
                            {loading ? <Loader2 size={20} className="animate-spin" /> : 'Lacak'}
                        </button>
                    </form>

                    {/* HASIL PELACAKAN (INTEGRASI DARI FILE KAMU) */}
                    {(error || trackingResult) && (
                        <div className="mt-8 animate-fade-in">
                            {error && (
                                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 flex items-center gap-3">
                                    <XCircle size={20} /> {error}
                                </div>
                            )}
                            
                            {trackingResult && (
                                <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-6 border border-gray-100 dark:border-slate-700">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Status Resi</p>
                                            <h4 className="font-extrabold text-2xl text-primary">{resi}</h4>
                                        </div>
                                        <div className="flex items-center gap-3 bg-white dark:bg-slate-700 px-4 py-2 rounded-full shadow-sm">
                                            <Globe size={18} className="text-primary" />
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Lokasi Terkini</p>
                                                <p className="font-bold text-sm text-text-main dark:text-text-main-dark">{trackingResult.currentLocation}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Timeline Component Inline */}
                                    <div className="space-y-6 relative pl-4 border-l-2 border-primary/30 ml-2">
                                        {trackingResult.timeline?.map((item, index) => (
                                            <div key={index} className="relative">
                                                <div className={`absolute -left-[21px] w-8 h-8 rounded-full border-4 border-white dark:border-slate-800 flex items-center justify-center ${index === 0 ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-400'}`}>
                                                    {index === 0 ? <Truck size={14} /> : <CheckCircle size={14} />}
                                                </div>
                                                <div className="ml-6">
                                                    <p className={`font-bold text-base ${index === 0 ? 'text-primary' : 'text-text-main dark:text-text-main-dark'}`}>
                                                        {item.status}
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{item.location}</p>
                                                    <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                                                        <Clock size={12} /> {item.time}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* 3. LAYANAN SECTION */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <span className="text-primary font-bold tracking-wider uppercase text-sm">Layanan Kami</span>
                    <h2 className="text-3xl md:text-4xl font-black text-text-main dark:text-text-main-dark mt-2">Solusi Logistik Terlengkap</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((svc, index) => (
                        <div key={index} className="glass-container p-8 hover:border-primary/50 transition-all hover:-translate-y-1 duration-300 group bg-white/50 dark:bg-surface-dark/50">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                                {svc.icon}
                            </div>
                            <h3 className="text-xl font-bold text-text-main dark:text-text-main-dark mb-3">{svc.title}</h3>
                            <p className="text-text-muted dark:text-text-muted-dark leading-relaxed">{svc.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 4. DOKUMENTASI ARMADA */}
            <section className="py-20 bg-surface-light dark:bg-surface-dark/30 border-y border-border-light dark:border-border-dark">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                        <div>
                            <span className="text-primary font-bold tracking-wider uppercase text-sm">Galeri Aktivitas</span>
                            <h2 className="text-3xl md:text-4xl font-black text-text-main dark:text-text-main-dark mt-2">Dokumentasi Armada</h2>
                            <p className="text-text-muted dark:text-text-muted-dark mt-2">Intip kesibukan armada kami di lapangan.</p>
                        </div>
                        <button className="text-primary font-bold hover:text-primary-hover flex items-center gap-2">Lihat Semua Galeri <ArrowRight size={18}/></button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {documentation.map((item) => (
                            <div key={item.id} className="group relative rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer shadow-lg">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                    <div className="flex items-center gap-2 text-gray-300 text-xs mb-1"><Calendar size={12} /> {item.date}</div>
                                    <h3 className="text-white font-bold text-lg leading-tight">{item.title}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. CTA SECTION */}
            <section className="py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto relative rounded-3xl overflow-hidden shadow-2xl bg-primary text-center p-10 md:p-16">
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Siap Mengirim Barang?</h2>
                        <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">Bergabunglah dengan ribuan pelanggan yang telah mempercayakan pengiriman mereka kepada Logistik Kita.</p>
                        <button onClick={() => navigate('/simulasi-harga')} className="bg-white text-primary px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg">Pesan Armada Sekarang</button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
