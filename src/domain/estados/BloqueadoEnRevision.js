import Estado from "./Estado.js";
import Rechazado from "./Rechazado.js";
import Confirmado from "./Confirmado.js";
import DerivadoSuperior from "./DerivadoSuperior.js";

export default class BloqueadoEnRevision extends Estado {
    
    constructor() {
        super("Bloqueado en Revisión");
    }

    rechazar(fechaHora, empleado, evento, observacion) {
        // Cierra el cambio de actual
        this.cerrarCambioDeEstado(evento, fechaHora);
        
        //  Crear el nuevo cambio de estado
        evento.crearNuevoCambioEstado(new Rechazado(), fechaHora);
        
        // Actualizar el estado del evento
        evento.setEstado(new Rechazado());
    }

    confirmar(fechaHora, empleado, evento) {
        // Cierra el cambio de actual
        this.cerrarCambioDeEstado(evento, fechaHora);
        
        // Crear el nuevo cambio de estado
        evento.crearNuevoCambioEstado(new Confirmado(), fechaHora);
        
        // Actualizar el estado del evento
        evento.setEstado(new Confirmado());
    }

    derivar(fechaHora, empleado, evento) {
        // Cierra el cambio de actual
        this.cerrarCambioDeEstado(evento, fechaHora);
        
        // Crear el nuevo cambio de estado
        evento.crearNuevoCambioEstado(new DerivadoSuperior(), fechaHora);
        
        // Actualizar el estado del evento
        evento.setEstado(new DerivadoSuperior());
    }

    cerrarCambioDeEstado(evento, fechaHora) {
        // Busca que eñ cambio de estado no tenga hora fin
        const cambioActivo = evento.cambiosDeEstado.find(c => !c.tieneFechaFin());
        
        if (!cambioActivo) {
            throw new Error("No hay cambio de estado activo");
        }

        // Usar el método cerrar() en CambioEstado
        cambioActivo.cerrar(fechaHora);
    }
}