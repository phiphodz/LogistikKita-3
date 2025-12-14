import React from 'react';
const FirebaseStatus = ({ isReady, error }) => {
    if (isReady && !error) return null;
    return <div className="fixed bottom-4 left-4 bg-slate-800 text-xs p-2 rounded text-gray-400 border border-slate-700 z-50">{error ? `Error: ${error}` : 'Connecting...'}</div>;
};
export default FirebaseStatus;


