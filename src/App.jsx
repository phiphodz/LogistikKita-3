// src/App.jsx (KODE LENGKAP - FINAL ROUTING AUTHENTICATION)

import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // Tambahkan Navigate

// --- KOMPONEN WAJIB ---
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Preloader from './components/Preloader';
import ScrollNav from './components/ScrollNav';
import FirebaseStatus from './components/FirebaseStatus'; // Debugging Firebase

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
// 1. Login Customer (Menggantikan LoginPage lama)
import CustomerLoginPage from './pages/CustomerLoginPage'; 

// 2. Sign Up & Verifikasi Email (Customer)
import CustomerSignupPage from './pages/CustomerSignupPage'; 
import CheckEmailPage from './pages/CheckEmailPage'; 
import VerifyEmailPage from './pages/VerifyEmailPage'; // Memproses token dari email

// 3. Password Recovery
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// 4. Dashboard
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
        const timer = setTimeout(() => setLoading(false), 2000);
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
        <div className="py-12 px-4 max-w-7xl mx-auto">
            <div className="rounded-3xl bg-gradient-to-r from-orange-500 to-red-600 p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                        <h3 className="text-3xl font-black mb-2">Punya Produk untuk diiklankan?</h3>
                        <p className="text-white/90 text-lg">Jangkau ribuan shipper dan transporter di jaringan Logistik Kita.</p>
                    </div>
                    <a href="https://wa.me/6285813487753" target="_blank" rel="noopener noreferrer" className="bg-white text-red-600 font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition shadow-lg whitespace-nowrap">
                        Hubungi Admin
                    </a>
                </div>
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
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
            <div className="animate-fade-in space-y-0">
                <HeroSection darkMode={darkMode} />
                
                {/* PERBAIKAN JARAK DI SINI:
                    -mt-24 : Menarik ke atas (floating)
                    mb-32  : Memberi jarak besar (128px) ke bawah agar tidak menempel dengan Dokumentasi Armada
                */}
                <div className="relative z-30 -mt-24 mb-32">
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
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 py-12">
                    <div id="services" className={`scroll-mt-24 transition-all duration-700 ease-out delay-300 ${getAnimClass(servicesVisible)}`} ref={servicesRef}>
                        <ServicesSection darkMode={darkMode} />
                    </div>
                    
                    <div id="fleets" className={`scroll-mt-24 transition-all duration-700 ease-out delay-400 ${getAnimClass(fleetVisible)}`} ref={fleetRef}>
                        <FleetSection darkMode={darkMode} />
                    </div>
                    
                    <div className={`transition-all duration-700 ease-out delay-500 ${getAnimClass(testiVisible)}`} ref={testiRef}>
                        <TestimonialsSection darkMode={darkMode} />
                    </div>
                    
                    <div id="contact" className={`scroll-mt-24 transition-all duration-700 ease-out delay-600 ${getAnimClass(contactVisible)}`} ref={contactRef}>
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
                <div className="absolute inset-0 bg-[url('/background-lk.jpg')] bg-cover bg-center opacity-5 dark:opacity-5 grayscale"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-background-light/90 via-background-light/50 to-background-light/90 dark:from-background-dark/95 dark:via-background-dark/80 dark:to-background-dark/95"></div>
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
                
                <main className="flex-grow pt-0"> 
                    <Routes>
                        {/* 1. LANDING PAGE */}
                        <Route path="/" element={<LandingPage />} />
                        
                        {/* 2. FITUR UTAMA */}
                        <Route path="/gabung-mitra" element={<MitraRegistrationPage darkMode={darkMode} />} />
                        <Route path="/simulasi-harga" element={<SimulasiHargaPage darkMode={darkMode} />} />
                        
                        {/* 3. AUTHENTICATION (CUSTOMER SHIPPER) */}
                        
                        {/* Halaman Login Customer */}
                        <Route path="/login" element={<CustomerLoginPage />} />
                        
                        {/* Halaman Pendaftaran Customer */}
                        <Route path="/signup/customer" element={<CustomerSignupPage />} />
                        <Route path="/signup/check-email" element={<CheckEmailPage />} />
                        
                        {/* Halaman Verifikasi Email (dari link) - Menggunakan VerifyEmailPage */}
                        {/* Rute ini MENGANDUNG QUERY PARAMETERS (?token=...) */}
                        <Route path="/verify-account" element={<VerifyEmailPage />} /> 

                        {/* Halaman Lupa Password */}
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        {/* Halaman Reset Password (dari link) - MENGANDUNG QUERY PARAMETERS (?uid=...&token=...) */}
                        <Route path="/reset-password" element={<ResetPasswordPage />} /> 
                        
                        {/* 4. DASHBOARD & LAINNYA */}
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/maintenance" element={<MaintenancePage />} />
                        
                        {/* 5. FALLBACK ROUTE */}
                        <Route path="*" element={<MaintenancePage />} />
                    </Routes>
                </main>

                <Footer darkMode={darkMode} />
            </div>

            <FirebaseStatus isReady={isFirebaseReady} error={firebaseError} />
            <ScrollNav darkMode={darkMode} />
        </div>
    );
};

export default App;
