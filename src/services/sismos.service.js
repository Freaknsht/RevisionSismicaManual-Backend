import prisma from "../prisma/client.js";
import EventoSismico from "../domain/EventoSismico.js";
import BloqueadoEnRevision from "../domain/estados/BloqueadoEnRevision.js";
import AutoDetectado from "../domain/estados/AutoDetectado.js";
import Autoconfirmado from "../domain/estados/Autoconfirmado.js";

//Obtiene los sismos
export const getSismos = async () => {
  return await prisma.eventoSismico.findMany({
    include: {
      estado: true,
      cambios: true
    }
  });
};

// Crear evento sísmico
export async function crearEventoSismico(datos) {
  const evento = new EventoSismico(datos);

  // ✅ CORREGIDO: Lógica de magnitud invertida
  let estadoInicial;
  if (evento.magnitud >= 4.0) {
    // Magnitud alta = Autoconfirmado
    estadoInicial = new Autoconfirmado();
  } else {
    // Magnitud baja = AutoDetectado
    estadoInicial = new AutoDetectado();
  }

  // ✅ CORREGIDO: Mapeo correcto de propiedades
  const eventoDB = await prisma.eventoSismico.create({
    data: {
      magnitud: evento.magnitud,
      ubicacion: evento.ubicacion,
      coordenadas: evento.coordenadas,
      profundidad: evento.profundidad,
      fechaHora: evento.fechaHora,
      region: evento.region,
      observaciones: evento.observaciones,
      revisadoPor: evento.revisadoPor,
      estado: {
        connect: { nombre: estadoInicial.nombre }
      }
    },
    include: { estado: true }
  });

  estadoInicial.iniciar(eventoDB, new Date());

  if (estadoInicial.nombre === "Autodetectado") {
    iniciarTemporizadores(eventoDB.id);
  }

  return eventoDB;
}

//Obtener los sismos Pendiente
export async function getSismosPendientes() {
  return prisma.eventoSismico.findMany({
    where: {
      estado: {
        nombre: "Pendiente de Revisión",
      },
    },
    orderBy: {
      fechaHora: "desc",
    },
    include: {
      estado: true,
      cambios: true
    },
  });
}

//Bloquear los sismos a la hora de la revision
export async function iniciarRevisionSismo(eventoId) {
  const evento = await prisma.eventoSismico.findUnique({
    where: { id: Number(eventoId) },
    include: { estado: true }
  });

  if (!evento) {
    throw new Error("Evento sísmico no encontrado");
  }

  if (!esAmbitoEventoSismico(evento)) {
    throw new Error("El evento no está en ámbito de revisión");
  }

  if (evento.estado.nombre === "Bloqueado en Revisión") {
    throw new Error("El evento ya está en revisión");
  }

  const estadoBloqueado = await prisma.estado.findFirst({
    where: { nombre: "Bloqueado en Revisión" }
  });

  if (!estadoBloqueado) {
    throw new Error("Estado 'Bloqueado en Revisión' no existe");
  }

  await prisma.eventoSismico.update({
    where: { id: evento.id },
    data: { estadoId: estadoBloqueado.id }
  });

  await prisma.cambioEstado.create({
    data: {
      eventoId: evento.id,
      estadoId: estadoBloqueado.id,
      fechaHoraInicio: new Date()
    }
  });

  return { mensaje: "Revisión iniciada correctamente" };
}

//Busca el Ambito del evento sismico
function esAmbitoEventoSismico(evento) {
  // ✅ CORREGIDO: Puede estar en Autodetectado O Pendiente de Revisión
  return evento.estado.nombre === "Autodetectado" || evento.estado.nombre === "Pendiente de Revisión";
}

//Confirma el sismo
export const confirmarSismo = async (eventoId) => {
  return ejecutarCambioEstado(eventoId, "confirmar");
};

//Rechaza el sismo
export const rechazarSismo = async (eventoId) => {
  return ejecutarCambioEstado(eventoId, "rechazar");
};

//Deriva a un experto el sismo
export const derivarSismo = async (eventoId) => {
  return ejecutarCambioEstado(eventoId, "derivar");
};

//Hace el cambio de estado
async function ejecutarCambioEstado(eventoId, accion) {
  const eventoDB = await prisma.eventoSismico.findUnique({
    where: { id: Number(eventoId) },
    include: {
      estado: true,
      cambiosDeEstado: true,  // ✅ CORREGIDO: cargar cambios completos
    },
  });

  if (!eventoDB) throw new Error("Evento no encontrado");
  if (eventoDB.estado.nombre !== "Bloqueado en Revisión")
    throw new Error("El evento no está en Bloqueado en Revisión");

  // ✅ CORREGIDO: pasar cambiosDeEstado al constructor
  const evento = new EventoSismico({
    ...eventoDB,
    cambiosDeEstado: eventoDB.cambiosDeEstado  // ✅ Asegurar que se mapee correctamente
  });
  
  const estado = new BloqueadoEnRevision();  // ✅ Usar constructor

  // ✅ Ejecutar acción en el estado
  estado[accion](new Date(), null, evento);

  const nuevoEstado = await prisma.estado.findFirst({
    where: { nombre: evento.nuevoEstado },
  });

  if (!nuevoEstado) {
    throw new Error(`Estado '${evento.nuevoEstado}' no existe`);
  }

  // ✅ Actualizar estado en BD
  await prisma.eventoSismico.update({
    where: { id: evento.id },
    data: { estadoId: nuevoEstado.id },
  });

  // ✅ Crear nuevo registro de cambio de estado
  await prisma.cambioEstado.create({
    data: {
      eventoId: evento.id,
      estadoId: nuevoEstado.id,
      fechaHoraInicio: new Date(),
    },
  });

  return { mensaje: `Evento ${accion}do correctamente` };
}

//Inicia el contador para los estados
function iniciarTemporizadores(eventoId) {
  // 5 minutos → Pendiente de Revisión
  setTimeout(() => {
    cambiarEstadoSiSigue(
      eventoId,
      "Autodetectado",
      "Pendiente de Revisión"
    );
  }, 5 * 60 * 1000);

  // 10 minutos → Evento sin Revisión
  setTimeout(() => {
    cambiarEstadoSiSigue(
      eventoId,
      "Pendiente de Revisión",
      "Evento sin Revision"
    );
  }, 10 * 60 * 1000);
}

async function cambiarEstadoSiSigue(eventoId, estadoActual, estadoNuevo) {
  const evento = await prisma.eventoSismico.findUnique({
    where: { id: eventoId },
    include: { estado: true }
  });

  if (!evento || evento.estado.nombre !== estadoActual) return;

  const nuevoEstado = await prisma.estado.findFirst({
    where: { nombre: estadoNuevo }
  });

  if (!nuevoEstado) return;

  await prisma.eventoSismico.update({
    where: { id: eventoId },
    data: { estadoId: nuevoEstado.id }
  });

  await prisma.cambioEstado.create({
    data: {
      eventoId,
      estadoId: nuevoEstado.id,
      fechaHoraInicio: new Date()
    }
  });
}