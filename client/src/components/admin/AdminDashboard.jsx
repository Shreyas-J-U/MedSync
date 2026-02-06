import { useEffect, useState } from "react";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes, docsRes, apptRes] = await Promise.all([
          API.get("/admin/stats"),
          API.get("/admin/users"),
          API.get("/admin/doctors"),
          API.get("/admin/appointments"),
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data);
        setDoctors(docsRes.data);
        setAppointments(apptRes.data);
      } catch (err) {
        console.error("Admin data fetch failed", err);
      }
    };
    fetchData();
  }, []);

  const deleteUser = async (id) => {
    try {
      await API.delete(`/admin/user/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      setDoctors((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="fixed top-0 w-full bg-white shadow z-50 flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold text-blue-700">MedSync Admin Panel</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
        >
          Logout
        </button>
      </nav>

      <main className="pt-24 px-6 pb-10">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white shadow-lg p-6 rounded-lg text-center">
            <h2 className="text-lg font-medium text-gray-600">Total Patients</h2>
            <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalUsers || 0}</p>
          </div>
          <div className="bg-white shadow-lg p-6 rounded-lg text-center">
            <h2 className="text-lg font-medium text-gray-600">Total Doctors</h2>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats.totalDoctors || 0}</p>
          </div>
          <div className="bg-white shadow-lg p-6 rounded-lg text-center">
            <h2 className="text-lg font-medium text-gray-600">Appointments</h2>
            <p className="text-3xl font-bold text-purple-600 mt-2">{stats.totalAppointments || 0}</p>
          </div>
        </div>

        {/* Doctors List */}
        <div className="bg-white shadow-md rounded-lg mb-10 overflow-x-auto">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-700">All Doctors</h2>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {doctors.map((doc) => (
                <tr key={doc._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">{doc.name}</td>
                  <td className="px-6 py-4">{doc.email}</td>
                  <td className="px-6 py-4">{doc.phone || "N/A"}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => deleteUser(doc._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Patients List */}
        <div className="bg-white shadow-md rounded-lg mb-10 overflow-x-auto">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-700">All Patients</h2>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">{u.name}</td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4">{u.phone}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => deleteUser(u._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Appointments List */}
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-700">All Appointments</h2>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase">
              <tr>
                <th className="p-4">Date</th>
                <th>Time</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Status</th>
                <th>Reminders Sent</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {appointments.map((appt) => (
                <tr key={appt._id} className="hover:bg-gray-50 transition">
                  <td className="p-4">{appt.date}</td>
                  <td>{appt.time}</td>
                  <td>{appt.patient?.name || "N/A"}</td>
                  <td>{appt.doctor?.name || "N/A"}</td>
                  <td>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded text-white ${
                        appt.status === "completed"
                          ? "bg-green-600"
                          : appt.status === "cancelled"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {appt.status}
                    </span>
                  </td>
                  <td>
                    {appt.remindersSent?.length > 0 ? (
                      <span className="text-green-700 text-xs font-medium">
                        {appt.remindersSent.join(", ")}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic text-xs">None</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
