import React from 'react';
import { Star, Quote } from 'lucide-react';

const TestimonialsSection = ({ darkMode }) => {
    return (
        <div className="py-10">
             <div className="text-center max-w-2xl mx-auto mb-16">
                <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Kata Mereka
                </h2>
                {/* FIX WARNA TEXT */}
                <p className={`text-lg transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Geser untuk melihat pengalaman mitra kami.
                </p>
            </div>
            {/* ... (Konten testimonial di bawahnya biarkan saja, pastikan pakai class text-gray-300 untuk dark mode) ... */}
            <div className={`p-8 rounded-3xl border text-center ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100 shadow-xl'}`}>
                <div className="flex justify-center text-yellow-400 mb-4"><Star fill="currentColor"/><Star fill="currentColor"/><Star fill="currentColor"/><Star fill="currentColor"/><Star fill="currentColor"/></div>
                <p className={`text-lg italic mb-6 ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>"Pelayanan sangat cepat dan driver ramah. Sangat membantu pindahan rumah saya."</p>
                <div className="font-bold text-primary">- Budi Santoso</div>
            </div>
        </div>
    );
};

export default TestimonialsSection;
