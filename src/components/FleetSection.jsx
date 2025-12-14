import React, { useEffect, useState } from 'react';
import { Scale, Box, Info, ArrowRight } from 'lucide-react';
import FleetDetailModal from './FleetDetailModal';

// Ganti URL ini setiap kali kamu buka Codespace baru dengan nama yang berbeda!
// Jika sudah di-deploy ke Vercel/Netlify, hapus saja URL ini dan biarkan API_URL = '/api/fleets/'
const DJANGO_BASE_URL = 'https://turbo-capybara-7v65qpwg7647hxv7w-8001.app.github.dev'; 
const API_URL = `${DJANGO_BASE_URL}/api/fleets/`;

const FleetSection = ({ darkMode }) => { 
    const [fleets, setFleets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFleet, setSelectedFleet] = useState(null);

    // 1. Logic Fetch Data
    useEffect(() => {
        setLoading(true);
        fetch(API_URL)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Gagal fetch data armada (HTTP status: ${res.status}). Cek apakah Django server aktif di ${DJANGO_BASE_URL}`);
                }
                return res.json();
            })
            .then(data => {
                // Asumsi data bisa berupa array langsung atau objek dengan key 'results'
                const results = data.results || (Array.isArray(data) ? data : []);
                setFleets(results);
            })
            .catch(err => {
                console.error("Err Fetch Fleet:", err);
                setError("Gagal memuat data armada. (Pastikan Server Backend aktif & URL Codespace benar)");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // 2. Logic Perbaiki URL Gambar (PENTING!)
    const getImageUrl = (url) => {
        if (!url) return 'https://via.placeholder.com/400x300/f0f0f0/888888?text=NO+IMAGE';
        
        // 99% gambar di Codespace Django akan muncul di sini:
        if (url.includes('/media/')) {
             return `${DJANGO_BASE_URL}${url}`;
        }
        
        // Fallback
        return url;
    };

    return (
        <div className="py-10" id="fleets">
            <h2 className={`text-3xl font-bold mb-8 text-center ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Pilih Armada Logistik Anda
            </h2>
            
            {/* AREA LOADING DAN ERROR */}
            {loading && (
                <div className={`text-center p-10 rounded-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'} flex items-center justify-center gap-3`}>
                    <Info size={20} className="animate-pulse text-primary"/> Sedang memuat data armada dari Backend...
                </div>
            )}
            
            {error && (
                <div className={`text-center p-10 border border-red-400 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400`}>
                    <p className="font-bold">Error Koneksi Data:</p>
                    <p className="text-sm mt-1">{error}</p>
                </div>
            )}
            
            {/* TAMPILAN FLEET CARD */}
            {(!loading && !error && fleets.length > 0) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {fleets.map((fleet, index) => (
                        <div 
                            key={fleet.id} 
                            // Animasi Fade-In ringan
                            className={`rounded-3xl overflow-hidden border transition duration-500 hover:shadow-2xl hover:scale-[1.01] animate-fade-in`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="h-48 overflow-hidden bg-gray-200 relative">
                                <img 
                                    src={getImageUrl(fleet.image)} 
                                    alt={fleet.name} 
                                    className="w-full h-full object-cover transition duration-500 hover:scale-110"
                                />
                                <span className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">{fleet.fleet_type}</span>
                            </div>
                            <div className={`p-6 ${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`}>
                                <h3 className="font-extrabold text-xl mb-3">{fleet.name}</h3>
                                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm mb-5 opacity-80">
                                    <span className="flex gap-1 items-center font-medium"><Scale size={16}/> Max Beban: {fleet.capacity_display?.split('/')[0] || '-'}</span>
                                    <span className="flex gap-1 items-center font-medium"><Box size={16}/> Volume: {fleet.volume ? fleet.volume + ' CBM' : '-'}</span>
                                </div>
                                <button 
                                    onClick={() => setSelectedFleet(fleet)} 
                                    className="w-full py-3 rounded-xl bg-primary/10 text-primary text-base font-bold hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2"
                                >
                                    Lihat Spesifikasi Lengkap
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            {/* Modal Detail Armada */}
            {selectedFleet && <FleetDetailModal fleet={selectedFleet} onClose={() => setSelectedFleet(null)} darkMode={darkMode} />}
        </div>
    );
};

export default FleetSection;
