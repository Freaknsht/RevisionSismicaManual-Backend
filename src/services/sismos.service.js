import prisma from "../prisma/client.js";
import EventoSismico from "../domain/EventoSismico.js";
import { crearEstado } from "../domain/estados/EstadoFactory.js";

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

function esAmbitoEventoSismico(evento) {
  // Ejemplo: solo eventos autodetectados
  return evento.estado.nombre === "Autodetectado";
}

export async function rechazarSismo(eventoId, empleado) {
  const eventoDB = await prisma.eventoSismico.findUnique({
    where: { id: Number(eventoId) },
    include: { estado: true, cambios: true }
  });

  const evento = new EventoSismico(eventoDB);
  const estadoObj = crearEstado(evento.estado.nombre);

  evento.rechazar(new Date(), empleado, estadoObj);

  // Persistencia
  await prisma.cambioEstado.updateMany({
    where: { eventoId: evento.id, fechaHoraFin: null },
    data: { fechaHoraFin: new Date() }
  });

  const estadoNuevo = await prisma.estado.findFirst({
    where: { nombre: evento.nuevoEstado }
  });

  await prisma.eventoSismico.update({
    where: { id: evento.id },
    data: { estadoId: estadoNuevo.id }
  });

  await prisma.cambioEstado.create({
    data: {
      eventoId: evento.id,
      estadoId: estadoNuevo.id,
      fechaHoraInicio: new Date(),
      empleadoId: empleado.id
    }
  });
}