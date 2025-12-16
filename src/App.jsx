// src/App.jsx (KODE LENGKAP - DENGAN DEBUG INFO)

import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

// --- KOMPONEN WAJIB ---
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Preloader from './components/Preloader';
import ScrollNav from './components/ScrollNav';
import FirebaseStatus from './components/FirebaseStatus';
import DebugInfo from './components/DebugInfo'; // ✅ DEBUG INFO BARU

// --- KOMPONEN LANDING PAGE ---
import HeroSection from './components/HeroSection';
import TrackingSection from './components/TrackingSection';
import GallerySection from './components/GallerySection';
import TrustMetrics from './components/TrustMetrics';
import ServicesSection from './components/ServicesSection';
import FleetSection from './components/FleetSection';
import TestimonialsSection from './components/TestimonialsSection';
import ContactUs from './components/ContactUs';

// --- HALAMAN (PAGES) ---
import MitraRegistrationPage from './components/mitra/MitraRegistrationPage';
import MaintenancePage from './pages/MaintenancePage'; 
import SimulasiHargaPage from './pages/SimulasiHargaPage'; 

// --- AUTHENTICATION PAGES ---
import CustomerLoginPage from './pages/CustomerLoginPage'; 
import CustomerSignupPage from './pages/CustomerSignupPage'; 
import CheckEmailPage from './pages/CheckEmailPage'; 
import VerifyEmailPage from './pages/VerifyEmailPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';

// --- HOOKS ---
import useScrollAnimation from './hooks/useScrollAnimation';

const App = () => {
    // STATE LOADING & THEME
    const [loading, setLoading] = useState(true);
    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark' || 
                   (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });

    // DUMMY STATE 
    const [isFirebaseReady] = useState(true); 
    const [firebaseError] = useState(null); 
    const [db] = useState(null);

    // EFFECT: Loading Screen
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1200);
        return () => clearTimeout(timer);
    }, []);

    // EFFECT: Pasang Class 'dark' ke HTML
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    const toggleTheme = () => setDarkMode(!darkMode);

    // --- COMPONENT BANNER IKLAN ---
    const PromoBanner = () => (
        <div className="py-8 px-4 max-w-7xl mx-auto">
            <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 p-6 md:p-8 text-white relative overflow-hidden shadow-xl">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-center md:text-left">
                        <h3 className="text-xl md:text-2xl font-black mb-2">Punya Produk untuk diiklankan?</h3>
                        <p className="text-white/90 text-sm md:text-base">
                            Jangkau ribuan shipper dan transporter di jaringan Logistik Kita.
                        </p>
                    </div>
                    <a 
                        href="https://wa.me/6285813487753" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="bg-white text-red-600 font-bold px-5 py-2.5 rounded-full hover:bg-gray-100 transition shadow-lg whitespace-nowrap text-sm md:text-base"
                    >
                        Hubungi Admin
                    </a>
                </div>
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-black/10 rounded-full blur-xl"></div>
            </div>
        </div>
    );
    
    // LAYOUT LANDING PAGE
    const LandingPage = () => {
        const [galleryRef, galleryVisible] = useScrollAnimation();
        const [promoRef, promoVisible] = useScrollAnimation();
        const [trustRef, trustVisible] = useScrollAnimation();
        const [servicesRef, servicesVisible] = useScrollAnimation();
        const [fleetRef, fleetVisible] = useScrollAnimation();
        const [testiRef, testiVisible] = useScrollAnimation();
        const [contactRef, contactVisible] = useScrollAnimation();
        
        const getAnimClass = (isVisible) => 
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10';
    
        return (
            <div className="animate-fade-in">
                <HeroSection darkMode={darkMode} />
                
                {/* PERBAIKAN BESAR: HAPUS SEMUA MARGIN NEGATIF */}
                <div className="relative z-20 mt-0">
                    <TrackingSection darkMode={darkMode} />
                </div>
    
                <div ref={galleryRef} className={`transition-all duration-700 ease-out ${getAnimClass(galleryVisible)}`}>
                    <GallerySection />
                </div>
                
                <div ref={promoRef} className={`transition-all duration-700 ease-out delay-100 ${getAnimClass(promoVisible)}`}>
                    <PromoBanner />
                </div>
    
                <div ref={trustRef} className={`transition-all duration-700 ease-out delay-200 ${getAnimClass(trustVisible)}`}>
                    <TrustMetrics darkMode={darkMode} />
                </div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 py-8">
                    <div id="services" className={`scroll-mt-20 transition-all duration-700 ease-out delay-300 ${getAnimClass(servicesVisible)}`} ref={servicesRef}>
                        <ServicesSection darkMode={darkMode} />
                    </div>
                    
                    <div id="fleets" className={`scroll-mt-20 transition-all duration-700 ease-out delay-400 ${getAnimClass(fleetVisible)}`} ref={fleetRef}>
                        <FleetSection darkMode={darkMode} />
                    </div>
                    
                    <div className={`transition-all duration-700 ease-out delay-500 ${getAnimClass(testiVisible)}`} ref={testiRef}>
                        <TestimonialsSection darkMode={darkMode} />
                    </div>
                    
                    <div id="contact" className={`scroll-mt-20 transition-all duration-700 ease-out delay-600 ${getAnimClass(contactVisible)}`} ref={contactRef}>
                        <ContactUs db={db} darkMode={darkMode} />
                    </div>
                </div>
            </div>
        );
    };

    if (loading) return <Preloader loading={loading} />;

    return (
        <div className="min-h-screen font-sans transition-colors duration-300 ease-in-out bg-background-light dark:bg-background-dark text-text-main dark:text-text-main-dark">
            
            {/* BACKGROUND DECORATION */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-[url('/background-lk.jpg')] bg-cover bg-center opacity-[0.02] dark:opacity-[0.03] grayscale"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-background-light/80 via-background-light/40 to-background-light/80 dark:from-background-dark/85 dark:via-background-dark/60 dark:to-background-dark/85"></div>
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
                
                <main className="flex-grow">
                    <Routes>
                        {/* 1. LANDING PAGE */}
                        <Route path="/" element={<LandingPage />} />
                        
                        {/* 2. FITUR UTAMA */}
                        <Route path="/gabung-mitra" element={<MitraRegistrationPage darkMode={darkMode} />} />
                        <Route path="/simulasi-harga" element={<SimulasiHargaPage darkMode={darkMode} />} />
                        
                        {/* 3. AUTHENTICATION */}
                        <Route path="/login" element={<CustomerLoginPage />} />
                        <Route path="/signup/customer" element={<CustomerSignupPage />} />
                        <Route path="/signup/check-email" element={<CheckEmailPage />} />
                        <Route path="/verify-account" element={<VerifyEmailPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/reset-password" element={<ResetPasswordPage />} />
                        
                        {/* 4. DASHBOARD & LAINNYA */}
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/maintenance" element={<MaintenancePage />} />
                        <Route path="/tracking/demo" element={<MaintenancePage />} />
                        
                        {/* 5. FALLBACK ROUTE */}
                        <Route path="*" element={<MaintenancePage />} />
                    </Routes>
                </main>

                <Footer darkMode={darkMode} />
            </div>

            {/* KOMPONEN FIXED */}
            <FirebaseStatus isReady={isFirebaseReady} error={firebaseError} />
            <ScrollNav darkMode={darkMode} />
            
            {/* ✅ DEBUG INFO - TAMBAH DI SINI */}
            <DebugInfo />
            
        </div>
    );
};

export default App;
