import React from 'react';
import { Plane, Ship, Truck, Box, Zap, Map } from 'lucide-react';

const serviceCards = [
    {
        icon: Truck,
        title: 'Pengiriman Darat (Road Freight)',
        description: 'Layanan utama kami untuk pengiriman skala besar maupun kecil di seluruh pulau Jawa, Bali, dan Sumatera. Cepat, aman, dan terjangkau.',
        delay: '0.1s'
    },
    {
        icon: Plane,
        title: 'Pengiriman Udara (Air Cargo)',
        description: 'Solusi untuk barang yang membutuhkan kecepatan tinggi, melayani rute domestik dan internasional. Prioritas untuk kargo sensitif waktu.',
        delay: '0.2s'
    },
    {
        icon: Ship,
        title: 'Pengiriman Laut (Sea Freight)',
        description: 'Layanan FCL (Full Container Load) dan LCL (Less than Container Load) untuk efisiensi biaya pengiriman antar pulau dan internasional.',
        delay: '0.3s'
    },
    {
        icon: Box,
        title: 'Gudang & Distribusi',
        description: 'Fasilitas gudang modern di Mojokerto dengan sistem manajemen inventaris terintegrasi, siap mendukung rantai pasok Anda.',
        delay: '0.4s'
    },
    {
        icon: Zap,
        title: 'Last-Mile Express',
        description: 'Pengiriman cepat (satu hari sampai) untuk area Mojokerto, Surabaya, dan Malang. Cocok untuk kebutuhan e-commerce dan mendesak.',
        delay: '0.5s'
    },
    {
        icon: Map,
        title: 'Tracking Real-Time',
        description: 'Sistem pelacakan GPS terintegrasi yang memungkinkan Anda memantau lokasi kiriman secara akurat, 24 jam sehari.',
        delay: '0.6s'
    },
];

const Services = () => {
    return (
        <section id="services" className="py-16 sm:py-24 bg-gray-50 dark:bg-zinc-950">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-4xl font-extrabold text-center mb-4 text-[var(--color-dark)] dark:text-white reveal-item">
                    Layanan Logistik Unggulan
                </h2>
                <p className="text-center text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto reveal-item">
                    Kami menawarkan berbagai solusi pengiriman yang dapat disesuaikan dengan kebutuhan spesifik bisnis Anda.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {serviceCards.map((card, index) => (
                        <div 
                            key={index} 
                            className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg hover:shadow-2xl border border-gray-100 dark:border-zinc-800 transition-all duration-300 transform hover:-translate-y-1 reveal-item"
                            style={{ animationDelay: card.delay }}
                        >
                            <div className="flex items-center space-x-4 mb-4">
                                <card.icon className="w-8 h-8 text-[var(--color-primary)] p-1.5 bg-[var(--color-primary)]/10 rounded-lg" />
                                <h3 className="text-xl font-bold text-[var(--color-dark)] dark:text-white">
                                    {card.title}
                                </h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-base">
                                {card.description}
                            </p>
                        </div>
                    ))}
                </div>
                
                <div className="text-center mt-16 reveal-item" style={{ animationDelay: '0.7s' }}>
                    <a 
                        href="#contact-us" 
                        className="inline-flex items-center px-8 py-3 bg-[var(--color-primary)] text-gray-900 font-bold rounded-full hover:bg-[var(--color-primary-dark)] transition-all duration-300 shadow-xl"
                    >
                        Konsultasikan Kebutuhan Anda
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Services;

