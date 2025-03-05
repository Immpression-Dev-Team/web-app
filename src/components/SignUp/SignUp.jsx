import { useAuth } from "../../state/AuthProvider.jsx";
import { handleSignup } from "../../utils/handleSignup";
import logoImage from "../../assets/Logo_T.png";
import "./SignUp.css";
import useLoadingAnimation from "../loadingAnimation.js";
import {useState} from "react";

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const { login } = useAuth();

    const ellipsis = useLoadingAnimation();

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

        if (result && result.success) {
            setSuccessMessage(result.message);
            const loginResult = await login({ email, password });

            if (loginResult.success) {
                setTimeout(() => {
                    window.location.href = "/";
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
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <img src={logoImage} alt="Logo" className="login-logo"/>
                <h2>Create an Account</h2>
                <p>Join Immpression today</p>
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Username"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
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
                {successMessage && <p className="success-text">{successMessage}</p>}
                <button type="submit" className="login-button" disabled={isLoading}>
                    {isLoading ? `Signing Up${ellipsis}` : "Sign Up"}
                </button>
                <div className="login-links">
                    {/*<Link to="/login">Already have an account? Log in</Link>*/}
                </div>
            </form>
        </div>
    );
};

export default SignUp;
