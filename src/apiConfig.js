// src/apiConfig.js - WRAPPER FOR BACKWARD COMPATIBILITY
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
console.log('🚀 App Features:', Object.keys(AppConfig.FEATURES).filter(k => AppConfig.FEATURES[k]));

// 4. Deprecation warning untuk developer
if (import.meta.env.DEV) {
  console.warn(
    '⚠️  apiConfig.js is now a wrapper for AppConfig.js\n' +
    '💡 Consider updating imports to use AppConfig directly:\n' +
    '   import { AppConfig } from "../config/AppConfig";\n' +
    '   AppConfig.ENDPOINTS.LOGIN\n' +
    '   AppConfig.BACKEND_URL'
  );
}

// ================================================
// OPTIONAL: Fallback jika AppConfig belum ada
// (untuk safety selama transisi)
// ================================================
const fallbackEndpoints = {
  LOGIN: `${AppConfig.BACKEND_URL || 'http://localhost:8000'}/api/token/`,
  REFRESH: `${AppConfig.BACKEND_URL || 'http://localhost:8000'}/api/token/refresh/`,
  CUSTOMER_REGISTER: `${AppConfig.BACKEND_URL || 'http://localhost:8000'}/api/customer/register/`,
  CUSTOMER_VERIFY: `${AppConfig.BACKEND_URL || 'http://localhost:8000'}/api/customer/verify/`,
  CUSTOMER_RESEND_VERIFICATION: `${AppConfig.BACKEND_URL || 'http://localhost:8000'}/api/customer/resend-verification/`,
  FORGOT_PASSWORD_REQUEST: `${AppConfig.BACKEND_URL || 'http://localhost:8000'}/api/password/reset/`,
  FORGOT_PASSWORD_CONFIRM: `${AppConfig.BACKEND_URL || 'http://localhost:8000'}/api/password/reset/confirm/`,
  MITRA_REGISTER: `${AppConfig.BACKEND_URL || 'http://localhost:8000'}/api/mitra/register/`,
  FLEETS: `${AppConfig.BACKEND_URL || 'http://localhost:8000'}/api/fleets/`,
  GEOCODE: `${AppConfig.BACKEND_URL || 'http://localhost:8000'}/api/geocode/`,
  PRICING: `${AppConfig.BACKEND_URL || 'http://localhost:8000'}/api/simulasi-harga/`,
  PROMOS: `${AppConfig.BACKEND_URL || 'http://localhost:8000'}/api/promos/`,
  TRACKING: `${AppConfig.BACKEND_URL || 'http://localhost:8000'}/api/tracking/`,
};

// Export fallback sebagai backup
export const FALLBACK_ENDPOINTS = fallbackEndpoints;

// Export default untuk compatibility
export default {
  API_BASE_URL,
  ENDPOINTS,
  getBaseUrl,
  getBackendUrl,
  getFrontendUrl,
  getAppConfig,
  FALLBACK_ENDPOINTS,
};
