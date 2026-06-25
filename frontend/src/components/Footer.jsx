import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaSeedling } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <FaSeedling className="text-green-500 text-2xl" />
              <h2 className="text-xl font-bold">FarmLink</h2>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Connecting farmers directly with buyers. Empowering agriculture with technology and transparency.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/marketplace" className="hover:text-green-400 transition">Marketplace</Link></li>
              <li><Link to="/about" className="hover:text-green-400 transition">About Us</Link></li>
              <li><Link to="/register" className="hover:text-green-400 transition">Join as Farmer</Link></li>
              <li><Link to="/register" className="hover:text-green-400 transition">Join as Buyer</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/privacy" className="hover:text-green-400 transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-green-400 transition">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <div className="text-sm text-gray-400 space-y-2">
              <p>support@farmlink.com</p>
              <p>+92 300 1234567</p>
              <div className="flex gap-3 mt-3">
                <a href="#" className="text-gray-400 hover:text-green-400 transition">
                  <FaFacebookF />
                </a>
                <a href="#" className="text-gray-400 hover:text-green-400 transition">
                  <FaXTwitter />
                </a>
                <a href="#" className="text-gray-400 hover:text-green-400 transition">
                  <FaInstagram />
                </a>
                <a href="#" className="text-gray-400 hover:text-green-400 transition">
                  <FaLinkedinIn />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-gray-400">
          <p>© {new Date().getFullYear()} FarmLink. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-green-400 transition">Privacy</Link>
            <Link to="/terms" className="hover:text-green-400 transition">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;