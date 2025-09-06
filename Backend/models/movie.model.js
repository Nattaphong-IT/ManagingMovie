// Backend/models/movie.js
import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
    },
    rating: {
      type: String,
      enum: ["G", "PG", "M", "MA", "R"],
      required: true,
    },
    createdBy: { // ✅ เพิ่มฟิลด์นี้
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // ต้องตรงกับชื่อ model ของ user
      required: true,
    },
  },
  { timestamps: true }
);

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
