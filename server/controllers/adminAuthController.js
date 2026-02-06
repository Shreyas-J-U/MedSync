// server/controllers/adminAuthController.js
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const registerAdmin = async (req, res) => {
  const { name, email, password, secretKey } = req.body;

  if (secretKey !== process.env.ADMIN_SECRET_KEY) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      return res.status(403).json({ message: "Admin already exists" });
    }

    const admin = await User.create({ name, email, password, role: "admin" });

    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin),
    });
  } catch (err) {
    res.status(500).json({ message: "Admin registration failed", error: err.message });
  }
};

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await User.findOne({ email });

    if (!admin || admin.role !== "admin" || !(await admin.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin),
    });
  } catch (err) {
    res.status(500).json({ message: "Admin login failed", error: err.message });
  }
};
