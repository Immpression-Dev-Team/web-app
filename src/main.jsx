import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.jsx";
import "./constants/global.css"

const rootElement = document.getElementById("root");
if (!rootElement) {
    console.error("❌ Root element not found!");
} else {
    createRoot(rootElement).render(
        <StrictMode>
            <HelmetProvider>
                <App />
            </HelmetProvider>
        </StrictMode>
    );
}
