import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUserData = () => {
            try {
                const savedUserData = localStorage.getItem('userResponse');
                if (savedUserData) {
                    setUserData(JSON.parse(savedUserData));
                }
            } catch (error) {
                console.error('Failed to load user data', error);
            } finally {
                setLoading(false);
            }
        };

        loadUserData();
    }, []);

    const login = (data) => {
        try {
            localStorage.setItem('userResponse', JSON.stringify(data));
            setUserData(data);
            return { success: true };
        } catch (error) {
            console.error('Error during login', error);
            return { success: false, error: 'Login failed due to an internal error.' };
        }
    };

    const logout = () => {
        localStorage.removeItem('userResponse');
        setUserData(null);
        window.location.href = "/login";
    };

    const token = userData ? userData.token : null;

    return (
        <AuthContext.Provider
            value={{ userData, setUserData, logout, login, loading, token }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
