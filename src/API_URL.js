// API_URL.js

// Pick manually: "local" or "prod"
const MODE = "prod"; // <-- change this when needed

// Read IP from env (for local dev)
const HOST_IP = import.meta.env.VITE_HOST_IP || "127.0.0.1";

// URLs
const LOCAL_URL = `http://${HOST_IP}:5003`;
const PROD_URL = "https://immpression-backend.vercel.app";

// Final API URL
const API_URL = MODE === "prod" ? PROD_URL : LOCAL_URL;

console.log("API URL:", API_URL);

export { API_URL, HOST_IP };
