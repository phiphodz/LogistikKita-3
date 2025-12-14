// src/pages/ResetPasswordPage.jsx

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ENDPOINTS } from '../apiConfig';
import { Lock, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams(); 
    
    // Ambil token UID dan token dari URL query parameters
    // Contoh URL: /reset-password?uid=MQ&token=c29mY2FyZWRh
    const uid = searchParams.get('uid'); 
    const token = searchParams.get('token'); 

    // --- STATE FORM ---
    const [formData, setFormData] = useState({
        password: '',
        password2: '', // Konfirmasi password
    });
    
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('pending'); // 'pending', 'success', 'error'
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Cek apakah UID dan token ada. Jika tidak, anggap link tidak valid.
        if (!uid || !token) {
            setStatus('error');
            setMessage('Tautan pemulihan tidak lengkap. UID atau token tidak ditemukan.');
        } else {
            // Set status menjadi pending, siap menerima input password
            setMessage('Masukkan kata sandi baru Anda.');
        }
    }, [uid, token]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (status === 'error' && !message.includes('Tautan pemulihan')) {
            setMessage(''); // Hapus error field jika user mulai mengetik
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        
        // Cek link validitas lagi
        if (status === 'error') return;

        // 1. Validasi Frontend Dasar
        if (formData.password !== formData.password2) {
            setMessage("Konfirmasi kata sandi tidak cocok.");
            return;
        }
        if (formData.password.length < 8) {
             setMessage("Kata sandi minimal 8 karakter.");
            return;
        }

        setLoading(true);

        const CONFIRM_ENDPOINT = ENDPOINTS.FORGOT_PASSWORD_CONFIRM;

        // 2. Siapkan Payload untuk Django
        const payload = {
            uid: uid,
            token: token,
            new_password: formData.password,
            new_password2: formData.password2,
        };

        try {
            const response = await fetch(CONFIRM_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                // RESET SUKSES
                setStatus('success');
                setMessage("Kata sandi berhasil diubah! Anda dapat masuk sekarang.");
                
                // Redirect otomatis ke halaman login
                setTimeout(() => navigate('/login'), 3000);
            } else {
                // RESET GAGAL (Token Invalid/Kadaluarsa, atau Password terlalu lemah)
                setStatus('error');
                
                // Ambil pesan error spesifik dari backend
                const errorData = data.new_password?.[0] || data.token?.[0] || data.detail;
                const errorMessage = errorData || 'Gagal mengubah kata sandi. Tautan mungkin sudah kedaluwarsa.';
                setMessage(errorMessage);

                // Jika token kadaluarsa, tambahkan instruksi untuk request baru
                if (errorMessage.includes('kadaluarsa') || errorMessage.includes('invalid')) {
                     setMessage(errorMessage + ' Silakan ulangi proses Lupa Password.');
                }
            }

        } catch (err) {
            setStatus('error');
            setMessage("Gagal terhubung ke server. Periksa koneksi atau URL API.");
        } finally {
            setLoading(false);
        }
    };

    const renderHeader = () => {
        if (status === 'success') {
            return (
                <>
                    <CheckCircle size={50} className="text-green-500 mx-auto mb-3" />
                    <h2 className="text-2xl font-black text-green-500">Berhasil!</h2>
                </>
            );
        } else if (status === 'error' || status === 'pending') {
            return (
                <>
                    <Lock size={40} className="text-primary mx-auto mb-3" />
                    <h2 className="text-2xl font-black text-text-main dark:text-white">Atur Kata Sandi Baru</h2>
                </>
            );
        }
        return null;
    };
    
    return (
        <div className="pt-24 min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-background-light dark:bg-background-dark">
            <Helmet><title>Reset Password | Logistik Kita</title></Helmet>

            <div className="glass-container p-8 md:p-10 w-full max-w-md relative z-10 animate-fade-in shadow-2xl border-t-4 border-primary">

                <div className="flex flex-col items-center text-center mb-8">
                    {renderHeader()}
                    <p className={`mt-2 text-sm font-medium ${status === 'success' ? 'text-green-600' : status === 'error' ? 'text-red-500' : 'text-text-muted dark:text-gray-400'}`}>
                        {message}
                    </p>
                </div>

                {/* --- FORM RESET PASSWORD --- */}
                {status !== 'success' && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Input Password Baru */}
                        <div>
                            <label className="input-label">Kata Sandi Baru</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"} name="password"
                                    value={formData.password} onChange={handleChange}
                                    className="input-field pl-12 pr-12"
                                    placeholder="Minimal 8 karakter" 
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Input Konfirmasi Password */}
                        <div>
                            <label className="input-label">Konfirmasi Kata Sandi Baru</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"} name="password2"
                                    value={formData.password2} onChange={handleChange}
                                    className="input-field pl-12 pr-12"
                                    placeholder="Ulangi kata sandi baru" 
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="btn-primary w-full"
                        >
                            {loading ? <><Loader2 size={20} className="animate-spin mr-2" /> Mengubah Sandi...</> : 'Ubah Kata Sandi'}
                        </button>
                    </form>
                )}

                <div className="mt-6 text-center text-sm">
                    <Link to="/login" className="text-primary font-bold hover:underline">
                         {status === 'success' ? 'Lanjut ke Login' : 'Kembali ke Halaman Login'}
                    </Link>
                </div>
                
                {status === 'error' && !message.includes('Tautan pemulihan') && (
                     <div className="mt-4 text-center text-xs text-text-muted dark:text-gray-500">
                        *Jika mengalami kesulitan, <Link to="/forgot-password" className="text-primary font-bold hover:underline">minta tautan baru</Link>.
                     </div>
                )}
            </div>
        </div>
    );
};

export default ResetPasswordPage;
