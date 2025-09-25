const express = require("express");
const Booking = require("../models/Booking");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* =========================
   CREATE A BOOKING (USER ONLY)
   ========================= */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const booking = new Booking({
      ...req.body,
      status: "pending", // <-- FIXED: always lowercase
      userId: req.user.id,
    });

    await booking.save();
    res.status(201).json({ message: "Booking created successfully!", booking });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Failed to create booking" });
  }
});

/* =========================
   GET ALL BOOKINGS
   ========================= */
router.get("/", authMiddleware, async (req, res) => {
  try {
    let bookings;

    if (req.user.role === "admin") {
      // Admin sees ALL bookings
      bookings = await Booking.find().populate("userId", "name email phone");
    } else {
      // User sees ONLY their bookings
      bookings = await Booking.find({ userId: req.user.id });
    }

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

/* =========================
   UPDATE BOOKING STATUS (ADMIN ONLY)
   ========================= */
router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    // ✅ Validate status
    const validStatuses = ["accepted", "declined"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // ✅ Only admins can update booking status
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update status" });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("userId", "name email phone");

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({
      message: `Booking ${status} successfully`,
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ message: "Failed to update booking status" });
  }
});

/* =========================
   DELETE BOOKING
   ========================= */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    let deletedBooking;

    if (req.user.role === "admin") {
      // Admin can delete ANY booking
      deletedBooking = await Booking.findByIdAndDelete(req.params.id);
    } else {
      // User can only delete their OWN booking
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
