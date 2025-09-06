// Backend/middleware/auth.middleware.js
// PURPOSE: Middleware ศูนย์กลางสำหรับตรวจ JWT และบังคับสิทธิ์ตามบทบาท (Role)
// ใช้ร่วมกับทุก route ที่ต้องการการยืนยันตัวตนหรือจำกัดสิทธิ์
// HOW TO USE:
//   import { authenticateToken, authorize } from '../middleware/auth.middleware.js';
//   router.get('/secure', authenticateToken, handler);
//   router.delete('/:id', authenticateToken, authorize('MANAGER'), deleteHandler);

import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // รูปแบบ: Bearer <token>
  if (!token) {
    return res.status(401).json({ success: false, message: "Access token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET || "secret", (err, payload) => {
    if (err) {
      return res.status(403).json({ success: false, message: "Invalid or expired token" });
    }
    // payload ถูกสร้างตอน sign: { id, role }
    req.user = payload;
    next();
  });
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Permission denied" });
    }
    next();
  };
};