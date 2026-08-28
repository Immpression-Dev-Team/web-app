import {BrowserRouter as Router, Route, Routes, useLocation} from "react-router-dom";
import { AuthProvider, useAuth } from "./state/AuthProvider.jsx";
import { /*userStackScreen,*/ guestStackScreen } from "./utils/helpers.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import './styles/App.css'
import PageNotFound from "./components/PageNotFound/PageNotFound.jsx";

const AppContent = () => {
    const location = useLocation();
    const isInviteRoute = location.pathname.startsWith("/invite/");

    try {
        const {/*userData,*/ loading} = useAuth();

        if (loading) {
            return (
                <div className="loading-container">
                    <p>Loading...</p>
                </div>
            );
        }

        // The invite funnel is a standalone page — no site navbar/footer chrome.
        if (isInviteRoute) {
            return (
                <Routes>
                    {guestStackScreen()}
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            );
        }

        return (
            <>
                <Navbar/>
                <div className="content">
                    <Routes>
                        {/*userData ? userStackScreen() :*/ guestStackScreen()}
                        <Route path="*" element={<PageNotFound />} />
                    </Routes>
                </div>
                <Footer/>
            </>
        );
    } catch (error) {
        console.error("❌ useAuth() threw an error:", error);
        return <h1>⚠️ Error in AuthProvider</h1>;
    }
};

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <AppContent />
            </Router>
        </AuthProvider>
    );
}
