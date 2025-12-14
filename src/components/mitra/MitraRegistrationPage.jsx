// src/components/mitra/MitraRegistrationPage.jsx

import React, { useState } from 'react';
// PERBAIKAN IMPORT: Mundur 2 folder (../../) untuk mencari apiConfig di src
import { ENDPOINTS } from '../../apiConfig'; 

const MitraRegistrationPage = () => {
    const [formData, setFormData] = useState({
        full_name_ktp: '',
        phone_number: '',
        mitra_type: 'OWNER_OPERATOR',
        // Tambahkan field lain jika nanti perlu
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        // Gunakan FormData agar siap jika nanti ada fitur upload foto
        const dataToSend = new FormData();
        Object.keys(formData).forEach(key => {
            dataToSend.append(key, formData[key]);
        });

        try {
            // URL DIAMBIL DARI CONFIG (Aman dari error CORS)
            const response = await fetch(ENDPOINTS.MITRA_REGISTER, {
                method: 'POST',
                body: dataToSend, 
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(JSON.stringify(errData));
            }

            setMessage('Pendaftaran Berhasil! Silakan tunggu verifikasi admin.');
        } catch (error) {
            console.error("Register Error:", error);
            // Handle error message biar lebih cantik
            let msg = error.message;
            try {
                // Coba parse kalau errornya JSON object
                const parsed = JSON.parse(msg);
                msg = parsed.detail || JSON.stringify(parsed);
            } catch (e) {}
            
            setMessage(`Gagal: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-24 p-6 min-h-screen bg-gray-50">
            <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center text-primary">Gabung Mitra Driver</h2>
                
                {message && (
                    <div className={`p-4 mb-4 rounded ${message.includes('Gagal') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Nama Sesuai KTP</label>
                        <input 
                            type="text" name="full_name_ktp" 
                            onChange={handleChange} required
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                            placeholder="Contoh: Budi Santoso"
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">No. WhatsApp</label>
                        <input 
                            type="text" name="phone_number" 
                            onChange={handleChange} required
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                            placeholder="08123xxxxxx"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 font-bold mb-2">Tipe Mitra</label>
                        <select 
                            name="mitra_type" onChange={handleChange} 
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                        >
                            <option value="OWNER_OPERATOR">Pemilik Unit & Supir</option>
                            <option value="DRIVER">Supir Saja</option>
                        </select>
                    </div>

                    <button 
                        type="submit" disabled={loading}
                        className={`w-full font-bold py-3 rounded-lg transition ${
                            loading 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-primary text-white hover:bg-secondary'
                        }`}
                    >
                        {loading ? 'Mengirim Data...' : 'Daftar Sekarang'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MitraRegistrationPage;
