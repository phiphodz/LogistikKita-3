// src/pages/ForgotPasswordPage.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ENDPOINTS } from '../apiConfig';
import { Mail, Phone, Loader2, Lock, ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    
    // Gunakan satu field untuk Email atau Username (Nomor WA)
    const [identifier, setIdentifier] = useState(''); 
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!identifier) {
            setError('Mohon masukkan Email atau Nomor WhatsApp Anda.');
            return;
        }
        
        setLoading(true);

        // API Endpoint untuk meminta reset password
        const REQUEST_ENDPOINT = ENDPOINTS.FORGOT_PASSWORD_REQUEST;

        // Payload hanya berisi identifier (email atau username/wa)
        const payload = { 
            email: identifier.includes('@') ? identifier : undefined, // Kirim sebagai 'email' jika ada '@'
            username: !identifier.includes('@') ? identifier : undefined // Kirim sebagai 'username' jika tidak ada '@'
        };
        
        // Catatan: Anda harus menyesuaikan payload ini dengan apa yang diminta oleh Django Backend Anda.
        // Jika Django hanya menerima satu field (misalnya 'email'), Anda harus memvalidasinya terlebih dahulu.
        // Untuk contoh ini, kita asumsikan Django bisa memproses 'email' atau 'username'.

        try {
            const response = await fetch(REQUEST_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            // Baca data respons (walaupun sukses, data mungkin berisi pesan dari server)
            const data = await response.json(); 

            // PROFESIONALISME: Tampilkan pesan sukses generik
            // Kita menerima status 200/204/201 bahkan jika email tidak ditemukan di backend,
            // untuk mencegah enumerasi akun.
            setMessage("Instruksi pemulihan kata sandi telah dikirim. Mohon cek Email Anda (termasuk folder Spam).");
            
            // Logika Tambahan: Jika status 400 (Bad Request) karena format salah, tampilkan error spesifik.
            if (!response.ok && response.status === 400) {
                 // Contoh: Jika Django bilang "Invalid email format"
                 setError(data.email?.[0] || data.detail || 'Permintaan gagal. Cek kembali format input Anda.');
            }


        } catch (err) {
            // Network Error
            setError('Gagal menghubungi server. Cek koneksi internet Anda.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-24 min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-background-light dark:bg-background-dark">
            <Helmet><title>Lupa Password | Logistik Kita</title></Helmet>

            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-50 dark:opacity-30"></div>

            <div className="glass-container p-8 md:p-10 w-full max-w-md relative z-10 animate-fade-in shadow-2xl border-t-4 border-primary">

                <div className="flex flex-col items-center text-center mb-8">
                    <Lock size={40} className="text-primary mb-3" />
                    <h2 className="text-2xl font-black text-text-main dark:text-white">Lupa Kata Sandi?</h2>
                    <p className="text-text-muted dark:text-gray-400 mt-2 text-sm">
                        Masukkan Email atau Nomor WhatsApp yang terdaftar untuk menerima tautan pemulihan.
                    </p>
                </div>

                {/* Feedback Alert */}
                {error && (
                    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-500 text-sm font-bold text-center mb-4">
                        ⚠️ {error}
                    </div>
                )}
                {message && (
                    <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 text-green-700 text-sm font-bold text-center mb-4">
                        ✅ {message}
                    </div>
                )}


                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="input-label">Email / Nomor WhatsApp</label>
                        <div className="relative">
                            {identifier.includes('@') ? (
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            ) : (
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            )}
                            <input
                                type="text" name="identifier"
                                value={identifier} 
                                onChange={(e) => setIdentifier(e.target.value)}
                                className="input-field pl-12"
                                placeholder="Email atau 0812xxxx" 
                                required
                                disabled={loading || !!message}
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading || !!message} // Disable jika loading atau sudah sukses
                        className="btn-primary w-full"
                    >
                        {loading ? <><Loader2 size={20} className="animate-spin mr-2" /> Mengirim Permintaan...</> : 'Kirim Tautan Pemulihan'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <Link to="/login" className="text-text-muted dark:text-gray-400 hover:text-primary font-medium flex items-center justify-center gap-1">
                        <ArrowLeft size={16} /> Kembali ke Halaman Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
