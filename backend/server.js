import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import footballRoutes from "./routes/footballRoutes.js";
import newsRoutes from './routes/newsRoutes.js';

dotenv.config();

const app = express();
const allowedOrigins = [
  "https://two-football3-0-1lnp31ivq-rayan-0917s-projects.vercel.app",
  "http://localhost:5173", // for local dev
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/football", footballRoutes);
app.use("/api/news", newsRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
