import {API_URL} from "../API_URL.js";
import axios from "axios";

export const handleLogin = async (email, password, login) => {
    try {
        const response = await axios.post(
            `${API_URL}/login`,
            { email, password },
            { withCredentials: true }
        );

        if (response.data.success) {
            const loginResult = login(response.data);
            if (loginResult.success) {
                return { success: true, message: "Login successful!" };
            } else {
                return {
                    success: false,
                    error: loginResult.error || "Login failed.",
                };
            }
        } else {
            return {
                success: false,
                error: response.data.message || "Login failed. Please try again.",
            };
        }
    } catch (err) {
        const errorMessage =
            err.response?.data?.error ||
            err.message ||
            "An unexpected error occurred during login.";
        return {
            success: false,
            error: errorMessage,
        };
    }
};
