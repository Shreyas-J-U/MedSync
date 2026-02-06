// src/components/patient/DoctorSlotBrowser.jsx
import { useState } from "react";
import API from "../../services/api";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./calendarStyles.css";

const DoctorSlotBrowser = () => {
  const [selectedDay, setSelectedDay] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [events, setEvents] = useState([]);
  const [msg, setMsg] = useState("");
  const [selectedEventId, setSelectedEventId] = useState(null);

  const [bookingInfo, setBookingInfo] = useState({
    date: "",
    time: "",
    reason: "",
  });

  const handleDayChange = async (e) => {
    const day = e.target.value;
    setSelectedDay(day);
    setSelectedDoctorId("");
    setEvents([]);
    setDoctors([]);
    setSelectedEventId(null);
    setMsg("");

    if (day) {
      try {
        const res = await API.get(`/availability/by-day?day=${day}`);
        const rawDoctors = res.data.map((d) => d.doctor);
        const uniqueDoctors = Array.from(
          new Map(rawDoctors.map((doc) => [doc._id, doc])).values()
        );
        setDoctors(uniqueDoctors);

        if (uniqueDoctors.length === 0) {
          setMsg("⚠️ No doctors available on selected day.");
        }
      } catch (err) {
        console.error("Error fetching doctors by day", err);
        setMsg("⚠️ No availability found for the selected day.");
      }
    }
  };

  const handleDoctorChange = async (e) => {
    const doctorId = e.target.value;
    setSelectedDoctorId(doctorId);
    setEvents([]);
    setSelectedEventId(null);
    setMsg("");

    if (!doctorId) return;

    try {
      const apptRes = await API.get(`/appointments/doctor/${doctorId}`);
      const booked = apptRes.data.map((appt) => ({
        start: new Date(`${appt.date}T${appt.time}`),
      }));

      const availabilityRes = await API.get(`/availability/doctor/${doctorId}`);
      const availability = availabilityRes.data;

      const newEvents = [];
      const today = new Date();
      const next14Days = [...Array(14)].map(
        (_, i) => new Date(today.getTime() + i * 86400000)
      );

      availability.forEach((a) => {
        const dayIndex = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ].indexOf(a.day);

        next14Days.forEach((date) => {
          if (date.getDay() === dayIndex) {
            const [startHour, startMin] = a.startTime.split(":").map(Number);
            const [endHour, endMin] = a.endTime.split(":").map(Number);

            let current = new Date(date);
            current.setHours(startHour, startMin, 0, 0);

            const end = new Date(date);
            end.setHours(endHour, endMin, 0, 0);

            while (current < end) {
              const slotStart = new Date(current);

              // ✅ Skip slot if it is already in the past
              const now = new Date();
              if (slotStart < now) {
                current = new Date(current.getTime() + a.slotDuration * 60000);
                continue;
              }

              const slotEnd = new Date(
                current.getTime() + a.slotDuration * 60000
              );
              const isBooked = booked.some(
                (b) => b.start.getTime() === slotStart.getTime()
              );

              if (slotEnd <= end) {
                newEvents.push({
                  id: slotStart.toISOString(),
                  title: isBooked ? "Booked" : "Available",
                  start: slotStart.toISOString(),
                  end: slotEnd.toISOString(),
                  extendedProps: {
                    isBooked,
                  },
                });
              }

              current = new Date(current.getTime() + a.slotDuration * 60000);
            }
          }
        });
      });

      setEvents(newEvents);
    } catch (err) {
      console.error("Error loading availability or appointments", err);
      setMsg("⚠️ Failed to load slots. Try another doctor.");
    }
  };

  const handleDateClick = (info) => {
    const event = info.event;
    if (event.extendedProps.isBooked) return;

    const dateTime = new Date(event.start);
    if (isNaN(dateTime.getTime())) return;

    setSelectedEventId(event.id);
    setBookingInfo({
      date: dateTime.toISOString().split("T")[0],
      time: dateTime.toTimeString().slice(0, 5),
      reason: "",
    });
  };

  const handleBook = async (e) => {
    e.preventDefault();

    if (
      !selectedDoctorId ||
      !bookingInfo.date ||
      !bookingInfo.time ||
      !bookingInfo.reason
    ) {
      setMsg("❌ Please fill all booking details.");
      return;
    }

    try {
      await API.post("/appointments", {
        doctorId: selectedDoctorId,
        date: bookingInfo.date,
        time: bookingInfo.time,
        reason: bookingInfo.reason,
      });

      setMsg("✅ Appointment booked!");
      setSelectedEventId(null);
      setBookingInfo({ date: "", time: "", reason: "" });

      // Refresh the calendar
      await handleDoctorChange({ target: { value: selectedDoctorId } });
    } catch (err) {
      console.error("Booking failed:", err);
      setMsg(
        err.response?.data?.message ||
          "❌ Failed to book appointment. Try another slot."
      );
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-gradient-to-br from-blue-50 to-white p-8 rounded-xl shadow-xl">
      <h2 className="text-2xl font-semibold text-blue-800 mb-6 text-center">
        📅 Book an Appointment
      </h2>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Day
          </label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            value={selectedDay}
            onChange={handleDayChange}
          >
            <option value="">-- Select --</option>
            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Doctor
          </label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            value={selectedDoctorId}
            onChange={handleDoctorChange}
            disabled={!doctors.length}
          >
            <option value="">-- Select --</option>
            {doctors.map((doc) => (
              <option key={doc._id} value={doc._id}>
                {doc.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {msg && (
        <p
          className={`text-sm text-center mb-4 font-medium ${
            msg.startsWith("✅")
              ? "text-green-600"
              : msg.startsWith("❌")
              ? "text-red-600"
              : "text-yellow-600"
          }`}
        >
          {msg}
        </p>
      )}

      {selectedDoctorId && (
        <>
          {/* Legend */}
          <div className="flex gap-6 mb-4 text-sm justify-center">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-gray-400 inline-block rounded-sm"></span>
              <span>Booked</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-blue-500 inline-block rounded-sm"></span>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-green-500 inline-block rounded-sm"></span>
              <span>Selected</span>
            </div>
          </div>

          <div className="mb-6">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridDay"
              events={events}
              height="auto"
              selectable={true}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "timeGridWeek,timeGridDay",
              }}
              eventClick={handleDateClick}
              eventClassNames={(arg) => {
                const { isBooked } = arg.event.extendedProps;
                const isSelected = arg.event.id === selectedEventId;

                if (isBooked)
                  return ["bg-gray-400", "text-white", "cursor-not-allowed"];
                if (isSelected)
                  return ["bg-green-500", "text-white", "cursor-pointer"];
                return ["bg-blue-500", "text-white", "cursor-pointer"];
              }}
            />
          </div>

          <form onSubmit={handleBook} className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Reason for Appointment
            </label>
            <input
              type="text"
              placeholder="e.g., Regular check-up"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              value={bookingInfo.reason}
              onChange={(e) =>
                setBookingInfo({ ...bookingInfo, reason: e.target.value })
              }
              required
            />
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-medium transition"
            >
              ✅ Confirm Booking
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default DoctorSlotBrowser;
