import React, { useState } from "react";
import { FaLock, FaEye, FaEyeSlash, FaTractor, FaSeedling, FaArrowLeft, FaCheck } from "react-icons/fa";
import { Link, useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/authService";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await resetPassword(token, password);
      if (res.success) {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError(res.message || "Password reset failed");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Password reset failed. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    if (password.length === 0) return { text: "", color: "", width: "0%" };
    if (password.length < 8) return { text: "Too short", color: "bg-red-500", width: "25%" };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const levels = [
      { text: "Weak", color: "bg-red-500", width: "25%" },
      { text: "Fair", color: "bg-yellow-500", width: "50%" },
      { text: "Good", color: "bg-blue-500", width: "75%" },
      { text: "Strong", color: "bg-green-500", width: "100%" },
    ];

    return levels[strength - 1] || levels[0];
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-yellow-50 px-4 py-12">
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-green-500 to-green-700 p-3 rounded-2xl shadow-lg">
              <FaTractor className="text-white text-2xl" />
              <FaSeedling className="text-green-200 absolute -top-1 -right-1 text-xs" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-green-900 font-bold text-2xl">Farmer</span>
              <span className="text-green-600 font-semibold text-2xl -mt-1">Market</span>
            </div>
          </div>
        </div>

        <div className="w-full text-center border border-green-200/60 rounded-3xl px-8 py-10 bg-white/80 shadow-2xl">
          {!success ? (
            <>
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">🔑</span>
                </div>
              </div>

              <h1 className="text-green-900 text-3xl font-black mb-3">Set New Password</h1>
              <p className="text-gray-600 mb-8">
                Create a strong password with at least 8 characters.
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 mb-6 flex items-start gap-3 text-left">
                  <span className="text-red-500 text-xl">⚠️</span>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Error</p>
                    <p className="text-sm mt-1">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* New Password */}
                <div className="mb-4 relative">
                  <div className="flex items-center bg-green-50 border border-green-200 h-14 rounded-2xl pl-6 gap-4">
                    <FaLock className="text-green-600 text-lg" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="New Password (min 8 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-transparent w-full outline-none pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 text-green-600"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  {/* Password Strength Bar */}
                  {password.length > 0 && (
                    <div className="mt-2 px-1">
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${strength.color} rounded-full transition-all duration-300`}
                          style={{ width: strength.width }}
                        ></div>
                      </div>
                      <p className={`text-xs mt-1 font-medium ${
                        strength.color === "bg-red-500" ? "text-red-500" :
                        strength.color === "bg-yellow-500" ? "text-yellow-600" :
                        strength.color === "bg-blue-500" ? "text-blue-500" : "text-green-600"
                      }`}>
                        {strength.text}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="mb-6 relative">
                  <div className="flex items-center bg-green-50 border border-green-200 h-14 rounded-2xl pl-6 gap-4">
                    <FaLock className="text-green-600 text-lg" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm New Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-transparent w-full outline-none pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 text-green-600"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  {/* Match indicator */}
                  {confirmPassword.length > 0 && (
                    <p className={`text-xs mt-2 px-1 font-medium ${
                      password === confirmPassword ? "text-green-600" : "text-red-500"
                    }`}>
                      {password === confirmPassword ? "✅ Passwords match" : "❌ Passwords do not match"}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 rounded-2xl text-white bg-gradient-to-r from-green-500 to-green-600 font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-60"
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                  <FaCheck className="text-green-600 text-3xl" />
                </div>
              </div>

              <h2 className="text-green-900 text-2xl font-black mb-3">Password Reset! 🎉</h2>
              <p className="text-gray-600 mb-6">
                Your password has been reset successfully. You'll be redirected to login shortly.
              </p>

              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6">
                <p className="text-green-800 text-sm">
                  ✅ Redirecting to login in 3 seconds...
                </p>
              </div>

              <Link
                to="/login"
                className="text-green-700 font-bold hover:underline"
              >
                Go to Login Now →
              </Link>
            </>
          )}

          <div className="mt-8">
            <Link
              to="/login"
              className="text-green-700 font-bold hover:underline flex items-center justify-center gap-2"
            >
              <FaArrowLeft className="text-sm" /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
