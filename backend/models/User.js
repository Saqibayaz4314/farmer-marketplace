// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    // 🧍 Basic Info
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // 📧 Email for login
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    // 🔒 Hashed password
    password: {
      type: String,
      required: true,
      minlength: 8,
    },

    // 👩‍🌾 or 🛒
    role: {
      type: String,
      enum: ["farmer", "buyer"],
      default: "buyer",
    },

    // 📍 Optional info
    location: {
      type: String,
      default: "",
    },
    contact: {
      type: String,
      default: "",
    },

    // 🖼️ Profile picture (URL-based for now)
    photo: {
      type: String,
      default: "https://via.placeholder.com/150", // placeholder until we add uploads
    },

    // 🤖 AI Rate Limiting
    aiRequestCount: {
      type: Number,
      default: 0,
    },
    aiRequestResetDate: {
      type: Date,
      default: Date.now,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },

    // 🔑 Password Reset
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// 🔒 Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔐 Compare entered password with hashed one
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 🧾 Model export
const User = mongoose.model("User", userSchema);
export default User;
