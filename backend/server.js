import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import footballRoutes from "./routes/footballRoutes.js";
import newsRoutes from './routes/newsRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/football", footballRoutes);
app.use("/api/news", newsRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
