import { useState } from "react";
import { useAuth } from "../../state/AuthProvider.jsx";
import { requestOtp, verifyOtp, completeSignup } from "../../utils/handleSignup.js";
import { handleLogin } from "../../utils/handleLogin.js";
import logoImage from "../../assets/Logo_T.png";
import useLoadingAnimation from "../loadingAnimation.js";
import "./SignUp.css";

const STEP_CREDENTIALS = 1;
const STEP_OTP         = 2;
const STEP_USERNAME    = 3;

const SignUp = () => {
    const [step, setStep]         = useState(STEP_CREDENTIALS);
    const [email, setEmail]       = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp]           = useState("");
    const [name, setName]         = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError]       = useState("");

    const { login } = useAuth();
    const ellipsis  = useLoadingAnimation();

    const isValidEmail = (e) => /\S+@\S+\.\S+/.test(e);

    const handleCredentials = async (e) => {
        e.preventDefault();
        setError("");

        if (!isValidEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        setIsLoading(true);
        const result = await requestOtp(email, password);
        setIsLoading(false);

        if (result.success) {
            setStep(STEP_OTP);
        } else {
            setError(result.error);
        }
    };

    const handleOtp = async (e) => {
        e.preventDefault();
        setError("");

        if (otp.trim().length !== 4) {
            setError("Enter the 4-digit code sent to your email.");
            return;
        }

        setIsLoading(true);
        const result = await verifyOtp(email, otp.trim());
        setIsLoading(false);

        if (result.success) {
            setStep(STEP_USERNAME);
        } else {
            setError(result.error);
        }
    };

    const handleUsername = async (e) => {
        e.preventDefault();
        setError("");

        if (name.trim().length < 4) {
            setError("Username must be at least 4 characters.");
            return;
        }

        setIsLoading(true);
        const signupResult = await completeSignup(name.trim(), email);
        if (!signupResult.success) {
            setError(signupResult.error);
            setIsLoading(false);
            return;
        }

        const loginResult = await handleLogin(email, password, login);
        setIsLoading(false);

        if (loginResult.success) {
            window.location.href = "/";
        } else {
            setError("Account created but auto-login failed. Please log in manually.");
        }
    };

    const stepLabels = ["Account", "Verify", "Username"];

    return (
        <div className="signup-container">
            <form
                className="signup-form"
                onSubmit={
                    step === STEP_CREDENTIALS ? handleCredentials :
                    step === STEP_OTP         ? handleOtp         :
                                               handleUsername
                }
            >
                <img src={logoImage} alt="Logo" className="signup-logo" />
                <h2>Create an Account</h2>

                <div className="signup-steps">
                    {stepLabels.map((label, i) => (
                        <div key={label} className={`signup-step ${step === i + 1 ? "active" : step > i + 1 ? "done" : ""}`}>
                            <div className="signup-step-dot">{step > i + 1 ? "✓" : i + 1}</div>
                            <span className="signup-step-label">{label}</span>
                        </div>
                    ))}
                </div>

                {step === STEP_CREDENTIALS && (
                    <>
                        <p>Join Immpression today</p>
                        <div className="input-group">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                            />
                            <input
                                type="password"
                                placeholder="Password (min 8 characters)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="new-password"
                            />
                        </div>
                    </>
                )}

                {step === STEP_OTP && (
                    <>
                        <p>We sent a 4-digit code to<br /><strong>{email}</strong></p>
                        <div className="input-group">
                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={4}
                                placeholder="Enter code"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                required
                                autoComplete="one-time-code"
                                className="otp-input"
                            />
                        </div>
                        <button
                            type="button"
                            className="signup-back-btn"
                            onClick={() => { setStep(STEP_CREDENTIALS); setError(""); setOtp(""); }}
                        >
                            ← Back
                        </button>
                    </>
                )}

                {step === STEP_USERNAME && (
                    <>
                        <p>Choose a username for your profile</p>
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Username (min 4 characters)"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                autoComplete="username"
                            />
                        </div>
                    </>
                )}

                {error && <p className="error-text">{error}</p>}

                <button type="submit" className="signup-button" disabled={isLoading}>
                    {isLoading
                        ? `Please wait${ellipsis}`
                        : step === STEP_CREDENTIALS ? "Send Code"
                        : step === STEP_OTP         ? "Verify"
                        :                             "Create Account"}
                </button>
            </form>
        </div>
    );
};

export default SignUp;
