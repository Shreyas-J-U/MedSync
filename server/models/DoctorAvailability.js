import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Make sure doctors are stored in the User model
    required: true,
  },
  day: {
    type: String,
    required: true, // e.g. "Monday", "Tuesday"
  },
  startTime: {
    type: String, // Format: "09:00"
    required: true,
  },
  endTime: {
    type: String, // Format: "13:00"
    required: true,
  },
  slotDuration: {
    type: Number, // in minutes (e.g. 30)
    required: true,
  },
  slotAvailable:{type:Boolean,
    default:true
  }
});

const DoctorAvailability = mongoose.model("DoctorAvailability", availabilitySchema);
export default DoctorAvailability;
