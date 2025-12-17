import { getSismos, iniciarRevisionSismo, confirmarSismo, rechazarSismo, derivarSismo } from "../services/sismos.service.js";

export const obtenerSismos = async (req, res) => {
  try {
    const sismos = await getSismos();
    res.json(sismos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los sismos" });
  }
};

export async function obtenerSismosPendientes(req, res) {
  try {
    const sismos = await getSismosPendientes();
    res.json(sismos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function iniciarRevision(req, res) {
  try {
    const { id } = req.params;
    const resultado = await iniciarRevisionSismo(id);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
export const confirmar = (req, res) =>
  ejecutar(req, res, "confirmar");

export const rechazar = (req, res) =>
  ejecutar(req, res, "rechazar");

export const derivar = (req, res) =>
  ejecutar(req, res, "derivar");

async function ejecutar(req, res, accion) {
  try {
    const { id } = req.params;
    const { observacion } = req.body;
    const r = await ejecutarAccion(id, accion, observacion);
    res.json(r);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}