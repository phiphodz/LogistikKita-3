import React from 'react';

const Carousel = ({ darkMode }) => (
    <div className="py-20 px-4">
        <div className="max-w-7xl mx-auto rounded-[2.5rem] overflow-hidden relative h-64 md:h-80 shadow-2xl group">
            <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80" alt="Promo" className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-transparent flex flex-col justify-center px-8 md:px-16 text-white">
                <span className="bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full w-fit mb-4 animate-pulse">PROMO SPESIAL</span>
                <h2 className="text-3xl md:text-5xl font-bold mb-4">Diskon Ongkir 20%</h2>
                <p className="text-gray-300 max-w-md mb-8">Khusus pengiriman pertama ke seluruh Jawa Timur. Gunakan kode: <strong>MOJOKERTO20</strong></p>
                {/* FIX KONTRAST: Tombol putih, teksnya merah primary */}
                <button className="bg-white text-primary px-6 py-3 rounded-xl font-bold w-fit hover:bg-gray-100 transition">Klaim Sekarang</button>
            </div>
        </div>
    </div>
);
export default Carousel;
