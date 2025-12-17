// src/pages/CustomerSignupPage.jsx (PROFESSIONAL VERSION)

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'; 
import { 
    User, Mail, Phone, Lock, Home, MapPin, Building, 
    Loader2, Truck, Eye, EyeOff, Briefcase, UserCircle,
    Check, AlertCircle
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

import { ENDPOINTS } from '../apiConfig';

// --- FUNGSI UTILITY AKSES ENV VAR WILAYAH ---
const getWilayahApiBase = () => {
    if (typeof import.meta !== 'undefined' && import.meta.env.VITE_WILAYAH_API_BASE) {
        return import.meta.env.VITE_WILAYAH_API_BASE; 
    }
    return 'https://www.emsifa.com/api-wilayah-indonesia/api'; 
};
const WILAYAH_API_BASE = getWilayahApiBase();

const CustomerSignupPage = () => {
    const navigate = useNavigate();
    const REGISTER_ENDPOINT = ENDPOINTS.CUSTOMER_REGISTER; 

    // === STATE UTAMA ===
    const [customerType, setCustomerType] = useState('personal'); // 'personal' atau 'company'
    const [step, setStep] = useState(1); // 1: Pilih tipe, 2: Form data, 3: Konfirmasi
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // === STATE WILAYAH ===
    const [provinces, setProvinces] = useState([]);
    const [regencies, setRegencies] = useState([]);
    const [selectedArea, setSelectedArea] = useState({ provId: '', regencyId: '' });

    // === STATE FORM ===
    const [formData, setFormData] = useState({
        // Umum untuk semua tipe
        customer_type: 'personal',
        full_name: '',
        username: '',
        email: '',
        password: '',
        password2: '',
        phone: '', // Tambah field phone terpisah
        address: '',
        city: '',
        
        // Khusus perusahaan
        company_name: '',
        company_npwp: '',
        company_phone: '',
        company_position: '', // Jabatan di perusahaan
        
        // Khusus perorangan
        id_number: '', // KTP/NIK
        occupation: '', // Pekerjaan
    });

    // === LOAD PROVINSI ===
    useEffect(() => {
        axios.get(`${WILAYAH_API_BASE}/provinces.json`)
            .then(res => setProvinces(res.data))
            .catch(err => console.error("Gagal load provinsi", err));
    }, []);

    // === HANDLERS ===
    const handleWilayahChange = async (type, id, name) => {
        setError('');

        if (type === 'prov') {
            setSelectedArea({ provId: id, regencyId: '' });
            setRegencies([]);
            setFormData(prev => ({ ...prev, city: '' }));
            if (id) {
                const res = await axios.get(`${WILAYAH_API_BASE}/regencies/${id}.json`);
                setRegencies(res.data);
            }
        } else if (type === 'regency') {
            setSelectedArea(prev => ({ ...prev, regencyId: id }));
            setFormData(prev => ({ ...prev, city: name }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    const handleCustomerTypeSelect = (type) => {
        setCustomerType(type);
        setFormData(prev => ({ ...prev, customer_type: type }));
        setTimeout(() => setStep(2), 300); // Animasi transisi
    };

    const handleNextStep = () => {
        // Validasi step 2
        if (!formData.full_name || !formData.email || !formData.username || !formData.password) {
            setError('Mohon isi semua field wajib');
            return;
        }
        if (formData.password !== formData.password2) {
            setError('Konfirmasi password tidak cocok');
            return;
        }
        setStep(3);
    };

    const handlePrevStep = () => {
        setStep(step - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Siapkan payload sesuai tipe customer
        const payload = {
            customer_type: formData.customer_type,
            full_name: formData.full_name,
            username: formData.username,
            email: formData.email,
            password: formData.password,
            password2: formData.password2,
            phone: formData.phone || formData.username, // Fallback ke username jika phone kosong
            address: formData.address,
            city: formData.city,
            
            // Conditional fields
            ...(formData.customer_type === 'company' && {
                company_name: formData.company_name,
                company_npwp: formData.company_npwp || '',
                company_phone: formData.company_phone || '',
                company_position: formData.company_position || '',
            }),
            
            ...(formData.customer_type === 'personal' && {
                id_number: formData.id_number || '',
                occupation: formData.occupation || '',
            }),
        };

        try {
            const response = await fetch(REGISTER_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Pendaftaran berhasil! Cek email untuk verifikasi.');
                setTimeout(() => navigate('/signup/check-email', { 
                    state: { 
                        email: formData.email,
                        customerType: formData.customer_type 
                    } 
                }), 1500);
            } else {
                const errorMsg = data.detail || 
                               (data.email && data.email[0]) || 
                               (data.username && data.username[0]) || 
                               'Registrasi gagal. Cek data Anda.';
                setError(errorMsg);
            }
        } catch (err) {
            setError('Gagal terhubung ke server. Periksa koneksi atau URL API.');
            console.error('API Error:', err);
        } finally {
            setLoading(false);
        }
    };

    // === RENDER CONTENT BERDASARKAN STEP ===
    const renderStepContent = () => {
        switch(step) {
            case 1:
                return (
                    <div className="text-center animate-fade-in">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-xl bg-gradient-to-br from-primary to-blue-500 text-white mb-6 shadow-xl">
                            <Truck size={32} />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-black text-text-main dark:text-white mb-4">
                            Daftar sebagai Shipper
                        </h1>
                        <p className="text-text-muted dark:text-gray-400 mb-8">
                            Pilih tipe akun yang sesuai dengan kebutuhan Anda
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                            {/* PERORANGAN CARD */}
                            <div 
                                className={`glass-container p-6 cursor-pointer transition-all duration-300 border-2 ${
                                    customerType === 'personal' 
                                        ? 'border-primary bg-primary/5' 
                                        : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                                }`}
                                onClick={() => handleCustomerTypeSelect('personal')}
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${
                                        customerType === 'personal' ? 'bg-primary/20 text-primary' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                                    }`}>
                                        <UserCircle size={28} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Perorangan</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                        Cocok untuk individu, freelancer, atau usaha kecil
                                    </p>
                                    <ul className="text-left text-sm space-y-2 text-gray-500 dark:text-gray-400">
                                        <li className="flex items-center gap-2">
                                            <Check size={14} className="text-green-500" /> Tanpa NPWP
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check size={14} className="text-green-500" /> Proses cepat
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check size={14} className="text-green-500" /> Limit pengiriman standar
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* PERUSAHAAN CARD */}
                            <div 
                                className={`glass-container p-6 cursor-pointer transition-all duration-300 border-2 ${
                                    customerType === 'company' 
                                        ? 'border-primary bg-primary/5' 
                                        : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                                }`}
                                onClick={() => handleCustomerTypeSelect('company')}
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${
                                        customerType === 'company' ? 'bg-primary/20 text-primary' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                                    }`}>
                                        <Building size={28} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Perusahaan</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                        Untuk PT, CV, atau bisnis dengan volume pengiriman besar
                                    </p>
                                    <ul className="text-left text-sm space-y-2 text-gray-500 dark:text-gray-400">
                                        <li className="flex items-center gap-2">
                                            <Check size={14} className="text-green-500" /> Dengan NPWP perusahaan
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check size={14} className="text-green-500" /> Terms khusus & invoice
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Check size={14} className="text-green-500" /> Priority support
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <button 
                                onClick={() => customerType && setStep(2)}
                                disabled={!customerType}
                                className="btn-primary px-8"
                            >
                                Lanjutkan
                            </button>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="animate-fade-in">
                        <div className="flex items-center justify-between mb-8">
                            <button 
                                onClick={handlePrevStep}
                                className="flex items-center gap-2 text-text-muted hover:text-primary"
                            >
                                ← Kembali
                            </button>
                            <div className="text-sm font-medium">
                                <span className="text-primary">Step 2/3</span> • Data {customerType === 'personal' ? 'Pribadi' : 'Perusahaan'}
                            </div>
                        </div>

                        <h2 className="text-2xl font-black text-text-main dark:text-white mb-6">
                            {customerType === 'personal' ? 'Data Pribadi' : 'Data Perusahaan'}
                        </h2>

                        <div className="space-y-6">
                            {/* DATA UMUM */}
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                                <h3 className="font-bold text-lg mb-4 text-text-main dark:text-white">
                                    Informasi Akun
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="input-label">Nama Lengkap*</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input 
                                                type="text" 
                                                name="full_name" 
                                                value={formData.full_name}
                                                onChange={handleChange}
                                                placeholder="Nama lengkap Anda"
                                                className="input-field pl-12"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="input-label">Email*</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input 
                                                type="email" 
                                                name="email" 
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="email@domain.com"
                                                className="input-field pl-12"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="input-label">Nomor WhatsApp*</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input 
                                                type="tel" 
                                                name="username" 
                                                value={formData.username}
                                                onChange={handleChange}
                                                placeholder="0812xxxxxxx"
                                                className="input-field pl-12"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="input-label">Nomor Telepon Lain</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input 
                                                type="tel" 
                                                name="phone" 
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="Opsional"
                                                className="input-field pl-12"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="input-label">Password*</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input 
                                                type={showPassword ? "text" : "password"} 
                                                name="password" 
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="Minimal 8 karakter"
                                                className="input-field pl-12 pr-12"
                                                required
                                            />
                                            <button 
                                                type="button" 
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="input-label">Konfirmasi Password*</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input 
                                                type={showPassword ? "text" : "password"} 
                                                name="password2" 
                                                value={formData.password2}
                                                onChange={handleChange}
                                                placeholder="Ulangi password"
                                                className="input-field pl-12"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* DATA SPESIFIK */}
                            {customerType === 'personal' ? (
                                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                                    <h3 className="font-bold text-lg mb-4 text-text-main dark:text-white">
                                        Data Pribadi
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="input-label">NIK (KTP)</label>
                                            <input 
                                                type="text" 
                                                name="id_number" 
                                                value={formData.id_number}
                                                onChange={handleChange}
                                                placeholder="16 digit NIK"
                                                className="input-field"
                                            />
                                        </div>
                                        <div>
                                            <label className="input-label">Pekerjaan</label>
                                            <input 
                                                type="text" 
                                                name="occupation" 
                                                value={formData.occupation}
                                                onChange={handleChange}
                                                placeholder="Misal: Wiraswasta, Karyawan"
                                                className="input-field"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                                    <h3 className="font-bold text-lg mb-4 text-text-main dark:text-white">
                                        Data Perusahaan
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="input-label">Nama Perusahaan*</label>
                                            <div className="relative">
                                                <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <input 
                                                    type="text" 
                                                    name="company_name" 
                                                    value={formData.company_name}
                                                    onChange={handleChange}
                                                    placeholder="PT/CV/Nama Usaha"
                                                    className="input-field pl-12"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="input-label">NPWP Perusahaan</label>
                                            <input 
                                                type="text" 
                                                name="company_npwp" 
                                                value={formData.company_npwp}
                                                onChange={handleChange}
                                                placeholder="15 digit NPWP"
                                                className="input-field"
                                            />
                                        </div>
                                        <div>
                                            <label className="input-label">Telepon Perusahaan</label>
                                            <input 
                                                type="tel" 
                                                name="company_phone" 
                                                value={formData.company_phone}
                                                onChange={handleChange}
                                                placeholder="021-xxxxxxx"
                                                className="input-field"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="input-label">Jabatan Anda di Perusahaan</label>
                                            <input 
                                                type="text" 
                                                name="company_position" 
                                                value={formData.company_position}
                                                onChange={handleChange}
                                                placeholder="Misal: Owner, Manager Logistik"
                                                className="input-field"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ALAMAT */}
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                                <h3 className="font-bold text-lg mb-4 text-text-main dark:text-white">
                                    Alamat
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="input-label">Provinsi*</label>
                                        <select 
                                            className="input-field" 
                                            onChange={(e) => handleWilayahChange('prov', e.target.value, e.target.options[e.target.selectedIndex].text)} 
                                            value={selectedArea.provId}
                                            required
                                        >
                                            <option value="">Pilih Provinsi</option>
                                            {provinces.map(p => (
                                                <option key={p.id} value={p.id}>{p.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="input-label">Kota/Kabupaten*</label>
                                        <select 
                                            className="input-field" 
                                            disabled={!selectedArea.provId}
                                            onChange={(e) => handleWilayahChange('regency', e.target.value, e.target.options[e.target.selectedIndex].text)} 
                                            value={selectedArea.regencyId}
                                            required
                                        >
                                            <option value="">Pilih Kota/Kabupaten</option>
                                            {regencies.map(r => (
                                                <option key={r.id} value={r.id}>{r.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="input-label">Alamat Lengkap*</label>
                                        <div className="relative">
                                            <Home className="absolute left-4 top-4 text-gray-400" size={18} />
                                            <textarea 
                                                name="address" 
                                                value={formData.address}
                                                onChange={handleChange}
                                                rows="3"
                                                placeholder="Jalan, No. Rumah/Gedung, RT/RW, Kecamatan"
                                                className="input-field pl-12 pt-4"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between mt-8">
                            <button 
                                onClick={handlePrevStep}
                                className="px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                Kembali
                            </button>
                            <button 
                                onClick={handleNextStep}
                                className="btn-primary px-8"
                            >
                                Lanjut ke Review
                            </button>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="animate-fade-in">
                        <div className="flex items-center justify-between mb-8">
                            <button 
                                onClick={handlePrevStep}
                                className="flex items-center gap-2 text-text-muted hover:text-primary"
                            >
                                ← Kembali
                            </button>
                            <div className="text-sm font-medium">
                                <span className="text-primary">Step 3/3</span> • Konfirmasi
                            </div>
                        </div>

                        <h2 className="text-2xl font-black text-text-main dark:text-white mb-6">
                            Review Data Pendaftaran
                        </h2>

                        <div className="glass-container p-6 mb-6">
                            <h3 className="font-bold text-lg mb-4 text-primary">
                                Ringkasan Pendaftaran
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Tipe Akun</p>
                                    <p className="font-semibold">
                                        {customerType === 'personal' ? 'Perorangan' : 'Perusahaan'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Nama</p>
                                    <p className="font-semibold">{formData.full_name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-semibold">{formData.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">WhatsApp</p>
                                    <p className="font-semibold">{formData.username}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Kota</p>
                                    <p className="font-semibold">{formData.city || 'Belum dipilih'}</p>
                                </div>
                                
                                {customerType === 'company' && (
                                    <>
                                        <div className="md:col-span-2">
                                            <p className="text-sm text-gray-500">Nama Perusahaan</p>
                                            <p className="font-semibold">{formData.company_name}</p>
                                        </div>
                                        {formData.company_npwp && (
                                            <div>
                                                <p className="text-sm text-gray-500">NPWP</p>
                                                <p className="font-semibold">{formData.company_npwp}</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <AlertCircle size={20} className="text-blue-500 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-blue-700 dark:text-blue-300">
                                            Setelah mendaftar, Anda akan menerima email verifikasi.
                                            Akun harus diverifikasi sebelum bisa login.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Dengan mendaftar, Anda menyetujui{' '}
                                <Link to="/terms" className="text-primary hover:underline">
                                    Syarat & Ketentuan
                                </Link>
                            </p>
                            <button 
                                onClick={handleSubmit}
                                disabled={loading}
                                className="btn-primary px-8"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin mr-2" />
                                        Memproses...
                                    </>
                                ) : 'Daftar Sekarang'}
                            </button>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4 md:p-8 relative overflow-hidden">
            <Helmet>
                <title>Daftar Shipper | Logistik Kita</title>
            </Helmet>

            {/* Background Decoration */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="glass-container w-full max-w-4xl p-6 md:p-8 relative z-10 shadow-2xl border-t-4 border-primary">
                
                {/* Progress Bar */}
                {step > 1 && (
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-text-muted">
                                {step === 2 ? 'Data Pribadi' : step === 3 ? 'Review' : 'Pilih Tipe'}
                            </span>
                            <span className="text-sm font-medium">{step}/3</span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-primary transition-all duration-300"
                                style={{ width: `${(step / 3) * 100}%` }}
                            />
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-300 flex items-start gap-3">
                        <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="font-medium">{error}</p>
                            {error.includes('server') && (
                                <p className="text-sm mt-1">Pastikan backend Django sedang berjalan di port 8000</p>
                            )}
                        </div>
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 text-green-700 dark:text-green-300 flex items-start gap-3">
                        <Check size={20} className="mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="font-medium">{success}</p>
                            <p className="text-sm mt-1">Anda akan diarahkan ke halaman verifikasi email...</p>
                        </div>
                    </div>
                )}

                {renderStepContent()}

                {/* Footer Links */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
                    <p className="text-text-muted dark:text-gray-400 text-sm">
                        Sudah punya akun?{' '}
                        <Link to="/login" className="text-primary font-bold hover:underline">
                            Masuk di sini
                        </Link>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        Butuh bantuan?{' '}
                        <a href="https://wa.me/6285813487753" className="text-primary hover:underline">
                            Hubungi Support
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CustomerSignupPage;
