import { useEffect, useState } from "react";
import API from "../../services/api";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await API.get("/appointments/my");
        setAppointments(res.data);
      } catch (err) {
        console.error("Failed to load appointments");
      }
    };

    fetchAppointments();
  }, []);

  // 🔍 Filter only upcoming appointments (not completed or cancelled)
  const upcomingAppointments = appointments.filter(
    (a) => a.status !== "completed" && a.status !== "cancelled"
  );

  // ❌ Cancel handler
  const cancelAppointment = async (id) => {
    try {
      await API.patch(`/appointments/${id}/cancel`);
      setAppointments((prev) =>
        prev.map((a) =>
          a._id === id ? { ...a, status: "cancelled" } : a
        )
      );
      setMessage("❌ Appointment cancelled.");
    } catch (err) {
      setMessage("⚠️ Failed to cancel appointment.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-gradient-to-br from-teal-50 to-white p-8 rounded-xl shadow-xl mt-10">
      <h2 className="text-2xl font-semibold text-teal-800 mb-6 text-center">
        My Appointments
      </h2>

      {message && (
        <p
          className={`text-center text-sm mb-4 font-medium ${
            message.includes("cancelled") ? "text-red-600" : "text-yellow-600"
          }`}
        >
          {message}
        </p>
      )}

      {upcomingAppointments.length === 0 ? (
        <p className="text-center text-gray-500 text-sm">No upcoming appointments.</p>
      ) : (
        <ul className="space-y-4">
          {upcomingAppointments.map((a) => (
            <li
              key={a._id}
              className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                  <p className="text-gray-800 font-medium">
                    🩺 Doctor: <span className="font-semibold">{a.doctor.name}</span>
                  </p>
                  <p className="text-gray-700 mt-1">
                    📅 Date: <span className="font-semibold">{a.date}</span> at{" "}
                    <span className="font-semibold">{a.time}</span>
                  </p>
                  <p className="text-gray-500 text-sm mt-1">📝 {a.reason}</p>
                </div>

                <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end gap-2">
                  <span className="inline-block bg-teal-100 text-teal-700 text-xs font-medium px-3 py-1 rounded-full">
                    {a.status || "Scheduled"}
                  </span>
                  <button
                    onClick={() => cancelAppointment(a._id)}
                    className="text-red-600 hover:text-red-800 text-sm underline cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyAppointments;
