export default class Estado {

    constructor(estadoDB) {
    this.id = estadoDB.id;
    this.nombre = estadoDB.nombre;
    }

    confirmar(fechaHoraActual, empleadoLogueado, eventoSismico, cambiosDeEstado) {
        throw new Error(
        `No se puede CONFIRMAR un evento en estado ${this.nombre}`
        );
    }

    rechazar(
        fechaHoraActual,
        empleadoLogueado,
        eventoSismico,
        cambiosDeEstado,
        observacion
    ) {
        throw new Error(
        `No se puede RECHAZAR un evento en estado ${this.nombre}`
        );
    }

    derivar(fechaHoraActual, empleadoLogueado, eventoSismico, cambiosDeEstado) {
        throw new Error(
        `No se puede DERIVAR un evento en estado ${this.nombre}`
        );
    }

    // =========================
    // Métodos comunes del State
    // =========================

    cerrarCambioDeEstado(cambiosDeEstado, fechaHoraActual) {
        const cambioActivo = cambiosDeEstado.find(
        cambio => !cambio.tieneFechaFin()
        );

        if (cambioActivo) {
        cambioActivo.setFechaFin(fechaHoraActual);
        }
    }

    crearNuevoCambioEstado(estadoNuevo, fechaHoraActual) {
        return new CambioEstado({
        estado: {
            id: estadoNuevo.id,
            nombre: estadoNuevo.nombre
        },
        fechaHoraInicio: fechaHoraActual
        });
    }

    
}