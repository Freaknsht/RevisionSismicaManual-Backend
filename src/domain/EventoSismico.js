import CambioEstado from "./CambioEstado.js";
import AutoDetectado from "./estados/AutoDetectado.js";
import Autoconfirmado from "./estados/Autoconfirmado.js";

export default class EventoSismico {
    constructor(eventoDB) {
        this.id = eventoDB.id;

        // Datos del sismo
        this.magnitud = eventoDB.magnitud;
        this.ubicacion = eventoDB.ubicacion;
        // ✅ CORREGIDO: Usar latitud y longitud, no coordenadas
        this.latitud = eventoDB.latitud;
        this.longitud = eventoDB.longitud;
        this.profundidad = eventoDB.profundidad;
        this.fechaHora = new Date(eventoDB.fechaHora);
        this.region = eventoDB.region;
        this.observaciones = eventoDB.observaciones || null;
        this.revisadoPor = eventoDB.revisadoPor || null;

        // Estado actual (instancia de Estado)
        this.estado = eventoDB.estado;

        // ✅ CORREGIDO: Mapear correctamente cambios de la BD
        this.cambiosDeEstado = (eventoDB.cambiosDeEstado || []).map(
            c => new CambioEstado(c)
        );
        
        // Nuevo estado después de transición (usado en ejecutarCambioEstado)
        this.nuevoEstado = null;
    }

    actualizarEstadoPorTiempo(fechaActual) {
        if (this.estado.nombre === "Autodetectado") {
            if (this.minutosDesdeUltimoCambio(fechaActual) >= 5) {
                this.estado = this.estado.pasarAPendiente();
            }
        }

        if (this.estado.nombre === "Pendiente de Revisión") {
            if (this.minutosDesdeUltimoCambio(fechaActual) >= 5) {
                this.estado = this.estado.pasarASinRevision();
            }
        }
    }

    minutosDesdeUltimoCambio(fechaActual) {
        if (this.cambiosDeEstado.length === 0) return 0;
        const ultimoCambio = this.cambiosDeEstado[this.cambiosDeEstado.length - 1];
        const diferencia = fechaActual - ultimoCambio.fechaHoraInicio;
        return Math.floor(diferencia / (1000 * 60));
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
        this.nuevoEstado = nuevoEstado.nombre;
    }

    crearNuevoCambioEstado(estadoNuevo, fechaHoraActual) {
        const cambio = new CambioEstado({
            estado: estadoNuevo.nombre,
            fechaHoraInicio: fechaHoraActual
        });
        this.cambiosDeEstado.push(cambio);
    }
}