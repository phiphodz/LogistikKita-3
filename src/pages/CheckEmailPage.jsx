// src/pages/CheckEmailPage.jsx

import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { MailCheck, RefreshCw, Loader2 } from 'lucide-react';

// Import ENDPOINTS yang sudah direvisi
import { ENDPOINTS } from '../apiConfig';

const CheckEmailPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Ambil email dari state navigasi yang dikirim dari CustomerSignupPage.jsx
    // Jika user langsung akses halaman ini tanpa state, gunakan placeholder
    const registeredEmail = location.state?.email || 'email Anda';

    const [loading, setLoading] = useState(false);
    const [resendSuccess, setResendSuccess] = useState('');
    const [resendError, setResendError] = useState('');

    const handleResendVerification = async () => {
        setLoading(true);
        setResendError('');
        setResendSuccess('');

        // 1. Validasi: Pastikan kita punya email yang valid
        if (registeredEmail === 'email Anda' || !registeredEmail) {
            setResendError("Alamat email tidak diketahui. Silakan kembali ke halaman pendaftaran atau login.");
            setLoading(false);
            return;
        }

        // 2. Siapkan Payload untuk Backend
        const payload = { email: registeredEmail };

        try {
            // **API Call ke Django Backend**
            const response = await fetch(ENDPOINTS.CUSTOMER_RESEND_VERIFICATION, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                // SUCCESS: Email terkirim ulang
                setResendSuccess("✅ Email verifikasi telah berhasil dikirim ulang. Silakan cek kotak masuk Anda.");
            } else {
                // FAILURE: Tangani error spesifik dari Backend
                // Professional: Error 409 Conflict atau 400 Bad Request
                const errorMessage = data.detail || data.email?.[0] || "Gagal mengirim ulang email. Akun mungkin sudah aktif atau tidak terdaftar.";
                setResendError(`⚠️ ${errorMessage}`);
            }

        } catch (err) {
            // Network Error
            setResendError("Gagal terhubung ke server. Cek koneksi internet Anda.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-24 min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-background-light dark:bg-background-dark">
             
             {/* Background Decoration */}
             <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-50 dark:opacity-30"></div>

            <div className="glass-container p-8 md:p-10 w-full max-w-lg relative z-10 animate-fade-in text-center shadow-2xl border-t-4 border-primary">

                <MailCheck size={60} className="text-primary mx-auto mb-6" />

                <h2 className="text-3xl font-black text-text-main dark:text-white mb-3">
                    Hampir Selesai!
                </h2>
                
                {/* Instruksi Utama */}
                <p className="text-lg text-text-muted dark:text-gray-400 mb-6">
                    Kami telah mengirimkan tautan verifikasi akun ke:
                    <br />
                    <span className="font-bold text-primary break-words">{registeredEmail}</span>
                </p>

                <p className="text-text-main dark:text-white mb-8">
                    Mohon cek kotak masuk email Anda (dan folder Spam!) untuk mengklik tautan aktivasi.
                </p>

                {/* Feedback Kirim Ulang */}
                {resendError && (
                    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 text-sm font-bold mb-4">
                        {resendError}
                    </div>
                )}
                 {resendSuccess && (
                    <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 text-sm font-bold mb-4">
                        {resendSuccess}
                    </div>
                )}


                {/* Tombol Kirim Ulang */}
                <button
                    onClick={handleResendVerification}
                    disabled={loading || !!resendSuccess}
                    className="w-full md:w-auto mx-auto mb-4 py-3 px-6 rounded-xl bg-gray-100 dark:bg-gray-700 text-text-main dark:text-white font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all flex items-center justify-center disabled:opacity-50"
                >
                    {loading ? (
                        <Loader2 size={20} className="animate-spin mr-2" />
                    ) : (
                        <RefreshCw size={20} className="mr-2" />
                    )}
                    {loading ? 'Mengirim Ulang...' : 'Kirim Ulang Email Verifikasi'}
                </button>

                {/* Footer Link */}
                <div className="mt-8 text-sm text-text-muted dark:text-gray-400">
                    <Link to="/login" className="text-primary font-bold hover:underline transition-colors">
                        Kembali ke Halaman Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CheckEmailPage;
