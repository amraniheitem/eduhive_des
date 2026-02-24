import React, { createContext, useContext, useState, useEffect } from 'react';
import { saveToken, getToken, removeToken, saveUser, getUser, removeUser, isTokenValid } from '../utils/auth';
const AuthContext = createContext(null);
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    // Initialize auth state from localStorage
    useEffect(() => {
        const initAuth = () => {
            const storedToken = getToken();
            const storedUser = getUser();
            if (storedToken && isTokenValid()) {
                setToken(storedToken);
                setUser(storedUser);
            } else {
                // Clear invalid/expired token
                removeToken();
                removeUser();
            }
            setLoading(false);
        };
        initAuth();
    }, []);
    const login = (authToken, userData) => {
        // Validate role - only ADMIN and SUPER_ADMIN can access
        if (userData.role !== 'ADMIN' && userData.role !== 'SUPER_ADMIN') {
            throw new Error('Accès refusé. Seuls les administrateurs peuvent accéder à cette application.');
        }
        saveToken(authToken);
        saveUser(userData);
        setToken(authToken);
        setUser(userData);
    };
    const logout = () => {
        removeToken();
        removeUser();
        setToken(null);
        setUser(null);
    };
    const isAuthenticated = () => {
        return !!token && !!user && isTokenValid();
    };
    const hasRole = (roles) => {
        if (!user) return false;
        if (Array.isArray(roles)) {
            return roles.includes(user.role);
        }
        return user.role === roles;
    };
    const value = {
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated,
        hasRole,
    };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export default AuthContext;
