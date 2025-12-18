import prisma from "../prisma/client.js";
import EventoSismico from "../domain/EventoSismico.js";
import BloqueadoEnRevision from "../domain/estados/BloqueadoEnRevision.js";
import { crearEstado } from "../domain/estados/EstadoFactory.js";

//Obtiene los sismos
export const getSismos = async () => {
  return await prisma.eventoSismico.findMany({
    include: {
      estado: true,
      cambios: true
    }
  });
};

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
  // Ejemplo: solo eventos autodetectados
  return evento.estado.nombre === "Autodetectado";
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
      cambios: true,
    },
  });

  if (!eventoDB) throw new Error("Evento no encontrado");
  if (eventoDB.estado.nombre !== "Bloqueado en Revisión")
    throw new Error("El evento no está en Bloqueado en Revisión");

  const evento = new EventoSismico(eventoDB);
  const estado = new BloqueadoEnRevision("Bloqueado en Revisión");

  estado[accion](new Date(), null, evento);

  const nuevoEstado = await prisma.estado.findFirst({
    where: { nombre: evento.nuevoEstado },
  });

  await prisma.eventoSismico.update({
    where: { id: evento.id },
    data: { estadoId: nuevoEstado.id },
  });

  await prisma.cambioEstado.create({
    data: {
      eventoId: evento.id,
      estadoId: nuevoEstado.id,
      fechaHoraInicio: new Date(),
    },
  });

  return { mensaje: `Evento ${accion} correctamente` };
}
