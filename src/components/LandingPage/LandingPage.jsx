import { motion } from "framer-motion";
import "./LandingPage.css";
import { useEffect, useState } from "react";

const LandingPage = () => {
    const [signUpLink, setSignUpLink] = useState("/signup");
    const [kickStarterlink, setKickStarterLink] = useState("/kickstarterlink");

    useEffect(() => {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if (/android/i.test(userAgent)) {
            setSignUpLink("https://forms.gle/ogAzLMj9ac92qWYJ8");
            setKickStarterLink("http://kck.st/44T1jbU");
        } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            setSignUpLink("https://forms.gle/ogAzLMj9ac92qWYJ8");
            setKickStarterLink("http://kck.st/44T1jbU");
        } else {
            setSignUpLink("https://forms.gle/ogAzLMj9ac92qWYJ8");
            setKickStarterLink("http://kck.st/44T1jbU");
        }
    }, []);

    return (
        <motion.div
            className="landing-container"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
        >

        <div className="landing-container">
            <div className="text-section">
                <h1 className="kickStarterLabel">IMMPRESSION IS LIVE ON</h1> {/*we'll be updating*/}
                 <img className="kickStarterLogo" src="../src/assets/kickstarter_logo.png" alt="Kickstarter Logo"/>
                <p>Bring your art to life, Own your gallery.</p><p>Sell to the world.</p>
                <div className="button-group">
                    <a href={kickStarterlink} target="_blank" rel="noopener noreferrer" className="pledge-button">PLEDGE</a>
                    <a href={signUpLink} target="_blank" rel="noopener noreferrer" className="signUp-button">SIGN UP</a>
                    {/*<Link to="/signup" className="auth-button">SIGN UP</Link>*/}
                    {/*<Link to="/login" className="auth-button">LOGIN</Link>*/}
                </div>
            </div>
            <div className="image-section">
                <motion.img
                    src="/Immpression_UI_3.png"
                    alt="Mobile App Left"
                    className="mobile-image"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                />
                <motion.img
                    src="/Immpression_UI_1.png"
                    alt="Mobile App Center"
                    className="mobile-image"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                />
                <motion.img
                    src="/Immpression_UI_2.png"
                    alt="Mobile App Right"
                    className="mobile-image mobile-image-offset"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                />
            </div>
        </div>
        </motion.div>
    );
};

export default LandingPage;
