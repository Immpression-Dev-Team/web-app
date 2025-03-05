import { Link } from "react-router-dom";
import LogoTitle from "../LogoTitle/LogoTitle.jsx";
import headerImage from "../../assets/headers/Immpression_multi.png";
import "./Navbar.css";
import { useAuth } from "../../state/AuthProvider.jsx";
import {useState} from "react";

export default function Navbar() {
    const [showNavItems, setShowNavItems] = useState(false);
    const { userData, logout } = useAuth();

    const handleToggleNavItems = () => {
        setShowNavItems(!showNavItems);
    };

    return (
        <div className="navbar-container">
            <div className="navbar">
                <Link to="/" className="logo-and-title">
                    <img src={headerImage} alt="Logo" className="logo" />
                    <LogoTitle />
                </Link>
                <button onClick={handleToggleNavItems} className="menu-button">
                    <span className={showNavItems ? "close-icon" : "hamburger-icon"}></span>
                </button>
            </div>
            <div className={`nav-items-container ${showNavItems ? "show" : ""}`}>
                {userData ? (
                    <>
                        <Link to="/statistics" className="nav-item">Statistics</Link>
                        <Link to="/settings" className="nav-item">Settings</Link>
                        <button onClick={logout} className="nav-item">Logout</button>
                    </>
                ) : (
                    <>
                        {/*<Link to="/login" className="nav-item">Login</Link>*/}
                        <Link to="/signup" className="nav-item">Sign Up</Link>
                        <Link to="/about" className="nav-item">About Us</Link>
                        <Link to="/contact" className="nav-item">Contact Us</Link>
                    </>
                )}
            </div>
        </div>
    );
}
