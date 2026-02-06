import DoctorAvailability from "../models/DoctorAvailability.js";

// ✅ Set availability (doctor only)
export const setAvailability = async (req, res) => {
  const { day, startTime, endTime, slotDuration } = req.body;
  const doctorId = req.user._id;

  try {
    const availability = await DoctorAvailability.create({
      doctor: doctorId,
      day,
      startTime,
      endTime,
      slotDuration,
    });

    res.status(201).json(availability);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to set availability", error: error.message });
  }
};

// ✅ Get availability by doctor ID
export const getAvailabilityByDoctor = async (req, res) => {
  const doctorId = req.params.doctorId;

  try {
    const availability = await DoctorAvailability.find({ doctor: doctorId });
    res.status(200).json(availability);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching availability", error: error.message });
  }
};

// ✅ Get all doctors available on a specific day (e.g., "Monday")
export const getDoctorsByDate = async (req, res) => {
  const { day } = req.query;

  try {
    if (!day) {
      return res
        .status(400)
        .json({ message: "Query parameter 'day' is required" });
    }

    const availabilities = await DoctorAvailability.find({ day }).populate(
      "doctor",
      "-password"
    );

    // ✅ Even if no doctors found, return 200 with an empty array
    if (availabilities.length === 0) {
      return res.status(200).json([]);
    }

    const doctors = availabilities.map((entry) => ({
      doctor: entry.doctor,
      startTime: entry.startTime,
      endTime: entry.endTime,
      slotDuration: entry.slotDuration,
      slotAvailable: entry.slotAvailable,
    }));

    res.status(200).json(doctors);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching doctors by day", error: error.message });
  }
};

