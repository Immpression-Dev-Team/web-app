import React from "react";
import { useNavigate } from "react-router-dom";
import { updateAccountType } from "../API/API";
import { useAuth } from "../../state/AuthProvider";
import backgroundImage from "../assets/backgrounds/navbar_bg_blue.png";
import artistEmoji from "../assets/artisteemoji.png";
import "./AccountTypeScreen.css";

const AccountType = () => {
    const { userData } = useAuth();
    const token = userData?.token;
    const navigate = useNavigate();

    const handleSelection = async (type) => {
        try {
            const response = await updateAccountType(type, token);
            console.log("response from updating account type: " + response);

            navigate("/home");
        } catch (error) {
            console.error("Error updating account type:", error);
        }
    };

    return (
        <div className="container">
            {/* Header */}
            <div className="header">
                <img
                    src={backgroundImage}
                    alt="Background"
                    className="background-image"
                />
            </div>

            {/* Body */}
            <div className="body">
                <div className="heading-container">
                    <p className="sub-heading">ARE YOU AN</p>
                    <h1 className="main-heading">ARTIST?</h1>
                </div>
                <div className="buttons">
                    <button
                        className="button"
                        onClick={() => handleSelection("artist")}
                    >
                        YES
                        <img
                            src={artistEmoji}
                            alt="Artist Emoji"
                            className="artist-emoji"
                        />
                    </button>
                    <button
                        className="button button2"
                        onClick={() => handleSelection("art-lover")}
                    >
                        NO,
                        <span className="extra-text">
                            I'm here to <br /> look around
                        </span>
                    </button>
                </div>

                <img
                    src={require("../assets/loading-gif.gif")}
                    alt="Loading"
                    className="loading"
                />
            </div>

            {/* Footer */}
            <div className="header">
                <img
                    src={backgroundImage}
                    alt="Footer Background"
                    className="footer-background-image"
                />
            </div>
        </div>
    );
};

export default AccountType;
