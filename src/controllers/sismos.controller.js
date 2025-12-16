import { getSismos } from "../services/sismos.service.js";

export const obtenerSismos = async (req, res) => {
  try {
    const sismos = await getSismos();
    res.json(sismos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los sismos" });
  }
};