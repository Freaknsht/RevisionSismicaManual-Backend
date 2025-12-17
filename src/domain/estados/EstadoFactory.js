import BloqueadoEnRevision from "./BloqueadoEnRevision.js";

//Crea las nuevas instancias de estado
export function crearEstado(nombre) {
    if (nombre === "Bloqueado en Revisión") {
        return new BloqueadoEnRevision();
    }
    return null;
}