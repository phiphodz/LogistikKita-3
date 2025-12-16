// src/config/AppConfig.js
// FILE INI BISA DITIMPA SETIAP GANTI CODESPACE TANPA RUSAK KODE LAIN

/**
 * ================================================
 * CONFIGURASI APLIKASI - CENTRAL MANAGER
 * ================================================
 * SETIAP GANTI CODESPACE, UBAH VARIABEL DI BAWAH INI SAJA!
 * ================================================
 */

// 1. CODESPACE URL CONFIG (GANTI INI SETIAP PINDH AKUN)
const CODESPACE_CONFIG = {
  // === AKUN GITHUB KE-3 (SAAT INI) ===
  BACKEND_URL: 'https://bug-free-disco-4g97prv74g72vjr-8000.app.github.dev',
  FRONTEND_URL: 'https://bug-free-disco-4g97prv74g72vjr-5173.app.github.dev',
  
  // === TEMPLATE UNTUK AKUN BERIKUTNYA ===
  // AKUN KE-4: ganti-bug-free-disco-dengan-nama-baru
  // BACKEND_URL: 'https://[NAMA-CODESPACE]-8000.app.github.dev',
  // FRONTEND_URL: 'https://[NAMA-CODESPACE]-5173.app.github.dev',
};

// 2. API ENDPOINTS (AUTO GENERATE DARI BACKEND_URL)
const API_BASE_URL = `${CODESPACE_CONFIG.BACKEND_URL}/api`;

// 3. EXPORT SEMUA CONFIG
export const AppConfig = {
  // URLs
  BACKEND_URL: CODESPACE_CONFIG.BACKEND_URL,
  FRONTEND_URL: CODESPACE_CONFIG.FRONTEND_URL,
  API_BASE_URL: API_BASE_URL,
  
  // API Endpoints (generated)
  ENDPOINTS: {
    // AUTHENTICATION
    LOGIN: `${API_BASE_URL}/token/`,
    REFRESH: `${API_BASE_URL}/token/refresh/`,
    
    // CUSTOMER AUTH
    CUSTOMER_REGISTER: `${API_BASE_URL}/customer/register/`,
    CUSTOMER_VERIFY: `${API_BASE_URL}/customer/verify/`,
    CUSTOMER_RESEND_VERIFICATION: `${API_BASE_URL}/customer/resend-verification/`,
    
    // PASSWORD
    FORGOT_PASSWORD_REQUEST: `${API_BASE_URL}/password/reset/`,
    FORGOT_PASSWORD_CONFIRM: `${API_BASE_URL}/password/reset/confirm/`,
    
    // MITRA
    MITRA_REGISTER: `${API_BASE_URL}/mitra/register/`,
    
    // SERVICES
    FLEETS: `${API_BASE_URL}/fleets/`,
    GEOCODE: `${API_BASE_URL}/geocode/`,
    PRICING: `${API_BASE_URL}/simulasi-harga/`,
    PROMOS: `${API_BASE_URL}/promos/`,
    TRACKING: `${API_BASE_URL}/tracking/`,
  },
  
  // App Constants
  APP_NAME: 'Logistik Kita',
  SUPPORT_EMAIL: 'logistikkita.assist@gmail.com',
  SUPPORT_PHONE: '+6285813487753',
  
  // Feature Flags
  FEATURES: {
    ENABLE_SIGNUP: true,
    ENABLE_MITRA_REGISTRATION: true,
    ENABLE_PRICING_SIMULATION: true,
    MAINTENANCE_MODE: false,
  },
  
  // External APIs (TomTom, dll)
  EXTERNAL_APIS: {
    TOMTOM_API_KEY: import.meta.env.VITE_TOMTOM_API_KEY || '',
    WILAYAH_API_BASE: 'https://www.emsifa.com/api-wilayah-indonesia/api',
  },
};

// 4. VALIDATION & LOGGING
console.log('🔧 AppConfig Loaded:', {
  backend: AppConfig.BACKEND_URL,
  frontend: AppConfig.FRONTEND_URL,
  features: Object.keys(AppConfig.FEATURES).filter(k => AppConfig.FEATURES[k]),
});
