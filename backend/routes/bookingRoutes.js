const express = require("express");
const Booking = require("../models/Booking");
const authMiddleware = require("../middleware/authMiddleware"); // Import middleware

const router = express.Router();

// ===== CREATE BOOKING (Logged-in Users Only) =====
router.post("/", authMiddleware, async (req, res) => {
  try {
    const booking = new Booking({
      ...req.body,
      userId: req.user.id, // Attach logged-in user's ID automatically
    });

    await booking.save();
    res.status(201).json({ message: "Booking created successfully!", booking });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Failed to create booking" });
  }
});

// ===== GET ALL BOOKINGS =====
router.get("/", authMiddleware, async (req, res) => {
  try {
    let bookings;

    if (req.user.role === "admin") {
      // ✅ Admin sees ALL bookings with user details
      bookings = await Booking.find().populate("userId", "name email phone");
    } else {
      // ✅ Normal users see only their own bookings
      bookings = await Booking.find({ userId: req.user.id });
    }

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

// ===== UPDATE BOOKING STATUS (Admin Only) =====
// Update booking status
router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: `Booking ${status}`, booking: updatedBooking });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ message: "Failed to update booking status" });
  }
});


// ===== DELETE BOOKING =====
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    let deletedBooking;

    if (req.user.role === "admin") {
      // ✅ Admin can delete ANY booking
      deletedBooking = await Booking.findByIdAndDelete(req.params.id);
    } else {
      // ✅ Normal user can only delete their OWN booking
      deletedBooking = await Booking.findOneAndDelete({
        _id: req.params.id,
        userId: req.user.id,
      });
    }

    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking deleted successfully!" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ message: "Failed to delete booking" });
  }
});

module.exports = router;
