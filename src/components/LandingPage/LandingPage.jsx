import { motion } from "framer-motion";
import "./LandingPage.css";
import { useEffect, useState } from "react";

const LandingPage = () => {
    const [signUpLink, setSignUpLink] = useState("/signup");
    const [kickStarterlink, setKickStarterLink] = useState("/kickstarterlink");

    useEffect(() => {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;

        const adjustFontSize = () => {
            const isMobileViewport = window.innerWidth <= 768;

            if (/android/i.test(userAgent)) {
                setSignUpLink("https://forms.gle/ogAzLMj9ac92qWYJ8");
                setKickStarterLink("http://kck.st/44T1jbU");
                document.querySelectorAll('.gradient-text').forEach(el => {
                    el.style.fontSize = '2rem';
                });
            } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
                setSignUpLink("https://forms.gle/ogAzLMj9ac92qWYJ8");
                setKickStarterLink("http://kck.st/44T1jbU");
                document.querySelectorAll('.gradient-text').forEach(el => {
                    el.style.fontSize = '2rem';
                });
            } else if (isMobileViewport) {
                document.querySelectorAll('.gradient-text').forEach(el => {
                    el.style.fontSize = '2rem';
                });
            } else {
                document.querySelectorAll('.gradient-text').forEach(el => {
                    el.style.fontSize = '3rem';
                });
            }
        };

    adjustFontSize();
    window.addEventListener('resize', adjustFontSize);

    return () => window.removeEventListener('resize', adjustFontSize);
}, []);


    return (
        <div className="landing-wrapper">
            {/* Hero Section */}
            <motion.section 
                className="hero-section"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <div className="hero-content">
                    <div className="hero-left">
                        <motion.div 
                            className="badge"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                        >
                            <span className="badge-text">NOW LIVE ON MY</span>
                            <img className="kickstarter-badge" src="/kickstarter_logo.svg" alt="Kickstarter"/>
                        </motion.div>
                        
                        <motion.h1 
                            className="hero-title"
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                        >
                            Transform Your Art Into a<br className="desktop-break" />
                            <p><span className="gradient-text gradient-bold">Global Gallery</span></p>
                        </motion.h1>
                        
                        <motion.p 
                            className="hero-subtitle"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                        >
                            Create, showcase, and sell your artwork to collectors worldwide. 
                            Join the revolution that&apos;s putting artists in control of their digital galleries.
                        </motion.p>

                        <motion.div 
                            className="hero-stats"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.8 }}
                        >
                            <div className="stat-item">
                                <span className="stat-number">10k+</span>
                                <span className="stat-label">Artists</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">50k+</span>
                                <span className="stat-label">Artworks</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">$2M+</span>
                                <span className="stat-label">Sales</span>
                            </div>
                        </motion.div>
                        
                        <motion.div 
                            className="cta-buttons"
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1, duration: 0.8 }}
                        >
                            <a href={kickStarterlink} target="_blank" rel="noopener noreferrer" className="btn-primary">
                                <span>🚀 Back Our Project</span>
                            </a>
                            <a href={signUpLink} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                                <span>Join Waitlist</span>
                            </a>
                        </motion.div>
                    </div>

                    <div className="hero-right">
                        <div className="app-preview">
                            <motion.div 
                                className="preview-container"
                                initial={{ x: 100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.5, duration: 1 }}
                            >
                                <div className="phone-mockup">
                                    <motion.img
                                        src="/Immpression_UI_1.png"
                                        alt="Immpression App - Main Screen"
                                        className="main-screen"
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.8, duration: 0.8 }}
                                    />
                                </div>
                                <motion.img
                                    src="/Immpression_UI_2.png"
                                    alt="Immpression App - Gallery View"
                                    className="floating-screen left"
                                    initial={{ x: -30, y: 20, opacity: 0, rotate: -10 }}
                                    animate={{ x: 0, y: 0, opacity: 0.9, rotate: -5 }}
                                    transition={{ delay: 1.2, duration: 0.8 }}
                                />
                                <motion.img
                                    src="/Immpression_UI_3.png"
                                    alt="Immpression App - Artist Profile"
                                    className="floating-screen right"
                                    initial={{ x: 30, y: -20, opacity: 0, rotate: 10 }}
                                    animate={{ x: 0, y: 0, opacity: 0.9, rotate: 5 }}
                                    transition={{ delay: 1.4, duration: 0.8 }}
                                />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.section>

        </div>
    );
};

export default LandingPage;
