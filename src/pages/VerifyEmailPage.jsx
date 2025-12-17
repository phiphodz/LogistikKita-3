// src/pages/VerifyEmailPage.jsx

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ENDPOINTS } from '../apiConfig';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const VerifyEmailPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams(); 
    const token = searchParams.get('token');
    const uid = searchParams.get('uid'); // Tambah UID parameter untuk JWT/Django standard

    const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
    const [message, setMessage] = useState('');

    useEffect(() => {
        // PERBAIKAN: Django SimpleJWT menggunakan 'uid' dan 'token' parameters
        if (token && uid) {
            handleVerification();
        } else {
            // Jika user mengakses halaman ini tanpa parameter lengkap
            setStatus('error');
            setMessage('Tautan verifikasi tidak lengkap. Parameter token atau UID tidak ditemukan.');
        }
    }, [token, uid]);

    const handleVerification = async () => {
        setStatus('loading');
        setMessage('Memverifikasi akun Anda...');

        // PERBAIKAN: Sesuai dengan Django views.py - payload harus {uid: ..., token: ...}
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
                setMessage(data.message || 'Akun berhasil diverifikasi! Anda sekarang bisa login.');
                
                // Redirect otomatis ke halaman login setelah 3 detik
                setTimeout(() => navigate('/login', { 
                    state: { message: 'Akun berhasil diverifikasi! Silakan login.' }
                }), 3000);

            } else {
                // VERIFIKASI GAGAL
                setStatus('error');
                // Ambil pesan error dari backend Django
                const errorMessage = data.detail || data.error || data.message || 
                                   'Token verifikasi tidak valid atau sudah kadaluarsa.';
                setMessage(errorMessage);
            }

        } catch (err) {
            // Network Error
            setStatus('error');
            setMessage('Gagal terhubung ke server verifikasi. Cek koneksi internet Anda.');
            console.error('Verification error:', err);
        }
    };

    const renderContent = () => {
        switch (status) {
            case 'loading':
                return (
                    <>
                        <Loader2 size={60} className="text-primary mx-auto mb-6 animate-spin" />
                        <h2 className="text-3xl font-black text-text-main dark:text-white mb-3">
                            Memverifikasi Akun Anda...
                        </h2>
                        <p className="text-text-muted dark:text-gray-400">
                            {message || 'Mohon tunggu sebentar, kami sedang memverifikasi tautan Anda.'}
                        </p>
                    </>
                );
            case 'success':
                return (
                    <>
                        <CheckCircle size={60} className="text-green-500 mx-auto mb-6" />
                        <h2 className="text-3xl font-black text-green-500 mb-3">
                            Verifikasi Berhasil! 🎉
                        </h2>
                        <p className="text-lg text-text-main dark:text-white mb-4">
                            {message}
                        </p>
                        <p className="text-sm text-text-muted dark:text-gray-400">
                            Anda akan diarahkan ke halaman login dalam 3 detik...
                        </p>
                    </>
                );
            case 'error':
                return (
                    <>
                        <XCircle size={60} className="text-red-500 mx-auto mb-6" />
                        <h2 className="text-3xl font-black text-red-500 mb-3">
                            Verifikasi Gagal
                        </h2>
                        <p className="text-lg text-text-main dark:text-white mb-4">
                            {message}
                        </p>
                        <p className="text-sm text-text-muted dark:text-gray-400">
                            Silakan coba lagi atau minta tautan verifikasi baru.
                        </p>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="pt-24 min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-background-light dark:bg-background-dark">
            
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-50 dark:opacity-30"></div>

            <div className="glass-container p-8 md:p-10 w-full max-w-lg relative z-10 animate-fade-in text-center shadow-2xl border-t-4 border-primary">
                
                {renderContent()}

                <div className="mt-8 space-y-4">
                    <Link 
                        to="/login" 
                        className="btn-primary w-full block"
                        disabled={status === 'loading'}
                    >
                        {status === 'success' ? 'Login Sekarang' : 'Ke Halaman Login'}
                    </Link>
                    
                    {/* Opsi untuk error state */}
                    {status === 'error' && (
                        <div className="space-y-3">
                            <Link 
                                to="/signup/check-email" 
                                className="text-primary font-bold hover:underline block"
                            >
                                Kirim Ulang Email Verifikasi
                            </Link>
                            <Link 
                                to="/signup/customer" 
                                className="text-text-muted dark:text-gray-400 hover:text-primary block text-sm"
                            >
                                Daftar Akun Baru
                            </Link>
                        </div>
                    )}
                </div>

                {/* Debug info (hanya development) */}
                {import.meta.env.DEV && (
                    <div className="mt-6 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs text-gray-500 dark:text-gray-400">
                        <p>Debug Info:</p>
                        <p>Token: {token ? `${token.substring(0, 20)}...` : 'null'}</p>
                        <p>UID: {uid || 'null'}</p>
                        <p>Endpoint: {ENDPOINTS.CUSTOMER_VERIFY}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyEmailPage;
