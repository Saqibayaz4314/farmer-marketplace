import React, { useEffect, useState } from "react";
import {
  FaEnvelope,
  FaUserEdit,
  FaSeedling,
  FaMapMarkerAlt,
  FaPhone,
  FaCamera,
  FaSave,
  FaTimes,
  FaCheckCircle,
  FaSpinner,
  FaUser,
  FaCalendarAlt,
} from "react-icons/fa";
import { getProfile, updateProfile, getCurrentUser } from "../services/authService";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("view"); // view, edit, password
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: "",
    location: "",
    contact: "",
    photo: "",
  });



  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        const userData = data.data?.user || data.user || data;
        setUser(userData);
        setEditForm({
          name: userData.name || "",
          location: userData.location || "",
          contact: userData.contact || "",
          photo: userData.photo || "",
        });
      } catch (err) {
        console.error("Profile fetch error:", err);
        // Fallback to localStorage
        const localUser = getCurrentUser();
        if (localUser) {
          setUser(localUser);
          setEditForm({
            name: localUser.name || "",
            location: localUser.location || "",
            contact: localUser.contact || "",
            photo: localUser.photo || "",
          });
        } else {
          setError("Failed to load profile. Please log in again.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };



  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!editForm.name.trim()) {
      setError("Name is required");
      return;
    }
    try {
      setSaving(true);
      setError("");

      let profileData;
      if (photoFile) {
        // Use FormData when uploading a photo file
        profileData = new FormData();
        profileData.append("name", editForm.name);
        profileData.append("location", editForm.location);
        profileData.append("contact", editForm.contact);
        profileData.append("photo", photoFile);
      } else {
        profileData = editForm;
      }

      const result = await updateProfile(profileData);
      if (result.success) {
        const updatedUser = result.data?.user || { ...user, ...editForm };
        setUser(updatedUser);
        setPhotoFile(null);
        setPhotoPreview(null);
        showSuccess("Profile updated successfully! ✅");
        setActiveTab("view");
      }
    } catch (err) {
      console.error("Update error:", err);
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-6xl text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-xl text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
          <FaTimes className="text-5xl text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-6xl text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-xl text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "view", label: "My Profile", icon: <FaUser /> },
    { id: "edit", label: "Edit Profile", icon: <FaUserEdit /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-yellow-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Toast */}
        {successMsg && (
          <div className="fixed top-24 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
            <FaCheckCircle />
            {successMsg}
          </div>
        )}

        {/* Profile Header Card */}
        <div className="bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 rounded-3xl p-8 mb-6 text-white shadow-2xl relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-10 -translate-x-10"></div>

          <div className="relative flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <img
                src={user.photo && user.photo !== "https://via.placeholder.com/150"
                  ? (user.photo.startsWith("/uploads")
                    ? `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${user.photo}`
                    : user.photo)
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=128&background=ffffff&color=16a34a&bold=true&font-size=0.4`
                }
                alt="Profile"
                className="w-28 h-28 rounded-full border-4 border-white/80 shadow-xl object-cover"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=128&background=ffffff&color=16a34a&bold=true&font-size=0.4`;
                }}
              />
              <div className="absolute -bottom-1 -right-1 bg-green-400 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                <FaCheckCircle className="text-white text-sm" />
              </div>
            </div>

            {/* User Info */}
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-green-100 flex items-center gap-2 justify-center sm:justify-start mt-1">
                <FaEnvelope className="text-sm" /> {user.email}
              </p>
              <div className="flex items-center gap-3 mt-3 justify-center sm:justify-start">
                <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                  user.role === "farmer"
                    ? "bg-yellow-400/90 text-yellow-900"
                    : "bg-blue-400/90 text-blue-900"
                }`}>
                  <FaSeedling className="inline mr-1" />
                  {user.role === "farmer" ? "🌾 Farmer" : "🛒 Buyer"}
                </span>
                {user.createdAt && (
                  <span className="text-green-100 text-sm flex items-center gap-1">
                    <FaCalendarAlt className="text-xs" />
                    Member since {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg mb-6 p-2 flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setError(""); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg scale-[1.02]"
                  : "text-gray-600 hover:bg-green-50 hover:text-green-700"
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
            <FaTimes className="text-red-500" />
            {error}
            <button onClick={() => setError("")} className="ml-auto text-red-400 hover:text-red-600">
              <FaTimes />
            </button>
          </div>
        )}

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          {/* VIEW TAB */}
          {activeTab === "view" && (
            <div>
              <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center gap-2">
                <FaUser className="text-green-600" /> Profile Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoCard icon={<FaUser />} label="Full Name" value={user.name} />
                <InfoCard icon={<FaEnvelope />} label="Email Address" value={user.email} />
                <InfoCard icon={<FaSeedling />} label="Account Type" value={user.role === "farmer" ? "Farmer 🌾" : "Buyer 🛒"} />
                <InfoCard icon={<FaMapMarkerAlt />} label="Location" value={user.location || "Not set"} muted={!user.location} />
                <InfoCard icon={<FaPhone />} label="Contact Number" value={user.contact || "Not set"} muted={!user.contact} />
                <InfoCard icon={<FaShieldAlt />} label="Account Status" value="Verified ✅" />
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 flex gap-3">
                <button
                  onClick={() => setActiveTab("edit")}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-green-300/40 transition-all duration-300 flex items-center gap-2"
                >
                  <FaUserEdit /> Edit Profile
                </button>
                <button
                  onClick={() => setActiveTab("password")}
                  className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 flex items-center gap-2"
                >
                  <FaLock /> Change Password
                </button>
              </div>
            </div>
          )}

          {/* EDIT TAB */}
          {activeTab === "edit" && (
            <form onSubmit={handleSaveProfile}>
              <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center gap-2">
                <FaUserEdit className="text-green-600" /> Edit Profile
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaUser className="inline mr-2 text-green-600" /> Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaMapMarkerAlt className="inline mr-2 text-green-600" /> Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={editForm.location}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="e.g. Lahore, Punjab"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaPhone className="inline mr-2 text-green-600" /> Contact Number
                  </label>
                  <input
                    type="text"
                    name="contact"
                    value={editForm.contact}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="e.g. 03XX-XXXXXXX"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaCamera className="inline mr-2 text-green-600" /> Profile Photo
                  </label>
                  <div className="flex items-center gap-4">
                    {/* Preview */}
                    <div className="relative">
                      <img
                        src={
                          photoPreview ||
                          (editForm.photo && editForm.photo !== "https://via.placeholder.com/150"
                            ? (editForm.photo.startsWith("/uploads")
                              ? `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${editForm.photo}`
                              : editForm.photo)
                            : `https://ui-avatars.com/api/?name=${encodeURIComponent(editForm.name || "User")}&size=128&background=16a34a&color=ffffff&bold=true`)
                        }
                        alt="Preview"
                        className="w-20 h-20 rounded-full object-cover border-2 border-green-300"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(editForm.name || "User")}&size=128&background=16a34a&color=ffffff&bold=true`;
                        }}
                      />
                    </div>
                    {/* Upload Button */}
                    <div className="flex-1">
                      <label className="cursor-pointer inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2.5 rounded-xl font-medium hover:bg-green-100 transition-all border border-green-200">
                        <FaCamera />
                        <span>{photoFile ? photoFile.name : "Upload Photo"}</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              if (file.size > 5 * 1024 * 1024) {
                                setError("Image must be less than 5MB");
                                return;
                              }
                              setPhotoFile(file);
                              setPhotoPreview(URL.createObjectURL(file));
                            }
                          }}
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-1">JPEG, PNG, WebP • Max 5MB</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-green-300/40 transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
                >
                  {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab("view"); setError(""); }}
                  className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 flex items-center gap-2"
                >
                  <FaTimes /> Cancel
                </button>
              </div>
            </form>
          )}


        </div>
      </div>
    </div>
  );
};

// Reusable info card component
const InfoCard = ({ icon, label, value, muted = false }) => (
  <div className="bg-gradient-to-br from-gray-50 to-green-50/30 p-5 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300">
    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
      <span className="text-green-600">{icon}</span>
      {label}
    </div>
    <p className={`text-lg font-semibold ${muted ? "text-gray-400 italic" : "text-gray-800"}`}>
      {value}
    </p>
  </div>
);

export default Profile;
