import React, { useState } from "react";
import "./Settings.css";

const Settings = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const openModal = () => {
        setIsModalOpen(true);
        setError(""); // Reset error on opening modal
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEmail(""); // Reset email input
    };

    const handleConfirmDelete = () => {
        if (!email) {
            setError("Please enter your email to confirm.");
            return;
        }

        // Add your API call to delete the account here
        console.log("Account deletion requested for:", email);
        alert("Your account has been deleted.");
        closeModal();
    };

    return (
        <div className="settings-container">
            <h1>Settings Page</h1>
            <div className="settings-options">
                <button className="delete-account-button" onClick={openModal}>
                    Delete Account
                </button>
            </div>

            {/* Delete Account Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Delete Account</h2>
                        <p className="warning-text">
                            WARNING: This is permanent and cannot be undone!
                        </p>
                        <p>
                            All of your data will be immediately deleted. This action is irreversible.
                        </p>
                        <label htmlFor="email">Confirm email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="email-input"
                        />
                        {error && <p className="error-text">{error}</p>}
                        <div className="modal-actions">
                            <button className="cancel-button" onClick={closeModal}>
                                Go Back
                            </button>
                            <button className="confirm-button" onClick={handleConfirmDelete}>
                                Start Deletion
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
