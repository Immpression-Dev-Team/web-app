import React from "react";
import "./PrivacyPolicy.css";

const PrivacyPolicyScreen = () => {
    return (
        <div className="privacy-policy-container">
            <h1>Privacy Policy</h1>
            <p>Last updated: November 28, 2024</p>
            <p>
                This Privacy Policy describes Our policies and procedures on the collection, use, 
                and disclosure of Your information when You use the Service and tells You about Your 
                privacy rights and how the law protects You.
            </p>
            <p>
                We use Your Personal data to provide and improve the Service. By using the Service, 
                You agree to the collection and use of information in accordance with this Privacy 
                Policy. This Privacy Policy has been created with the help of the{" "}
                <a href="https://www.termsfeed.com/privacy-policy-generator/" target="_blank" rel="noopener noreferrer">
                    Privacy Policy Generator
                </a>.
            </p>
            {/* Add the remaining content here exactly as you provided */}
            <h2>Interpretation and Definitions</h2>
            <h3>Interpretation</h3>
            <p>
                The words of which the initial letter is capitalized have meanings defined under the 
                following conditions. The following definitions shall have the same meaning regardless 
                of whether they appear in singular or in plural.
            </p>
            <h3>Definitions</h3>
            <p>For the purposes of this Privacy Policy:</p>
            <ul>
                <li>
                    <p>
                        <strong>Account</strong> means a unique account created for You to access our 
                        Service or parts of our Service.
                    </p>
                </li>
                <li>
                    <p>
                        <strong>Affiliate</strong> means an entity that controls, is controlled by or is 
                        under common control with a party, where "control" means ownership of 50% or more 
                        of the shares, equity interest or other securities entitled to vote for election 
                        of directors or other managing authority.
                    </p>
                </li>
                <li>
                    <p>
                        <strong>Application</strong> refers to Immpression, the software program provided 
                        by the Company.
                    </p>
                </li>
                <li>
                    <p>
                        <strong>Company</strong> (referred to as either "the Company", "We", "Us" or "Our" 
                        in this Agreement) refers to Immpression LLC, 65-30 Kissena Blvd, Kew Gardens Hills, 
                        NY 11367.
                    </p>
                </li>
                {/* Continue adding all other sections and details here */}
            </ul>
            {/* Repeat this structure for all remaining content */}
        </div>
    );
};

export default PrivacyPolicyScreen;
