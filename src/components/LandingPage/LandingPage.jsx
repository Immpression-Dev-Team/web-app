import { motion } from "framer-motion";
import "./LandingPage.css";
import { Link } from "react-router-dom";

const LandingPage = () => {
    return (
        <div className="landing-container">
            <div className="text-section">
                <h1 className="slogan">BRING YOUR ART TO THE 21ST CENTURY</h1>
                <p>OWN A PERSONAL GALLERY IN YOUR POCKET</p>
                <div className="button-group">
                    <Link to="/signup" className="auth-button">SIGN UP</Link>
                    {/*<Link to="/login" className="auth-button">LOGIN</Link>*/}
                </div>
            </div>
            <div className="image-section">
                <motion.img
                    src="/Immpression_UI_2.png"
                    alt="Mobile App Left"
                    className="mobile-image"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                />
                <motion.img
                    src="/Immpression_UI_3.png"
                    alt="Mobile App Right"
                    className="mobile-image mobile-image-offset"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                />
            </div>
        </div>
    );
};

export default LandingPage;
