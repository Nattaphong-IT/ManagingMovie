// Backend/controllers/auth.controller.js
// PURPOSE: จัดการ Login และ Me (ดึงข้อมูล user จาก token)

import jwt from "jsonwebtoken";
import User from "../models/user.model.js"; // ตรวจชื่อไฟล์ให้ตรงกับจริง

// Login: ตรวจ credentials แล้วส่ง JWT + user info
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user._id, username: user.username, role: user.role },
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Me: อ่านข้อมูลผู้ใช้จาก req.user (ต้องผ่าน authenticateToken แล้ว)
export const me = async (req, res) => {
  try {
    // req.user ถูกแนบโดย authenticateToken middleware
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};