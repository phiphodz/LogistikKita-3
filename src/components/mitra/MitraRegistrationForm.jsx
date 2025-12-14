import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User, Truck, FileText, Landmark, CheckCircle, AlertTriangle, ArrowLeft, ArrowRight, Phone, FileDigit } from 'lucide-react';

// URL Backend TELAH DISESUAIKAN dengan Codespace kamu:
const DJANGO_BASE_URL = 'https://turbo-capybara-7v65qpwg7647hxv7w-8001.app.github.dev'; 
// Pastikan Codespace kamu berjalan di port 9001 dan memiliki jalur /api/

// API WILAYAH INDONESIA (Gratis & Stabil)
const WILAYAH_API_BASE = 'https://www.emsifa.com/api-wilayah-indonesia/api';

function MitraRegistrationForm() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- STATE DATA MASTER ---
    const [fleets, setFleets] = useState([]);
    
    // --- STATE WILAYAH (API) ---
    const [provinces, setProvinces] = useState([]);
    const [regencies, setRegencies] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [villages, setVillages] = useState([]);
    const [selectedArea, setSelectedArea] = useState({
        provId: '', regencyId: '', districtId: '', villageId: ''
    });

    // --- STATE UTAMA DATA FORMULIR ---
    const [formData, setFormData] = useState({
        // TAHAP 1: DATA DIRI & DARURAT
        full_name_ktp: '', 
        phone_number: '', 
        mitra_type: 'OWNER_OPERATOR',
        domicile_address_detail: '', 
        domicile_full_string: '',    
        domicile_city: '',           
        emergency_name: '',
        emergency_phone: '',
        emergency_relation: 'Istri',

        // TAHAP 2: DATA ARMADA
        nopol: '', 
        merk_tahun: '', 
        jenis_armada_id: '', 
        panjang_bak: '', 
        lebar_bak: '', 
        tinggi_bak: '', 
        
        // TAHAP 4: BANK
        bank_name: 'BCA', 
        bank_account_number: '', 
        bank_account_holder: ''
    });

    const [files, setFiles] = useState({});

    // 1. LOAD DATA MASTER SAAT KOMPONEN DIMUAT (Provinsi & Fleets)
    useEffect(() => {
        // Load Provinsi
        axios.get(`${WILAYAH_API_BASE}/provinces.json`)
            .then(res => setProvinces(res.data))
            .catch(err => console.error("Gagal load provinsi", err));

        // Load Fleet List dari API Backend Kita -> WAJIB!
        axios.get(`${DJANGO_BASE_URL}fleets/`)
            .then(res => {
                setFleets(res.data);
                if (res.data.length > 0) {
                    setFormData(prev => ({ ...prev, jenis_armada_id: res.data[0].id }));
                }
            })
            .catch(err => console.error("Error loading fleets:", err));

    }, []);

    // 2. HANDLER WILAYAH BERJENJANG
    const handleWilayahChange = async (type, id, name) => {
        if (type === 'prov') {
            setRegencies([]); setDistricts([]); setVillages([]);
            setSelectedArea({ ...selectedArea, provId: id, regencyId: '', districtId: '', villageId: '' });
            if (id) {
                const res = await axios.get(`${WILAYAH_API_BASE}/regencies/${id}.json`);
                setRegencies(res.data);
                setFormData(prev => ({...prev, domicile_full_string: `Prov. ${name}`}));
            }
        } 
        else if (type === 'regency') {
            setDistricts([]); setVillages([]);
            setSelectedArea({ ...selectedArea, regencyId: id, districtId: '', villageId: '' });
            if (id) {
                const res = await axios.get(`${WILAYAH_API_BASE}/districts/${id}.json`);
                setDistricts(res.data);
                const provincePart = formData.domicile_full_string.split(',')[0];
                setFormData(prev => ({...prev, domicile_full_string: provincePart + `, ${name}`, domicile_city: name}));
            }
        }
        else if (type === 'district') {
            setVillages([]);
            setSelectedArea({ ...selectedArea, districtId: id, villageId: '' });
            if (id) {
                const res = await axios.get(`${WILAYAH_API_BASE}/villages/${id}.json`);
                setVillages(res.data);
                const cityPart = formData.domicile_full_string.split(',').slice(0, 2).join(', ');
                setFormData(prev => ({...prev, domicile_full_string: cityPart + `, Kec. ${name}`}));
            }
        }
        else if (type === 'village') {
            setSelectedArea({ ...selectedArea, villageId: id });
            const districtPart = formData.domicile_full_string.split(',').slice(0, 3).join(', ');
            setFormData(prev => ({...prev, domicile_full_string: districtPart + `, Kel. ${name}`}));
        }
    };

    // 3. HANDLER INPUT BIASA
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError(null);
    };

    // 4. HANDLER FILE DENGAN VALIDASI
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
                alert("Hanya boleh upload file Gambar (JPG/PNG)!");
                e.target.value = null; 
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert("Ukuran file terlalu besar! Maksimal 5MB.");
                e.target.value = null;
                return;
            }
            setFiles(prev => ({ ...prev, [e.target.name]: file }));
        }
    };

    // 5. VALIDASI SEBELUM PINDAH HALAMAN
    const validateStep = (currentStep) => {
        if (currentStep === 1) {
            const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,11}$/;
            if (!formData.full_name_ktp || !selectedArea.villageId || !phoneRegex.test(formData.phone_number) || !formData.emergency_phone || !formData.emergency_relation) {
                setError("Mohon lengkapi semua data identitas, alamat, dan kontak darurat.");
                return false;
            }
        }
        if (currentStep === 2) {
            if (!formData.nopol || !formData.jenis_armada_id || !formData.panjang_bak || !formData.lebar_bak || !formData.tinggi_bak) {
                setError("Mohon lengkapi Data Kendaraan dan Dimensi Bak Riil (P, L, T).");
                return false;
            }
        }
        if (currentStep === 3) {
            const requiredDocs = ['ktp_photo', 'sim_photo', 'selfie_photo', 'stnk_photo', 'foto_depan', 'foto_samping', 'foto_belakang'];
            for (const doc of requiredDocs) {
                if (!files[doc]) {
                    setError(`Mohon upload dokumen wajib: ${doc.toUpperCase().replace('_', ' ')}.`);
                    return false;
                }
            }
        }
        setError(null);
        return true;
    };


    // 6. SUBMIT DATA KE BACKEND
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const payload = new FormData();
        
        // Gabungkan Alamat
        const finalAddress = `${formData.domicile_address_detail}, ${formData.domicile_full_string}`;
        payload.append('domicile_address', finalAddress);
        
        // Ambil Kota/Kab untuk domicile_city (Backend butuh ini)
        const cityMatch = formData.domicile_full_string.match(/(Kota\.\s*(.+)|Kab\.\s*(.+))/);
        const domicileCity = cityMatch ? (cityMatch[2] || cityMatch[3] || 'Indonesia') : 'Indonesia';
        payload.append('domicile_city', domicileCity.trim()); 

        // Masukkan semua data teks
        Object.keys(formData).forEach(key => {
            if (key !== 'domicile_address_detail' && key !== 'domicile_full_string') {
                payload.append(key, formData[key]);
            }
        });

        // Masukkan semua file
        Object.keys(files).forEach(key => {
            payload.append(key, files[key]);
        });
        
        // Ambil token JWT
        const token = localStorage.getItem('access_token');
        if (!token) {
             setError("Anda harus login sebelum mendaftar Mitra.");
             setIsLoading(false);
             return;
        }

        try {
            await axios.post(`${DJANGO_BASE_URL}mitra/register/`, payload, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}` 
                }
            });
            setStep(5); // Sukses
        } catch (err) {
            console.error("Registrasi Error:", err.response || err);
            const errorData = err.response && err.response.data ? JSON.stringify(err.response.data) : "Terjadi kesalahan koneksi atau server.";
            setError(`Gagal Mendaftar: ${errorData}. Pastikan Anda sudah login.`);
            window.scrollTo(0, 0);
        } finally {
            setIsLoading(false);
        }
    };

    // --- RENDER VISUAL ---
    const renderStep = () => {
        // [VISUAL STEP 1]
        if (step === 1) {
            return (
                <div className="space-y-4 animate-fade-in">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800"><User className="text-primary"/> Identitas & Kontak</h2>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                        <input className="p-3 border rounded-xl w-full" name="full_name_ktp" placeholder="Nama Lengkap (KTP)" onChange={handleChange} defaultValue={formData.full_name_ktp} required />
                        <input className="p-3 border rounded-xl w-full" name="phone_number" type="number" placeholder="No WhatsApp (08xxx)" onChange={handleChange} defaultValue={formData.phone_number} required />
                        <select className="p-3 border rounded-xl w-full" name="mitra_type" onChange={handleChange} value={formData.mitra_type}>
                            <option value="OWNER_OPERATOR">Pemilik Unit & Supir</option>
                            <option value="DRIVER">Supir Tanpa Unit</option>
                        </select>
                    </div>
                    
                    <div className="space-y-2 pt-4 border-t">
                        <label className="text-xs font-bold uppercase text-gray-500">Kontak Darurat</label>
                        <div className="grid grid-cols-3 gap-2">
                            <input className="p-2 border rounded col-span-1" name="emergency_name" placeholder="Nama Darurat" onChange={handleChange} required />
                            <input className="p-2 border rounded col-span-1" name="emergency_relation" placeholder="Hubungan" onChange={handleChange} required />
                            <input className="p-2 border rounded col-span-1" name="emergency_phone" placeholder="No HP Darurat" onChange={handleChange} required />
                        </div>
                    </div>

                    {/* Alamat Berjenjang */}
                    <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                        <label className="text-xs font-bold uppercase text-gray-500">Alamat Domisili (Basecamp Truk)</label>
                        <select className="w-full p-2 border rounded" onChange={(e) => handleWilayahChange('prov', e.target.value, e.target.options[e.target.selectedIndex].text)} value={selectedArea.provId}>
                            <option value="">Pilih Provinsi</option>
                            {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        <div className="grid grid-cols-2 gap-2">
                            <select className="p-2 border rounded" disabled={!selectedArea.provId} onChange={(e) => handleWilayahChange('regency', e.target.value, e.target.options[e.target.selectedIndex].text)} value={selectedArea.regencyId}>
                                <option value="">Kota/Kab</option>
                                {regencies.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                            </select>
                            <select className="p-2 border rounded" disabled={!selectedArea.regencyId} onChange={(e) => handleWilayahChange('district', e.target.value, e.target.options[e.target.selectedIndex].text)} value={selectedArea.districtId}>
                                <option value="">Kecamatan</option>
                                {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                        </div>
                        <select className="w-full p-2 border rounded" disabled={!selectedArea.districtId} onChange={(e) => handleWilayahChange('village', e.target.value, e.target.options[e.target.selectedIndex].text)} value={selectedArea.villageId}>
                            <option value="">Kelurahan / Desa</option>
                            {villages.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                        </select>
                        <input className="w-full p-2 border rounded" name="domicile_address_detail" placeholder="Jalan, No Rumah, RT/RW" onChange={handleChange} defaultValue={formData.domicile_address_detail} required />
                    </div>
                </div>
            )
        }
        // [VISUAL STEP 2]
        if (step === 2) {
            return (
                <div className="space-y-4 animate-fade-in">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800"><Truck className="text-primary"/> Data Truk</h2>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                        <input className="p-3 border rounded-xl w-full" name="nopol" placeholder="Plat Nomor (B 1234 XX)" onChange={handleChange} defaultValue={formData.nopol} required />
                        <input className="p-3 border rounded-xl w-full" name="merk_tahun" placeholder="Merk & Tahun (Canter 2020)" onChange={handleChange} defaultValue={formData.merk_tahun} required />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                        <label className="text-xs font-bold uppercase text-gray-500">Jenis & Dimensi Bak Riil</label>
                        <select className="w-full p-3 border rounded" name="jenis_armada_id" onChange={handleChange} value={formData.jenis_armada_id} required>
                            {fleets.length > 0 ? (
                                fleets.map(f => (
                                    <option key={f.id} value={f.id}> 
                                        {f.name} - {f.capacity_display}
                                    </option>
                                ))
                            ) : (
                                <option value="">Loading armada...</option>
                            )}
                        </select>
                        
                        <label className="text-sm font-bold block pt-2">Dimensi Bak Riil (Meter):</label>
                        <div className="grid grid-cols-3 gap-2">
                            <input className="p-2 border rounded" type="number" name="panjang_bak" placeholder="P (m)" onChange={handleChange} required />
                            <input className="p-2 border rounded" type="number" name="lebar_bak" placeholder="L (m)" onChange={handleChange} required />
                            <input className="p-2 border rounded" type="number" name="tinggi_bak" placeholder="T (m)" onChange={handleChange} required />
                        </div>
                    </div>
                </div>
            )
        }
        // [VISUAL STEP 3]
        if (step === 3) {
            return (
                <div className="space-y-5 animate-fade-in">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800"><FileText className="text-primary"/> Upload Dokumen</h2>
                    <p className="text-sm text-gray-500">Format: JPG/PNG. Maks 5MB per file.</p>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* DOKUMEN IDENTITAS (WAJIB) */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold block">1. Foto KTP *</label>
                            <input type="file" name="ktp_photo" onChange={handleFileChange} required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold block">2. Foto SIM *</label>
                            <input type="file" name="sim_photo" onChange={handleFileChange} required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold block">3. Selfie + KTP *</label>
                            <input type="file" name="selfie_photo" onChange={handleFileChange} required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold block">4. Foto SKCK (Opsional)</label>
                            <input type="file" name="skck_photo" onChange={handleFileChange} />
                        </div>
                        {/* DOKUMEN KENDARAAN (WAJIB) */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold block">5. Foto STNK *</label>
                            <input type="file" name="stnk_photo" onChange={handleFileChange} required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold block">6. Foto KIR (Opsional)</label>
                            <input type="file" name="kir_photo" onChange={handleFileChange} />
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <label className="text-sm font-bold block mb-3">Foto Fisik Truk (Depan, Samping, Belakang)*</label>
                        <div className="grid grid-cols-3 gap-2">
                            <input type="file" name="foto_depan" onChange={handleFileChange} className="text-xs" required/>
                            <input type="file" name="foto_samping" onChange={handleFileChange} className="text-xs" required/>
                            <input type="file" name="foto_belakang" onChange={handleFileChange} className="text-xs" required/>
                        </div>
                    </div>
                </div>
            )
        }
        // [VISUAL STEP 4]
        if (step === 4) {
            return (
                <div className="space-y-4 animate-fade-in">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800"><Landmark className="text-primary"/> Rekening Pencairan</h2>
                    
                    <select className="w-full p-3 border rounded-xl" name="bank_name" onChange={handleChange} value={formData.bank_name}>
                        <option value="BCA">BCA</option>
                        <option value="BRI">BRI</option>
                        <option value="MANDIRI">Mandiri</option>
                        <option value="BNI">BNI</option>
                        <option value="LAINNYA">Lainnya</option>
                    </select>
                    
                    <input className="p-3 border rounded-xl w-full" name="bank_account_number" placeholder="Nomor Rekening" onChange={handleChange} required />
                    <input className="p-3 border rounded-xl w-full" name="bank_account_holder" placeholder="Nama Pemilik (Sesuai KTP)" onChange={handleChange} required />
                </div>
            )
        }
        // [VISUAL STEP 5]
        if (step === 5) {
            return (
                <div className="text-center py-10">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">Pendaftaran Berhasil!</h2>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                        Terima kasih <b>{formData.full_name_ktp}</b>. Status awal Anda adalah **Waspada**, harap cek WhatsApp Anda untuk langkah verifikasi selanjutnya.
                    </p>
                    <button onClick={() => navigate('/')} className="mt-8 px-6 py-2 border rounded-full hover:bg-gray-50">
                        Kembali ke Beranda
                    </button>
                </div>
            )
        }
    };


    return (
        <form onSubmit={(e) => e.preventDefault()}>
             <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
                {/* Header Progress */}
                <div className="bg-slate-900 p-6 text-white text-center">
                    <h1 className="text-2xl font-bold mb-2">Pendaftaran Mitra Armada</h1>
                    <div className="flex justify-center gap-2 text-sm opacity-80">
                        <span className={step >= 1 ? "text-primary font-bold" : ""}>1. Diri</span> &bull; 
                        <span className={step >= 2 ? "text-primary font-bold" : ""}> 2. Truk</span> &bull; 
                        <span className={step >= 3 ? "text-primary font-bold" : ""}> 3. Dokumen</span> &bull; 
                        <span className={step >= 4 ? "text-primary font-bold" : ""}> 4. Bank</span>
                    </div>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-red-700 flex items-start gap-3">
                            <AlertTriangle className="shrink-0" />
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    {renderStep()}

                    {/* TOMBOL NAVIGASI */}
                    {step < 5 && (
                        <div className="flex gap-4 mt-8 pt-6 border-t">
                            {step > 1 && (
                                <button 
                                    onClick={() => setStep(step - 1)}
                                    className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 flex items-center gap-2"
                                >
                                    <ArrowLeft size={18}/> Kembali
                                </button>
                            )}
                            
                            <button 
                                onClick={step === 4 ? handleSubmit : () => {
                                    if(validateStep(step)) setStep(step + 1);
                                }}
                                disabled={isLoading || (step === 4 && !formData.bank_account_number)}
                                className="flex-1 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition flex items-center justify-center gap-2 shadow-lg shadow-red-500/30 ml-auto"
                            >
                                {isLoading ? 'Mengirim Data...' : (step === 4 ? 'Kirim Pendaftaran' : 'Lanjut')} <ArrowRight size={18}/>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </form>
    );
}

export default MitraRegistrationForm;
