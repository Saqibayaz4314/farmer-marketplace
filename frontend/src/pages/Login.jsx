import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaTractor, FaSeedling } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { useToast } from '../components/Toast';

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const onChangeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    if (!data.email.trim()) {
      setError("Email is required");
      return;
    }
    if (!data.password) {
      setError("Password is required");
      return;
    }
    
    setIsLoading(true);
    setError("");

    try {
      const res = await loginUser(data);
      
      if (res.success) {
        console.log("✅ Login Success:", res);
        toast.success("Login Successful!");
        
        // Redirect based on role
        const userRole = res.data.role;
        if (userRole === "farmer") {
          navigate("/dashboard");
        } else {
          navigate("/marketplace");
        }
      } else {
        setError(res.message || "Login failed");
      }
    } catch (err) {
      console.error("❌ Login Error:", err);
      // Show the actual error message from backend
      const errorMessage = err.response?.data?.message || err.message || "Login failed. Please check your credentials.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-yellow-50 px-4 py-12">
      <div className="w-full max-w-md relative z-10">
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

        <form onSubmit={handleSubmit} className="w-full text-center border border-green-200/60 rounded-3xl px-8 py-10 bg-white/80 shadow-2xl">
          <h1 className="text-green-900 text-3xl font-black mb-3">Welcome Back 👋</h1>
          <p className="text-gray-600 mb-6">Sign in to access your account</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 mb-6 flex items-start gap-3 text-left">
              <span className="text-red-500 text-xl">⚠️</span>
              <div className="flex-1">
                <p className="font-semibold text-sm">Login Failed</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          <div className="mb-6">
            <div className="flex items-center bg-green-50 border border-green-200 h-14 rounded-2xl pl-6 gap-4">
              <FaEnvelope className="text-green-600 text-lg" />
              <input
                type="email"
                placeholder="Email address"
                name="email"
                value={data.email}
                onChange={onChangeHandler}
                className="bg-transparent w-full outline-none"
                required
              />
            </div>
          </div>

          <div className="mb-6 relative">
            <div className="flex items-center bg-green-50 border border-green-200 h-14 rounded-2xl pl-6 gap-4">
              <FaLock className="text-green-600 text-lg" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                value={data.password}
                onChange={onChangeHandler}
                className="bg-transparent w-full outline-none pr-10"
                required
              />
              <button type="button" onClick={togglePasswordVisibility} className="absolute right-4 text-green-600">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full h-14 rounded-2xl text-white bg-gradient-to-r from-green-500 to-green-600 font-bold">
            {isLoading ? "Signing In..." : "Sign In"}
          </button>

          {/* Forgot Password Link */}
          <div className="text-center mt-4">
            <Link to="/forgot-password" className="text-green-600 text-sm font-semibold hover:underline hover:text-green-800 transition-colors">
              🔑 Forgot your password?
            </Link>
          </div>

          <p className="text-gray-700 text-base mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-green-700 font-bold hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
