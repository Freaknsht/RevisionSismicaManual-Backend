import { CambioEstado } from "./CambioEstado.js";

export class EventoSismico {
    constructor(eventoDB, estado, cambiosDeEstado = []) {
        this.id = eventoDB.id;
        this.fechaHora = eventoDB.fechaHora;
        this.magnitud = eventoDB.magnitud;
        this.estado = estado;
        this.cambiosDeEstado = cambiosDeEstado;
    }

    // =========================
    // Delegación al STATE
    // =========================

    confirmar(fechaHoraActual, empleadoLogueado) {
        this.estado.confirmar(
        fechaHoraActual,
        empleadoLogueado,
        this,
        this.cambiosDeEstado
        );
    }

    rechazar(fechaHoraActual, empleadoLogueado, observacion) {
        this.estado.rechazar(
        fechaHoraActual,
        empleadoLogueado,
        this,
        this.cambiosDeEstado,
        observacion
        );
    }

    derivar(fechaHoraActual, empleadoLogueado) {
        this.estado.derivar(
        fechaHoraActual,
        empleadoLogueado,
        this,
        this.cambiosDeEstado
        );
    }

    // =========================
    // Métodos usados por ESTADO
    // =========================

    setEstado(nuevoEstado) {
        this.estado = nuevoEstado;
    }

    agregarCambioEstado(cambioEstado) {
        this.cambiosDeEstado.push(cambioEstado);
    }

    obtenerCambioEstadoActivo() {
        return this.cambiosDeEstado.find(
        cambio => !cambio.tieneFechaFin()
        );
    }

    cerrarCambioEstadoActivo(fechaHoraActual) {
        const cambioActivo = this.obtenerCambioEstadoActivo();
        if (cambioActivo) {
        cambioActivo.setFechaFin(fechaHoraActual);
        }
    }

    crearNuevoCambioEstado(estadoNuevo, fechaHoraActual) {
        const nuevoCambio = new CambioEstado({
        estado: {
            id: estadoNuevo.id,
            nombre: estadoNuevo.nombre
        },
        fechaHoraInicio: fechaHoraActual
        });

        this.agregarCambioEstado(nuevoCambio);
    }
}