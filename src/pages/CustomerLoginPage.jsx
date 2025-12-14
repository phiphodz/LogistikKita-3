// src/pages/CustomerLoginPage.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ENDPOINTS } from '../apiConfig';
import { Eye, EyeOff, Truck, ArrowLeft } from 'lucide-react'; 
import { Helmet } from 'react-helmet-async';

const CustomerLoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [logoError, setLogoError] = useState(false); 

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // 1. Frontend Validation
        if (!formData.username || !formData.password) {
            setError('Nomor WA dan Password wajib diisi.');
            setLoading(false);
            return;
        }

        try {
            // Menggunakan ENDPOINTS.LOGIN (generik token)
            const response = await fetch(ENDPOINTS.LOGIN, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                // SUCCESS: Simpan Token dan Redirect
                localStorage.setItem('accessToken', data.access);
                localStorage.setItem('refreshToken', data.refresh);
                localStorage.setItem('userWA', formData.username);
                navigate('/dashboard');
            } else {
                // PROFESIONAL ERROR HANDLING
                if (response.status === 401) {
                    setError('Nomor WA atau Password salah. Cek kembali input Anda.');
                } else if (response.status === 403) {
                     // 403: Forbidden (Kemungkinan akun non-aktif / Belum Verifikasi Email)
                     setError('Akun Anda belum aktif. Silakan cek email Anda untuk verifikasi.');
                } else {
                    setError(data.detail || 'Gagal login. Cek kembali data Anda.');
                }
            }
        } catch (err) {
            setError('Gagal menghubungi server. Cek koneksi internet Anda.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-24 min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            <Helmet><title>Login Customer | Logistik Kita</title></Helmet>
             
             {/* Hiasan Background */}
             <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-50 dark:opacity-30"></div>
             <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none opacity-50 dark:opacity-30"></div>

            <div className="glass-container p-8 md:p-10 w-full max-w-md relative z-10 animate-fade-in">

                {/* --- LOGO FIXED --- */}
                <div className="flex flex-col items-center justify-center mb-8">
                    {/* ... (Logo Code) ... */}
                    <div className="relative w-20 h-20 rounded-lg flex items-center justify-center mb-4 overflow-hidden border-2 border-transparent">
                        <div className="absolute inset-0 w-full h-full animate-logo-neon rounded-lg"></div>
                        {logoError ? (
                            <Truck size={40} className="text-primary relative z-10" />
                        ) : (
                            <img
                                src="/Logistik-Kita.png" 
                                alt="Logo Logistik Kita"
                                className="w-full h-full object-contain rounded-lg p-1 relative z-10 bg-surface-light dark:bg-background-dark" 
                                onError={() => setLogoError(true)} 
                            />
                        )}
                    </div>
                    <h2 className="text-3xl font-black text-center tracking-tight leading-none text-text-main dark:text-text-main-dark">
                        <span className="text-primary">LOGISTIK</span>
                        <span className="text-text-main dark:text-text-main-dark">KITA</span>
                    </h2>
                    <p className="text-text-muted dark:text-text-muted-dark text-sm font-bold tracking-[0.3em] mt-1">CUSTOMER LOGIN</p>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 p-4 rounded-xl mb-6 text-center text-sm font-bold border border-red-100 dark:border-red-800/50 flex items-center justify-center gap-2">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="input-label">Nomor WhatsApp</label>
                        <input
                            type="text" name="username"
                            value={formData.username} onChange={handleChange}
                            className="input-field"
                            placeholder="Contoh: 081234567890" required
                            inputMode="numeric"
                        />
                    </div>

                    <div>
                        <label className="input-label">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password} onChange={handleChange}
                                className="input-field pr-12" 
                                placeholder="Masukkan password Anda" required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                    
                    {/* --- LINK LUPA PASSWORD --- */}
                    <p className="text-right text-sm">
                        <Link 
                            to="/forgot-password" 
                            className="font-semibold text-text-muted hover:text-primary transition-colors"
                        >
                            Lupa Password?
                        </Link>
                    </p>


                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? 'Memproses...' : 'Masuk Dashboard'}
                    </button>
                </form>

                {/* --- NAVIGASI PENDAFTARAN (Customer & Mitra) --- */}
                <p className="mt-8 text-center text-sm text-text-muted dark:text-text-muted-dark font-medium">
                    Belum punya akun? 
                    <Link to="/signup/customer" className="font-bold text-primary hover:underline ml-1">
                        Daftar Akun Customer
                    </Link>
                    <span className="mx-2 text-text-muted/50">|</span>
                    <Link to="/gabung-mitra" className="font-bold text-blue-500 hover:underline">
                        Daftar Mitra Driver
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default CustomerLoginPage;
