import React from 'react';
import { X, Truck, Box, Scale, Ruler } from 'lucide-react';

const FleetDetailModal = ({ fleet, onClose, darkMode }) => {
    if (!fleet) return null;

    return (
        // Ganti 'fixed inset-0' dengan flex container yang lebih aman
        <div className="fixed top-0 left-0 w-full h-full z-[9999] flex items-center justify-center p-4">
            
            {/* Backdrop Gelap Pekat (Tanpa Blur agar ringan di HP) */}
            <div 
                className="absolute top-0 left-0 w-full h-full bg-black/90 transition-opacity" 
                onClick={onClose}
            ></div>

            {/* Konten Modal - Gunakan max-height dan overflow-y-auto */}
            <div className={`relative w-full max-w-lg rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh] p-6 md:p-8 border z-10 ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-white text-slate-900'}`}>
                
                {/* Header: Nama Armada */}
                <div className="flex justify-between items-start mb-6 sticky top-0 pt-2 bg-inherit z-20">
                    <div>
                        <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
                            {fleet.fleet_type}
                        </span>
                        <h2 className="text-2xl md:text-3xl font-bold">{fleet.name}</h2>
                    </div>
                    <button onClick={onClose} className={`p-2 rounded-full shrink-0 ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
                        <X size={24} />
                    </button>
                </div>

                {/* Spesifikasi (Grid) */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className={`p-4 rounded-2xl ${darkMode ? 'bg-slate-700' : 'bg-blue-50'}`}>
                        <div className="flex items-center gap-2 mb-1 opacity-70">
                            <Scale size={16} /> <span className="font-bold text-xs uppercase">Kapasitas</span>
                        </div>
                        <p className="text-lg font-bold">{fleet.capacity_display?.split('/')[0] || '-'}</p>
                    </div>
                    <div className={`p-4 rounded-2xl ${darkMode ? 'bg-slate-700' : 'bg-blue-50'}`}>
                        <div className="flex items-center gap-2 mb-1 opacity-70">
                            <Box size={16} /> <span className="font-bold text-xs uppercase">Volume</span>
                        </div>
                        <p className="text-lg font-bold">{fleet.volume ? `${fleet.volume} CBM` : '-'}</p>
                    </div>
                </div>

                {/* Dimensi */}
                {fleet.dimension && (
                    <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 ${darkMode ? 'border-slate-600 bg-slate-900/50' : 'border-gray-200 bg-gray-50'}`}>
                        <Ruler size={20} className="text-primary"/>
                        <div>
                            <h4 className="font-bold text-xs uppercase opacity-70">Dimensi Box / Bak</h4>
                            <p className="font-mono font-medium">{fleet.dimension}</p>
                        </div>
                    </div>
                )}

                {/* Deskripsi */}
                <div className="mb-8">
                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                        <Truck size={20} className="text-primary"/> Deskripsi Unit
                    </h3>
                    <p className={`leading-relaxed text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {fleet.description || 'Tidak ada deskripsi detail untuk armada ini.'}
                    </p>
                </div>

                {/* Tombol Tutup */}
                <button 
                    onClick={onClose}
                    className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-red-700 transition shadow-lg shadow-primary/30"
                >
                    Tutup Detail
                </button>
            </div>
        </div>
    );
};

export default FleetDetailModal;
