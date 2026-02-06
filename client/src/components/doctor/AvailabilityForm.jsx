// src/components/doctor/AvailabilityForm.jsx
import { useState } from "react";
import API from "../../services/api";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const AvailabilityForm = () => {
  const [form, setForm] = useState({
    day: "Monday",
    startTime: "",
    endTime: "",
    slotDuration: 30,
  });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/availability", form);
      setMessage("✅ Availability saved!");
    } catch {
      setMessage("❌ Failed to save availability");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gradient-to-br from-blue-50 to-white p-8 rounded-xl shadow-xl">
      <h2 className="text-2xl font-semibold text-blue-800 mb-6 text-center">Set Your Availability</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Day</label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            value={form.day}
            onChange={(e) => setForm({ ...form, day: e.target.value })}
          >
            {days.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
          <div className="flex gap-3">
            <input
              type="time"
              className="w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
            />
            <input
              type="time"
              className="w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              value={form.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slot Duration (minutes)</label>
          <input
            type="number"
            min="5"
            step="5"
            placeholder="e.g. 30"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            value={form.slotDuration}
            onChange={(e) => setForm({ ...form, slotDuration: e.target.value })}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition font-medium shadow-md"
        >
          Save Availability
        </button>

        {message && (
          <p
            className={`text-sm text-center mt-3 font-medium ${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default AvailabilityForm;
