import { useState } from "react";
import AvailabilityForm from "./AvailabilityForm";
import AppointmentsList from "./AppointmentsList";
import UploadPrescription from "./UploadPrescription";
import DoctorHistory from "./DoctorHistory";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const DoctorDashboard = () => {
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
          Welcome Dr. {user?.name} 👨‍⚕️
        </h1>
        <p className="text-gray-600">
          Manage your schedule, view appointments, upload prescriptions, and track patient history.
        </p>
      </div>

      {/* Home Options */}
      {view === "home" && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Set Availability */}
          <div
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition cursor-pointer"
            onClick={() => setView("availability")}
          >
            <div className="text-2xl font-semibold text-blue-600 mb-2">
              ⏰ Set Availability
            </div>
            <p className="text-gray-600">
              Define your weekly availability so patients can book slots.
            </p>
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Set Now
            </button>
          </div>

          {/* View Appointments */}
          <div
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition cursor-pointer"
            onClick={() => setView("appointments")}
          >
            <div className="text-2xl font-semibold text-green-600 mb-2">
              🗓️ View Appointments
            </div>
            <p className="text-gray-600">
              View and manage upcoming appointments with patients.
            </p>
            <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              View
            </button>
          </div>

          {/* Upload Prescription */}
          <div
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition cursor-pointer"
            onClick={() => setView("prescriptions")}
          >
            <div className="text-2xl font-semibold text-purple-600 mb-2">
              📄 Upload Prescription
            </div>
            <p className="text-gray-600">
              Upload prescription documents for your patients.
            </p>
            <button className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
              Upload
            </button>
          </div>

          {/* Patient History */}
          <div
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition cursor-pointer"
            onClick={() => setView("history")}
          >
            <div className="text-2xl font-semibold text-orange-600 mb-2">
              📚 Treatment History
            </div>
            <p className="text-gray-600">
              View history of all patients you've treated and their appointments.
            </p>
            <button className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
              View
            </button>
          </div>
        </div>
      )}

      {/* Dynamic Views */}
      {view === "availability" && (
        <div className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">⏰ Set Availability</h2>
            <button
              onClick={() => setView("home")}
              className="text-blue-600 underline"
            >
              ← Back
            </button>
          </div>
          <AvailabilityForm />
        </div>
      )}

      {view === "appointments" && (
        <div className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">🗓️ My Appointments</h2>
            <button
              onClick={() => setView("home")}
              className="text-blue-600 underline"
            >
              ← Back
            </button>
          </div>
          <AppointmentsList />
        </div>
      )}

      {view === "prescriptions" && (
        <div className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">📄 Upload Prescription</h2>
            <button
              onClick={() => setView("home")}
              className="text-blue-600 underline"
            >
              ← Back
            </button>
          </div>
          <UploadPrescription />
        </div>
      )}

      {view === "history" && (
        <div className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">📚 Treatment History</h2>
            <button
              onClick={() => setView("home")}
              className="text-blue-600 underline"
            >
              ← Back
            </button>
          </div>
          <DoctorHistory />
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
