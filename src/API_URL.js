const ENV = import.meta.env.VITE_APP_ENV;
const API_URL =
    ENV === "prod"
        ? "https://immpression-backend.vercel.app"
        : "http://localhost:4000";

export { API_URL };