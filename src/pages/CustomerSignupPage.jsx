// src/pages/CustomerSignupPage.jsx (KODE REVISI FINAL)

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'; 
import { 
    User, Mail, Phone, Lock, Home, MapPin, Building, Loader2, Truck, Eye, EyeOff, Search 
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

// Import ENDPOINTS dari apiConfig.js
import { ENDPOINTS } from '../apiConfig';

// --- FUNGSI UTILITY AKSES ENV VAR WILAYAH ---
const getWilayahApiBase = () => {
    // 1. Standar Vite
    if (typeof import.meta !== 'undefined' && import.meta.env.VITE_WILAYAH_API_BASE) {
        return import.meta.env.VITE_WILAYAH_API_BASE; 
    }
    // 2. Fallback jika tidak ada ENV
    return 'https://www.emsifa.com/api-wilayah-indonesia/api'; 
};
const WILAYAH_API_BASE = getWilayahApiBase();

const CustomerSignupPage = () => {
    const navigate = useNavigate();

    const REGISTER_ENDPOINT = ENDPOINTS.CUSTOMER_REGISTER; 

    // --- STATE WILAYAH (API) ---
    const [provinces, setProvinces] = useState([]);
    const [regencies, setRegencies] = useState([]);
    const [selectedArea, setSelectedArea] = useState({
        provId: '', regencyId: ''
    });

    // --- STATE FORM & KEAMANAN ---
    const [formData, setFormData] = useState({
        full_name: '', // KOLOM BARU: NAMA PERSONAL
        username: '',  // No WA
        email: '',
        password: '',
        password2: '', // Konfirmasi password
        company_name: '',
        address: '',    // Jalan/Detail
        city: '',       // Nama Kota/Kabupaten (string)
    });
    
    // Keamanan: Honeypot & reCAPTCHA
    const [honeypot, setHoneypot] = useState(''); 
    const [recaptchaToken, setRecaptchaToken] = useState(''); 

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // 1. LOAD DATA PROVINSI SAAT KOMPONEN DIMUAT
    useEffect(() => {
        axios.get(`${WILAYAH_API_BASE}/provinces.json`)
            .then(res => setProvinces(res.data))
            .catch(err => console.error("Gagal load provinsi", err));
    }, []);

    // 2. HANDLER WILAYAH BERJENJANG
    const handleWilayahChange = async (type, id, name) => {
        setError(null);

        if (type === 'prov') {
            setSelectedArea({ provId: id, regencyId: '' });
            setRegencies([]);
            setFormData(prev => ({...prev, city: ''})); // Reset Kota/Kab
            if (id) {
                const res = await axios.get(`${WILAYAH_API_BASE}/regencies/${id}.json`);
                setRegencies(res.data);
            }
        } 
        else if (type === 'regency') {
            setSelectedArea(prev => ({ ...prev, regencyId: id }));
            setFormData(prev => ({...prev, city: name})); // Simpan nama Kota/Kab
        }
    };

    // 3. HANDLER INPUT BIASA
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    // Placeholder reCAPTCHA Component
    const handleRecaptchaChange = (token) => {
        setRecaptchaToken(token);
    };

    // 4. SUBMIT
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        // Honeypot Check
        if (honeypot) {
            console.warn("HONEYPOT TRIGGERED: Bot activity detected.");
            setError("Aktivitas tidak valid terdeteksi. Pendaftaran diblokir.");
            setLoading(false);
            return;
        }

        // Validasi Frontend
        if (formData.password !== formData.password2) {
            setError("Konfirmasi password tidak cocok.");
            setLoading(false);
            return;
        }
        if (!formData.city) {
            setError("Mohon pilih Provinsi dan Kota/Kabupaten.");
            setLoading(false);
            return;
        }
        if (!recaptchaToken) {
            setError("Mohon selesaikan verifikasi reCAPTCHA.");
            setLoading(false);
            return;
        }

        const payload = {
            full_name: formData.full_name, // KOLOM NAMA BARU
            username: formData.username,
            email: formData.email,
            password: formData.password,
            password2: formData.password2,
            company_name: formData.company_name,
            address: formData.address,
            city: formData.city,
            recaptcha_token: recaptchaToken,
        };

        try {
            const response = await fetch(REGISTER_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess("Pendaftaran Berhasil! Silakan cek email Anda untuk verifikasi akun.");
                
                setTimeout(() => navigate('/signup/check-email', { 
                    state: { email: formData.email } 
                }), 2000);
            } else {
                const errorMessage = data.detail || (data.email && data.email[0]) || (data.username && data.username[0]) || "Registrasi Gagal. Cek data Anda.";
                
                if (response.status === 409) {
                     setError("Email atau Nomor WA sudah terdaftar. Silakan masuk.");
                } else {
                     setError(errorMessage);
                }
            }

        } catch (err) {
            setError("Gagal terhubung ke server. Periksa koneksi atau URL API.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4 md:p-8 relative overflow-hidden transition-colors duration-300">
            <Helmet>
                <title>Daftar Shipper | Logistik Kita</title>
            </Helmet>

            <div className="glass-container w-full max-w-2xl p-6 md:p-10 relative z-10 animate-fade-in shadow-2xl border-t-4 border-primary">
                
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-orange-500 text-white mb-3 shadow-lg shadow-primary/30">
                        <Truck size={28} />
                    </div>
                    <h1 className="text-2xl font-black text-text-main dark:text-white">Daftar Akun Customer (Shipper)</h1>
                    <p className="text-text-muted dark:text-gray-400 mt-1 text-sm">
                        Bergabung dan nikmati kemudahan manajemen logistik Anda.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-500 text-sm font-bold text-center">
                            ⚠️ {error}
                        </div>
                    )}
                    {success && (
                        <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 text-green-700 text-sm font-bold text-center animate-pulse">
                            ✅ {success}
                        </div>
                    )}

                    {/* KEAMANAN: HONEYPOT FIELD */}
                    <input type="text" name="honeypot" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} 
                        style={{ position: 'absolute', opacity: 0, height: 0, width: 0, pointerEvents: 'none' }}
                        autoComplete="off"
                    />

                    {/* === BAGIAN 1: INFORMASI AKUN === */}
                    <h3 className="font-bold text-lg border-b pb-2 text-text-main dark:text-white border-gray-200 dark:border-gray-700">1. Data Login & Kontak Personal</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* KOLOM BARU: NAMA LENGKAP */}
                        <div>
                            <label className="input-label">Nama Lengkap PIC</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input type="text" name="full_name" placeholder="Nama Anda (PIC)" value={formData.full_name} onChange={handleChange} required
                                    className="input-field pl-12"
                                />
                            </div>
                        </div>
                        
                        {/* Input Email */}
                        <div>
                            <label className="input-label">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input type="email" name="email" placeholder="contoh@perusahaan.com" value={formData.email} onChange={handleChange} required
                                    className="input-field pl-12"
                                />
                            </div>
                        </div>

                        {/* Input No WA (Username) */}
                        <div>
                            <label className="input-label">Nomor WhatsApp (Username)</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input type="tel" name="username" placeholder="Cth: 0812xxxx" value={formData.username} onChange={handleChange} required
                                    className="input-field pl-12"
                                />
                            </div>
                        </div>
                        
                        {/* Input Password */}
                        <div>
                            <label className="input-label">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input type={showPassword ? "text" : "password"} name="password" placeholder="Minimal 8 karakter" value={formData.password} onChange={handleChange} required
                                    className="input-field pl-12 pr-12"
                                />
                            </div>
                        </div>

                        {/* Input Konfirmasi Password */}
                        <div>
                            <label className="input-label">Konfirmasi Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input type={showPassword ? "text" : "password"} name="password2" placeholder="Ulangi password" value={formData.password2} onChange={handleChange} required
                                    className="input-field pl-12 pr-12"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {/* === BAGIAN 2: INFORMASI PERUSAHAAN & ALAMAT === */}
                    <h3 className="font-bold text-lg border-b pb-2 pt-4 text-text-main dark:text-white border-gray-200 dark:border-gray-700">2. Data Perusahaan & Alamat</h3>
                    <div className="space-y-4">
                        
                        {/* Input Nama Perusahaan */}
                        <div>
                            <label className="input-label">Nama Perusahaan/Shipper</label>
                            <div className="relative">
                                <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input type="text" name="company_name" placeholder="PT Logistik Jaya Abadi" value={formData.company_name} onChange={handleChange} required
                                    className="input-field pl-12"
                                />
                            </div>
                        </div>

                        {/* Input Provinsi & Kota (WILAYAH API) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Pilih Provinsi */}
                            <div>
                                <label className="input-label">Provinsi</label>
                                <select className="input-field" 
                                    onChange={(e) => handleWilayahChange('prov', e.target.value, e.target.options[e.target.selectedIndex].text)} 
                                    value={selectedArea.provId} required
                                >
                                    <option value="">Pilih Provinsi</option>
                                    {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                            
                            {/* Pilih Kota/Kabupaten */}
                            <div>
                                <label className="input-label">Kota / Kabupaten</label>
                                <select className="input-field" 
                                    disabled={!selectedArea.provId} 
                                    onChange={(e) => handleWilayahChange('regency', e.target.value, e.target.options[e.target.selectedIndex].text)} 
                                    value={selectedArea.regencyId} required
                                >
                                    <option value="">Pilih Kota/Kabupaten</option>
                                    {regencies.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                </select>
                            </div>
                        </div>
                        
                        {/* Input Alamat Lengkap (Detail Jalan/Blok) */}
                        <div>
                            <label className="input-label">Alamat Lengkap (Jalan, No. Blok, RT/RW)</label>
                            <div className="relative">
                                <Home className="absolute left-4 top-4 text-gray-400" size={18} />
                                <textarea name="address" placeholder="Jalan Raya No. 123, Blok A, RT 01/RW 02" value={formData.address} onChange={handleChange} rows="3" required
                                    className="input-field pl-12 pt-4"
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* === BAGIAN 3: KEAMANAN (RECAPTCHA) === */}
                    <div className="pt-4">
                        <label className="input-label">Verifikasi Keamanan (reCAPTCHA)</label>
                        {/* GANTIKAN INI DENGAN KOMPONEN reCAPTCHA NYATA ANDA */}
                        <div className="h-16 bg-gray-100 dark:bg-gray-700 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center text-sm">
                            <button 
                                type="button" 
                                onClick={() => handleRecaptchaChange('MOCK_RECAPTCHA_TOKEN_123')}
                                className="text-primary font-bold hover:underline"
                                disabled={recaptchaToken}
                            >
                                {recaptchaToken ? '✅ reCAPTCHA Verified' : 'Klik untuk Verifikasi Keamanan (MOCK)'}
                            </button>
                        </div>
                    </div>


                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        disabled={loading || success || !recaptchaToken || !formData.city} 
                        className="w-full bg-primary hover:bg-red-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed mt-8"
                    >
                        {loading ? <><Loader2 size={20} className="animate-spin" /> Sedang Mendaftar...</> : 'Daftar Sekarang'}
                    </button>
                </form>

                {/* Footer Link */}
                <div className="mt-8 text-center text-sm text-text-muted dark:text-gray-400">
                    Sudah punya akun?{' '}
                    <Link to='/login' className="text-primary font-bold cursor-pointer hover:underline transition-colors">
                        Masuk
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default CustomerSignupPage;
