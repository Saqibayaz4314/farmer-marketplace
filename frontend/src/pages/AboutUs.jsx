import React from "react";
import { Link } from "react-router-dom";
import {
  FaSeedling,
  FaHandshake,
  FaUsers,
  FaTruck,
  FaLeaf,
  FaShieldAlt,
  FaChartLine,
  FaHeart,
  FaGlobe,
  FaArrowRight,
} from "react-icons/fa";

const AboutUs = () => {
  const stats = [
    { icon: <FaUsers />, value: "10,000+", label: "Active Farmers" },
    { icon: <FaHandshake />, value: "50,000+", label: "Happy Buyers" },
    { icon: <FaSeedling />, value: "25,000+", label: "Products Listed" },
    { icon: <FaTruck />, value: "100+", label: "Cities Covered" },
  ];

  const values = [
    {
      icon: <FaLeaf className="text-3xl" />,
      title: "Fresh & Organic",
      desc: "We ensure that all products listed on our platform meet the highest quality standards, directly from the farm to your table.",
    },
    {
      icon: <FaShieldAlt className="text-3xl" />,
      title: "Trust & Transparency",
      desc: "We build trust between farmers and buyers through verified profiles, honest pricing, and real-time communication.",
    },
    {
      icon: <FaChartLine className="text-3xl" />,
      title: "Fair Pricing",
      desc: "By eliminating middlemen, we ensure farmers get the best prices for their produce while buyers enjoy affordable rates.",
    },
    {
      icon: <FaHeart className="text-3xl" />,
      title: "Community First",
      desc: "We're building a community that supports local agriculture, promotes sustainability, and empowers rural economies.",
    },
  ];

  const team = [
    { name: "Team FarmLink", role: "Founders & Developers", emoji: "👨‍💻" },
    { name: "Our Farmers", role: "The Heart of FarmLink", emoji: "👨‍🌾" },
    { name: "Our Buyers", role: "Our Valued Community", emoji: "🛒" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-yellow-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-800 via-green-700 to-emerald-700 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
              <FaSeedling />
              <span>Empowering Agriculture Since 2024</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
              About <span className="text-green-300">FarmLink</span>
            </h1>
            <p className="text-lg sm:text-xl text-green-100 leading-relaxed max-w-3xl mx-auto">
              Bridging the gap between farmers and buyers across Pakistan. 
              We're revolutionizing how fresh produce reaches your doorstep — 
              directly, fairly, and sustainably.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full">
            <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,40 1440,30 L1440,80 L0,80 Z" fill="#f0fdf4" />
          </svg>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 text-center border border-green-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-green-600 text-2xl sm:text-3xl mb-2 flex justify-center">
                {stat.icon}
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-green-800">
                {stat.value}
              </p>
              <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-green-900 mb-6">
              Our Mission 🌱
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              FarmLink was born out of a simple yet powerful idea — to connect 
              Pakistani farmers directly with buyers, eliminating the middlemen 
              who often take the lion's share of profits.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              We believe that every farmer deserves a fair price for their hard work, 
              and every buyer deserves access to fresh, quality produce at reasonable prices.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              Through technology, transparency, and a commitment to community, 
              we're building a platform that empowers both farmers and buyers 
              across Pakistan.
            </p>
          </div>
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-green-100">
            <div className="grid grid-cols-1 gap-6">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-xl flex-shrink-0">
                  <FaGlobe className="text-green-600 text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-green-900 text-lg">Vision</h3>
                  <p className="text-gray-600">
                    To become Pakistan's largest and most trusted farm-to-table marketplace.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-xl flex-shrink-0">
                  <FaHandshake className="text-green-600 text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-green-900 text-lg">Purpose</h3>
                  <p className="text-gray-600">
                    Empowering farmers with technology and connecting them with urban buyers seamlessly.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-xl flex-shrink-0">
                  <FaSeedling className="text-green-600 text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-green-900 text-lg">Impact</h3>
                  <p className="text-gray-600">
                    Creating sustainable livelihoods for farming communities while ensuring food quality.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-green-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Everything we do is guided by these principles
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <div
                key={i}
                className="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="text-green-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <h3 className="font-bold text-green-900 text-lg mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-green-900 mb-4">
            The FarmLink Family
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            It takes a community to build something meaningful
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {team.map((member, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-lg p-8 text-center border border-green-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-6xl mb-4">{member.emoji}</div>
              <h3 className="font-bold text-green-900 text-xl mb-1">
                {member.name}
              </h3>
              <p className="text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-green-700 to-emerald-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-6">
            Ready to Join the FarmLink Community?
          </h2>
          <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
            Whether you're a farmer looking to sell directly to buyers, or a buyer 
            seeking fresh farm produce — FarmLink is the place for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 bg-white text-green-800 px-8 py-4 rounded-2xl font-bold hover:bg-green-50 transition-all duration-300 hover:shadow-lg"
            >
              Get Started
              <FaArrowRight />
            </Link>
            <Link
              to="/marketplace"
              className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-8 py-4 rounded-2xl font-bold border-2 border-green-400 hover:bg-green-500 transition-all duration-300"
            >
              <FaSeedling />
              Explore Marketplace
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
