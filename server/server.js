import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import scheduleReminders from "./utils/scheduler.js";
import "./utils/autoCleanup.js";


// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Routes
import authRoutes from "./routes/authRoutes.js";
import availabilityRoutes from "./routes/availabilityRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import prescriptionRoutes from "./routes/prescriptionRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import cleanupRoutes from "./routes/cleanupRoutes.js";

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get("/", (req, res) => {
  res.send("MedSync API is running...");
});

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/availability", availabilityRoutes); 
app.use("/api/appointments", appointmentRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin-auth", adminAuthRoutes); 
app.use("/api", cleanupRoutes);

// Connect to DB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    scheduleReminders(); // ✅ Start the cron job
  });
}).catch((err) => {
  console.error("❌ Failed to connect to MongoDB:", err.message);
  process.exit(1);
});
