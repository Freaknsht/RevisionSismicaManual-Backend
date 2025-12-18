import Estado from "./Estado.js";
import CambioEstado from "../CambioEstado.js";

//Estado bloqueado en Revision
export default class BloqueadoEnRevision extends Estado {

    rechazar(fechaHora, empleado, evento) {
        this.cerrarCambioDeEstado(fechaHora, evento);
        this.crearNuevoEstado("Rechazado", fechaHora, empleado, evento);
        evento.cambios.push(new CambioEstado("Rechazado", fechaHora));
    }

    confirmar(fechaHora, empleado, evento) {
        this.cerrarCambioDeEstado( fechaHora, evento);
        this.crearNuevoEstado("Confirmado", fechaHora, empleado, evento);
        evento.cambios.push(new CambioEstado("Confirmado", fechaHora));
    }

    derivar(fechaHora, empleado, evento) {
        this.cerrarCambioDeEstado(fechaHora, evento);
        this.crearNuevoEstado("Derivado a Superior", fechaHora, empleado, evento);
        evento.cambios.push(new CambioEstado("Derivado a Superior", fechaHora));
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