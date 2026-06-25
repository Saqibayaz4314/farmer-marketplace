import React, { useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaTractor, FaSeedling } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import { useToast } from "../components/Toast";

const Register = () => {
  const [data, setData] = useState({ name: "", email: "", password: "", confirmPassword: "", role: "buyer" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const onChangeHandler = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    if (!data.name.trim()) {
      setError("Name is required");
      return;
    }
    if (!data.email.trim()) {
      setError("Email is required");
      return;
    }
    if (data.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    setError("");

    try {
      const res = await registerUser({ 
        name: data.name, 
        email: data.email, 
        password: data.password,
        role: data.role 
      });
      
      if (res.success) {
        toast.success("Registration Successful!");
        navigate("/login");
      } else {
        setError(res.message || "Registration failed");
      }
    } catch (err) {
      console.error("❌ Registration Error:", err);
      // Show the actual error message from backend
      const errorMessage = err.response?.data?.message || err.message || "Registration failed. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-yellow-50 px-4 py-12">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md border border-green-200/50 shadow-2xl rounded-3xl p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="bg-gradient-to-br from-green-500 to-green-700 p-3 rounded-2xl shadow-md">
              <FaTractor className="text-white text-2xl" />
              <FaSeedling className="text-green-200 absolute -top-1 -right-1 text-xs" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-green-900 font-bold text-2xl">Farmer</span>
              <span className="text-green-600 font-semibold text-2xl -mt-1">Market</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 mb-4 flex items-start gap-3">
              <span className="text-red-500 text-xl">⚠️</span>
              <div className="flex-1">
                <p className="font-semibold text-sm">Error</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          <div className="mb-4">
            <input type="text" name="name" placeholder="Full Name" value={data.name} onChange={onChangeHandler}
              className="w-full border border-green-200 rounded-2xl px-4 py-3 bg-green-50" required />
          </div>
          <div className="mb-4">
            <input type="email" name="email" placeholder="Email" value={data.email} onChange={onChangeHandler}
              className="w-full border border-green-200 rounded-2xl px-4 py-3 bg-green-50" required />
          </div>

          {/* Role Selection */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2 text-sm">I am a:</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setData({ ...data, role: "buyer" })}
                className={`px-4 py-3 rounded-2xl border-2 font-medium transition-all ${
                  data.role === "buyer"
                    ? "bg-green-500 text-white border-green-500 shadow-md"
                    : "bg-white text-gray-700 border-green-200 hover:border-green-400"
                }`}
              >
                🛒 Buyer
              </button>
              <button
                type="button"
                onClick={() => setData({ ...data, role: "farmer" })}
                className={`px-4 py-3 rounded-2xl border-2 font-medium transition-all ${
                  data.role === "farmer"
                    ? "bg-green-500 text-white border-green-500 shadow-md"
                    : "bg-white text-gray-700 border-green-200 hover:border-green-400"
                }`}
              >
                🌾 Farmer
              </button>
            </div>
          </div>

          <div className="mb-4 relative">
            <input type={showPassword ? "text" : "password"} name="password" placeholder="Password"
              value={data.password} onChange={onChangeHandler}
              className="w-full border border-green-200 rounded-2xl px-4 py-3 bg-green-50 pr-10" required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3 text-green-600">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="mb-4 relative">
            <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password"
              value={data.confirmPassword} onChange={onChangeHandler}
              className="w-full border border-green-200 rounded-2xl px-4 py-3 bg-green-50 pr-10" required />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-3 text-green-600">
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button type="submit" disabled={isLoading} className="w-full h-12 rounded-2xl text-white bg-gradient-to-r from-green-500 to-green-600 font-semibold">
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="text-center text-gray-700 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-green-700 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
