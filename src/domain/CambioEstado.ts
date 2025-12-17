import  Estado  from "./estados/Estado.js";

export class CambioEstado {
    id?: number;
    estado: Estado;
    fechaHoraInicio: Date;
    fechaHoraFin?: Date;
    observacion?: string;
    empleado?: any;

    constructor(cambioDB: any) {
        this.id = cambioDB.id;
        this.estado = new Estado(cambioDB.estado);
        this.fechaHoraInicio = new Date(cambioDB.fechaHoraInicio);
        this.fechaHoraFin = cambioDB.fechaHoraFin
        ? new Date(cambioDB.fechaHoraFin)
        : undefined;
        this.observacion = cambioDB.observacion;
        this.empleado = cambioDB.empleado;
    }

    // ====== LÓGICA DE CAMBIO ======

    tieneFechaFin(): boolean {
        return !!this.fechaHoraFin;
    }

    cerrar(fechaHora: Date): void {
        if (!this.fechaHoraFin) {
        this.fechaHoraFin = fechaHora;
        }
    }
}