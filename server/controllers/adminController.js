import User from "../models/User.js";
import Appointment from "../models/Appointment.js";

// @desc Get all patients
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "patient" });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// @desc Get all doctors
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch doctors" });
  }
};

// @desc Get all appointments (with reminder info)
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("doctor", "name email")
      .populate("patient", "name email");

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

// @desc Get dashboard stats
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "patient" });
    const totalDoctors = await User.countDocuments({ role: "doctor" });
    const totalAppointments = await Appointment.countDocuments();

    res.json({
      totalUsers,
      totalDoctors,
      totalAppointments,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};

// OPTIONAL: Delete user (can be used in admin dashboard)
export const deleteUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    await User.findByIdAndDelete(userId);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};
