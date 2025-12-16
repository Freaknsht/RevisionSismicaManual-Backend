import prisma from "../prisma/client.js";

export const getSismos = async () => {
  return await prisma.eventoSismico.findMany({
    include: {
      estado: true,
      cambios: true
    }
  });
};