// src/components/SimulasiHargaPage.jsx

import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';

// IMPORT CONFIG DARI FILE BARU (Pastikan path-nya benar)
import { ENDPOINTS } from '../apiConfig'; 

const SimulasiHargaPage = ({ darkMode }) => {
    
    // URL DIAMBIL DARI FILE CONFIG (Rapi & Aman)
    const API_FLEET = ENDPOINTS.FLEETS;
    const API_GEOCODE = ENDPOINTS.GEOCODE;
    const API_PRICING = ENDPOINTS.PRICING;

    const [armadaOptions, setArmadaOptions] = useState([]);
    const [formData, setFormData] = useState({
        origin: null, 
        destination: null,
        fleet_id: '',
        fleet_name: '',
        weight: '', 
        volume: '', 
    });

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [formError, setFormError] = useState(null);

    // Style Dropdown (Support Dark Mode)
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            minHeight: '44px',
            borderRadius: '0.5rem',
            borderColor: state.isFocused ? (darkMode ? '#d97706' : '#f59e0b') : (darkMode ? '#374151' : '#e5e7eb'),
            backgroundColor: darkMode ? '#1f2937' : 'white',
            color: darkMode ? 'white' : 'black',
        }),
        singleValue: (provided) => ({ ...provided, color: darkMode ? 'white' : 'black' }),
        menu: (provided) => ({ ...provided, zIndex: 100, backgroundColor: darkMode ? '#1f2937' : 'white' }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? (darkMode ? '#374151' : '#fef3c7') : 'transparent',
            color: darkMode ? 'white' : 'black',
        }),
    };

    // Ambil Data Armada
    useEffect(() => {
        fetch(API_FLEET) 
            .then(res => res.json())
            .then(data => {
                const results = data.results || (Array.isArray(data) ? data : []);
                setArmadaOptions(results);
                if (results.length > 0) {
                    setFormData(prev => ({ 
                        ...prev, 
                        fleet_id: results[0].id.toString(), 
                        fleet_name: results[0].name 
                    }));
                }
            })
            .catch(err => console.error("Error fetching fleets:", err));
    }, [API_FLEET]);

    // Search Lokasi (TomTom via Backend)
    const loadOptions = async (inputValue) => {
        if (!inputValue || inputValue.length < 3) return [];
        try {
            const response = await fetch(`${API_GEOCODE}?q=${inputValue}`);
            if (!response.ok) throw new Error("Gagal load lokasi");
            const data = await response.json();
            return data.map(item => ({
                label: item.label,
                value: `${item.lat},${item.lng}`,
                lat: item.lat,
                lng: item.lng
            }));
        } catch (error) {
            console.error("Geocode error:", error);
            return [];
        }
    };
    
    // Handle Input
    const handleLocationChange = (name, selectedOption) => {
        setFormData(prev => ({
            ...prev,
            [name]: selectedOption ? { lat: selectedOption.lat, lng: selectedOption.lng, label: selectedOption.label } : null
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleFleetChange = (selectedOption) => {
        setFormData(prev => ({
            ...prev,
            fleet_id: selectedOption.value,
            fleet_name: selectedOption.label
        }));
    };

    // Submit Hitung Harga
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);
        setResult(null);

        if (!formData.origin || !formData.destination || !formData.fleet_id) {
            setFormError("Lokasi dan Armada wajib diisi!");
            return;
        }

        setLoading(true);
        
        try {
            const payload = {
                origin_lat: formData.origin.lat,
                origin_lng: formData.origin.lng,
                dest_lat: formData.destination.lat,
                dest_lng: formData.destination.lng,
                fleet_id: formData.fleet_id,
                // KUNCI: Kirim 0 jika kosong
                weight: formData.weight === '' ? 0 : parseFloat(formData.weight), 
                volume: formData.volume === '' ? 0 : parseFloat(formData.volume),
            };

            const response = await fetch(API_PRICING, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok || data.error) {
                throw new Error(data.error || "Gagal menghitung harga (Cek API Key / Rute).");
            }
            
            setResult({
                price: parseFloat(data.estimated_price),
                armadaName: formData.fleet_name || 'Armada',
                distance: `${data.distance_km} km`, 
                eta: data.duration_text,
                details: data.details, 
            });

        } catch (err) {
            console.error("Pricing Error:", err.message);
            setFormError(`Gagal: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        // NAVBAR FIX: Tambahkan 'pt-24'
        <div className={`pt-24 p-6 md:p-12 min-h-screen ${darkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
            
            <header className="mb-10 text-center">
                <h1 className="text-4xl font-extrabold text-primary mb-2">Simulasi Harga Logistik</h1>
                <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Cek ongkir truk instan. Jarak riil & akurat.
                </p>
            </header>

            {formError && (
                <div className="max-w-4xl mx-auto bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded" role="alert">
                    <p className="font-bold">Info</p>
                    <p>{formError}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className={`max-w-4xl mx-auto p-6 rounded-xl shadow-2xl ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="block text-sm font-bold mb-2">Lokasi Muat (Asal)</label>
                        <AsyncSelect
                            cacheOptions loadOptions={loadOptions} defaultOptions
                            onChange={(opt) => handleLocationChange('origin', opt)}
                            placeholder="Ketik Kota..." styles={customStyles}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">Lokasi Bongkar (Tujuan)</label>
                        <AsyncSelect
                            cacheOptions loadOptions={loadOptions} defaultOptions
                            onChange={(opt) => handleLocationChange('destination', opt)}
                            placeholder="Ketik Kota..." styles={customStyles}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 items-end">
                    <div className="md:col-span-1">
                        <label className="block text-sm font-bold mb-2">Armada</label>
                        <Select
                            options={armadaOptions.map(a => ({ value: a.id.toString(), label: a.name }))}
                            onChange={handleFleetChange}
                            value={formData.fleet_id ? { value: formData.fleet_id, label: formData.fleet_name } : null}
                            placeholder="Pilih..." styles={customStyles}
                        />
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-sm font-bold mb-2">Berat (Kg)</label>
                        <input
                            type="number" name="weight" value={formData.weight} onChange={handleChange}
                            placeholder="0"
                            className={`w-full p-2.5 border rounded-lg ${darkMode ? 'bg-slate-700 border-gray-600' : 'border-gray-300'}`}
                        />
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-sm font-bold mb-2">Volume (m³)</label>
                        <input
                            type="number" name="volume" value={formData.volume} onChange={handleChange}
                            placeholder="0"
                            className={`w-full p-2.5 border rounded-lg ${darkMode ? 'bg-slate-700 border-gray-600' : 'border-gray-300'}`}
                        />
                    </div>
                    <div className="md:col-span-1">
                        <button
                            type="submit" disabled={loading}
                            className={`w-full py-3 px-4 rounded-lg font-bold transition duration-200 ${loading ? 'bg-gray-400' : 'bg-primary text-white hover:bg-secondary'}`}
                        >
                            {loading ? 'Menghitung...' : 'Hitung'}
                        </button>
                    </div>
                </div>
            </form>

            {result && (
                <div className={`max-w-4xl mx-auto mt-8 p-6 rounded-2xl shadow-xl border ${darkMode ? 'bg-slate-900 border-primary' : 'bg-red-50 border-primary'}`}>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-extrabold text-primary">Estimasi Biaya</h3>
                        {result.details.is_cached && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Cached</span>}
                    </div>
                    
                    <div className="flex justify-between border-b border-dashed pb-2 mb-2">
                        <span>Jarak ({result.distance})</span>
                        <span className="font-bold">Rp {new Intl.NumberFormat('id-ID').format(result.details.base_price)}</span>
                    </div>

                    {(result.details.surcharge_weight > 0 || result.details.surcharge_volume > 0) && (
                        <div className="text-red-500 text-sm mb-2">
                            *Termasuk biaya tambahan (Surcharge) muatan.
                        </div>
                    )}

                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-300">
                        <span className="text-xl font-bold">TOTAL</span>
                        <span className="text-4xl font-extrabold text-primary">Rp {new Intl.NumberFormat('id-ID').format(result.price)}</span>
                    </div>
                    
                    <button className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-lg">
                        Pesan via WhatsApp
                    </button>
                </div>
            )}
        </div>
    );
};

export default SimulasiHargaPage;
