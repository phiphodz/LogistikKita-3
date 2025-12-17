// src/pages/ForgotPasswordPage.jsx (UPDATED VERSION)

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ENDPOINTS } from '../apiConfig';
import { Mail, Phone, Loader2, Lock, ArrowLeft, AlertCircle, Check } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { AppConfig } from '../config/AppConfig';

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    
    const [loginMethod, setLoginMethod] = useState('phone'); // 'phone' atau 'email'
    const [identifier, setIdentifier] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setSuccess(false);

        // Validasi input
        if (!identifier) {
            setError(`${loginMethod === 'phone' ? 'Nomor WhatsApp' : 'Email'} wajib diisi.`);
            return;
        }

        // Validasi format
        if (loginMethod === 'email' && !identifier.includes('@')) {
            setError('Format email tidak valid.');
            return;
        }

        if (loginMethod === 'phone' && !/^[0-9]+$/.test(identifier)) {
            setError('Format nomor WhatsApp tidak valid (hanya angka).');
            return;
        }

        setLoading(true);

        // Payload sesuai dengan backend Django
        // Django's password reset biasanya memerlukan field 'email'
        const payload = { 
            email: identifier // Django's password reset umumnya menggunakan email
        };

        try {
            const response = await fetch(ENDPOINTS.FORGOT_PASSWORD_REQUEST, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                // SUCCESS - Untuk keamanan, selalu tampilkan pesan sukses generic
                setSuccess(true);
                setMessage(
                    loginMethod === 'email' 
                        ? `Instruksi pemulihan password telah dikirim ke ${identifier}. Cek inbox dan folder spam Anda.`
                        : `Instruksi pemulihan password telah dikirim ke email yang terhubung dengan nomor ${identifier}.`
                );
                
                // Reset form setelah 5 detik
                setTimeout(() => {
                    setIdentifier('');
                    setSuccess(false);
                }, 5000);
                
            } else {
                // ERROR HANDLING
                if (response.status === 400) {
                    const errorMsg = data.email?.[0] || 
                                   data.detail || 
                                   'Permintaan tidak valid. Periksa format input.';
                    setError(errorMsg);
                } else if (response.status === 404) {
                    // Untuk keamanan, jangan tunjukkan bahwa email/nomor tidak ditemukan
                    setSuccess(true); // Tetap tampilkan sukses untuk prevent user enumeration
                    setMessage('Jika email/nomor terdaftar, instruksi pemulihan akan dikirim.');
                } else {
                    setError(data.detail || `Terjadi kesalahan (${response.status}). Coba lagi.`);
                }
            }
        } catch (err) {
            console.error('Forgot password error:', err);
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
                <title>Lupa Password | {AppConfig.APP_NAME}</title>
            </Helmet>

            {/* Background Decoration */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="glass-container w-full max-w-md p-6 md:p-8 relative z-10 shadow-2xl border-t-4 border-primary">
                
                {/* Header */}
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Lock size={28} className="text-primary" />
                    </div>
                    <h2 className="text-2xl font-black text-text-main dark:text-white mb-2">
                        Lupa Password
                    </h2>
                    <p className="text-text-muted dark:text-gray-400 text-sm">
                        Masukkan {loginMethod === 'phone' ? 'nomor WhatsApp' : 'email'} untuk menerima tautan pemulihan
                    </p>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 text-green-700 dark:text-green-300 flex items-start gap-3">
                        <Check size={20} className="mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="font-medium">{message}</p>
                            <p className="text-sm mt-1">Silakan cek email Anda untuk instruksi selanjutnya.</p>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-300 flex items-start gap-3">
                        <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="font-medium">{error}</p>
                        </div>
                    </div>
                )}

                {/* Method Toggle */}
                <div className="flex mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                    <button
                        type="button"
                        onClick={() => {
                            setLoginMethod('phone');
                            setIdentifier('');
                        }}
                        className={`flex-1 py-3 rounded-lg text-center font-medium transition-all ${loginMethod === 'phone' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary' : 'text-gray-500'}`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <Phone size={18} />
                            Nomor WA
                        </div>
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setLoginMethod('email');
                            setIdentifier('');
                        }}
                        className={`flex-1 py-3 rounded-lg text-center font-medium transition-all ${loginMethod === 'email' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary' : 'text-gray-500'}`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <Mail size={18} />
                            Email
                        </div>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="input-label">
                            {loginMethod === 'phone' ? 'Nomor WhatsApp' : 'Email'}
                        </label>
                        <div className="relative">
                            {loginMethod === 'phone' ? (
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            ) : (
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            )}
                            <input
                                type={loginMethod === 'phone' ? 'tel' : 'email'}
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                className="input-field pl-12"
                                placeholder={loginMethod === 'phone' ? '081234567890' : 'email@domain.com'}
                                required
                                disabled={loading || success}
                                inputMode={loginMethod === 'phone' ? 'numeric' : 'email'}
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading || success}
                        className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                <span>Mengirim Permintaan...</span>
                            </>
                        ) : (
                            <span>Kirim Tautan Pemulihan</span>
                        )}
                    </button>
                </form>

                {/* Footer Links */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="space-y-3 text-center">
                        <Link 
                            to="/login" 
                            className="text-sm font-medium text-primary hover:underline flex items-center justify-center gap-2"
                        >
                            <ArrowLeft size={16} />
                            Kembali ke Halaman Login
                        </Link>
                        
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Butuh bantuan?{' '}
                            <a 
                                href={`https://wa.me/${AppConfig.SUPPORT_PHONE.replace('+', '')}`}
                                className="text-primary hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Hubungi Support
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
