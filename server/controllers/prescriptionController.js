// server/controllers/prescriptionController.js
import Prescription from "../models/Prescription.js";

export const uploadPrescription = async (req, res) => {
  const { appointmentId, patientId } = req.body;

  try {
    const fileUrl = req.file.path;

    const prescription = await Prescription.create({
      appointment: appointmentId,
      patient: patientId,
      doctor: req.user._id,
      fileUrl,
    });

    res.status(201).json(prescription);
  } catch (error) {
    res.status(500).json({ message: "Failed to upload prescription", error });
  }
};

export const getPatientPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.user._id })
      .populate("doctor", "name email")
      .populate("appointment", "date time");

    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching prescriptions", error });
  }
};
