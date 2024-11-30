import React from "react";
import { useNavigate } from "react-router-dom";
import "./Footer.css"

const Footer = () => {
    const navigate = useNavigate();

    return (
        <footer className="footer">
            <div>
                <button
                    onClick={() => navigate("/privacyPolicy")}
                    className="footer-link"
                >
                    Privacy Policy
                </button>
                <button
                    onClick={() => navigate("/contact")}
                    className="footer-link"
                >
                    Contact Us
                </button>
            </div>
            <div style={{ marginTop: "0.5rem", color: "#777" }}>
                &copy; {new Date().getFullYear()} Immpression. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
