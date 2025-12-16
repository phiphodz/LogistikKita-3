import React, { useState } from 'react';
import { Search, Loader2, Truck, Package, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TrackingSection = ({ darkMode }) => {
    const navigate = useNavigate();
    const [resi, setResi] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Data dummy untuk demo
    const demoTrackingData = {
        currentStatus: "ON_DELIVERY",
        currentLocation: "KM 67 Tol Cipali, Jawa Barat",
        timeline: [
            { status: "PICKUP_COMPLETED", location: "Gudang Mojokerto", time: "Senin, 16 Des 08:00 WIB" },
            { status: "AT_WAREHOUSE", location: "Sorting Center Surabaya", time: "Senin, 16 Des 12:30 WIB" },
            { status: "DEPARTED", location: "Pelabuhan Tanjung Perak", time: "Senin, 16 Des 18:45 WIB" },
            { status: "ON_DELIVERY", location: "KM 67 Tol Cipali", time: "Selasa, 17 Des 09:15 WIB" },
            { status: "ESTIMATED_DELIVERY", location: "Gudang Jakarta", time: "Selasa, 17 Des 14:00 WIB" }
        ]
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'PICKUP_COMPLETED': return <Package size={16} className="text-green-500" />;
            case 'AT_WAREHOUSE': return <MapPin size={16} className="text-blue-500" />;
            case 'DEPARTED': return <Truck size={16} className="text-orange-500" />;
            case 'ON_DELIVERY': return <Truck size={16} className="text-primary" />;
            case 'ESTIMATED_DELIVERY': return <Loader2 size={16} className="text-purple-500 animate-spin" />;
            default: return <Package size={16} className="text-gray-500" />;
        }
    };

    const getStatusText = (status) => {
        const statusMap = {
            'PICKUP_COMPLETED': 'Pickup Selesai',
            'AT_WAREHOUSE': 'Di Gudang',
            'DEPARTED': 'Berangkat',
            'ON_DELIVERY': 'Dalam Pengiriman',
            'ESTIMATED_DELIVERY': 'Estimasi Tiba'
        };
        return statusMap[status] || status;
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        // Simulasi loading
        setTimeout(() => {
            setLoading(false);
            // Untuk demo, selalu tampilkan data dummy
            navigate('/tracking/demo', { state: { trackingData: demoTrackingData, resi: resi || 'LKG-DEMO-001' } });
        }, 800);
    };

    return (
        <div className="relative z-20 mt-0"> {/* PERBAIKAN: mt-0 bukan -mt-16 */}
            <div className="w-full max-w-4xl mx-auto px-4 mt-4" id="tracking"> {/* PERBAIKAN: mt-4 bukan -mt-16 */}
                <div className={`glass-container p-6 md:p-8 shadow-2xl ${darkMode ? 'bg-gray-800/90' : 'bg-white/95'} backdrop-blur-xl transition-all duration-300`}>
                    
                    <div className="text-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
                            Lacak Status Pengiriman
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base mt-2">
                            Masukkan Nomor Resi atau ID Transaksi Anda
                        </p>
                    </div>
                    
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative w-full flex-grow">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                            <input 
                                type="text" 
                                value={resi}
                                onChange={(e) => setResi(e.target.value)}
                                placeholder="Contoh: LKG-8829100 atau LKG-DEMO-001" 
                                className="input-field pl-12 py-4 text-base md:text-lg"
                                disabled={loading}
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="btn-primary md:w-auto px-8 py-4 h-full shadow-lg flex items-center justify-center gap-2 w-full md:w-auto"
                            disabled={loading}
                        >
                            {loading ? <Loader2 size={20} className="animate-spin" /> : 'Lacak'}
                        </button>
                    </form>

                    {/* Demo Hint */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            💡 <strong>Tips:</strong> Gunakan <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">LKG-DEMO-001</code> untuk melihat demo pelacakan
                        </p>
                    </div>

                    {/* Quick Status Preview */}
                    <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                        <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                            <Truck size={18} />
                            Dokumentasi Armada Terbaru
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[
                                { id: 1, code: 'LKG-8829100', route: 'Jakarta → Surabaya', status: 'DELIVERED' },
                                { id: 2, code: 'LKG-8829101', route: 'Medan → Batam', status: 'ON_DELIVERY' },
                                { id: 3, code: 'LKG-8829102', route: 'Bandung → Yogyakarta', status: 'AT_WAREHOUSE' },
                                { id: 4, code: 'LKG-8829103', route: 'Semarang → Malang', status: 'PROCESSING' }
                            ].map((item) => (
                                <div key={item.id} className={`p-3 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-mono text-sm font-bold">{item.code}</p>
                                            <p className="text-xs text-gray-500">{item.route}</p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs rounded-full ${item.status === 'DELIVERED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'}`}>
                                            {item.status === 'DELIVERED' ? 'Selesai' : 'Aktif'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackingSection;
