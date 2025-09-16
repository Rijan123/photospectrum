const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    dateOfBirth: {
      type: Date,
    },

    // ✅ Added this for storing profile picture filename
    profileImage: {
      type: String,
      default: "", // stores filename like "1727690438123.jpg"
    },

    role: {
      type: String,
      enum: ["user", "admin"], // either 'user' or 'admin'
      default: "user", // default role is user
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
