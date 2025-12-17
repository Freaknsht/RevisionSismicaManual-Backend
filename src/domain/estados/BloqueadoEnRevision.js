import Estado from "./Estado.js";

//Estado bloqueado en Revision
export default class BloqueadoEnRevision extends Estado {

    rechazar(fechaHora, empleado, evento) {
        this.cerrarCambioDeEstado(fechaHora, evento);
        this.crearNuevoEstado(
        "Rechazado",
        fechaHora,
        empleado,
        evento
        );
    }

    cerrarCambioDeEstado(fechaHora, evento) {
        const cambioActivo = evento.cambios.find(
        c => c.fechaHoraFin === null
        );

        if (!cambioActivo) {
        throw new Error("No hay cambio de estado activo");
        }

        cambioActivo.fechaHoraFin = fechaHora;
    }

    crearNuevoEstado(nombreEstado, fechaHora, empleado, evento) {
        evento.nuevoEstado = nombreEstado;
        evento.nuevoCambio = {
        fechaHoraInicio: fechaHora,
        empleadoId: empleado.id
        };
    }
}