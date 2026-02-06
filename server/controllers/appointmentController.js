// server/controllers/appointmentController.js
import Appointment from "../models/Appointment.js";
import DoctorAvailability from "../models/DoctorAvailability.js";

// 🧾 Book an appointment (Patient only)
export const bookAppointment = async (req, res) => {
  const { doctorId, date, time, reason } = req.body;
  const patientId = req.user._id;

  if (!doctorId || !date || !time || !reason) {
    return res.status(400).json({
      message: "Missing required fields",
      details: { doctorId, date, time, reason },
    });
  }

  try {
    // Check for double booking
    const existing = await Appointment.findOne({
      doctor: doctorId,
      date,
      time,
    });

    if (existing) {
      return res.status(400).json({ message: "Slot already booked" });
    }

    // ✅ Create appointment
    const appointment = await Appointment.create({
      doctor: doctorId,
      patient: patientId,
      date,
      time,
      reason,
    });

    // ✅ Mark availability for that day as unavailable
    const day = new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
    });

    await DoctorAvailability.updateOne(
      { doctor: doctorId, day },
      { $set: { slotAvailable: false } }
    );

    res.status(201).json(appointment);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Slot already booked" });
    }
    console.error(error);
    res.status(500).json({ message: "Booking failed", error: error.message });
  }
};


// 📅 Get patient’s own appointments
export const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patient: req.user._id,
    }).populate("doctor", "name email");
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

// 📋 Get doctor’s appointments
export const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctor: req.user._id,
    }).populate("patient", "name email phone");
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

export const getDoctorAppointmentsById = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const appointments = await Appointment.find({ doctor: doctorId });
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch doctor appointments" });
  }
};

// ✅ Doctor: Mark appointment as completed
export const markAppointmentCompleted = async (req, res) => {
  const { id } = req.params;
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: id, doctor: req.user._id },
      { status: "completed" },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found or unauthorized" });
    }

    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Failed to update appointment status" });
  }
};


export const cancelAppointment = async (req, res) => {
  const userId = req.user._id;
  const userRole = req.user.role;
  const appointmentId = req.params.id;

  try {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const isAuthorized =
      (userRole === "patient" && appointment.patient.equals(userId)) ||
      (userRole === "doctor" && appointment.doctor.equals(userId));

    if (!isAuthorized) {
      return res
        .status(403)
        .json({ message: "Unauthorized to cancel this appointment" });
    }

    // ✅ 1. Get day string from date
    const day = new Date(appointment.date).toLocaleDateString("en-US", {
      weekday: "long",
    });

    // ✅ 2. Set slotAvailable to true for that day (optional – only if availability is disabled per day)
    await DoctorAvailability.updateOne(
      {
        doctor: appointment.doctor,
        day: day,
      },
      { $set: { slotAvailable: true } }
    );

    // ✅ 3. Delete the appointment
    await Appointment.findByIdAndDelete(appointmentId);

    res.json({ message: "Appointment cancelled and removed from system." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to cancel appointment" });
  }
};
