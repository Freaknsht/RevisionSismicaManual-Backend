import Estado from "./Estado.js";

export default class Autoconfirmado extends Estado {
    puedeIniciar(evento) {
        return evento.magnitud >= 4.0;
    }

    iniciar(evento, fechaHora) {
        evento.crearNuevoCambioEstado(this, fechaHora);
        evento.setEstado(this);
    }
}