import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import DoctorSlotBrowser from "./DoctorSlotBrowser";
import MyAppointments from "./MyAppointments";
import PrescriptionViewer from "./PrescriptionViewer";
import MedicalHistory from "./MedicalHistory";

const PatientDashboard = () => {
  const { user, logout } = useAuth();
  const [view, setView] = useState("home");
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="pt-24 px-6 min-h-screen bg-gray-50 relative">
      {/* 🔓 Logout button */}
      <div className="absolute top-6 right-6">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 shadow"
        >
          Logout
        </button>
      </div>

      {/* Hero Section */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-blue-700 mb-2">
          Welcome, {user?.name} 👋
        </h1>
        <p className="text-gray-600">
          Manage your health with MedSync. Book appointments, track prescriptions, and stay organized.
        </p>
      </div>

      {/* Grid with options */}
      {view === "home" && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Appointments */}
          <div
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition cursor-pointer"
            onClick={() => setView("appointments")}
          >
            <div className="text-2xl font-semibold text-blue-600 mb-2">
              🗓️ My Appointments
            </div>
            <p className="text-gray-600">
              View your upcoming and past appointments with doctors.
            </p>
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              View
            </button>
          </div>

          {/* Search Doctors */}
          <div
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition cursor-pointer"
            onClick={() => setView("slots")}
          >
            <div className="text-2xl font-semibold text-green-600 mb-2">
              🔍 Search Doctors
            </div>
            <p className="text-gray-600">
              Find available doctors by date and book instantly.
            </p>
            <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              Search
            </button>
          </div>

          {/* Prescription Viewer */}
          <div
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition cursor-pointer"
            onClick={() => setView("prescriptions")}
          >
            <div className="text-2xl font-semibold text-purple-600 mb-2">
              📄 Prescriptions
            </div>
            <p className="text-gray-600">
              Access your uploaded prescriptions and download them anytime.
            </p>
            <button className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
              View
            </button>
          </div>

          {/* Medical History */}
          <div
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition cursor-pointer"
            onClick={() => setView("history")}
          >
            <div className="text-2xl font-semibold text-orange-600 mb-2">
              📚 Medical History
            </div>
            <p className="text-gray-600">
              See your past doctors, appointment history, and prescriptions.
            </p>
            <button className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
              View
            </button>
          </div>
        </div>
      )}

      {/* Dynamic Panels */}
      {view === "appointments" && (
        <div className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">🗓️ My Appointments</h2>
            <button onClick={() => setView("home")} className="text-blue-600 underline">
              ← Back
            </button>
          </div>
          <MyAppointments />
        </div>
      )}

      {view === "slots" && (
        <div className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">🔍 Search Available Doctors</h2>
            <button onClick={() => setView("home")} className="text-blue-600 underline">
              ← Back
            </button>
          </div>
          <DoctorSlotBrowser />
        </div>
      )}

      {view === "prescriptions" && (
        <div className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">📄 Prescription History</h2>
            <button onClick={() => setView("home")} className="text-blue-600 underline">
              ← Back
            </button>
          </div>
          <PrescriptionViewer />
        </div>
      )}

      {view === "history" && (
        <div className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">📚 Medical History</h2>
            <button onClick={() => setView("home")} className="text-blue-600 underline">
              ← Back
            </button>
          </div>
          <MedicalHistory />
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
