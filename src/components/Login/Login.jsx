import React, { useState } from "react";
import { useAuth } from "../../state/AuthProvider.jsx";
import { handleLogin } from "../../utils/handleLogin.js";
import logoImage from "../../assets/Logo_T.png";
import headerImage from "../../assets/headers/Immpression_multi.png";
import "./Login.css";
import useLoadingAnimation from "../loadingAnimation.js";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { login } = useAuth();

    const ellipsis = useLoadingAnimation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        const result = await handleLogin(email, password, login);

        if (result.success) {
            window.location.href = "/profile";
        } else {
            setError(result.error || "Invalid email or password.");
        }

        setIsLoading(false);
    };

    return (
        <div className="login-background">
            <div className="login-container">
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="login-header">
                        <img src={logoImage} alt="Logo" className="login-logo"/>
                        <img src={headerImage} alt="Header" className="login-header-image"/>
                    </div>
                    <div className="login-input-group">
                        <div className="input-wrapper">
                            <i className="fas fa-envelope input-icon"></i>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="login-input"
                            />
                        </div>
                        <div className="input-wrapper">
                            <i className="fas fa-lock input-icon"></i>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="login-input"
                            />
                        </div>
                    </div>
                    {error && <p className="error-text">{error}</p>}
                    <button
                        type="submit"
                        className="login-button"
                        disabled={isLoading}
                    >
                        {isLoading ? `Logging In${ellipsis}` : "Login"}
                    </button>
                    <button
                        type="button"
                        className="back-button"
                        onClick={() => (window.location.href = "/passwordReset")}
                    >
                        <span className="italic-links">Forgot Password?</span>
                    </button>
                    <button
                        type="button"
                        className="back-button"
                        onClick={() => (window.location.href = "/signup")}
                    >
                        <span className="italic-links">Don't have an account?</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
