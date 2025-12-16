import express from "express";
import sismosRoutes from "./routes/sismos.routes.js";

const app = express();
app.use(express.json());

// Rutas
app.use("/api/sismos", sismosRoutes);

app.listen(3001, () => {
  console.log("Servidor backend corriendo en http://localhost:3001");
});
