import { Router } from "express";
import { obtenerSismos } from "../controllers/sismos.controller.js";

const router = Router();

router.get("/", obtenerSismos);

export default router;
