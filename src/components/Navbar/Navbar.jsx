import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoTitle from "../LogoTitle/LogoTitle.jsx";
import headerImage from "../../assets/headers/Immpression_multi.png";
import "./Navbar.css";

export default function Navbar() {
    const navigate = useNavigate();
    const [showNavItems, setShowNavItems] = useState(false);

    const handleToggleNavItems = () => {
        setShowNavItems(!showNavItems);
    };

    const refreshApp = () => {
        navigate("/");
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
                    <button onClick={() => navigate("/statistics")} className="nav-item">
                        📊
                    </button>
                    <button onClick={() => navigate("/settings")} className="nav-item">
                        ⚙️
                    </button>
                </div>
            )}
        </div>
    );
}
