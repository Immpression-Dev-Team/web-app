import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-links">
                <Link to="/policyPage" className="footer-link">Privacy Policy</Link>
                <Link to="/contact" className="footer-link">Contact Us</Link>
            </div>
            <div className="footer-text">
                &copy; {new Date().getFullYear()} Immpression. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;