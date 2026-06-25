import React from "react";
import { Link } from "react-router-dom";
import { FaShieldAlt, FaArrowLeft } from "react-icons/fa";

const PrivacyPolicy = () => {
  const sections = [
    {
      title: "1. Information We Collect",
      content: [
        "**Personal Information:** When you register, we collect your name, email address, phone number, and location.",
        "**Profile Data:** Profile pictures, farm details, and product listings that you voluntarily provide.",
        "**Transaction Data:** Order history, cart items, delivery addresses, and payment method preferences.",
        "**Communication Data:** Messages sent through our chat system between buyers and farmers.",
        "**Usage Data:** Pages visited, features used, browser type, and device information for improving our services.",
      ],
    },
    {
      title: "2. How We Use Your Information",
      content: [
        "To create and manage your account on FarmLink.",
        "To facilitate transactions between farmers and buyers.",
        "To enable real-time communication through our chat system.",
        "To provide AI-powered features such as price suggestions and the FarmAssist chatbot.",
        "To send order confirmations, password resets, and important account notifications via email.",
        "To improve our platform's performance, features, and user experience.",
      ],
    },
    {
      title: "3. Data Protection",
      content: [
        "All passwords are encrypted using industry-standard bcrypt hashing.",
        "We use JWT (JSON Web Tokens) for secure authentication.",
        "API communications are secured with HTTPS encryption.",
        "We never store or have access to your plain-text password.",
        "Session tokens expire automatically for your security.",
      ],
    },
    {
      title: "4. Data Sharing",
      content: [
        "We do **not** sell, trade, or rent your personal information to third parties.",
        "Farmer names and contact info are shared with buyers only when viewing listed products.",
        "We may share data with law enforcement if required by Pakistani law.",
        "Email notifications are sent via secure SMTP services (Nodemailer).",
      ],
    },
    {
      title: "5. Cookies & Local Storage",
      content: [
        "We use browser local storage to maintain your login session.",
        "No third-party tracking cookies are used on FarmLink.",
        "You can clear your local storage at any time by logging out.",
      ],
    },
    {
      title: "6. Your Rights",
      content: [
        "**Access:** You can view and edit your profile information at any time.",
        "**Deletion:** You can request account deletion by contacting our support team.",
        "**Data Portability:** You can request a copy of your data in a standard format.",
        "**Opt-out:** You can opt out of non-essential email communications.",
      ],
    },
    {
      title: "7. Children's Privacy",
      content: [
        "FarmLink is not intended for users under the age of 18.",
        "We do not knowingly collect personal information from minors.",
        "If we discover that a minor's data has been collected, we will delete it immediately.",
      ],
    },
    {
      title: "8. Changes to This Policy",
      content: [
        "We may update this Privacy Policy from time to time.",
        "Changes will be posted on this page with an updated revision date.",
        "Continued use of FarmLink after changes constitutes acceptance of the updated policy.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-yellow-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 font-medium mb-4 transition-colors"
          >
            <FaArrowLeft />
            Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-100 p-3 rounded-xl">
              <FaShieldAlt className="text-green-600 text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-green-900">
                Privacy Policy
              </h1>
              <p className="text-gray-600 text-sm">
                Last updated: February 2026
              </p>
            </div>
          </div>
          <p className="text-gray-700 text-lg leading-relaxed">
            At FarmLink, we take your privacy seriously. This policy explains how we 
            collect, use, and protect your personal information when you use our platform.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 border border-green-100"
            >
              <h2 className="text-xl font-bold text-green-900 mb-4">
                {section.title}
              </h2>
              <ul className="space-y-3">
                {section.content.map((item, j) => (
                  <li key={j} className="flex items-start gap-3 text-gray-700">
                    <span className="text-green-500 mt-1.5 flex-shrink-0">•</span>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: item
                          .replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-900">$1</strong>'),
                      }}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-8 bg-green-100 rounded-2xl p-6 sm:p-8 border border-green-200 text-center">
          <h3 className="text-xl font-bold text-green-900 mb-2">
            Questions About Your Privacy?
          </h3>
          <p className="text-gray-700 mb-4">
            If you have any questions or concerns about this Privacy Policy, please contact us.
          </p>
          <p className="text-green-800 font-semibold">
            📧 support@farmlink.com &nbsp;|&nbsp; 📞 +92 300 1234567
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
