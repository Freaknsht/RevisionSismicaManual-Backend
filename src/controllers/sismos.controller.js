import { 
    getSismos, 
    getSismosPendientes,  // ✅ IMPORTAR
    iniciarRevisionSismo, 
    confirmarSismo, 
    rechazarSismo, 
    derivarSismo 
} from "../services/sismos.service.js";

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
    const sismos = await getSismosPendientes();  // ✅ AHORA ESTÁ IMPORTADO
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

export const confirmar = async (req, res) => {
  try {
    const result = await confirmarSismo(req.params.id);
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const rechazar = async (req, res) => {
  try {
    const result = await rechazarSismo(req.params.id);
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const derivar = async (req, res) => {
  try {
    const result = await derivarSismo(req.params.id);
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
