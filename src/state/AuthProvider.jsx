import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    console.log("🔄 AuthProvider is initializing...");

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("⏳ Loading user data from localStorage...");
        try {
            const savedUserData = localStorage.getItem('userResponse');
            if (savedUserData) {
                console.log("✅ Found user data:", savedUserData);
                setUserData(JSON.parse(savedUserData));
            } else {
                console.log("⚠️ No user data found.");
            }
        } catch (error) {
            console.error('❌ Failed to load user data', error);
        } finally {
            console.log("✅ Finished loading user data.");
            setLoading(false);
        }
    }, []);

    console.log("📌 AuthProvider State:", { userData, loading });

    const login = (data) => {
        console.log("🔑 Logging in user:", data);
        try {
            localStorage.setItem('userResponse', JSON.stringify(data));
            setUserData(data);
            return { success: true };
        } catch (error) {
            console.error('❌ Error during login', error);
            return { success: false, error: 'Login failed due to an internal error.' };
        }
    };

    const logout = () => {
        console.log("🚪 Logging out user...");
        localStorage.removeItem('userResponse');
        setUserData(null);
        window.location.href = "/login";
    };

    const token = userData ? userData.token : null;

    return (
        <AuthContext.Provider value={{ userData, setUserData, logout, login, loading, token }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    console.log("🧩 useAuth() is called...");
    return useContext(AuthContext);
}
