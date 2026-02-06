import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: String, required: true }, // "YYYY-MM-DD"
    time: { type: String, required: true }, // "HH:mm"
    reason: { type: String },
    status: {
      type: String,
      enum: ["booked", "completed", "cancelled"],
      default: "booked",
    },
    remindersSent: {
      type: [String], // ["24h", "1h"]
      default: [],
    },
    prescription: {
      type: String, // cloudinary file URL
    },
  },
  { timestamps: true }
);

// Prevent duplicate bookings for same doctor/date/time
appointmentSchema.index({ doctor: 1, date: 1, time: 1 }, { unique: true });

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
