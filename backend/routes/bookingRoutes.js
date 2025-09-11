const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

// POST - Create a new booking
router.post("/", async (req, res) => {
  console.log("Incoming booking data:", req.body);
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json({ message: "Booking saved successfully!" });
  } catch (error) {
    console.error("Error saving booking:", error);
    res.status(500).json({ error: "Failed to save booking." });
  }
});

// GET - Fetch all bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings." });
  }
});

module.exports = router;
