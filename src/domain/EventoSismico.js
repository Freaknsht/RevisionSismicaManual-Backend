import CambioEstado from "./CambioEstado.js";

export default class EventoSismico {
    constructor(eventoDB) {
        this.id = eventoDB.id;

        // Datos del sismo
        this.magnitud = eventoDB.magnitud;
        this.ubicacion = eventoDB.location;
        this.coordenadas = eventoDB.coordinates;
        this.profundidad = eventoDB.depth;
        this.fechaHora = new Date(eventoDB.timestamp);
        this.region = eventoDB.region;
        this.observaciones = eventoDB.notes || null;
        this.revisadoPor = eventoDB.reviewedBy || null;

        // Estado actual (instancia de Estado)
        this.estado = eventoDB.estado;

        // Historial de cambios
        this.cambiosDeEstado = eventoDB.cambios || [];
    }

    // =========================
    // Delegación al STATE
    // =========================

    confirmar(fechaHoraActual, empleadoLogueado) {
        this.estado.confirmar(
        fechaHoraActual,
        empleadoLogueado,
        this
        );
    }

    rechazar(fechaHoraActual, empleadoLogueado, observacion) {
        this.estado.rechazar(
        fechaHoraActual,
        empleadoLogueado,
        this,
        observacion
        );
    }

    derivar(fechaHoraActual, empleadoLogueado) {
        this.estado.derivar(
        fechaHoraActual,
        empleadoLogueado,
        this
        );
    }

    // =========================
    // Métodos usados por ESTADO
    // =========================

    setEstado(nuevoEstado) {
        this.estado = nuevoEstado;
    }

    cerrarCambioEstadoActivo(fechaHoraActual) {
        const cambioActivo = this.cambiosDeEstado.find(
        c => !c.fechaHoraFin
        );
        if (cambioActivo) {
        cambioActivo.setFechaFin(fechaHoraActual);
        }
    }

    crearNuevoCambioEstado(estadoNuevo, fechaHoraActual) {
        const cambio = new CambioEstado({
        estado: estadoNuevo,
        fechaHoraInicio: fechaHoraActual
        });
        this.cambiosDeEstado.push(cambio);
    }
}