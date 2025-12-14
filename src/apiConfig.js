// src/apiConfig.js (REVISI FINAL PROFESIONAL)

// --- FUNGSI UTILITY UNTUK MENDAPATKAN BASE URL YANG KOMPATIBEL ---
// Ini memperbaiki masalah "process is not defined" dan mendukung VITE (import.meta.env)
const getBaseUrl = () => {
    // 1. Coba akses dari environment variable VITE (Standar modern/Vite)
    // Variabel VITE harus diawali 'VITE_' di file .env
    if (typeof import.meta !== 'undefined' && import.meta.env.VITE_API_BASE_URL) {
        return import.meta.env.VITE_API_BASE_URL; 
    }
    // 2. Fallback untuk environment lama (CRA/Webpack yang menyuntikkan process.env)
    if (typeof process !== 'undefined' && process.env.REACT_APP_API_BASE_URL) {
        return process.env.REACT_APP_API_BASE_URL; 
    }
    
    // 3. Fallback Default Lokal
    // Menggunakan port 8001 yang benar untuk Codespace Django
    return 'http://localhost:8001'; 
};

export const API_BASE_URL = getBaseUrl();

export const ENDPOINTS = {
    // =======================================================
    // I. AUTHENTICATION & TOKEN MANAGEMENT (Simple JWT standard)
    // =======================================================
    LOGIN: `${API_BASE_URL}/api/token/`,             // Mendapatkan Access/Refresh Token
    REFRESH: `${API_BASE_URL}/api/token/refresh/`,    // Memperbarui Access Token
    
    // =======================================================
    // II. MITRA & FLEET ENDPOINTS
    // =======================================================
    FLEETS: `${API_BASE_URL}/api/fleets/`,
    MITRA_REGISTER: `${API_BASE_URL}/api/mitra/register/`, 
    
    // =======================================================
    // III. CUSTOMER (SHIPPER) WORKFLOW ENDPOINTS
    // =======================================================
    CUSTOMER_REGISTER: `${API_BASE_URL}/api/customer/register/`, // Pendaftaran Shipper
    CUSTOMER_VERIFY: `${API_BASE_URL}/api/customer/verify/`,     // Verifikasi Email (dari link)
    CUSTOMER_RESEND_VERIFICATION: `${API_BASE_URL}/api/customer/resend-verification/`, // Kirim Ulang Email
    
    // =======================================================
    // IV. PASSWORD RECOVERY WORKFLOW (Umumnya butuh 2 langkah API)
    // =======================================================
    FORGOT_PASSWORD_REQUEST: `${API_BASE_URL}/api/password/reset/`, // Kirim email reset
    FORGOT_PASSWORD_CONFIRM: `${API_BASE_URL}/api/password/reset/confirm/`, // Konfirmasi reset dengan token

    // =======================================================
    // V. GENERAL SERVICES
    // =======================================================
    GEOCODE: `${API_BASE_URL}/api/geocode/`,
    PRICING: `${API_BASE_URL}/api/simulasi-harga/`,
};
