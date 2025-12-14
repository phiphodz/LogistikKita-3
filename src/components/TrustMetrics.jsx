import React from 'react';
import { Users, Truck, PackageCheck, MousePointerClick } from 'lucide-react';

const logos = [
    "GOJEK", "TOKOPEDIA", "SHOPEE", "LAZADA", "SINARMAS", "MAYORA", 
    "INDOMARCO", "UNILEVER", "GRAB", "BUKALAPAK", "BLIBLI", "JNE"
];

const StatCard = ({ icon, value, label, darkMode }) => (
    <div className={`p-6 rounded-2xl border text-center transition hover:-translate-y-2 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100 shadow-lg'}`}>
        <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
            {icon}
        </div>
        <h3 className={`text-3xl font-black mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{value}</h3>
        <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{label}</p>
    </div>
);

const TrustMetrics = ({ darkMode }) => {
    return (
        <div className={`py-16 ${darkMode ? 'bg-secondary' : 'bg-gray-50'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* 1. BAGIAN STATISTIK (REQUEST POIN 5) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
                    <StatCard darkMode={darkMode} icon={<MousePointerClick />} value="15k+" label="Pengunjung Website" />
                    <StatCard darkMode={darkMode} icon={<Truck />} value="250+" label="Mitra Armada" />
                    <StatCard darkMode={darkMode} icon={<Users />} value="400+" label="Mitra Driver" />
                    <StatCard darkMode={darkMode} icon={<PackageCheck />} value="1.2k+" label="Pesanan Selesai" />
                </div>

                {/* 2. BAGIAN LOGO PARTNER (ANIMASI LAMBAT) */}
                <div className="text-center mb-10">
                    <p className={`text-sm font-bold tracking-widest uppercase ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        Dipercaya Oleh Market Leader Indonesia
                    </p>
                </div>

                <div className="relative w-full overflow-hidden">
                    {/* duration-10000 agar lambat & smooth */}
                    <div className="flex w-max animate-scroll gap-16 items-center" style={{ animationDuration: '30s' }}>
                        {[...logos, ...logos].map((logo, index) => (
                            <h3 key={index} className={`text-3xl font-black opacity-30 hover:opacity-100 transition-opacity cursor-default flex-shrink-0 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                {logo}
                            </h3>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TrustMetrics;
