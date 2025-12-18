import Estado from "./Estado.js";
import Rechazado from "./Rechazado.js";
import Confirmado from "./Confirmado.js";
import DerivadoSuperior from "./DerivadoSuperior.js";

export default class BloqueadoEnRevision extends Estado {
    
    constructor() {
        super("Bloqueado en Revisión");
    }

    rechazar(fechaHora, empleado, evento, observacion) {
        // ✅ Cerrar cambio actual
        this.cerrarCambioDeEstado(evento, fechaHora);
        
        // ✅ Crear nuevo cambio de estado
        evento.crearNuevoCambioEstado(new Rechazado(), fechaHora);
        
        // ✅ Actualizar estado del evento
        evento.setEstado(new Rechazado());
    }

    confirmar(fechaHora, empleado, evento) {
        // ✅ Cerrar cambio actual
        this.cerrarCambioDeEstado(evento, fechaHora);
        
        // ✅ Crear nuevo cambio de estado
        evento.crearNuevoCambioEstado(new Confirmado(), fechaHora);
        
        // ✅ Actualizar estado del evento
        evento.setEstado(new Confirmado());
    }

    derivar(fechaHora, empleado, evento) {
        // ✅ Cerrar cambio actual
        this.cerrarCambioDeEstado(evento, fechaHora);
        
        // ✅ Crear nuevo cambio de estado
        evento.crearNuevoCambioEstado(new DerivadoSuperior(), fechaHora);
        
        // ✅ Actualizar estado del evento
        evento.setEstado(new DerivadoSuperior());
    }

    cerrarCambioDeEstado(evento, fechaHora) {
        // ✅ CORREGIDO: usar cambiosDeEstado, no cambios
        const cambioActivo = evento.cambiosDeEstado.find(c => !c.tieneFechaFin());
        
        if (!cambioActivo) {
            throw new Error("No hay cambio de estado activo");
        }

        // ✅ Usar método cerrar() de CambioEstado
        cambioActivo.cerrar(fechaHora);
    }
}