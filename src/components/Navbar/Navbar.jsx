import { Link, useLocation } from "react-router-dom";
import LogoTitle from "../LogoTitle/LogoTitle.jsx";
import headerImage from "../../assets/headers/Immpression_multi.png";
import "./Navbar.css";
import { useAuth } from "../../state/AuthProvider.jsx";
import { useState, useEffect } from "react";

export default function Navbar() {
    const [showNavItems, setShowNavItems] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { /*userData, logout*/ } = useAuth();
    const location = useLocation();

    const handleToggleNavItems = () => {
        setShowNavItems(!showNavItems);
    };

    const closeMenu = () => {
        setShowNavItems(false);
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        closeMenu();
    }, [location]);

    return (
        <nav className={`navbar-container ${isScrolled ? 'scrolled' : ''}`}>
            <div className="navbar">
                <Link to="/" className="logo-and-title" onClick={closeMenu}>
                    <LogoTitle />
                    <img src={headerImage} alt="Immpression Logo" className="logo" />
                </Link>
                
                {/* Desktop Navigation */}
                <div className="nav-items-desktop">
                    <Link to="/about" className="nav-item">About</Link>
                    <Link to="/contact" className="nav-item">Contact</Link>
                    <Link to="/policy" className="nav-item">Policy</Link>
                    <a 
                        href="https://forms.gle/ogAzLMj9ac92qWYJ8" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="nav-cta-button"
                    >
                        Join Waitlist
                    </a>
                </div>

                {/* Mobile Menu Button */}
                <button 
                    onClick={handleToggleNavItems} 
                    className={`menu-button ${showNavItems ? 'active' : ''}`}
                    aria-label="Toggle navigation menu"
                >
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                </button>
            </div>
            
            {/* Mobile Navigation Overlay */}
            <div className={`nav-overlay ${showNavItems ? "show" : ""}`} onClick={closeMenu}></div>
            <div className={`nav-items-mobile ${showNavItems ? "show" : ""}`}>
                <div className="mobile-nav-header">
                    <span className="mobile-nav-title">Menu</span>
                    <button onClick={closeMenu} className="close-button">×</button>
                </div>
                <div className="mobile-nav-items">
                    <Link to="/about" className="nav-item" onClick={closeMenu}>About Us</Link>
                    <Link to="/contact" className="nav-item" onClick={closeMenu}>Contact</Link>
                    <Link to="/policy" className="nav-item" onClick={closeMenu}>Privacy Policy</Link>
                    <div className="mobile-nav-actions">
                        <a 
                            href="https://forms.gle/ogAzLMj9ac92qWYJ8" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="mobile-cta-button"
                            onClick={closeMenu}
                        >
                            Join Waitlist
                        </a>
                        <a 
                            href="http://kck.st/44T1jbU" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="mobile-kickstarter-button"
                            onClick={closeMenu}
                        >
                            Back on Kickstarter
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
}
