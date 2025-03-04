import { BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./state/AuthProvider.jsx";
import { userStackScreen, guestStackScreen } from "./utils/helpers.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import './App.css'

const AppContent = () => {
    console.log("🔄 AppContent is rendering...");

    try {
        const {userData, loading} = useAuth();
        console.log("📌 useAuth() returned:", {userData, loading});

        console.log("👤 User Data:", userData);
        console.log("⏳ Loading State:", loading);

        if (loading) {
            console.log("⏳ App is still loading...");
            return (
                <div className="loading-container">
                    <p>Loading...</p>
                </div>
            );
        }

        console.log("✅ Deciding which routes to render...");
        return (
            <>
                <Navbar/>
                <div className="content">
                    <Routes>{userData ? userStackScreen() : guestStackScreen()}</Routes>
                </div>
                <Footer/>
            </>
        );
    } catch (error) {
        console.error("❌ useAuth() threw an error:", error);
        return <h1>⚠️ Error in AuthProvider</h1>;
    }
};


console.log("App is rendering!");

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <AppContent />
            </Router>
        </AuthProvider>
    );
}
