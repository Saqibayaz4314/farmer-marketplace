import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaExchangeAlt } from "react-icons/fa";
import {
  FaBars,
  FaTimes,
  FaUser,
  FaComments,
  FaShoppingBag,
  FaTractor,
  FaSeedling,
  FaLeaf,
  FaHome,
  FaChartLine,
  FaShoppingCart,
  FaSignOutAlt
} from "react-icons/fa";
import { getCurrentUser, logoutUser, switchRole as switchRoleAPI } from "../services/authService";
import { getUnreadCount } from "../services/chatService";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get current user
  const user = getCurrentUser();
  const isLoggedIn = !!user;
  const userRole = user?.role;

  // Handle logout
  const handleLogout = () => {
    logoutUser();
    navigate("/");
    setMenuOpen(false);
  };

  // Handle role switch
  const handleSwitchRole = async () => {
    try {
      await switchRoleAPI();
      window.location.reload(); // Full reload to refresh all role-dependent UI
    } catch (err) {
      console.error("Failed to switch role:", err);
    }
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Fetch unread count — on mount, on route change, and poll every 30s
  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchUnread = async () => {
      try {
        const data = await getUnreadCount();
        setUnreadCount(data.unreadCount || 0);
      } catch (err) {
        // Silently fail — don't break nav for badge
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [isLoggedIn, location.pathname]);

  const isActiveRoute = (path) => location.pathname === path;

  // Navigation items based on user role
  const getNavItems = () => {
    const commonItems = [
      { 
        to: "/", 
        label: "Home", 
        icon: <FaHome size={16} />,
        roles: ["farmer", "buyer", null]
      },
      { 
        to: "/marketplace", 
        label: "Marketplace", 
        icon: <FaShoppingBag size={16} />,
        roles: ["farmer", "buyer"]
      },
      { 
        to: "/chat", 
        label: "Chat", 
        icon: <FaComments size={16} />,
        badge: unreadCount > 0 ? unreadCount : null,
        roles: ["farmer", "buyer"]
      },
    ];

    const farmerItems = [
      {
        to: "/dashboard",
        label: "Dashboard",
        icon: <FaChartLine size={16} />,
        roles: ["farmer"]
      },
    ];

    const buyerItems = [
      {
        to: "/cart",
        label: "Cart",
        icon: <FaShoppingCart size={16} />,
        roles: ["buyer"]
      },
    ];

    if (userRole === "farmer") {
      return [...commonItems, ...farmerItems];
    } else if (userRole === "buyer") {
      return [...commonItems, ...buyerItems];
    } else {
      return commonItems.filter(item => item.roles.includes(null));
    }
  };

  const navItems = getNavItems();

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-green-100/60"
            : "bg-white/90 backdrop-blur-lg shadow-sm border-b border-green-100/40"
        }`}
      >
        <div className="max-w-7xl mx-auto h-14 sm:h-16 flex items-center justify-between px-3 sm:px-6 lg:px-8">
          
          {/* Logo Section */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile Menu Button */}
            <button
              className={`lg:hidden p-1.5 sm:p-2 rounded-xl transition-all duration-300 ${
                menuOpen 
                  ? "bg-green-100 text-green-700" 
                  : "text-green-700 hover:bg-green-50"
              }`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
            </button>

            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-1.5 sm:gap-3 group transition-all duration-300 hover:scale-105"
            >
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-lg group-hover:shadow-green-300/40 transition-all duration-300">
                <FaTractor className="text-white text-sm sm:text-xl" />
              </div>
              
              <div className="flex gap-0.5 leading-tight">
                <span className="font-black text-lg sm:text-2xl lg:text-3xl tracking-tight bg-gradient-to-r from-green-900 to-green-800 bg-clip-text text-transparent">
                  Farmer
                </span>
                <span className="font-bold text-lg sm:text-2xl lg:text-3xl tracking-wide bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                  Market
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 group ${
                  isActiveRoute(item.to)
                    ? "text-green-700 bg-green-50 border border-green-200 shadow-sm"
                    : "text-gray-600 hover:text-green-700 hover:bg-green-50/80"
                }`}
              >
                <span
                  className={`transition-colors duration-300 ${
                    isActiveRoute(item.to) ? "text-green-600" : "text-gray-500 group-hover:text-green-600"
                  }`}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
                
                {/* Notification Badge */}
                {item.badge && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold px-1 animate-pulse">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </Link>
            ))}

            {/* Profile & Logout */}
            {isLoggedIn ? (
              <>
                {/* Role Switch Button */}
                <button
                  onClick={handleSwitchRole}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl transition-all duration-300 bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 hover:from-amber-100 hover:to-amber-200 border border-amber-200"
                  title={`Switch to ${userRole === 'farmer' ? 'Buyer' : 'Farmer'} mode`}
                >
                  <FaExchangeAlt size={12} />
                  <span className="hidden xl:inline">Switch to {userRole === 'farmer' ? 'Buyer' : 'Farmer'}</span>
                  <span className="xl:hidden">{userRole === 'farmer' ? '🛒' : '🌾'}</span>
                </button>

                <Link
                  to="/profile"
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 group ${
                    isActiveRoute("/profile")
                      ? "text-green-700 bg-green-50 border border-green-200 shadow-sm"
                      : "text-gray-600 hover:text-green-700 hover:bg-green-50/80"
                  }`}
                >
                  <FaUser size={16} />
                  <span>Profile</span>
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-200"
                  aria-label="Logout"
                >
                  <FaSignOutAlt size={16} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-green-400/30 hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            )}
          </div>

          {/* Mobile Get Started Button */}
          {!isLoggedIn && (
            <div className="lg:hidden">
              <Link
                to="/login"
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden bg-white border-t border-green-100 transition-all duration-300 overflow-hidden ${
            menuOpen ? "max-h-96 opacity-100 py-3" : "max-h-0 opacity-0 py-0"
          }`}
        >
          <div className="px-3 space-y-1.5">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300 ${
                  isActiveRoute(item.to)
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "text-gray-700 hover:bg-green-50"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                <span className={`transition-colors duration-300 ${
                  isActiveRoute(item.to) ? "text-green-700" : "text-green-600"
                }`}>
                  {item.icon}
                </span>
                <span className="font-medium text-sm">{item.label}</span>
                
                {/* Mobile Badge */}
                {item.badge && (
                  <span className="ml-auto min-w-[22px] h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold px-1">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </Link>
            ))}

            {/* Mobile Profile & Logout */}
            {isLoggedIn && (
              <>
                {/* Mobile Role Switch */}
                <button
                  onClick={handleSwitchRole}
                  className="flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300 bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 w-full"
                >
                  <FaExchangeAlt size={16} />
                  <span className="font-medium text-sm">Switch to {userRole === 'farmer' ? 'Buyer' : 'Farmer'}</span>
                </button>

                <Link
                  to="/profile"
                  className={`flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300 ${
                    isActiveRoute("/profile")
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "text-gray-700 hover:bg-green-50"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  <FaUser size={16} />
                  <span className="font-medium text-sm">Profile</span>
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 w-full"
                >
                  <FaSignOutAlt size={16} />
                  <span className="font-medium text-sm">Logout</span>
                </button>
              </>
            )}

            {!isLoggedIn && (
              <div className="pt-1">
                <Link
                  to="/login"
                  className="block bg-gradient-to-r from-green-500 to-green-600 text-white p-2.5 rounded-xl font-semibold text-center text-sm transition-all duration-300"
                  onClick={() => setMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-14 sm:h-16"></div>
    </>
  );
};

export default Navbar;