// src/components/GallerySection.jsx

import React from 'react';
import { Camera } from 'lucide-react';

const GallerySection = () => {
    const gallery = [
        "https://images.unsplash.com/photo-1566576912904-60017581a101?q=80&w=500",
        "https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=500",
        "https://images.unsplash.com/photo-1605218427306-6354db69e563?q=80&w=500",
        "https://images.unsplash.com/photo-1513828742140-ccaa28f3eda0?q=80&w=500",
        "https://images.unsplash.com/photo-1616432043562-3671ea2e5242?q=80&w=500",
    ];

    return (
        <section className="pt-32 py-10 bg-neutral dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 mb-6 flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Camera size={20} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-secondary dark:text-white">
                        Dokumentasi Armada
                    </h3>
                    <p className="text-xs text-gray-500">
                        Aktivitas pengiriman terbaru kami
                    </p>
                </div>
            </div>

            {/* Carousel Scroll Samping */}
            <div className="flex overflow-x-auto gap-4 px-4 pb-4 no-scrollbar snap-x snap-mandatory">
                {gallery.map((img, idx) => (
                    <div
                        key={idx}
                        className="snap-center flex-shrink-0 w-72 h-48 rounded-xl overflow-hidden relative group cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                    >
                        <img 
                            src={img} 
                            alt={`Dokumentasi ${idx}`} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-xs font-bold border border-white/50 px-3 py-1 rounded-full backdrop-blur-sm">
                                Lihat Detail
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default GallerySection;
