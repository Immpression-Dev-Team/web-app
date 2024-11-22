import axios from "axios";
import { API_URL } from "../API_URL.js";

export const handleSignup = async (name, email, password) => {
    try {
        const response = await axios.post(`${API_URL}/signup`, {
            name,
            email,
            password,
        });

        // Check for success in the response
        if (response.data.success) {
            return { success: true, message: "Signup successful!" };
        } else {
            return {
                success: false,
                error: response.data.message || "Signup failed. Please try again.",
            };
        }
    } catch (err) {
        // Improved error message handling
        const errorMessage =
            err.response?.data?.error ||
            err.message ||
            "An unexpected error occurred during signup.";
        return {
            success: false,
            error: errorMessage,
        };
    }
};

