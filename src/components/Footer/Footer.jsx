import { Link } from "react-router-dom";
import LogoTitle from "../LogoTitle/LogoTitle.jsx";
import headerImage from "../../assets/headers/Immpression_multi.png";
import GooglePlay from "../../assets/headers/GooglePlay.png";
import Apple from "../../assets/headers/Apple.png";
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
                    <div className="footer-app-links">
                        <a
                            href="https://play.google.com/store/apps/details?id=com.immpression.artapp"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="footer-app-link"
                        >
                            <img src={GooglePlay} alt="Get it on Google Play" className="footer-app-img" />
                        </a>
                        <a
                            href="https://apps.apple.com/app/id6756974604"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="footer-app-link"
                        >
                            <img src={Apple} alt="Download on the App Store" className="footer-app-img" />
                        </a>
                    </div>
                </div>

                <div className="footer-section">
                    <h4 className="footer-heading">Discover</h4>
                    <div className="footer-links">
                        <Link to="/explore" className="footer-link">Explore Art</Link>
                        <Link to="/marketplace" className="footer-link">Marketplace</Link>
                        <Link to="/search" className="footer-link">Art Search</Link>
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
                        <Link to="/about" className="footer-link">About Us</Link>
                        <Link to="/press" className="footer-link">Press</Link>
                        <Link to="/blog" className="footer-link">Blog</Link>
                        <Link to="/contact" className="footer-link">Contact</Link>
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
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;