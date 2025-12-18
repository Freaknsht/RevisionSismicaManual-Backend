import Estado from "./Estado.js";
import PendienteDeRevision from "./PendienteDeRevision.js";

export default class AutoDetectado extends Estado {
    constructor() {
        super("Autodetectado");
    }

    puedeIniciar(evento) {
        return evento.magnitud < 4.0;
    }

    iniciar(evento, fechaHora) {
        evento.crearNuevoCambioEstado(this, fechaHora);
        evento.setEstado(this);
    }

    // Hace la transición automática después de 5 minutos
    pasarAPendiente() {
        return new PendienteDeRevision();
    }
}
