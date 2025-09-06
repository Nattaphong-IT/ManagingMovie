// Backend/server.js
import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./utils/db.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

connectDB(); // ✅ connect MongoDB

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
