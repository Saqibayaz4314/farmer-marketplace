import React from "react";
import { Link } from "react-router-dom";
import { FaFileContract, FaArrowLeft } from "react-icons/fa";

const TermsConditions = () => {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: [
        "By creating an account or using FarmLink, you agree to be bound by these Terms and Conditions.",
        "If you do not agree with any part of these terms, you must not use our platform.",
        "We reserve the right to modify these terms at any time. Continued use after changes constitutes acceptance.",
      ],
    },
    {
      title: "2. Account Registration",
      content: [
        "You must provide accurate and complete information during registration.",
        "You are responsible for maintaining the confidentiality of your account credentials.",
        "You must be at least 18 years old to create an account.",
        "One person may not create multiple accounts. Duplicate accounts will be terminated.",
        "You are responsible for all activities that occur under your account.",
      ],
    },
    {
      title: "3. For Farmers",
      content: [
        "Farmers must provide accurate descriptions, pricing, and images for all listed products.",
        "Products must comply with Pakistani food safety and agricultural standards.",
        "Farmers are responsible for the quality, freshness, and timely delivery of their products.",
        "Misleading product listings or inflated prices may result in account suspension.",
        "Farmers can switch between farmer and buyer roles using the role-switching feature.",
      ],
    },
    {
      title: "4. For Buyers",
      content: [
        "Buyers must provide accurate delivery addresses and contact information.",
        "Orders once confirmed and shipped cannot be cancelled unless the seller agrees.",
        "Buyers should inspect products upon delivery and report issues within 24 hours.",
        "Payment is expected according to the selected method (Cash on Delivery, etc.).",
        "Abusive behavior towards farmers through the chat system will result in account suspension.",
      ],
    },
    {
      title: "5. Product Listings",
      content: [
        "All products must be legitimate agricultural produce or related goods.",
        "Prohibited items include: illegal substances, non-agricultural goods, and counterfeit products.",
        "FarmLink reserves the right to remove any listing that violates our guidelines.",
        "Product images must be genuine and representative of the actual product.",
      ],
    },
    {
      title: "6. Pricing & Payments",
      content: [
        "All prices are listed in Pakistani Rupees (PKR).",
        "Prices are set by farmers and may include AI-suggested pricing for guidance.",
        "Currently supported payment methods: Cash on Delivery (COD).",
        "Additional payment methods (EasyPaisa, JazzCash, Card) will be added in future updates.",
        "FarmLink may charge a service fee in the future, with advance notice to all users.",
      ],
    },
    {
      title: "7. Communication",
      content: [
        "FarmLink provides a real-time chat system for buyer-farmer communication.",
        "Chat messages are stored on our servers to facilitate ongoing conversations.",
        "Users must not use the chat system for spam, harassment, or illegal activities.",
        "Email notifications are sent for account-related actions (registration, password reset, etc.).",
      ],
    },
    {
      title: "8. AI Features",
      content: [
        "FarmLink provides AI-powered features including price suggestions and the FarmAssist chatbot.",
        "AI-generated suggestions are for guidance only and should not be considered financial advice.",
        "AI chat is limited to agricultural and platform-related queries only.",
        "Free users have daily limits on AI usage; premium users get unlimited access.",
      ],
    },
    {
      title: "9. Limitation of Liability",
      content: [
        "FarmLink acts as a marketplace platform and is not directly involved in transactions between farmers and buyers.",
        "We are not liable for the quality, safety, or legality of products listed by farmers.",
        "We are not responsible for delivery delays caused by external factors (weather, transportation, etc.).",
        "FarmLink's liability is limited to the extent permitted by Pakistani law.",
      ],
    },
    {
      title: "10. Termination",
      content: [
        "FarmLink may suspend or terminate accounts that violate these terms.",
        "Users may delete their accounts by contacting support.",
        "Upon termination, users will lose access to their account data, order history, and chat messages.",
        "Any pending orders at the time of termination will be handled on a case-by-case basis.",
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
              <FaFileContract className="text-green-600 text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-green-900">
                Terms & Conditions
              </h1>
              <p className="text-gray-600 text-sm">
                Last updated: February 2026
              </p>
            </div>
          </div>
          <p className="text-gray-700 text-lg leading-relaxed">
            Please read these Terms and Conditions carefully before using FarmLink. 
            These terms govern your use of our platform and the services we provide.
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
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-8 bg-green-100 rounded-2xl p-6 sm:p-8 border border-green-200 text-center">
          <h3 className="text-xl font-bold text-green-900 mb-2">
            Have Questions About Our Terms?
          </h3>
          <p className="text-gray-700 mb-4">
            If you need clarification on any of these terms, feel free to reach out.
          </p>
          <p className="text-green-800 font-semibold">
            📧 support@farmlink.com &nbsp;|&nbsp; 📞 +92 300 1234567
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
