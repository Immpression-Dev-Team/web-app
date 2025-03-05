import { useAuth } from "../../state/AuthProvider.jsx";
import { handleLogin } from "../../utils/handleLogin.js";
import logoImage from "../../assets/Logo_T.png";
import "./Login.css";
import useLoadingAnimation from "../loadingAnimation.js";
import { Link } from "react-router-dom";
import {useState} from "react";

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
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <img src={logoImage} alt="Logo" className="login-logo"/>
                <h2>Welcome Back</h2>
                <p>Log in to your account</p>
                <div className="input-group">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error-text">{error}</p>}
                <button type="submit" className="login-button" disabled={isLoading}>
                    {isLoading ? `Logging In${ellipsis}` : "Login"}
                </button>
                <div className="login-links">
                    <Link to="/passwordReset">Forgot Password?</Link>
                    <Link to="/signup">Don't have an account? Sign Up</Link>
                </div>
            </form>
        </div>
    );
};

export default Login;