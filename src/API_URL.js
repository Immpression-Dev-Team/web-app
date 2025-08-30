// API_URL.js

// Read IP from env
const HOST_IP = import.meta.env.VITE_HOST_IP || "127.0.0.1";

// Production backend
const PROD_URL = "https://immpression-backend.vercel.app";

// 👇 Decide automatically: if running on localhost, use HOST_IP; otherwise prod
const isLocal = window.location.hostname === "localhost";
const API_URL = isLocal ? `http://${HOST_IP}:5003` : PROD_URL;

console.log("API URL:", API_URL);

export { API_URL, HOST_IP };
