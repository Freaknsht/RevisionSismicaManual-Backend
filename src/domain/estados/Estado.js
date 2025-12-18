export default class Estado {
    constructor(nombre) {
        this.nombre = nombre;
    }

    cerrarCambioDeEstado(evento, fechaHora) {
        const cambioAbierto = evento.cambios.find(c => !c.fechaHoraFin);
        if (cambioAbierto) {
        cambioAbierto.fechaHoraFin = fechaHora;
        }
    }

    crearNuevoEstado(evento, nombreNuevoEstado) {
        evento.nuevoEstado = nombreNuevoEstado;
    }

    // Métodos “abstractos” (conceptuales)
    rechazar() {
        throw new Error("Operación no permitida en este estado");
    }

    confirmar() {
        throw new Error("Operación no permitida en este estado");
    }

    derivar() {
        throw new Error("Operación no permitida en este estado");
    }
}