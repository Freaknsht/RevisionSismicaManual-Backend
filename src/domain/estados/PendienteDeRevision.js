import Estado from "./Estado.js";
import EventoSinRevision from "./EventoSinRevision.js";

export default class PendienteDeRevision extends Estado {
    constructor() {
        super("Pendiente de Revisión");
    }

    // Transición automática después de 10 minutos
    pasarASinRevision() {
        return new EventoSinRevision();
    }
}