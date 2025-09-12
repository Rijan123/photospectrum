const express = require("express");
const Booking = require("../models/Booking");
const authMiddleware = require("../middleware/authMiddleware"); // Import middleware

const router = express.Router();

// Create a booking (Only logged-in users)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const booking = new Booking({
      ...req.body,
      userId: req.user.id, // attach logged-in user ID
    });
    await booking.save();
    res.status(201).json({ message: "Booking created successfully!" });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Failed to create booking" });
  }
});

// Get all bookings (Only logged-in users)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id });
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

module.exports = router;
// Delete a booking by ID (Only logged-in users)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedBooking = await Booking.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id, // ensure user owns the booking
    });

    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking deleted successfully!" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ message: "Failed to delete booking" });
  }
});
