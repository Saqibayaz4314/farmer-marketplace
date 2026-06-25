import React from "react";
import { Link } from "react-router-dom";
import farmerImg from "../assets/farmer-hero.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] bg-gradient-to-br from-green-50 to-yellow-50 flex items-center justify-center overflow-hidden px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-48 sm:w-72 h-48 sm:h-72 bg-green-200 rounded-full blur-3xl opacity-30 animate-float-slow"></div>
      <div className="absolute bottom-10 right-10 w-56 sm:w-80 h-56 sm:h-80 bg-yellow-200 rounded-full blur-3xl opacity-30 animate-float-medium"></div>
      
      {/* Floating particles — hidden on very small screens */}
      <div className="absolute inset-0 overflow-hidden hidden sm:block">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 rounded-full ${
              i % 3 === 0 ? 'bg-green-400' : i % 3 === 1 ? 'bg-yellow-400' : 'bg-emerald-300'
            } opacity-40 animate-float`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Main Container */}
      <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-12 xl:gap-16 relative z-10">
        
        {/* Left Content */}
        <div className="text-center lg:text-left max-w-2xl lg:max-w-none lg:w-1/2 flex flex-col items-center gap-2 lg:items-start">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-green-100/80 backdrop-blur-sm border border-green-200 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-3 sm:mb-5 lg:mb-6">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-800 font-medium text-xs sm:text-sm">🌿 Fresh from the farm to you</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 leading-tight mb-4 sm:mb-6 lg:mb-8">
            Connecting{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                Farmers
              </span>
              <div className="absolute bottom-1 sm:bottom-2 left-0 w-full h-2 sm:h-3 bg-green-200/40 -rotate-1 -z-0"></div>
            </span>{" "}
            &{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-yellow-500 to-yellow-700 bg-clip-text text-transparent">
                Buyers
              </span>
              <div className="absolute bottom-1 sm:bottom-2 left-0 w-full h-2 sm:h-3 bg-yellow-200/40 rotate-1 -z-0"></div>
            </span>{" "}
            Directly
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-700 mb-5 sm:mb-8 lg:mb-10 leading-relaxed max-w-3xl">
            Empowering agriculture with technology — sell your crops, discover
            fresh produce, and connect instantly with trusted buyers and sellers
            across the region.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-5 sm:gap-8 lg:gap-10 mb-5 sm:mb-8 lg:mb-10">
            {[
              { number: "10K+", label: "Active Farmers" },
              { number: "50K+", label: "Products" },
              { number: "100+", label: "Cities" }
            ].map((stat, index) => (
              <div key={index} className="text-center lg:text-left">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 font-medium mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 sm:gap-4 w-full">
            <Link
              to="/login"
              className="group relative bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white px-6 sm:px-10 py-3.5 sm:py-4 lg:py-5 rounded-2xl font-bold shadow-xl shadow-green-500/25 hover:shadow-green-600/30 transition-all duration-500 hover:-translate-y-1 overflow-hidden text-center"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-800 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative z-10 flex items-center justify-center gap-2 text-sm sm:text-base lg:text-lg font-semibold">
                🌱 Join as Farmer
              </span>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </Link>

            <Link
              to="/marketplace"
              className="group relative bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-green-900 px-6 sm:px-10 py-3.5 sm:py-4 lg:py-5 rounded-2xl font-bold shadow-xl shadow-yellow-500/25 hover:shadow-yellow-600/30 transition-all duration-500 hover:-translate-y-1 overflow-hidden text-center border border-yellow-300/50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-yellow-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative z-10 flex items-center justify-center gap-2 text-sm sm:text-base lg:text-lg font-semibold">
                🛒 Explore Marketplace
              </span>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </Link>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex justify-center lg:justify-end w-full lg:w-1/2 relative">
          <div className="relative w-full max-w-[280px] sm:max-w-md lg:max-w-lg xl:max-w-2xl">
            {/* Image Container */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl group">
              <img
                src={farmerImg}
                alt="Happy farmer showcasing fresh produce"
                className="w-full rounded-2xl sm:rounded-3xl transform group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            
            {/* Floating Cards — hidden on small mobile */}
            <div className="hidden sm:block absolute -bottom-4 -left-4 lg:-bottom-6 lg:-left-6 bg-white/90 backdrop-blur-md rounded-xl lg:rounded-2xl p-3 lg:p-4 shadow-xl lg:shadow-2xl border border-green-200/50 transform hover:-translate-y-2 transition-transform duration-300">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm lg:text-lg">🌾</span>
                </div>
                <div>
                  <div className="font-bold text-green-900 text-xs lg:text-base">Fresh Daily</div>
                  <div className="text-xs lg:text-sm text-gray-600">Direct from farms</div>
                </div>
              </div>
            </div>

            <div className="hidden sm:block absolute -top-4 -right-4 lg:-top-6 lg:-right-6 bg-white/90 backdrop-blur-md rounded-xl lg:rounded-2xl p-3 lg:p-4 shadow-xl lg:shadow-2xl border border-yellow-200/50 transform hover:-translate-y-2 transition-transform duration-300">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 text-sm lg:text-lg">🚚</span>
                </div>
                <div>
                  <div className="font-bold text-yellow-900 text-xs lg:text-base">Fast Delivery</div>
                  <div className="text-xs lg:text-sm text-gray-600">Across region</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator REMOVED as requested */}
    </section>
  );
};

export default HeroSection;