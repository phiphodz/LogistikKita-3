// src/pages/VerifyEmailPage.jsx (UPDATED VERSION)

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ENDPOINTS } from '../apiConfig';
import { CheckCircle, XCircle, Loader2, Mail, AlertCircle, Shield } from 'lucide-react';
import { AppConfig } from '../config/AppConfig';

const VerifyEmailPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams(); 
    const token = searchParams.get('token');
    const uid = searchParams.get('uid');

    const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
    const [message, setMessage] = useState('');
    const [debugInfo, setDebugInfo] = useState('');

    useEffect(() => {
        // Validasi parameter
        if (!token || !uid) {
            setStatus('error');
            setMessage('Tautan verifikasi tidak lengkap. Pastikan Anda mengklik tautan yang lengkap dari email.');
            return;
        }

        // Validasi format token (minimal 10 karakter)
        if (token.length < 10) {
            setStatus('error');
            setMessage('Format token tidak valid. Token terlalu pendek.');
            return;
        }

        handleVerification();
    }, [token, uid]);

    const handleVerification = async () => {
        setStatus('loading');
        setMessage('Memverifikasi akun Anda...');

        // Payload sesuai Django SimpleJWT standard
        const payload = { 
            uid: uid,
            token: token 
        };

        try {
            const response = await fetch(ENDPOINTS.CUSTOMER_VERIFY, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                // VERIFIKASI SUKSES
                setStatus('success');
                setMessage(data.message || '✅ Akun berhasil diverifikasi! Anda sekarang bisa login.');
                
                // Auto-redirect setelah delay
                setTimeout(() => {
                    navigate('/login', { 
                        replace: true,
                        state: { 
                            message: 'Akun berhasil diverifikasi! Silakan login.',
                            email: data.email || ''
                        }
                    });
                }, 3000);

            } else {
                // VERIFIKASI GAGAL
                setStatus('error');
                
                // Error handling spesifik
                if (response.status === 400) {
                    if (data.detail?.includes('already verified')) {
                        setMessage('Akun ini sudah diverifikasi sebelumnya. Silakan login langsung.');
                        // Redirect ke login jika sudah terverifikasi
                        setTimeout(() => navigate('/login'), 2000);
                    } else {
                        setMessage(data.detail || 'Token tidak valid atau format salah.');
                    }
                } else if (response.status === 404) {
                    setMessage('Tautan verifikasi tidak ditemukan atau sudah kadaluarsa.');
                } else {
                    setMessage(data.detail || 'Token verifikasi tidak valid atau sudah kadaluarsa.');
                }
            }
        } catch (err) {
            console.error('Verification error:', err);
            setStatus('error');
            setMessage(
                <div>
                    <p className="font-medium">Gagal terhubung ke server verifikasi.</p>
                    <p className="text-sm mt-1">
                        Pastikan backend berjalan di: <br/>
                        <code className="text-xs bg-gray-100 dark:bg-gray-800 p-1 rounded">
                            {AppConfig.BACKEND_URL}
                        </code>
                    </p>
                </div>
            );
        }
    };

    const renderContent = () => {
        switch (status) {
            case 'loading':
                return (
                    <div className="text-center">
                        <div className="relative w-24 h-24 mx-auto mb-6">
                            <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse"></div>
                            <Loader2 size={60} className="text-primary relative z-10 animate-spin" />
                        </div>
                        <h2 className="text-2xl font-black text-text-main dark:text-white mb-3">
                            Memverifikasi Akun Anda...
                        </h2>
                        <p className="text-text-muted dark:text-gray-400">
                            {message || 'Mohon tunggu sebentar, kami sedang memverifikasi tautan Anda.'}
                        </p>
                    </div>
                );
                
            case 'success':
                return (
                    <div className="text-center">
                        <div className="relative w-24 h-24 mx-auto mb-6">
                            <div className="absolute inset-0 bg-green-500/10 rounded-full animate-pulse"></div>
                            <CheckCircle size={60} className="text-green-500 relative z-10" />
                        </div>
                        <h2 className="text-2xl font-black text-green-500 mb-3">
                            Verifikasi Berhasil! 🎉
                        </h2>
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg mb-4">
                            <p className="text-lg text-text-main dark:text-white">
                                {typeof message === 'string' ? message : 'Akun berhasil diverifikasi!'}
                            </p>
                            <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                                Anda akan diarahkan ke halaman login dalam beberapa detik...
                            </p>
                        </div>
                    </div>
                );
                
            case 'error':
                return (
                    <div className="text-center">
                        <div className="relative w-24 h-24 mx-auto mb-6">
                            <div className="absolute inset-0 bg-red-500/10 rounded-full"></div>
                            <XCircle size={60} className="text-red-500 relative z-10" />
                        </div>
                        <h2 className="text-2xl font-black text-red-500 mb-3">
                            Verifikasi Gagal
                        </h2>
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg mb-4">
                            <p className="text-lg text-text-main dark:text-white">
                                {typeof message === 'string' ? message : 'Terjadi kesalahan saat verifikasi.'}
                            </p>
                            <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                                Silakan coba lagi atau minta tautan verifikasi baru.
                            </p>
                        </div>
                    </div>
                );
                
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4 md:p-8 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="glass-container w-full max-w-lg p-6 md:p-8 relative z-10 shadow-2xl border-t-4 border-primary">
                
                {/* Header */}
                <div className="flex items-center justify-center gap-3 mb-6">
                    <Shield size={24} className="text-primary" />
                    <h1 className="text-xl font-bold text-text-main dark:text-white">
                        Verifikasi Email - {AppConfig.APP_NAME}
                    </h1>
                </div>

                {/* Main Content */}
                {renderContent()}

                {/* Action Buttons */}
                <div className="mt-8 space-y-4">
                    {status === 'success' ? (
                        <Link 
                            to="/login" 
                            className="btn-primary w-full flex items-center justify-center gap-2"
                        >
                            <Mail size={18} />
                            Login Sekarang
                        </Link>
                    ) : (
                        <Link 
                            to="/login" 
                            className="btn-outline w-full"
                        >
                            Ke Halaman Login
                        </Link>
                    )}
                    
                    {/* Additional options for error state */}
                    {status === 'error' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Link 
                                to="/signup/check-email" 
                                className="btn-secondary flex items-center justify-center gap-2"
                            >
                                <Mail size={18} />
                                Kirim Ulang Verifikasi
                            </Link>
                            <Link 
                                to="/signup/customer" 
                                className="btn-outline"
                            >
                                Daftar Akun Baru
                            </Link>
                        </div>
                    )}
                </div>

                {/* Support Info */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
                    <p className="text-sm text-text-muted dark:text-gray-400 mb-2">
                        Masih mengalami masalah?
                    </p>
                    <a 
                        href={`https://wa.me/${AppConfig.SUPPORT_PHONE.replace('+', '')}`}
                        className="text-sm font-medium text-primary hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Hubungi Support {AppConfig.APP_NAME}
                    </a>
                </div>

                {/* Debug info (development only) */}
                {import.meta.env.DEV && status === 'error' && (
                    <div className="mt-6 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <p className="text-xs font-mono text-gray-500 dark:text-gray-400">
                            <strong>Debug:</strong> uid={uid?.substring(0, 10)}... | 
                            token={token?.substring(0, 20)}... | 
                            endpoint={ENDPOINTS.CUSTOMER_VERIFY}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyEmailPage;
