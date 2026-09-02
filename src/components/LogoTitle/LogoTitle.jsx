import "./LogoTitle.css";
import logoImage from "../../assets/Logo_T.png";

const LogoTitle = () => {
    return (
        <div className="logo-title">
            <img
                src={logoImage}
                alt="Immpression"
                className="title"
            />
        </div>
    );
};

export default LogoTitle;
