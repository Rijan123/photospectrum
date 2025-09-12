const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ===== MIDDLEWARE =====
app.use(cors()); // Allow requests from frontend
app.use(express.json()); // Parse JSON data from requests

// ✅ Log every incoming request
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ===== CONNECT TO MONGODB =====
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected successfully"))
.catch(err => console.error("MongoDB connection error:", err));

// ===== ROUTES =====
const bookingRoutes = require("./routes/bookingRoutes");
app.use("/api/bookings", bookingRoutes); // all booking routes handled here
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);


// ===== START SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
