// src/pages/CustomerLoginPage.jsx (UPDATED VERSION)

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ENDPOINTS } from '../apiConfig';
import { Eye, EyeOff, Truck, Mail, Phone, Loader2, AlertCircle, Check, Shield, HelpCircle } from 'lucide-react'; 
import { Helmet } from 'react-helmet-async';
import { AppConfig } from '../config/AppConfig';

const CustomerLoginPage = () => {
    const navigate = useNavigate();
    const [loginMethod, setLoginMethod] = useState('phone'); // 'phone' atau 'email'
    const [formData, setFormData] = useState({ 
        identifier: '', // Bisa email atau nomor WA
        password: '' 
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [logoError, setLogoError] = useState(false);
    const [unverifiedEmail, setUnverifiedEmail] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
        if (unverifiedEmail) setUnverifiedEmail('');
    };

    const handleResendVerification = async () => {
        if (!unverifiedEmail) return;
        
        try {
            const response = await fetch(ENDPOINTS.CUSTOMER_RESEND_VERIFICATION, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: unverifiedEmail })
            });

            if (response.ok) {
                setSuccess(`Email verifikasi telah dikirim ulang ke ${unverifiedEmail}`);
                setUnverifiedEmail('');
            } else {
                const data = await response.json();
                setError(data.detail || 'Gagal mengirim ulang verifikasi. Coba lagi.');
            }
        } catch (err) {
            setError('Gagal menghubungi server.');
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        setUnverifiedEmail('');

        // 1. Validasi
        if (!formData.identifier || !formData.password) {
            setError(`${loginMethod === 'phone' ? 'Nomor WA' : 'Email'} dan Password wajib diisi.`);
            setLoading(false);
            return;
        }

        // Validasi format
        if (loginMethod === 'email' && !formData.identifier.includes('@')) {
            setError('Format email tidak valid.');
            setLoading(false);
            return;
        }

        if (loginMethod === 'phone' && !/^[0-9]+$/.test(formData.identifier)) {
            setError('Format nomor WhatsApp tidak valid (hanya angka).');
            setLoading(false);
            return;
        }

        // Payload sesuai Django expectation
        const payload = {
            username: formData.identifier, // Django expect 'username' field
            password: formData.password
        };

        try {
            const response = await fetch(ENDPOINTS.LOGIN, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                // 🚀 SUCCESS: Simpan semua token
                localStorage.setItem('accessToken', data.access);
                localStorage.setItem('refreshToken', data.refresh);
                localStorage.setItem('userIdentifier', formData.identifier);
                localStorage.setItem('userType', 'customer');
                
                // Tampilkan success message
                setSuccess('Login berhasil! Mengarahkan ke dashboard...');
                
                // Delay sebelum redirect
                setTimeout(() => {
                    navigate('/dashboard', { replace: true });
                }, 1000);
                
            } else {
                // ERROR HANDLING
                switch (response.status) {
                    case 401:
                        setError('Email/Nomor WA atau Password salah. Cek kembali input Anda.');
                        break;
                        
                    case 403:
                        // Akun belum aktif / belum verifikasi
                        if (data.detail && (data.detail.includes('verifikasi') || data.detail.includes('aktif'))) {
                            const emailToVerify = loginMethod === 'email' ? formData.identifier : '';
                            setUnverifiedEmail(emailToVerify);
                            setError(
                                <div className="space-y-2">
                                    <p className="font-medium">Akun Anda belum diverifikasi!</p>
                                    <p className="text-sm">Silakan cek email Anda untuk link verifikasi.</p>
                                    {emailToVerify && (
                                        <button
                                            type="button"
                                            onClick={handleResendVerification}
                                            className="mt-2 text-sm font-bold text-primary hover:underline flex items-center gap-1"
                                        >
                                            <Mail size={14} />
                                            Kirim ulang email verifikasi
                                        </button>
                                    )}
                                </div>
                            );
                        } else {
                            setError('Akun Anda belum aktif. Silakan hubungi support.');
                        }
                        break;
                        
                    case 400:
                        // Validation errors
                        const errorMsg = data.detail || 
                                        data.non_field_errors?.[0] || 
                                        (data.username && data.username[0]) ||
                                        'Permintaan tidak valid';
                        setError(`Validasi gagal: ${errorMsg}`);
                        break;
                        
                    case 429:
                        setError('Terlalu banyak percobaan login. Coba lagi dalam beberapa menit.');
                        break;
                        
                    default:
                        setError(data.detail || `Gagal login (${response.status}). Silakan coba lagi.`);
                }
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(
                <div>
                    <p className="font-medium">Gagal menghubungi server.</p>
                    <p className="text-sm mt-1">
                        Pastikan backend berjalan di: <br/>
                        <code className="text-xs bg-gray-100 dark:bg-gray-800 p-1 rounded">
                            {AppConfig.BACKEND_URL}
                        </code>
                    </p>
                </div>
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4 md:p-8 relative overflow-hidden">
            <Helmet>
                <title>Login Customer | {AppConfig.APP_NAME}</title>
            </Helmet>

            {/* Background Decoration */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="glass-container w-full max-w-md p-6 md:p-8 relative z-10 shadow-2xl border-t-4 border-primary">

                {/* Logo Section */}
                <div className="flex flex-col items-center justify-center mb-8">
                    <div className="relative w-20 h-20 rounded-lg flex items-center justify-center mb-4 overflow-hidden border-2 border-transparent">
                        <div className="absolute inset-0 w-full h-full animate-logo-neon rounded-lg"></div>
                        {logoError ? (
                            <Truck size={40} className="text-primary relative z-10" />
                        ) : (
                            <img
                                src="/Logistik-Kita.png" 
                                alt={`Logo ${AppConfig.APP_NAME}`}
                                className="w-full h-full object-contain rounded-lg p-1 relative z-10 bg-surface-light dark:bg-background-dark" 
                                onError={() => setLogoError(true)} 
                            />
                        )}
                    </div>
                    <h2 className="text-3xl font-black text-center tracking-tight leading-none text-text-main dark:text-white">
                        <span className="text-primary">LOGISTIK</span>
                        <span className="text-text-main dark:text-white">KITA</span>
                    </h2>
                    <div className="flex items-center gap-2 mt-2">
                        <Shield size={14} className="text-green-500" />
                        <p className="text-text-muted dark:text-gray-400 text-sm font-bold tracking-[0.3em]">
                            CUSTOMER LOGIN
                        </p>
                    </div>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 text-green-700 dark:text-green-300 flex items-start gap-3">
                        <Check size={20} className="mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="font-medium">{success}</p>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-300">
                        <div className="flex items-start gap-3">
                            <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                {typeof error === 'string' ? (
                                    <p className="font-medium">{error}</p>
                                ) : error}
                            </div>
                        </div>
                    </div>
                )}

                {/* Login Method Toggle */}
                <div className="flex mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                    <button
                        type="button"
                        onClick={() => {
                            setLoginMethod('phone');
                            setFormData(prev => ({ ...prev, identifier: '' }));
                        }}
                        className={`flex-1 py-3 rounded-lg text-center font-medium transition-all flex items-center justify-center gap-2 ${
                            loginMethod === 'phone' 
                                ? 'bg-white dark:bg-gray-700 shadow-sm text-primary' 
                                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                    >
                        <Phone size={18} />
                        Nomor WA
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setLoginMethod('email');
                            setFormData(prev => ({ ...prev, identifier: '' }));
                        }}
                        className={`flex-1 py-3 rounded-lg text-center font-medium transition-all flex items-center justify-center gap-2 ${
                            loginMethod === 'email' 
                                ? 'bg-white dark:bg-gray-700 shadow-sm text-primary' 
                                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                    >
                        <Mail size={18} />
                        Email
                    </button>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="input-label flex items-center justify-between">
                            <span>{loginMethod === 'phone' ? 'Nomor WhatsApp' : 'Email'}</span>
                            {loginMethod === 'phone' && (
                                <span className="text-xs font-normal text-text-muted">
                                    Contoh: 081234567890
                                </span>
                            )}
                        </label>
                        <div className="relative">
                            {loginMethod === 'phone' ? (
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            ) : (
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            )}
                            <input
                                type={loginMethod === 'phone' ? 'tel' : 'email'}
                                name="identifier"
                                value={formData.identifier}
                                onChange={handleChange}
                                className="input-field pl-12"
                                placeholder={loginMethod === 'phone' ? '081234567890' : 'email@domain.com'}
                                required
                                autoComplete={loginMethod === 'phone' ? 'tel' : 'email'}
                                inputMode={loginMethod === 'phone' ? 'numeric' : 'email'}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="input-label">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="input-field pl-12 pr-12"
                                placeholder="Masukkan password Anda"
                                required
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-colors p-1"
                                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                    
                    {/* Action Links */}
                    <div className="flex justify-between items-center">
                        <Link 
                            to="/forgot-password" 
                            className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                        >
                            <HelpCircle size={16} />
                            Lupa Password?
                        </Link>
                        
                        {unverifiedEmail && (
                            <button
                                type="button"
                                onClick={handleResendVerification}
                                className="text-sm font-medium text-blue-500 hover:underline"
                            >
                                Kirim ulang verifikasi
                            </button>
                        )}
                    </div>

                    {/* Login Button */}
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                <span>Memproses Login...</span>
                            </>
                        ) : (
                            <>
                                <Shield size={18} />
                                <span>Masuk ke Dashboard</span>
                            </>
                        )}
                    </button>
                </form>

                {/* Divider */}
                <div className="my-8 flex items-center">
                    <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                    <span className="px-4 text-sm text-gray-500 dark:text-gray-400">ATAU</span>
                    <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                </div>

                {/* Registration & Support Links */}
                <div className="space-y-4 text-center">
                    <p className="text-text-muted dark:text-gray-400 text-sm">
                        Belum punya akun customer?{' '}
                        <Link 
                            to="/signup/customer" 
                            className="font-bold text-primary hover:underline"
                        >
                            Daftar Sekarang
                        </Link>
                    </p>
                    
                    {AppConfig.FEATURES.ENABLE_MITRA_REGISTRATION && (
                        <p className="text-text-muted dark:text-gray-400 text-sm">
                            Ingin bergabung sebagai driver?{' '}
                            <Link 
                                to="/gabung-mitra" 
                                className="font-bold text-blue-500 hover:underline"
                            >
                                Daftar Mitra Driver
                            </Link>
                        </p>
                    )}

                    <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Butuh bantuan? Hubungi support kami:
                        </p>
                        <div className="flex justify-center gap-4 mt-2">
                            <a 
                                href={`https://wa.me/${AppConfig.SUPPORT_PHONE.replace('+', '')}`}
                                className="text-xs font-medium text-primary hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                WhatsApp
                            </a>
                            <a 
                                href={`mailto:${AppConfig.SUPPORT_EMAIL}`}
                                className="text-xs font-medium text-primary hover:underline"
                            >
                                Email
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerLoginPage;
