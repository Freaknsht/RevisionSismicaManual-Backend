import Estado from "./estados/Estado.js";

export default class CambioEstado {
    constructor(cambioDB) {
        this.id = cambioDB.id;
        this.estado = cambioDB.estado ? new Estado(cambioDB.estado) : null;
        this.fechaHoraInicio = cambioDB.fechaHoraInicio
        ? new Date(cambioDB.fechaHoraInicio)
        : null;
        this.fechaHoraFin = cambioDB.fechaHoraFin
        ? new Date(cambioDB.fechaHoraFin)
        : null;
        this.observacion = cambioDB.observacion || null;
        this.empleado = cambioDB.empleado || null;
    }

    // ====== LÓGICA ======

    tieneFechaFin() {
        return this.fechaHoraFin !== null;
    }

    cerrar(fechaHoraActual) {
        if (!this.fechaHoraFin) {
        this.fechaHoraFin = fechaHoraActual;
        }
    }
}