/**
 * Authentication utility functions for token management
 */
const TOKEN_KEY = 'eduhive_auth_token';
const USER_KEY = 'eduhive_user';
/**
 * Save JWT token to localStorage
 */
export const saveToken = (token) => {
    try {
        localStorage.setItem(TOKEN_KEY, token);
        return true;
    } catch (error) {
        console.error('Error saving token:', error);
        return false;
    }
};
/**
 * Get JWT token from localStorage
 */
export const getToken = () => {
    try {
        return localStorage.getItem(TOKEN_KEY);
    } catch (error) {
        console.error('Error getting token:', error);
        return null;
    }
};
/**
 * Remove JWT token from localStorage
 */
export const removeToken = () => {
    try {
        localStorage.removeItem(TOKEN_KEY);
        return true;
    } catch (error) {
        console.error('Error removing token:', error);
        return false;
    }
};
/**
 * Save user data to localStorage
 */
export const saveUser = (user) => {
    try {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        return true;
    } catch (error) {
        console.error('Error saving user:', error);
        return false;
    }
};
/**
 * Get user data from localStorage
 */
export const getUser = () => {
    try {
        const user = localStorage.getItem(USER_KEY);
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error('Error getting user:', error);
        return null;
    }
};
/**
 * Remove user data from localStorage
 */
export const removeUser = () => {
    try {
        localStorage.removeItem(USER_KEY);
        return true;
    } catch (error) {
        console.error('Error removing user:', error);
        return false;
    }
};
/**
 * Decode JWT token payload
 */
export const decodeToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};
/**
 * Check if token is expired
 */
export const isTokenValid = () => {
    const token = getToken();
    if (!token) return false;
    try {
        const decoded = decodeToken(token);
        if (!decoded || !decoded.exp) return false;
        // Check if token is expired (exp is in seconds, Date.now() is in milliseconds)
        const currentTime = Date.now() / 1000;
        return decoded.exp > currentTime;
    } catch (error) {
        console.error('Error validating token:', error);
        return false;
    }
};
/**
 * Clear all authentication data
 */
export const clearAuth = () => {
    removeToken();
    removeUser();
};
