import "./ContactUs.css";

const ContactUs = () => {
    return (
        <div className="contact-page">
            {/* Hero Section */}
            <div className="contact-hero">
                <h1>Contact Us</h1>
                <p>We'd love to hear from you. Reach out to us through any of the following channels.</p>
            </div>

            {/* Main Content */}
            <div className="contact-content">
                {/* Contact Info Cards */}
                <div className="contact-info-grid">
                    <div className="info-card">
                        <div className="info-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                            </svg>
                        </div>
                        <h3>Email Us</h3>
                        <a href="mailto:immpression.nyc@gmail.com">immpression.nyc@gmail.com</a>
                        <p className="info-description">Send us an email anytime</p>
                    </div>

                    <div className="info-card">
                        <div className="info-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                            </svg>
                        </div>
                        <h3>Call Us</h3>
                        <a href="tel:+17187814261">+1 (718) 781-4261</a>
                        <p className="info-description">Mon-Fri from 9am to 6pm</p>
                    </div>

                    <div className="info-card">
                        <div className="info-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                        </div>
                        <h3>Visit Us</h3>
                        <a
                            href="https://www.google.com/maps/place/65-30+Kissena+Blvd,+Kew+Gardens+Hills,+NY+11367"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            65-30 Kissena Blvd<br/>Kew Gardens Hills, NY 11367
                        </a>
                        <p className="info-description">Come visit our office</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
