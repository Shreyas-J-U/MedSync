import { useEffect, useState } from "react";
import API from "../../services/api";

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/appointments/doctor");
        setAppointments(res.data);
      } catch (err) {
        console.error("Failed to load appointments");
      }
    };
    fetchData();
  }, []);

  const markAsCompleted = async (id) => {
    try {
      await API.patch(`/appointments/${id}/complete`);
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: "completed" } : a))
      );
      setMessage("✅ Appointment marked as completed.");
    } catch (err) {
      setMessage("❌ Failed to update appointment.");
    }
  };

  const openPatientModal = (patient, reason, date, time) => {
    setSelectedPatient({ ...patient, reason, date, time });
  };

  const closeModal = () => setSelectedPatient(null);

  // 🧠 Filter only upcoming appointments (exclude completed or cancelled)
  const upcomingAppointments = appointments.filter(
    (a) => a.status !== "completed" && a.status !== "cancelled"
  );

  return (
    <>
      <div
        className={`max-w-3xl mx-auto p-8 rounded-xl shadow-xl relative transition-all duration-300 bg-gradient-to-br from-blue-50 to-white ${
          selectedPatient ? "filter blur-sm pointer-events-none select-none" : ""
        }`}
      >
        <h2 className="text-2xl font-semibold text-blue-800 mb-6 text-center">
          Upcoming Appointments
        </h2>

        {message && (
          <p
            className={`text-sm text-center mb-4 font-medium ${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        {upcomingAppointments.length === 0 ? (
          <p className="text-gray-500 text-center">No upcoming appointments.</p>
        ) : (
          <ul className="space-y-4">
            {upcomingAppointments.map((a) => (
              <li
                key={a._id}
                className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col md:flex-row md:justify-between md:items-center transition hover:shadow-md"
              >
                <div>
                  <p className="text-gray-800 font-medium">
                    👤 Patient: <span className="font-semibold">{a.patient.name}</span>
                  </p>
                  <p className="text-gray-700 mt-1">
                    📅 {a.date} at {a.time}
                  </p>
                  <p className="text-sm mt-2">
                    <strong>Status:</strong>{" "}
                    <span className="font-semibold text-yellow-600">{a.status}</span>
                  </p>
                </div>

                <div className="flex gap-3 mt-4 md:mt-0 items-center">
                  <button
                    onClick={() => markAsCompleted(a._id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition text-sm"
                  >
                    ✅ Done
                  </button>
                  <button
                    onClick={() =>
                      openPatientModal(a.patient, a.reason, a.date, a.time)
                    }
                    className="text-blue-600 text-xl hover:text-blue-800 transition"
                    title="View Patient Details"
                  >
                    👁️
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg border border-gray-200 relative animate-fadeIn">
            <button
              onClick={closeModal}
              className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-xl"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold text-blue-800 mb-4">
              Patient Details
            </h3>
            <div className="space-y-2 text-gray-700 text-sm">
              <p>
                <strong>Name:</strong> {selectedPatient.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedPatient.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedPatient.phone || "N/A"}
              </p>
              <p>
                <strong>Reason:</strong> {selectedPatient.reason}
              </p>
              <p>
                <strong>Date:</strong> {selectedPatient.date}
              </p>
              <p>
                <strong>Time:</strong> {selectedPatient.time}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppointmentsList;
