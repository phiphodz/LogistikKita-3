import React, { useState } from 'react';
import { collection, addDoc, getFirestore } from 'firebase/firestore';
import { Truck, Image, AlertTriangle } from 'lucide-react';

const FleetUploadForm = ({ db, darkMode }) => {
    const [form, setForm] = useState({
        name: '', type: 'Small', capacity: '', dimension: '', volume: '', description: '', imageUrl: '', order: 1,
    });
    const [status, setStatus] = useState(''); // idle, uploading, success, error

    const handleFileUpload = (e) => {
        // --- LOGIKA FIREBASE STORAGE AKAN MASUK SINI NANTI ---
        const file = e.target.files[0];
        if (file) {
            alert(`File ${file.name} terpilih. Implementasi upload ke Firebase Storage dan mendapatkan URL gambar akan dilakukan di tahap Backend.`);
            // Sementara, kita pakai URL placeholder
            setForm({ ...form, imageUrl: 'https://placehold.co/600x400' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const firestore = db || getFirestore();
        if (!firestore) return;

        setStatus('uploading');
        try {
            const dataToSave = { ...form, order: Number(form.order), submittedAt: new Date() };
            // Menyimpan data ke koleksi public_fleets (yang juga digunakan di home page)
            await addDoc(collection(firestore, 'public_fleets'), dataToSave); 
            setStatus('success');
            setForm({ name: '', type: 'Small', capacity: '', dimension: '', volume: '', description: '', imageUrl: '', order: 1 });
            setTimeout(() => setStatus(''), 5000); 
        } catch (error) {
            console.error("Error adding fleet:", error);
            setStatus('error');
        }
    };

    return (
        <div className={`p-8 rounded-2xl ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
            <p className="text-sm text-gray-500 mb-8">Isi data lengkap armada Anda. Tim kami akan segera memproses pendaftaran.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* General Info */}
                <div className="grid md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Nama Armada (Ex: Truk CDD Box)" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} 
                        className={`w-full p-3 rounded-lg border-2 ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-gray-50 border-gray-200'}`} />
                    <select required value={form.type} onChange={e => setForm({...form, type: e.target.value})} 
                        className={`w-full p-3 rounded-lg border-2 ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-gray-50 border-gray-200'}`}>
                        <option value="Small">Small (Pickup/Van)</option><option value="Medium">Medium (CDE)</option><option value="Large">Large (CDD)</option><option value="Heavy">Heavy (Fuso/Tronton)</option>
                    </select>
                </div>

                {/* Specs */}
                <div className="grid md:grid-cols-3 gap-4">
                    <input type="text" placeholder="Kapasitas (Ex: 5 Ton)" required value={form.capacity} onChange={e => setForm({...form, capacity: e.target.value})} 
                        className={`w-full p-3 rounded-lg border-2 ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-gray-50 border-gray-200'}`} />
                    <input type="text" placeholder="Volume (Ex: 14 CBM)" required value={form.volume} onChange={e => setForm({...form, volume: e.target.value})} 
                        className={`w-full p-3 rounded-lg border-2 ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-gray-50 border-gray-200'}`} />
                    <input type="number" placeholder="Order Prioritas (1, 2, 3...)" required value={form.order} onChange={e => setForm({...form, order: e.target.value})} 
                        className={`w-full p-3 rounded-lg border-2 ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-gray-50 border-gray-200'}`} />
                </div>
                
                <input type="text" placeholder="Dimensi (Ex: 4.2 x 1.9 x 1.8 m)" required value={form.dimension} onChange={e => setForm({...form, dimension: e.target.value})} 
                    className={`w-full p-3 rounded-lg border-2 ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-gray-50 border-gray-200'}`} />

                {/* Description */}
                <textarea placeholder="Deskripsi Singkat (Max 100 karakter)" required value={form.description} onChange={e => setForm({...form, description: e.target.value})} maxLength={100}
                    className={`w-full p-3 rounded-lg border-2 h-20 resize-none ${darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-gray-50 border-gray-200'}`} />

                {/* Image Upload */}
                <div className={`p-4 rounded-lg border-2 border-dashed flex items-center gap-4 ${darkMode ? 'border-primary/50 bg-slate-900' : 'border-primary/30 bg-gray-50'}`}>
                    <Image className="w-5 h-5 text-primary" />
                    <input type="file" accept="image/*" onChange={handleFileUpload} 
                        className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30" />
                </div>
                
                {/* Submit Button */}
                <button type="submit" disabled={status === 'uploading' || status === 'success'} className={`w-full py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 ${status === 'success' ? 'bg-green-500 text-white' : 'bg-primary hover:bg-red-600 text-white'}`}>
                    {status === 'uploading' ? 'Menyimpan Data...' : (status === 'success' ? 'Data Armada Tersimpan!' : <>Tambah Armada <Truck className="w-5 h-5" /></>)}
                </button>

                {status === 'error' && <p className="text-red-500 text-center text-sm flex items-center justify-center gap-1"><AlertTriangle className="w-4 h-4" /> Gagal menyimpan. Cek Console.</p>}
            </form>
        </div>
    );
};

export default FleetUploadForm;
