// src/utils/envChecker.js

import { AppConfig } from '../config/AppConfig';

export const checkEnvironment = () => {
  const issues = [];
  
  // Check Backend Connectivity
  fetch(`${AppConfig.BACKEND_URL}/api/fleets/`)
    .then(res => {
      if (!res.ok) issues.push(`Backend not responding (${res.status})`);
    })
    .catch(() => issues.push('Cannot connect to backend'));
  
  // Check Required Env Vars
  if (!import.meta.env.VITE_TOMTOM_API_KEY) {
    issues.push('TOMTOM_API_KEY not found in .env');
  }
  
  // Log issues
  if (issues.length > 0) {
    console.error('⚠️ Environment Issues:', issues);
    return { ok: false, issues };
  }
  
  console.log('✅ Environment OK');
  return { ok: true, issues: [] };
};

// Auto-run on import
if (typeof window !== 'undefined') {
  setTimeout(() => checkEnvironment(), 1000);
}
