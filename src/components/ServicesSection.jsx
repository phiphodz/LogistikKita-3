import React from 'react';
import { Truck, Package, Globe, Clock } from 'lucide-react';

const ServicesSection = ({ darkMode }) => {
    const services = [
        { icon: <Truck size={28}/>, title: 'Kargo Darat', desc: 'Pengiriman muatan besar via jalur tol.' },
        { icon: <Globe size={28}/>, title: 'Antar Pulau', desc: 'Jangkauan luas ke seluruh Indonesia.' },
        { icon: <Package size={28}/>, title: 'Pindahan', desc: 'Jasa angkut pindahan rumah & kantor.' },
        { icon: <Clock size={28}/>, title: 'Express', desc: 'Layanan prioritas sampai hari yang sama.' },
    ];

    return (
        <div className="py-8"> {/* Padding diperkecil */}
            <div className="text-center mb-8">
                <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Layanan Kita</h2>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Solusi logistik terintegrasi.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {services.map((srv, i) => (
                    <div key={i} className={`p-5 rounded-2xl border transition hover:-translate-y-1 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100 shadow-sm'}`}>
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-3">
                            {srv.icon}
                        </div>
                        <h3 className={`text-base font-bold mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{srv.title}</h3>
                        <p className={`text-xs leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{srv.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ServicesSection;
