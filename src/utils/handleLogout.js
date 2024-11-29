import axios from "axios";
import { API_URL } from "../API_URL.js";

export const handleLogout = async () => {
    try {
        const response = await axios().post(
            `${API_URL}/logout`
        );

        if (response.data.success) {
            return { success: true, message: "Logout successful!", data: response.data };
        } else {
            return {
                success: false,
                error: response.data.message || "Logout failed. Please try again.",
            };
        }
    } catch (err) {
        const errorMessage =
            err.response?.data?.error ||
            err.message ||
            "An unexpected error occurred during logout.";
        return {
            success: false,
            error: errorMessage,
        }
    }
}
