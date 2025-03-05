import "./ContactUs.css";

const ContactUs = () => {
    return (
        <div className="contact-container">
            {/* Company Info Section */}
            <div className="contact-section">
                <h2>Contact Us</h2>
                <p><strong>Phone:</strong> <a href="tel:+11234567890">(123) 456-7890</a></p>
                <p><strong>Email:</strong> <a href="mailto:contact@immpression.com">contact@immpression.com</a></p>
            </div>

            {/* Address & Map Section */}
            <div className="contact-section">
                <h2>Our Location</h2>
                <p>
                    <a
                        href="https://www.google.com/maps/place/65-30+Kissena+Blvd,+Kew+Gardens+Hills,+NY+11367"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        65-30 Kissena Blvd, Kew Gardens Hills, NY 11367
                    </a>
                </p>
                <div className="map-container">
                    <iframe
                        title="Company Location"
                        width="100%"
                        height="300"
                        style={{ border: 0, borderRadius: '8px' }}
                        loading="lazy"
                        allowFullScreen
                        src="https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=65-30+Kissena+Blvd,+Kew+Gardens+Hills,+NY+11367"
                    ></iframe>
                </div>
            </div>

            {/*/!* Team Section *!/*/}
            {/*<div className="contact-section team-section">*/}
            {/*    <h2>Immpression Team</h2>*/}
            {/*    <div className="team-list">*/}
            {/*        /!* Placeholder team members *!/*/}
            {/*        <div className="team-member">*/}
            {/*            <img src="/team-member1.jpg" alt="Team Member 1" />*/}
            {/*            <p>John Doe - CEO</p>*/}
            {/*        </div>*/}
            {/*        <div className="team-member">*/}
            {/*            <img src="/team-member2.jpg" alt="Team Member 2" />*/}
            {/*            <p>Jane Smith - CTO</p>*/}
            {/*        </div>*/}
            {/*        <div className="team-member">*/}
            {/*            <img src="/team-member3.jpg" alt="Team Member 3" />*/}
            {/*            <p>Michael Brown - COO</p>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    );
};

export default ContactUs;
