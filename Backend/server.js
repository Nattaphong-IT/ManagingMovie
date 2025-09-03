import express from 'express';
import movieRoutes from './routes/movieRoutes';
import { connectDB } from './utils/db';

const app = express();

app.use(express.json());
app.use('/api/movies', movieRoutes);

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});