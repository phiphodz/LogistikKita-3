// src/pages/VerifyCustomerPage.jsx

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ENDPOINTS } from '../apiConfig';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const VerifyCustomerPage = () => {
    const navigate = useNavigate();
    // useSearchParams untuk membaca query parameter (?token=XYZ)
    const [searchParams] = useSearchParams(); 
    const token = searchParams.get('token'); 

    const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Hanya jalankan proses verifikasi jika token ada di URL
        if (token) {
            handleVerification();
        } else {
            // Jika user mengakses halaman ini tanpa token
            setStatus('error');
            setMessage('Tautan verifikasi tidak lengkap. Token tidak ditemukan.');
        }
    }, [token]); // Dipicu saat token di URL berubah

    const handleVerification = async () => {
        setStatus('loading');

        // Siapkan Payload: Mengirim token ke backend
        const payload = { token: token };

        try {
            const response = await fetch(ENDPOINTS.CUSTOMER_VERIFY, {
                method: 'POST', // Umumnya verifikasi akun menggunakan POST
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                // VERIFIKASI SUKSES
                setStatus('success');
                setMessage('Verifikasi akun berhasil! Anda akan diarahkan ke halaman Login.');
                
                // Redirect otomatis ke halaman login setelah 3 detik
                setTimeout(() => navigate('/login'), 3000);

            } else {
                // VERIFIKASI GAGAL (Token Invalid/Kadaluarsa)
                setStatus('error');
                // Ambil pesan error dari backend Django/DRF
                const errorMessage = data.detail || data.token?.[0] || 'Token verifikasi tidak valid atau sudah kadaluarsa.';
                setMessage(errorMessage);
            }

        } catch (err) {
            // Network Error
            setStatus('error');
            setMessage('Gagal terhubung ke server. Cek koneksi internet Anda.');
        }
    };

    const renderContent = () => {
        switch (status) {
            case 'loading':
                return (
                    <>
                        <Loader2 size={60} className="text-primary mx-auto mb-6 animate-spin" />
                        <h2 className="text-3xl font-black text-text-main dark:text-white mb-3">Memverifikasi Akun...</h2>
                        <p className="text-text-muted dark:text-gray-400">Mohon tunggu, kami sedang memproses tautan verifikasi Anda.</p>
                    </>
                );
            case 'success':
                return (
                    <>
                        <CheckCircle size={60} className="text-green-500 mx-auto mb-6" />
                        <h2 className="text-3xl font-black text-green-500 mb-3">Akun Aktif!</h2>
                        <p className="text-lg text-text-main dark:text-white mb-4">{message}</p>
                        <p className="text-sm text-text-muted dark:text-gray-400">Jika tidak diarahkan otomatis, klik tautan di bawah.</p>
                    </>
                );
            case 'error':
                return (
                    <>
                        <XCircle size={60} className="text-red-500 mx-auto mb-6" />
                        <h2 className="text-3xl font-black text-red-500 mb-3">Verifikasi Gagal</h2>
                        <p className="text-lg text-text-main dark:text-white mb-4">Pesan: {message}</p>
                        <p className="text-sm text-text-muted dark:text-gray-400">Mohon cek kembali email Anda atau minta kirim ulang verifikasi.</p>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="pt-24 min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-background-light dark:bg-background-dark">
            <div className="glass-container p-8 md:p-10 w-full max-w-lg relative z-10 animate-fade-in text-center shadow-2xl border-t-4 border-primary">
                
                {renderContent()}

                <div className="mt-8">
                    <Link 
                        to="/login" 
                        className="btn-primary"
                        disabled={status === 'loading'}
                    >
                        Ke Halaman Login
                    </Link>
                    {/* Opsi kirim ulang jika gagal */}
                    {status === 'error' && (
                         <Link 
                            to="/signup/check-email" 
                            className="text-primary font-bold hover:underline block mt-4"
                        >
                            Kirim Ulang Verifikasi
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerifyCustomerPage;
