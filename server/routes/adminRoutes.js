import express from "express";
import User from "../models/User.js";
import Appointment from "../models/Appointment.js";

const router = express.Router();

// Get stats
router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "patient" });
    const totalDoctors = await User.countDocuments({ role: "doctor" });
    const totalAppointments = await Appointment.countDocuments();

    res.json({ totalUsers, totalDoctors, totalAppointments });
  } catch (err) {
    console.error("Stats Error:", err);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

// Get all users with role "patient"
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({ role: "patient" });
    res.json(users);
  } catch (err) {
    console.error("Users fetch error:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// Get all doctors
router.get("/doctors", async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" });
    res.json(doctors);
  } catch (err) {
    console.error("Doctors fetch error:", err);
    res.status(500).json({ message: "Failed to fetch doctors" });
  }
});

// Get all appointments with populated doctor/patient
router.get("/appointments", async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "name")
      .populate("doctor", "name");
    res.json(appointments);
  } catch (err) {
    console.error("Appointments fetch error:", err);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
});

// ✅ Get all reminder logs
router.get("/reminders", async (req, res) => {
  try {
    const reminders = await Appointment.find({
      "remindersSent.0": { $exists: true }, // only appointments with at least 1 reminder sent
    })
      .select("date time patient doctor remindersSent")
      .populate("patient", "name email")
      .populate("doctor", "name email");

    res.json(reminders);
  } catch (err) {
    console.error("Reminder logs fetch error:", err);
    res.status(500).json({ message: "Failed to fetch reminder logs" });
  }
});

// Delete a user by ID
router.delete("/user/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ message: "Failed to delete user" });
  }
});

export default router;
