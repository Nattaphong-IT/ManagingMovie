// Backend/controller/movieController.js
import Movie from "../models/movie.model.js";

// GET /api/movies
export const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json({ success: true, data: movies });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/movies
export const createMovie = async (req, res) => {
  try {
    const { title, year, rating } = req.body;
    const newMovie = new Movie({ title, year, rating });
    await newMovie.save();
    res.status(201).json({ success: true, data: newMovie });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/movies/:id
export const updateMovie = async (req, res) => {
  try {
    const updated = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Movie not found" });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/movies/:id
export const deleteMovie = async (req, res) => {
  try {
    const deleted = await Movie.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Movie not found" });
    res.json({ success: true, message: "Movie deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
