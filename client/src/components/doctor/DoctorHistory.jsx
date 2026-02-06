import { useEffect, useState } from "react";
import API from "../../services/api";

const DoctorHistory = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/appointments/doctor");
        setAppointments(res.data);
      } catch (err) {
        console.error("Failed to fetch appointment history");
      }
    };

    fetchData();
  }, []);

  const groupedByPatient = appointments.reduce((acc, appt) => {
    const patientId = appt.patient?._id;
    if (!acc[patientId]) acc[patientId] = { patient: appt.patient, appointments: [] };
    acc[patientId].appointments.push(appt);
    return acc;
  }, {});

  return (
    <div className="bg-white shadow p-6 rounded">
      <h2 className="text-xl font-bold mb-4">📋 My Patients</h2>
      {Object.values(groupedByPatient).length === 0 ? (
        <p className="text-gray-500">No history yet.</p>
      ) : (
        <div className="space-y-6">
          {Object.values(groupedByPatient).map(({ patient, appointments }) => (
            <div key={patient._id} className="border-b pb-4">
              <h3 className="text-lg font-semibold text-blue-600">{patient.name} ({patient.email})</h3>
              <ul className="mt-2 text-sm text-gray-700">
                {appointments.map((a) => (
                  <li key={a._id} className="mb-1">
                    {a.date} @ {a.time} — {a.reason || "No reason"} —{" "}
                    <span
                      className={
                        a.status === "completed"
                          ? "text-green-600"
                          : a.status === "cancelled"
                          ? "text-red-500"
                          : "text-yellow-600"
                      }
                    >
                      {a.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorHistory;
