import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/common/Navbar";

const testimonials = [
  {
    name: "Priya S.",
    message: "MedSync made booking appointments so simple and quick!",
  },
  {
    name: "Dr. Arjun Mehta",
    message: "I can manage my schedule and patients far more efficiently.",
  },
  {
    name: "Rahul D.",
    message: "No more missed appointments thanks to the smart reminders!",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const Home = () => {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 text-gray-800 font-sans">
      {/* Hero Section */}
      <div
        className="min-h-screen bg-cover bg-center relative rounded-2xl mx-auto"
        style={{ backgroundImage: `url("/bg.jpg")` }}
      >
        <Navbar />
        <motion.div
          initial="hidden"
          animate={fadeIn ? "visible" : "hidden"}
          variants={fadeUp}
          className="absolute top-[30%] left-[5%] bg-white/40 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-md max-w-[90%] sm:max-w-[75%] md:max-w-[50%] flex flex-col items-start gap-4 sm:gap-5"
        >
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-blue-900 leading-tight">
            Welcome to MedSync
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-blue-800 leading-relaxed">
            Smart Medical Appointment & Reminder System to keep patients on track and doctors in sync.
          </p>
          <a
            href="/register"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-md transition"
          >
            Get Started
          </a>
        </motion.div>
      </div>

      {/* Why It Matters */}
      <section className="py-20 px-6 md:px-16 bg-blue-50">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-6xl mx-auto flex flex-col gap-10"
        >
          <h2 className="text-3xl font-bold text-blue-900 text-center md:text-left">
            Why It Matters
          </h2>
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="w-full md:w-1/2">
              <img
                src="/src/assets/patient.jpg"
                alt="Patient using MedSync on a tablet"
                loading="lazy"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
            <div className="w-full md:w-1/2">
              <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
                MedSync empowers patients to take control of their health by addressing common
                challenges like missed appointments, forgotten medications, and scattered medical
                records—offering intelligent reminders, seamless prescription tracking, and
                centralized access to medical history in one intuitive platform.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <motion.section
        className="py-20 px-6 md:px-16 bg-blue-50 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <h2 className="text-3xl font-bold text-blue-900 mb-4">About MedSync</h2>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-center mt-8 text-left">
          <img
            src="src/assets/about.jpg"
            alt="Doctors and patients collaborating"
            loading="lazy"
            className="w-full md:w-1/2 rounded-lg shadow-md"
          />
          <p className="text-gray-700 text-lg md:w-1/2">
            MedSync is a smart healthcare platform designed to simplify appointment bookings,
            enhance patient-doctor communication, and ensure no one misses a visit.
          </p>
        </div>
      </motion.section>

      {/* Mission Section */}
      <motion.section
        className="py-20 px-6 md:px-16 bg-blue-50 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <h2 className="text-3xl font-bold text-blue-900 mb-4">Our Mission</h2>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row-reverse gap-8 items-center mt-8 text-left">
          <img
            src="src/assets/mission2.jpg"
            alt="Healthcare mission illustration"
            loading="lazy"
            className="w-full md:w-1/2 rounded-lg shadow-md"
          />
          <p className="text-gray-700 text-lg md:w-1/2">
            Our mission is to revolutionize digital healthcare by making medical scheduling seamless
            and personalized. We empower patients with control and equip doctors with intelligent tools.
          </p>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.div
        className="bg-blue-50 py-20 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ staggerChildren: 0.2 }}
      >
        <h2 className="text-3xl font-bold text-blue-900 text-center mb-16">
          What We Provide
        </h2>

        <div className="max-w-6xl mx-auto flex flex-col gap-16">

          {/* Alternating Feature Blocks */}
          {[
            {
              title: "Easy Appointment Scheduling",
              text: "Patients can easily book and manage appointments with a user-friendly interface designed to reduce wait times and confusion.",
              image: "src/assets/appointment.avif",
              direction: "left",
            },
            {
              title: "Automated Reminders",
              text: "Get 2-step smart reminders via email before the appointment to avoid missing the appointments and stay on track with your care.",
              image: "src/assets/reminder.jpg",
              direction: "right",
            },
            {
              title: "Secure Messaging",
              text: "Communicate privately with your healthcare provider to ask questions, follow up, or share updates — all within a safe and encrypted channel.",
              image: "src/assets/message.jpg",
              direction: "left",
            },
            {
              title: "Prescription Uploading",
              text: "Patients can upload prescriptions directly, allowing doctors to access them instantly — making consultations faster and more informed.",
              image: "src/assets/prescription.webp",
              direction: "right",
            },
            {
              title: "Doctor Dashboard",
              text: "Doctors can manage schedules, upload prescriptions directly to patients, and track their medication history — all in one place.",
              image: "src/assets/5.webp",
              direction: "left",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl shadow-lg p-6 md:max-w-[70%] hover:scale-[1.02] transition duration-300 ${
                feature.direction === "right" ? "md:self-end" : "md:self-start"
              }`}
            >
              <div
                className={`flex flex-col items-center gap-6 ${
                  feature.direction === "right" ? "md:flex-row-reverse" : "md:flex-row"
                }`}
              >
                <motion.img
                  src={feature.image}
                  alt={feature.title}
                  loading="lazy"
                  className="w-full md:w-[60%] rounded-md"
                  initial={{ opacity: 0, x: feature.direction === "right" ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  viewport={{ once: true }}
                />
                <p className="text-gray-700 text-lg md:w-[40%]">
                  <strong>{feature.title}:</strong> {feature.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Testimonials */}
      <motion.section
        className="py-20 px-6 md:px-16 bg-blue-50 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <h2 className="text-3xl font-bold text-blue-900 mb-10">What Our Customers Say</h2>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-10"
        >
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              variants={fadeUp}
              className="bg-white/60 backdrop-blur-md p-6 rounded-xl shadow-md hover:shadow-lg transition flex flex-col items-center"
            >
              <img
                src={`src/assets/testimonial-${index + 1}.webp`}
                alt={`Testimonial from ${t.name}`}
                loading="lazy"
                className="w-16 h-16 rounded-full object-cover mb-4"
              />
              <p className="text-gray-600 italic text-sm">"{t.message}"</p>
              <h4 className="mt-4 text-blue-800 font-semibold">{t.name}</h4>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-blue-800 text-white py-10 px-6 md:px-16 shadow-inner rounded-t-2xl">
        <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
          <div>
            <h3 className="text-xl font-bold mb-2">MedSync</h3>
            <p className="text-sm">Empowering care, enhancing lives.</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} MedSync. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
