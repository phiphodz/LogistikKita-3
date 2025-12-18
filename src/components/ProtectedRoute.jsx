// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { Shield, Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, requiredRole = null }) => {
    const [isValidating, setIsValidating] = React.useState(true);
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);

    React.useEffect(() => {
        const validateAuth = () => {
            // 1. Cek token di localStorage
            const token = localStorage.getItem('accessToken');
            
            if (!token) {
                setIsAuthenticated(false);
                setIsValidating(false);
                return;
            }

            // 2. Optional: Validasi token dengan backend (untuk production)
            // Di development, cukup cek keberadaan token
            setIsAuthenticated(true);
            setIsValidating(false);
        };

        validateAuth();
    }, []);

    if (isValidating) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
                <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-6">
                        <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse"></div>
                        <Loader2 size={40} className="text-primary animate-spin relative z-10" />
                    </div>
                    <p className="text-text-muted dark:text-gray-400">
                        Memverifikasi sesi Anda...
                    </p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect ke login dengan return URL untuk UX yang lebih baik
        return <Navigate to="/login" replace state={{ from: window.location.pathname }} />;
    }

    // Optional: Role-based authorization
    if (requiredRole) {
        const userType = localStorage.getItem('userType');
        if (userType !== requiredRole) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
