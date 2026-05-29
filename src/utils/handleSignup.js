import axios from "axios";
import { API_URL } from "../API_URL.js";

export const requestOtp = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/request-otp`, {
            email,
            password,
            signupSource: 'web',
        });
        return response.data.success
            ? { success: true }
            : { success: false, error: response.data.message || 'Failed to send OTP.' };
    } catch (err) {
        return {
            success: false,
            error: err.response?.data?.message || err.message || 'An unexpected error occurred.',
        };
    }
};

export const verifyOtp = async (email, otp) => {
    try {
        const response = await axios.post(`${API_URL}/verify-otp`, { email, otp });
        return response.data.success
            ? { success: true }
            : { success: false, error: response.data.message || 'Invalid OTP.' };
    } catch (err) {
        return {
            success: false,
            error: err.response?.data?.message || err.message || 'An unexpected error occurred.',
        };
    }
};

export const completeSignup = async (name, email) => {
    try {
        const response = await axios.post(`${API_URL}/signup`, { name, email });
        return response.data.success
            ? { success: true }
            : { success: false, error: response.data.error || 'Signup failed.' };
    } catch (err) {
        return {
            success: false,
            error: err.response?.data?.error || err.message || 'An unexpected error occurred.',
        };
    }
};
