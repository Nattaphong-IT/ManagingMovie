// Backend/routes/auth.Routes.js
// PURPOSE: Auth routes เฉพาะ login และ me (ไม่มี register)

import express from "express";
import { login, me } from "../controllers/auth.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", login);
router.get("/me", authenticateToken, me);

export default router;