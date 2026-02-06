// src/components/patient/PrescriptionViewer.jsx
import { useEffect, useState } from "react";
import API from "../../services/api";

const PrescriptionViewer = () => {
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await API.get("/prescriptions/my");
        setPrescriptions(res.data);
      } catch (err) {
        console.error("Failed to fetch prescriptions", err);
      }
    };
    fetchPrescriptions();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-gradient-to-br from-violet-50 to-white p-8 rounded-xl shadow-xl">
      <h2 className="text-2xl font-semibold text-violet-800 mb-6 text-center">🧾 My Prescriptions</h2>

      {prescriptions.length === 0 ? (
        <p className="text-center text-gray-500 text-sm">No prescriptions available.</p>
      ) : (
        <ul className="space-y-5">
          {prescriptions.map((p) => (
            <li
              key={p._id}
              className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div className="mb-3 md:mb-0">
                  <p className="text-gray-700 font-medium">
                    👨‍⚕️ Doctor: <span className="font-semibold">{p.doctor.name}</span>
                  </p>
                  <p className="text-gray-600 mt-1">
                    📅 Date:{" "}
                    <span className="font-semibold">
                      {new Date(p.appointment.date).toLocaleDateString()} at {p.appointment.time}
                    </span>
                  </p>
                </div>
                <a
                  href={p.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-2 md:mt-0 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded transition"
                >
                  🔽 View / Download
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PrescriptionViewer;
