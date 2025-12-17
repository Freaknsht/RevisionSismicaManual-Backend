import { Router } from "express";
import { obtenerSismos, obtenerSismosPendientes, iniciarRevision, confirmar, rechazar, derivar } from "../controllers/sismos.controller.js";

const router = Router();

router.get("/", obtenerSismos);

router.get("/pendientes", obtenerSismosPendientes);

router.post("/:id/iniciar-revision", iniciarRevision);

router.post("/:id/confirmar", confirmar);
router.post("/:id/rechazar", rechazar);
router.post("/:id/derivar", derivar);

export default router;
