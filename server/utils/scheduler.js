// server/utils/scheduler.js
import cron from "node-cron";
import Appointment from "../models/Appointment.js";
import sendEmail from "./sendEmail.js";
import dayjs from "dayjs";

const scheduleReminders = () => {
  // Runs every 15 mins
  cron.schedule("*/15 * * * *", async () => {
    const now = dayjs();

    const dateToday = now.format("YYYY-MM-DD");
    const timeNow = now.format("HH:mm");

    const oneHourLater = now.add(1, "hour");
    const oneDayLater = now.add(1, "day");

    const checkWindows = [
      {
        label: "1h",
        targetDate: oneHourLater.format("YYYY-MM-DD"),
        targetTime: oneHourLater.format("HH:mm"),
      },
      {
        label: "24h",
        targetDate: oneDayLater.format("YYYY-MM-DD"),
        targetTime: null, // We’ll match only on date
      },
    ];

    for (const window of checkWindows) {
      const filter = {
        status: "booked",
        date: window.targetDate,
        remindersSent: { $ne: window.label },
      };

      if (window.targetTime) {
        filter.time = window.targetTime;
      }

      try {
        const appointments = await Appointment.find(filter).populate("patient doctor");

        for (const appt of appointments) {
          const { patient, doctor, date, time } = appt;

          if (!patient.email) continue;

          const message = `Hi ${patient.name}, this is a ${
            window.label === "1h" ? "1 hour" : "24 hour"
          } reminder for your appointment with Dr. ${doctor.name} on ${date} at ${time}.\n\n– MedSync`;

          await sendEmail(patient.email, "Appointment Reminder", message);

          appt.remindersSent.push(window.label);
          await appt.save();

          console.log(`📧 ${window.label} reminder sent to ${patient.email}`);
        }
      } catch (err) {
        console.error(`❌ Failed to send ${window.label} reminders:`, err.message);
      }
    }
  });
};

export default scheduleReminders;
