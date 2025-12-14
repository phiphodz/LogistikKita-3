import React, { useState } from 'react';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { Database, Upload, CheckCircle, AlertTriangle } from 'lucide-react';

const AdminSeeder = ({ db }) => {
    const [status, setStatus] = useState('idle'); // idle, loading, success, error

    const seedData = async () => {
        if (!db) return;
        setStatus('loading');
        const batch = writeBatch(db);

        try {
            // ==========================================
            // 1. DATA ARMADA (LENGKAP & PROFESIONAL)
            // ==========================================
            const fleets = [
                {
                    id: 'blindvan',
                    name: "Blind Van",
                    type: "Express",
                    capacity: "600 kg",
                    dimension: "2.1 x 1.3 x 1.2 m",
                    volume: "3 CBM",
                    description: "Cocok untuk paket kargo kecil, catering, atau barang elektronik yang butuh perlindungan ekstra dari cuaca (tertutup rapat).",
                    features: ["City Courier", "Aman Hujan", "Segel"],
                    imageUrl: "https://images.unsplash.com/photo-1598555835694-825df8d933e4?auto=format&fit=crop&w=600&q=80",
                    order: 1
                },
                {
                    id: 'pickup_bak',
                    name: "Pickup Bak",
                    type: "Small",
                    capacity: "800 kg - 1.5 Ton",
                    dimension: "2.4 x 1.6 x 1.2 m",
                    volume: "5 CBM",
                    description: "Armada paling fleksibel untuk pindahan kos, angkut material bangunan, atau pengiriman jarak dekat-menengah.",
                    features: ["Terpal Standar", "Tali Tambang", "Pindahan"],
                    imageUrl: "https://images.unsplash.com/photo-1606769493608-410e74dc9456?auto=format&fit=crop&w=600&q=80",
                    order: 2
                },
                {
                    id: 'cde_box',
                    name: "Truk CDE (Engkel) Box",
                    type: "Medium",
                    capacity: "2.2 Ton",
                    dimension: "3.2 x 1.7 x 1.7 m",
                    volume: "9 CBM",
                    description: "Colt Diesel Engkel (4 Roda). Pilihan tepat untuk distribusi barang retail ke dalam kota atau gang yang agak besar.",
                    features: ["Box Aluminium", "Bebas Hujan", "Distribusi Toko"],
                    imageUrl: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=600&q=80",
                    order: 3
                },
                {
                    id: 'cdd_bak',
                    name: "Truk CDD (Double) Bak",
                    type: "Large",
                    capacity: "4 - 5 Ton",
                    dimension: "4.2 x 1.9 x 1.8 m",
                    volume: "14 CBM",
                    description: "Colt Diesel Double (6 Roda). Workhorse logistik untuk muatan berat seperti hasil pertanian, mesin, atau material proyek.",
                    features: ["Muatan Berat", "Bak Terbuka", "Lintas Provinsi"],
                    imageUrl: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80",
                    order: 4
                },
                {
                    id: 'fuso',
                    name: "Fuso Berat",
                    type: "Heavy",
                    capacity: "8 Ton",
                    dimension: "6.0 x 2.4 x 2.3 m",
                    volume: "30 CBM",
                    description: "Solusi untuk pengiriman volume besar sekali jalan. Sangat efisien untuk pindahan rumah besar atau distribusi pabrik.",
                    features: ["Kapasitas Besar", "Jarak Jauh", "Efisiensi Biaya"],
                    imageUrl: "https://images.unsplash.com/photo-1591768793355-74d04bb6608f?auto=format&fit=crop&w=600&q=80",
                    order: 5
                },
                {
                    id: 'wingbox',
                    name: "Tronton Wingbox",
                    type: "Heavy XL",
                    capacity: "15 - 20 Ton",
                    dimension: "9.4 x 2.4 x 2.4 m",
                    volume: "45 CBM",
                    description: "Truk raksasa dengan fitur buka samping (sayap). Mempercepat proses loading/unloading menggunakan forklift.",
                    features: ["Buka Samping", "Muatan Palet", "Pabrik ke Pabrik"],
                    imageUrl: "https://images.unsplash.com/photo-1542302633-8b835e386915?auto=format&fit=crop&w=600&q=80",
                    order: 6
                }
            ];

            fleets.forEach((item) => {
                const ref = doc(collection(db, "public_fleets")); // Masuk ke koleksi 'public_fleets'
                batch.set(ref, item);
            });

            // ==========================================
            // 2. DATA SERVICES (Agar tidak kosong)
            // ==========================================
            const services = [
                { title: "Kargo Darat", icon: "Truck", desc: "Truk Jawa-Bali", order: 1 },
                { title: "Kargo Laut", icon: "Ship", desc: "Antar Pulau", order: 2 },
                { title: "Express", icon: "Clock", desc: "1 Day Service", order: 3 },
                { title: "Sewa Armada", icon: "User", desc: "Lepas Kunci/Driver", order: 4 },
                { title: "Pindahan", icon: "Map", desc: "Rumah & Kantor", order: 5 },
                { title: "Project Logistics", icon: "Box", desc: "Kargo Alat Berat", order: 6 }
            ];
            services.forEach((item) => {
                const ref = doc(collection(db, "public_services"));
                batch.set(ref, item);
            });

             // ==========================================
            // 3. DATA TESTIMONI (Agar tidak kosong)
            // ==========================================
             const testimonials = [
                { name: "H. Samsul", role: "Juragan Beras", text: "Kiriman ke gudang Surabaya selalu aman dan tepat waktu. Sopirnya sopan-sopan.", rating: 5 },
                { name: "Dewi Sartika", role: "Owner Online Shop", text: "Sistem trackingnya sangat membantu. Customer saya jadi tidak rewel tanya paket.", rating: 5 },
                { name: "PT. Beton Jaya", role: "Corporate Partner", text: "Kerjasama B2B yang profesional. Invoice rapi dan termin pembayaran fleksibel.", rating: 5 },
            ];
            testimonials.forEach((item) => {
                const ref = doc(collection(db, "public_testimonials"));
                batch.set(ref, item);
            });


            await batch.commit();
            setStatus('success');
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    if (status === 'success') return null;

    return (
        <div className="fixed bottom-4 right-4 z-[100]">
            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-2xl border border-primary/50 max-w-sm">
                <div className="flex items-center gap-3 mb-4">
                    <Database className="text-primary w-6 h-6" />
                    <h3 className="font-bold text-lg">Setup Database</h3>
                </div>
                <p className="text-gray-400 text-sm mb-6">
                    Database Firestore Anda masih kosong. Klik tombol di bawah untuk mengisi <strong>Data Armada Dummy</strong>, Layanan, dan Testimoni awal.
                </p>
                
                <button 
                    onClick={seedData} 
                    disabled={status === 'loading'}
                    className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition ${status === 'loading' ? 'bg-gray-700 cursor-not-allowed' : 'bg-primary hover:bg-red-600 shadow-lg shadow-primary/30'}`}
                >
                    {status === 'loading' ? (
                        <>Mengupload... <Upload className="w-4 h-4 animate-bounce" /></>
                    ) : (
                        <>Upload Data Sekarang <Upload className="w-4 h-4" /></>
                    )}
                </button>
                {status === 'error' && <p className="text-red-500 text-xs mt-3 text-center flex items-center justify-center gap-1"><AlertTriangle className="w-3 h-3"/> Gagal. Cek Console.</p>}
            </div>
        </div>
    );
};

export default AdminSeeder;
