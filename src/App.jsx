import React from "react";
import { BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./state/AuthProvider.jsx";
import { userStackScreen, guestStackScreen } from "./utils/helpers.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";

const AppContent = () => {
    const { userData, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-container">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <>
            {userData && <Navbar />}
            <Routes>
                {userData ? userStackScreen() : guestStackScreen()}
            </Routes>
        </>
    );
};

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <AppContent />
            </Router>
        </AuthProvider>
    );
}
