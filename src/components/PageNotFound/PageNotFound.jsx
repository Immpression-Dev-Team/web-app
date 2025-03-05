import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./PageNotFound.css";

const PageNotFound = () => {
    return (
        <div className="not-found-container">
            <motion.h1
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 1 }}
                transition={{ duration: 0.5, yoyo: Infinity }}
                className="not-found-title"
            >
                404
            </motion.h1>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="not-found-text"
            >
                Oops! Looks like you've wandered into the art void.
            </motion.p>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className="not-found-text"
            >
                Maybe your masterpiece is just hiding?
            </motion.p>
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.5 }}
                className="not-found-button"
            >
                <Link to="/" className="home-button">Go Home Before the Art Police Arrive</Link>
            </motion.div>
        </div>
    );
};

export default PageNotFound;