import dotenv from "dotenv";
dotenv.config();

const { ENV } = process.env;

const API_URL = ENV === "prod" ? "https://immpression.com/api" : "http://localhost:4000";

export { API_URL };
