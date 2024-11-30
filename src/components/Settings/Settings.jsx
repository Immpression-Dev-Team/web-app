import React from "react";
import "./Settings.css";

const Settings = () => {
    const handleDeleteAccount = () => {
        const confirmation = window.confirm(
            "Are you sure you want to delete your account? This action cannot be undone."
        );
        if (confirmation) {
            // Add the API call to delete the account here
            console.log("Account deleted successfully!");
            alert("Your account has been deleted.");
        }
    };

    return (
        <div className="settings-container">
            <h1>Settings Page</h1>
            <div className="settings-options">
                {/* Other settings can go here */}
                <button 
                    className="delete-account-button" 
                    onClick={handleDeleteAccount}
                >
                    Delete Account
                </button>
            </div>
        </div>
    );
};

export default Settings;
