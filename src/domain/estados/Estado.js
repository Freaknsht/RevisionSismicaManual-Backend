export default class Estado {
    constructor(nombre) {
        this.nombre = nombre;
    }

    // ✅ Métodos abstractos (implementados por subclases)
    rechazar(fechaHora, empleado, evento, observacion) {
        throw new Error(`Operación 'rechazar' no permitida en estado ${this.nombre}`);
    }

    confirmar(fechaHora, empleado, evento) {
        throw new Error(`Operación 'confirmar' no permitida en estado ${this.nombre}`);
    }

    derivar(fechaHora, empleado, evento) {
        throw new Error(`Operación 'derivar' no permitida en estado ${this.nombre}`);
    }

    // ✅ Métodos utilizados por transiciones
    puedeIniciar(evento) {
        return false;
    }

    iniciar(evento, fechaHora) {
        // Implementado por subclases
    }

    pasarAPendiente() {
        throw new Error("Esta transición no existe en este estado");
    }

    pasarASinRevision() {
        throw new Error("Esta transición no existe en este estado");
    }
}