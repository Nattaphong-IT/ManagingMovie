// Backend/app.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import movieRoutes from "./routes/movieRoutes.js";

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api/movies", movieRoutes);

export default app;
