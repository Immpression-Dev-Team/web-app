import React from "react";
import "./LogoTitle.css";
import logoImage from "../../assets/Logo_T.png";

const LogoTitle = () => {
    return (
        <div className="logo-title">
            <img
                src={logoImage}
                alt="Logo Title"
                className="title"
            />
        </div>
    );
};

export default LogoTitle;
