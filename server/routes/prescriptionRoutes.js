// server/routes/prescriptionRoutes.js
import express from "express";
import { uploadPrescription, getPatientPrescriptions } from "../controllers/prescriptionController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Doctor uploads prescription
router.post("/", protect, restrictTo("doctor"), upload.single("file"), uploadPrescription);

// Patient gets prescription history
router.get("/my", protect, restrictTo("patient"), getPatientPrescriptions);

export default router;
