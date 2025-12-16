import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// 1. Pastikan root element ada
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('❌ ERROR: Element dengan id="root" tidak ditemukan di index.html');
  document.body.innerHTML = `
    <div style="padding: 40px; text-align: center; font-family: sans-serif;">
      <h1 style="color: #dc2626;">🚨 Error: Root Element Tidak Ditemukan</h1>
      <p>Pastikan index.html memiliki <code>&lt;div id="root"&gt;&lt;/div&gt;</code></p>
    </div>
  `;
  throw new Error('Root element not found');
}

// 2. Render dengan error boundary
try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <HelmetProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </HelmetProvider>
    </React.StrictMode>
  );
} catch (error) {
  console.error('❌ ERROR RENDER:', error);
  rootElement.innerHTML = `
    <div style="padding: 20px; color: #dc2626; font-family: sans-serif;">
      <h2>Render Error: ${error.message}</h2>
      <p>Check console untuk detail</p>
    </div>
  `;
}
