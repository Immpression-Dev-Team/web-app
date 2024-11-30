import React from "react";
import { BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./state/AuthProvider.jsx";
import { userStackScreen, guestStackScreen } from "./utils/helpers.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";

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
            <Navbar />
            <div className="content">
                <Routes>{userData ? userStackScreen() : guestStackScreen()}</Routes>
            </div>
            <Footer/>
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
