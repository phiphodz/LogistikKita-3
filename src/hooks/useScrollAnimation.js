import { useEffect, useRef, useState } from 'react';

// Konfigurasi default Intersection Observer
const config = {
    root: null,
    rootMargin: '0px',
    threshold: 0.2, // 20% dari elemen harus terlihat
};

/**
 * Hook untuk menambahkan animasi fade-in saat elemen masuk ke viewport.
 * @returns {Array} [ref, isVisible]
 * ref: Ref yang harus dipasang ke elemen yang ingin dianimasikan.
 * isVisible: Boolean, true jika elemen sudah terlihat.
 */
const useScrollAnimation = () => {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    // Hentikan pengamatan setelah elemen terlihat
                    observer.unobserve(entry.target);
                }
            });
        }, config);

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                // Pastikan observer dilepas saat komponen di-unmount
                observer.unobserve(ref.current);
            }
        };
    }, []); 

    return [ref, isVisible];
};

export default useScrollAnimation;
