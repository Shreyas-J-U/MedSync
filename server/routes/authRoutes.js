// server/routes/authRoutes.js
import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/test", (req, res) => {
  res.send("✅ /api/auth is reachable");
});


export default router;
