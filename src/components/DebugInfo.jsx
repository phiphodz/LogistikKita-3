// src/components/DebugInfo.jsx
import React, { useState } from 'react';
import { AppConfig } from '../config/AppConfig';
import { Bug, Copy, RefreshCw, Eye, EyeOff } from 'lucide-react';

const DebugInfo = () => {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyConfig = () => {
    const configText = JSON.stringify({
      backend: AppConfig.BACKEND_URL,
      frontend: AppConfig.FRONTEND_URL,
      endpoints: AppConfig.ENDPOINTS,
    }, null, 2);
    
    navigator.clipboard.writeText(configText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!import.meta.env.DEV) return null; // Only in development

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setVisible(!visible)}
        className="bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition"
        title="Debug Info"
      >
        <Bug size={20} />
      </button>
      
      {visible && (
        <div className="absolute bottom-12 right-0 w-80 bg-gray-900 text-white p-4 rounded-lg shadow-xl border border-gray-700">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-sm">🚀 Codespace Config</h3>
            <div className="flex gap-2">
              <button onClick={copyConfig} className="text-xs p-1 hover:bg-gray-700 rounded">
                <Copy size={12} /> {copied ? 'Copied!' : 'Copy'}
              </button>
              <button onClick={() => window.location.reload()} className="text-xs p-1 hover:bg-gray-700 rounded">
                <RefreshCw size={12} />
              </button>
              <button onClick={() => setVisible(false)} className="text-xs p-1 hover:bg-gray-700 rounded">
                <EyeOff size={12} />
              </button>
            </div>
          </div>
          
          <div className="text-xs space-y-2 font-mono">
            <div>
              <div className="text-gray-400">Backend:</div>
              <div className="text-green-400 break-all">{AppConfig.BACKEND_URL}</div>
            </div>
            <div>
              <div className="text-gray-400">Frontend:</div>
              <div className="text-blue-400 break-all">{AppConfig.FRONTEND_URL}</div>
            </div>
            <div>
              <div className="text-gray-400">Status:</div>
              <div className="text-yellow-400">Akun GitHub ke-3</div>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-700">
            <a
              href={`${AppConfig.BACKEND_URL}/admin`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded block text-center"
            >
              🔗 Open Django Admin
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugInfo;
