import axios from 'axios';

// Mengambil kunci dari .env (Vite)
const API_KEY = import.meta.env.VITE_TOMTOM_API_KEY;

// 1. FUNGSI MENCARI KOORDINAT (Geocoding)
export async function getCoordinates(alamat) {
  try {
    const url = `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(alamat)}.json?key=${API_KEY}`;
    const response = await axios.get(url);
    
    if (response.data.results && response.data.results.length > 0) {
      const posisi = response.data.results[0].position;
      return { lat: posisi.lat, lon: posisi.lon };
    }
    throw new Error("Alamat tidak ditemukan");
  } catch (error) {
    console.error("Gagal Geocoding:", error);
    return null;
  }
}

// 2. FUNGSI HITUNG RUTE & JARAK (Routing)
// Support: Mobil Kecil (car) & Truk Besar (truck)
export async function getRoute(titikAsal, titikTujuan, jenisKendaraan = 'car') {
  try {
    // Tentukan Mode: Jika nama kendaraan mengandung 'truk'/'fuso', pakai mode TRUCK
    const isTruck = jenisKendaraan.toLowerCase().match(/truk|fuso|tronton|box/);
    const travelMode = isTruck ? 'truck' : 'car';

    console.log(`🚚 Menghitung rute untuk: ${jenisKendaraan} (Mode API: ${travelMode})`);

    let url = `https://api.tomtom.com/routing/1/calculateRoute/${titikAsal.lat},${titikAsal.lon}:${titikTujuan.lat},${titikTujuan.lon}/json?key=${API_KEY}`;
    
    // Parameter Wajib
    url += `&travelMode=${travelMode}`;
    url += `&traffic=true`; // Hitung macet real-time

    // PARAMETER KHUSUS TRUK (Agar tidak lewat jalan sempit)
    if (travelMode === 'truck') {
      url += `&vehicleWeight=12000`; // Asumsi berat 12 ton
      url += `&vehicleLength=12`;    // Panjang 12m
      url += `&vehicleWidth=2.5`;    // Lebar 2.5m
    }

    const response = await axios.get(url);
    const data = response.data.routes[0].summary;

    return {
      jarak_km: (data.lengthInMeters / 1000).toFixed(2), // Jadi KM
      waktu_detik: data.travelTimeInSeconds,
      waktu_jam_menit: convertToJamMenit(data.travelTimeInSeconds),
      eta: response.data.routes[0].summary.arrivalTime
    };

  } catch (error) {
    console.error("Gagal Routing:", error);
    return null;
  }
}

// Helper: Ubah detik jadi jam menit
function convertToJamMenit(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h} jam ${m} menit`;
}

// 3. FUNGSI GABUNGAN (YANG DIPANGGIL DI FRONTEND)
export async function hitungOngkirLengkap(alamatAsal, alamatTujuan, kendaraan) {
  // A. Cari Koordinat Asal
  const coordAsal = await getCoordinates(alamatAsal);
  if (!coordAsal) return { error: "Alamat Asal tidak ditemukan!" };

  // B. Cari Koordinat Tujuan
  const coordTujuan = await getCoordinates(alamatTujuan);
  if (!coordTujuan) return { error: "Alamat Tujuan tidak ditemukan!" };

  // C. Hitung Rute
  const rute = await getRoute(coordAsal, coordTujuan, kendaraan);
  if (!rute) return { error: "Gagal menghitung rute (mungkin terhalang laut)" };

  // D. Return Hasil
  return {
    sukses: true,
    asal: alamatAsal,
    tujuan: alamatTujuan,
    kendaraan: kendaraan,
    jarak: rute.jarak_km,
    durasi: rute.waktu_jam_menit,
    // Disini kamu bisa tambah rumus harga sendiri
    // estimasi_harga: rute.jarak_km * harga_per_km
  };
}
