import "./PolicyPage.css";

const sections = [
  {
    title: "1. Introduction",
    content: `Immpression ("we", "us", or "our") operates a mobile and web platform for discovering, buying, and selling original artwork. This Privacy Policy explains how we collect, use, and protect your personal information when you use our services. By using Immpression, you agree to the practices described in this policy.`,
  },
  {
    title: "2. Information We Collect",
    items: [
      { label: "Account Information", text: "When you create an account, we collect your name, email address, and password. If you sign in with Google, we receive your name, email, and profile picture from Google." },
      { label: "Profile and Content", text: "Artists may upload artwork images, pricing, descriptions, and other listing information. This content is stored and displayed publicly on the platform." },
      { label: "Transaction Information", text: "When you make or receive a payment, we collect information necessary to process the transaction. Payments are handled by Stripe. We do not store full payment card details." },
      { label: "Usage Data", text: "We automatically collect information about how you interact with Immpression, including pages viewed, artworks browsed, search queries, and general device and browser information." },
      { label: "Communications", text: "If you contact us via the contact form or email, we collect the contents of your message and your contact details." },
    ],
  },
  {
    title: "3. How We Use Your Information",
    items: [
      { label: "Platform Operation", text: "To create and manage your account, process transactions, and deliver the core features of Immpression." },
      { label: "Communication", text: "To send you important account updates, order confirmations, and responses to your support inquiries." },
      { label: "Improvement", text: "To understand how users interact with the platform and improve features, performance, and design." },
      { label: "Safety and Compliance", text: "To detect and prevent fraud, abuse, and violations of our terms of service." },
    ],
  },
  {
    title: "4. Sharing of Information",
    content: `We do not sell your personal information. We may share your data in the following limited circumstances:`,
    items: [
      { label: "Payment Processors", text: "We use Stripe to handle payments. Your payment information is processed directly by Stripe under their privacy policy." },
      { label: "Service Providers", text: "We may share data with trusted third-party services that help us operate the platform, such as cloud storage, email delivery, and analytics. These providers are contractually required to protect your data." },
      { label: "Legal Requirements", text: "We may disclose information if required by law or in response to a valid legal request." },
    ],
  },
  {
    title: "5. Cookies and Tracking",
    content: `Immpression uses cookies and similar tracking technologies to maintain your session, remember your preferences, and understand platform usage. You can control cookies through your browser settings. Disabling cookies may affect the functionality of certain features.`,
  },
  {
    title: "6. Your Rights",
    items: [
      { label: "Access", text: "You may request a copy of the personal data we hold about you." },
      { label: "Correction", text: "You can update your account information at any time through the app settings." },
      { label: "Deletion", text: "You may delete your account at any time. Upon deletion, your personal data will be removed from our systems, subject to legal retention requirements." },
      { label: "Data Portability", text: "You may request a copy of your data in a portable format." },
    ],
  },
  {
    title: "7. Data Security",
    content: `We take reasonable technical and organizational measures to protect your data against unauthorized access, loss, or misuse. All data is transmitted over encrypted connections (HTTPS). However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.`,
  },
  {
    title: "8. Children's Privacy",
    content: `Immpression is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us so we can remove it.`,
  },
  {
    title: "9. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. When we do, we will update the date at the top of this page. Continued use of Immpression after changes are posted constitutes your acceptance of the updated policy.`,
  },
  {
    title: "10. Contact Us",
    content: `If you have any questions or concerns about this Privacy Policy, you can reach us at:`,
    contact: "immpression.nyc@gmail.com",
  },
];

const PolicyPage = () => {
  return (
    <div className="policy-wrapper">
      <div className="policy-container">

        <div className="policy-header">
          <h1 className="policy-title">Privacy Policy</h1>
          <p className="policy-date">Last updated: April 7, 2025</p>
          <p className="policy-intro">
            This policy explains how Immpression collects, uses, and protects your personal information.
            We are committed to being transparent about our data practices and respecting your privacy.
          </p>
        </div>

        <div className="policy-divider" />

        <div className="policy-body">
          {sections.map((section) => (
            <div key={section.title} className="policy-section">
              <h2 className="policy-section-title">{section.title}</h2>

              {section.content && (
                <p className="policy-text">{section.content}</p>
              )}

              {section.items && (
                <ul className="policy-list">
                  {section.items.map((item) => (
                    <li key={item.label} className="policy-list-item">
                      <strong>{item.label}:</strong> {item.text}
                    </li>
                  ))}
                </ul>
              )}

              {section.contact && (
                <a href={`mailto:${section.contact}`} className="policy-email">
                  {section.contact}
                </a>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default PolicyPage;
