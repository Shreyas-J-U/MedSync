import express from "express";
import {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  getDoctorAppointmentsById,
  markAppointmentCompleted,
  cancelAppointment, 
} from "../controllers/appointmentController.js";

import { protect, restrictTo } from "../middleware/authMiddleware.js";

const router = express.Router();

// Patient: Book appointment
router.post("/", protect, restrictTo("patient"), bookAppointment);

// Patient: Get own appointments
router.get("/my", protect, restrictTo("patient"), getPatientAppointments);

// Doctor: Get own appointments
router.get("/doctor", protect, restrictTo("doctor"), getDoctorAppointments);

// Get doctor appointments by ID (for admin/patient)
router.get("/doctor/:id", protect, restrictTo("patient"), getDoctorAppointmentsById);

// Doctor: Mark as completed
router.patch("/:id/complete", protect, restrictTo("doctor"), markAppointmentCompleted);

// Cancel appointment 
router.patch("/:id/cancel", protect, cancelAppointment);


export default router;
