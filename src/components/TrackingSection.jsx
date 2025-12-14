// src/components/TrackingSection.jsx

import React, { useState } from 'react';
import { Search, Loader2, Truck, CheckCircle, Clock, Globe, XCircle, MapPin } from 'lucide-react';

const TrackingSection = ({ darkMode }) => {
    const [resi, setResi] = useState('');
    const [loading, setLoading] = useState(false);
    const [trackingResult, setTrackingResult] = useState(null);
    const [error, setError] = useState(null);
    
    const API_MODEL = 'gemini-2.0-flash-exp'; 
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY; 

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

    const handleSearch = async (e) => {
        e.preventDefault();
        setError(null);
        setTrackingResult(null);
        
        if (!resi.trim()) {
            setError("Mohon masukkan Nomor Resi atau ID Transaksi.");
            return;
        }

        if (!API_KEY) {
            setError("API Key tidak ditemukan. Pastikan file .env menggunakan format VITE_GEMINI_API_KEY");
            return;
        }

        setLoading(true);

        const userQuery = `Lacak status pengiriman untuk nomor resi/ID: ${resi}. Berikan hasil dalam format JSON yang berisi currentStatus, currentLocation, dan timeline (array of objects: {status: string, location: string, time: string}). Buat data realistis untuk pengiriman FTL dari Mojokerto ke Jakarta/Surabaya/Luar Pulau.`;
        
        const payload = {
            contents: [{ parts: [{ text: userQuery }] }],
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        currentStatus: { type: "STRING" },
                        currentLocation: { type: "STRING" },
                        timeline: {
                            type: "ARRAY",
                            items: {
                                type: "OBJECT",
                                properties: {
                                    status: { type: "STRING" },
                                    location: { type: "STRING" },
                                    time: { type: "STRING" }
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
                setError("Data tidak ditemukan atau format salah.");
            }
        } catch (err) {
            console.error("Tracking API Error:", err);
            setError("Gagal terhubung ke sistem pelacakan.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative z-20">
            <div className="w-full max-w-4xl mx-auto px-4 -mt-24" id="tracking">
                <div className="glass-container p-6 md:p-10 shadow-2xl bg-white/90 dark:bg-surface-dark border-t-4 border-primary backdrop-blur-xl transition-all duration-300">
                    
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-black text-text-main dark:text-white">
                            Lacak Status Pengiriman
                        </h2>
                        <p className="text-text-muted dark:text-gray-400 text-sm mt-1">
                            Masukkan Nomor Resi atau ID Transaksi Anda
                        </p>
                    </div>
                    
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative w-full flex-grow">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                            <input 
                                type="text" 
                                value={resi}
                                onChange={(e) => setResi(e.target.value)}
                                placeholder="Contoh: LKG-8829100" 
                                className="input-field pl-12 py-4 text-lg bg-white dark:bg-black/20"
                                disabled={loading}
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="btn-primary md:w-auto px-10 py-4 h-full shadow-lg flex items-center justify-center gap-2"
                            disabled={loading}
                        >
                            {loading ? <Loader2 size={20} className="animate-spin" /> : 'Lacak'}
                        </button>
                    </form>

                    {(error || trackingResult) && (
                        <div className="mt-8 animate-fade-in border-t border-gray-200 dark:border-gray-700 pt-8">
                            {error && (
                                <div className="flex items-center gap-3 text-red-500 bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-800">
                                    <XCircle size={20} />
                                    <span className="font-medium">{error}</span>
                                </div>
                            )}
                            
                            {trackingResult && (
                                <div className="bg-gray-50 dark:bg-black/20 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
                                    {/* seluruh isi timeline TETAP */}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrackingSection;
