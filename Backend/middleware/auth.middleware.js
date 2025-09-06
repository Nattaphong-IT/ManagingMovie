import jwt from "jsonwebtoken";

// ✅ ตรวจ JWT และแนบข้อมูลผู้ใช้เข้า req.user
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // รูปแบบ: Bearer <token>

  if (!token) {
    return res.status(401).json({ success: false, message: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

    // ✅ decoded ควรมี: { id, username, role }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: "Invalid or expired token" });
  }
};

// ✅ ตรวจสิทธิ์ตามบทบาท (MANAGER, TEAMLEADER, FLOORSTAFF)
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
