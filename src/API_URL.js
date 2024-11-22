const API_URL = import.meta.env.ENV === "prod" ? "https://immpression.com/api" : "http://localhost:4000";

console.log(API_URL);

export { API_URL };
