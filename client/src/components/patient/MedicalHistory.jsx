// src/components/patient/MedicalHistory.jsx
import { useEffect, useState } from "react";
import API from "../../services/api";

const MedicalHistory = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await API.get("/appointments/my");
        setAppointments(res.data);
      } catch (err) {
        console.error("Failed to load medical history", err);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <div className="bg-white shadow rounded p-6">
      <h2 className="text-2xl font-bold mb-4">📚 My Medical History</h2>
      {appointments.length === 0 ? (
        <p className="text-gray-500">No history yet.</p>
      ) : (
        <ul className="divide-y">
          {appointments.map((a) => (
            <li key={a._id} className="py-4">
              <p><strong>Doctor:</strong> {a.doctor?.name || "Unknown"}</p>
              <p><strong>Date:</strong> {a.date} at {a.time}</p>
              <p><strong>Status:</strong> 
                <span className={`ml-1 text-sm font-semibold ${
                  a.status === "completed" ? "text-green-600" :
                  a.status === "cancelled" ? "text-red-500" : "text-yellow-600"
                }`}>
                  {a.status}
                </span>
              </p>
              {a.prescription ? (
                <a
                  href={a.prescription}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline mt-1 inline-block"
                >
                  📄 View Prescription
                </a>
              ) : (
                <p className="text-sm italic text-gray-400">No prescription uploaded</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MedicalHistory;
