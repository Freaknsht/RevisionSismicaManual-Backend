// src/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import healthRouter from "./routes/health.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/health", healthRouter);

app.use("/api/sismos", sismosRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Backend escuchando en http://localhost:${PORT}`);
});
