const ENV = import.meta.env.VITE_ENV;
const API_URL =
    ENV === "prod"
        ? "https://immpression.art/api"
        : "http://localhost:4000";

export { API_URL };
