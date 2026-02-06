import express from "express";
import {
  setAvailability,
  getAvailabilityByDoctor,
  getDoctorsByDate,
} from "../controllers/availabilityController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Route test
router.get("/test", (req, res) => {
  res.send("✅ /api/availability/test is working");
});

// ✅ Only doctors can set their availability
router.post("/", protect, restrictTo("doctor"), setAvailability);

// ✅ Anyone (logged in) can view a doctor's availability
router.get("/doctor/:doctorId", protect, getAvailabilityByDoctor);

// ✅ Get all doctors available on a specific day (e.g., Monday)
router.get("/by-day", protect, getDoctorsByDate); // GET /api/availability/by-day?day=Monday

export default router;
