import prisma from "../src/prisma/client.js";

async function main() {
    // Estados
    const autoDetectado = await prisma.estado.create({
        data: { nombre: "Autodetectado" }
    });

    const pendiente = await prisma.estado.create({
        data: { nombre: "Pendiente de Revisión" }
    });

    const eventoSinRevision = await prisma.estado.create({
        data: { nombre: "Evento Sin Revision" }
    });

    const bloqueado = await prisma.estado.create({
        data: { nombre: "Bloqueado en Revisión" }
    });

    const rechazado = await prisma.estado.create({
        data: { nombre: "Rechazado" }
    });

    const confirmado = await prisma.estado.create({
        data: { nombre: "Confirmado" }
    });

    const derivadoASuperior = await prisma.estado.create({
        data: { nombre: "Derivado a Superior" }
    });

    const autoConfirmado = await prisma.estado.create({
        data: { nombre: "Autoconfirmado" }
    });

    const pendienteDeCierre = await prisma.estado.create({
        data: { nombre: "Pendiente de Cierre" }
    });

    const cerrado = await prisma.estado.create({
        data: { nombre: "Cerrado" }
    });

    // Evento sísmico de prueba
    await prisma.eventoSismico.create({
        data: {
            fechaHora: new Date("2024-01-15T14:30:22Z"),
            magnitud: 7.2,
            profundidad: 15.2,
            latitud: 9.7489,
            longitud: -84.0907,
            ubicacion: "Costa Rica Central",
            region: "Provincia de San José",
            origen: "Sensor automático",
            clasificacion: "Alta",
            alcance: "Regional",
            estadoId: autoDetectado.id
        }
    });
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
