import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoTitle from "../LogoTitle/LogoTitle.jsx";
import headerImage from "../../assets/headers/Immpression_multi.png";
import "./Navbar.css";
import { useAuth } from "../../state/AuthProvider.jsx";

export default function Navbar() {
    const navigate = useNavigate();
    const [showNavItems, setShowNavItems] = useState(false);
    const { userData, logout } = useAuth();

    const handleToggleNavItems = () => {
        setShowNavItems(!showNavItems);
    };

    const refreshApp = () => {
        navigate("/");
    };

    const handleLogoutClick = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="navbar-container">
            <div className="navbar">
                <button onClick={refreshApp} className="logo-and-title">
                    <img src={headerImage} alt="Logo" className="logo" />
                    <LogoTitle />
                </button>
                <button onClick={handleToggleNavItems} className="menu-button">
                    {showNavItems ? "✖" : "☰"}
                </button>
            </div>
            {showNavItems && (
                <div className="nav-items-container">
                    {userData ? (
                        <>
                            {/* Render these items if the user is logged in */}
                            <button onClick={() => navigate("/statistics")} className="nav-item">
                                📊 Statistics
                            </button>
                            <button onClick={() => navigate("/settings")} className="nav-item">
                                ⚙️ Settings
                            </button>
                            <button onClick={handleLogoutClick} className="nav-item">
                                🚪 Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => navigate("/login")} className="nav-item">
                                🔐 Login
                            </button>
                            <button onClick={() => navigate("/signup")} className="nav-item">
                                📝 Sign Up
                            </button>
                            <button onClick={() => navigate("/about")} className="nav-item">
                                ℹ️ About Us
                            </button>
                            <button onClick={() => navigate("/contact")} className="nav-item">
                                📞 Contact Us
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
