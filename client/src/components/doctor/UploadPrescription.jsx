// src/components/doctor/UploadPrescription.jsx
import { useEffect, useState } from "react";
import API from "../../services/api";

const UploadPrescription = () => {
  const [appointments, setAppointments] = useState([]);
  const [selected, setSelected] = useState({
    appointmentId: "",
    patientId: "",
  });
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await API.get("/appointments/doctor");
        const filtered = res.data.filter((a) => a.status !== "completed");
        setAppointments(filtered);
      } catch (err) {
        console.error("Failed to load appointments");
      }
    };
    fetchAppointments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selected.appointmentId || !selected.patientId || !file) {
      setMsg("❌ All fields required.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("appointmentId", selected.appointmentId);
    formData.append("patientId", selected.patientId);

    try {
      await API.post("/prescriptions", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMsg("✅ Prescription uploaded successfully!");
      setFile(null);
      setSelected({ appointmentId: "", patientId: "" });
    } catch (err) {
      setMsg("❌ Upload failed. Try again.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-gradient-to-br from-purple-50 to-white p-8 rounded-xl shadow-xl">
      <h2 className="text-2xl font-semibold text-indigo-800 mb-6 text-center">Upload Prescription</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Appointment</label>
          <select
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
            value={selected.appointmentId}
            onChange={(e) => {
              const appt = appointments.find((a) => a._id === e.target.value);
              setSelected({
                appointmentId: appt._id,
                patientId: appt.patient._id,
              });
            }}
          >
            <option value="">-- Select --</option>
            {appointments.map((a) => (
              <option key={a._id} value={a._id}>
                {a.patient.name} – {a.date} at {a.time}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload File (PDF or Image)</label>
          <input
            type="file"
            accept=".pdf,image/*"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-medium shadow-md transition"
        >
          📤 Upload Prescription
        </button>

        {msg && (
          <p
            className={`text-sm text-center mt-3 font-medium ${
              msg.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {msg}
          </p>
        )}
      </form>
    </div>
  );
};

export default UploadPrescription;
