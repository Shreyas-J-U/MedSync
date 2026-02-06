// routes/cleanupRoutes.js
import express from "express";
import { deleteExpiredAvailability } from "../controllers/cleanupController.js";

const router = express.Router();

router.delete("/cleanup/expired-availability", deleteExpiredAvailability);

export default router;
