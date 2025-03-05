import logoImage from "../../assets/Logo_T.png";
import "./PasswordReset.css";
import { Link } from "react-router-dom";
import {useState} from "react";

const PasswordReset = () => {
    const [email, setEmail] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        setIsLoading(true);

        // Simulated API call for password reset (to be implemented later)
        setTimeout(() => {
            setSuccessMessage("If the email is valid, a password reset link has been sent.");
            setIsLoading(false);
        }, 2000);
    };

    return (
        <div className="password-reset-container">
            <form className="password-reset-form" onSubmit={handleSubmit}>
                <img src={logoImage} alt="Logo" className="password-reset-logo"/>
                <h2>Reset Your Password</h2>
                <p>Enter your email to receive a password reset link</p>
                <div className="input-group">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error-text">{error}</p>}
                {successMessage && <p className="success-text">{successMessage}</p>}
                <button type="submit" className="password-reset-button" disabled={isLoading}>
                    {isLoading ? "Sending..." : "Send Reset Link"}
                </button>
                <div className="password-reset-links">
                    <Link to="/login">Back to Login</Link>
                </div>
            </form>
        </div>
    );
};

export default PasswordReset;