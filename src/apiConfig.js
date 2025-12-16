// src/apiConfig.js - FILE BARU (WRAPPER VERSION)
import { AppConfig } from './config/AppConfig';

// ================================================
// WRAPPER UNTUK BACKWARD COMPATIBILITY
// Semua kode lama tetap bekerja tanpa perubahan
// ================================================

// 1. Ekspor semua yang diperlukan untuk kode lama
export const API_BASE_URL = AppConfig.API_BASE_URL;
export const ENDPOINTS = AppConfig.ENDPOINTS;

// 2. Tambah fungsi utility untuk migrasi mudah
export const getBaseUrl = () => AppConfig.API_BASE_URL;
export const getBackendUrl = () => AppConfig.BACKEND_URL;
export const getFrontendUrl = () => AppConfig.FRONTEND_URL;
export const getAppConfig = () => ({ ...AppConfig });

// 3. Logging untuk debugging
console.log('🔌 API Config migrated to AppConfig system');
console.log('📡 Backend URL:', AppConfig.BACKEND_URL);
console.log('🔗 Login Endpoint:', AppConfig.ENDPOINTS.LOGIN);

// 4. Deprecation warning untuk developer
if (import.meta.env.DEV) {
  console.warn(
    '⚠️  apiConfig.js is now a wrapper for AppConfig.js\n' +
    '💡 Consider updating imports to use AppConfig directly:\n' +
    '   import { AppConfig } from "../config/AppConfig";\n' +
    '   AppConfig.ENDPOINTS.LOGIN'
  );
}

// ================================================
// OPTIONAL: Fallback jika AppConfig belum ada
// (untuk safety selama transisi)
// ================================================
const fallbackEndpoints = {
  LOGIN: 'http://localhost:8000/api/token/',
  CUSTOMER_REGISTER: 'http://localhost:8000/api/customer/register/',
  // ... lainnya
};

// Export fallback sebagai backup
export const FALLBACK_ENDPOINTS = fallbackEndpoints;
