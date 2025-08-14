import { Link } from "react-router-dom";
import LogoTitle from "../LogoTitle/LogoTitle.jsx";
import headerImage from "../../assets/headers/Immpression_multi.png";
import "./Footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <div className="footer-logo">
                        <LogoTitle />
                        <img src={headerImage} alt="Immpression" className="footer-logo-img" />
                    </div>
                    <p className="footer-description">
                        Transform your art into a global gallery. Create, showcase, and sell your artwork to collectors worldwide.
                    </p>
                </div>

                <div className="footer-section">
                    <h4 className="footer-heading">Product</h4>
                    <div className="footer-links">
                        <Link to="/about" className="footer-link">About Us</Link>
                        <a href="#" className="footer-link">Features</a>
                        <a href="#" className="footer-link">Pricing</a>
                    </div>
                </div>

                <div className="footer-section">
                    <h4 className="footer-heading">Support</h4>
                    <div className="footer-links">
                        <Link to="/contact" className="footer-link">Contact Us</Link>
                        <Link to="/policy" className="footer-link">Privacy Policy</Link>
                        <a href="mailto:immpression.nyc@gmail.com" className="footer-link">
                            immpression.nyc@gmail.com
                        </a>
                    </div>
                </div>

                <div className="footer-section">
                    <h4 className="footer-heading">Company</h4>
                    <div className="footer-links">
                        <Link to="/about" className="footer-link">About</Link>
                        <Link to="/contact" className="footer-link">Contact</Link>
                        <a href="#" className="footer-link">Careers</a>
                        <a href="#" className="footer-link">Press</a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="footer-bottom-content">
                    <div className="copyright">
                        &copy; {new Date().getFullYear()} Immpression. All rights reserved.
                    </div>
                    <div className="footer-bottom-links">
                        <Link to="/policy" className="footer-bottom-link">Privacy</Link>
                        <Link to="/terms" className="footer-bottom-link">Terms</Link>
                        <a href="#" className="footer-bottom-link">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;