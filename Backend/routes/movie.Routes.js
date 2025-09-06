// Backend/routes/movieRoutes.js
import express from "express";
import {
  getMovies,
  createMovie,
  updateMovie,
  deleteMovie,
} from "../controllers/movie.controller.js";

import { authenticateToken, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// 📌 FLOORSTAFF อ่านได้อย่างเดียว
router.get(
  "/",
  authenticateToken,
  authorize("MANAGER", "TEAMLEADER", "FLOORSTAFF"),
  getMovies
);

// 📌 TEAMLEADER และ MANAGER เพิ่มหนังได้
router.post(
  "/",
  authenticateToken,
  authorize("MANAGER", "TEAMLEADER"),
  createMovie
);

// 📌 TEAMLEADER และ MANAGER แก้ไขหนังได้
router.route("/:id")
  .put(authenticateToken, authorize("MANAGER", "TEAMLEADER"), updateMovie)
  .patch(authenticateToken, authorize("MANAGER", "TEAMLEADER"), updateMovie);


// 📌 MANAGER เท่านั้นที่ลบหนังได้
router.delete(
  "/:id",
  authenticateToken,
  authorize("MANAGER"),
  deleteMovie
);

export default router;
