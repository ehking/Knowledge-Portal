import { createContext, useContext, useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    });
    const [loading, setLoading] = useState(false);
    const isAuthenticated = Boolean(token);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await axiosClient.get('/auth/me');
                setUser(data.data ?? data);
                localStorage.setItem('user', JSON.stringify(data.data ?? data));
            } catch (error) {
                // token invalid
            }
        };

        if (token && !user) {
            fetchProfile();
        }
    }, [token, user]);

    const login = async (username, password) => {
        setLoading(true);
        try {
            const { data } = await axiosClient.post('/auth/login', { username, password });
            setToken(data.access_token);
            setUser(data.user);
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.user));
            return true;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await axiosClient.post('/auth/logout');
        } catch (error) {
            // ignore
        }
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout, loading, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
