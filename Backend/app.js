// Backend/app.js
// PURPOSE: ตั้งค่าแอป Express, middleware พื้นฐาน และ mount routes หลัก

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import movieRoutes from "./routes/movie.Routes.js";
import authRoutes from "./routes/auth.Routes.js";

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api/movies", movieRoutes);
app.use("/api/auth", authRoutes);

export default app;