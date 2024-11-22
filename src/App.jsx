import React from "react";
import { BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./state/AuthProvider.jsx";
import { guestStackScreen } from "./utils/helpers.jsx";

const AppContent = () => {
    const { loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-container">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <Routes>
            {guestStackScreen()}
        </Routes>
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
