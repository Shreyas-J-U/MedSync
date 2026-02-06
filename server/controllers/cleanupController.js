// controllers/cleanupController.js
import DoctorAvailability from "../models/DoctorAvailability.js";

// This will delete expired availability entries for *today* where time is up
export const deleteExpiredAvailability = async (req, res) => {
  try {
    const now = new Date();

    // Get today's day name (e.g., "Monday")
    const todayDayName = now.toLocaleDateString("en-US", { weekday: "long" });

    // Get current time as string (e.g., "07:30")
    const currentTimeStr = now
      .toTimeString()
      .slice(0, 5); // "HH:MM"

    // Find expired records
    const expired = await DoctorAvailability.find({
      day: todayDayName,
      endTime: { $lte: currentTimeStr }, // endTime is earlier than or equal to now
    });

    // Delete all expired
    await DoctorAvailability.deleteMany({
      day: todayDayName,
      endTime: { $lte: currentTimeStr },
    });

    res.json({
      message: "✅ Expired availabilities deleted",
      deletedCount: expired.length,
    });
  } catch (err) {
    console.error("Cleanup error:", err);
    res.status(500).json({ message: "❌ Cleanup failed", error: err.message });
  }
};
