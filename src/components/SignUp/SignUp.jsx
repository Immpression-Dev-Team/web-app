import React, { useEffect, useState } from "react";
import NavBar from "../Navbar/Navbar.jsx";
import { useAuth } from "../../state/AuthProvider.jsx";
import { handleSignup } from "../../utils/handleSignup";
import logoImage from "../../assets/Logo_T.png";
import headerImage from "../../assets/headers/Immpression_multi.png";
import backgroundImage from "../../assets/backgrounds/babyBlue.png";
import "./SignUp.css";

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [ellipsis, setEllipsis] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const { login } = useAuth();

    // Animate loading state
    useEffect(() => {
        if (isLoading) {
            const intervalId = setInterval(() => {
                setEllipsis((prev) => (prev.length < 3 ? prev + "." : ""));
            }, 500);

            return () => clearInterval(intervalId);
        } else {
            setEllipsis("");
        }
    }, [isLoading]);

    const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        if (name.length < 4) {
            setError("Name must be at least 4 characters long.");
            return;
        }
        if (!isValidEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setIsLoading(true);
        const result = await handleSignup(name, email, password);

        console.log(result);

        if (result && result.success) {
            setSuccessMessage(result.message);
            const loginResult = await login({ email, password });

            // Check login result after successful signup
            if (loginResult.success) {
                setTimeout(() => {
                    window.location.href = "/account-type";
                }, 2000);
            } else {
                setError("Login failed after successful signup.");
            }
        } else {
            setError(result?.error || "Unknown error during signup");
        }

        setIsLoading(false);
    };

    return (
        <div
            className="signup-background"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <NavBar />
            <div className="signup-container">
                <form className="signup-form" onSubmit={handleSubmit}>
                    <div className="signup-header">
                        <img src={logoImage} alt="Logo" className="signup-logo" />
                        <img src={headerImage} alt="Header" className="signup-header-image" />
                    </div>
                    <div className="signup-input-group">
                        <div className="input-wrapper">
                            <i className="fas fa-user input-icon"></i>
                            <input
                                type="text"
                                placeholder="Username"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="signup-input"
                            />
                        </div>
                        <div className="input-wrapper">
                            <i className="fas fa-envelope input-icon"></i>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="signup-input"
                            />
                        </div>
                        <div className="input-wrapper">
                            <i className="fas fa-lock input-icon"></i>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="signup-input"
                            />
                        </div>
                    </div>
                    {error && <p className="error-text">{error}</p>}
                    {successMessage && <p className="success-text">{successMessage}</p>}
                    <button
                        type="submit"
                        className="signup-button"
                        disabled={isLoading}
                    >
                        {isLoading ? `Signing Up${ellipsis}` : "Sign Up"}
                    </button>
                    <button
                        type="button"
                        className="back-button"
                        onClick={() => (window.location.href = "/login")}
                    >
                        Back to Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
