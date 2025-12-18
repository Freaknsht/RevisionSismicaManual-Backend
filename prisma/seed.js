import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Crear estados
    const estados = [
      'Autoconfirmado',
      'Autodetectado',
      'Pendiente de Revisión',
      'Bloqueado en Revisión',
      'Confirmado',
      'Rechazado',
      'Derivado a Superior',
      'Evento sin Revision'
    ];

    for (const nombre of estados) {
      await prisma.estado.upsert({
        where: { nombre },
        update: {},
        create: { nombre }
      });
    }

    console.log('✅ Estados creados');

    // Obtener estados
    const autoconfirmado = await prisma.estado.findFirst({ where: { nombre: 'Autoconfirmado' } });
    const autodetectado = await prisma.estado.findFirst({ where: { nombre: 'Autodetectado' } });
    const pendiente = await prisma.estado.findFirst({ where: { nombre: 'Pendiente de Revisión' } });
    const rechazado = await prisma.estado.findFirst({ where: { nombre: 'Rechazado' } });

    console.log('Estados encontrados:', {
      autoconfirmado: autoconfirmado?.id,
      autodetectado: autodetectado?.id,
      pendiente: pendiente?.id,
      bloqueado: rechazado?.id
    });

    // ✅ CORREGIDO: Usar create en lugar de createMany para mejor manejo de errores
    const sismo1 = await prisma.eventoSismico.create({
      data: {
        fechaHora: new Date('2024-12-18T10:00:00Z'),
        magnitud: 5.8,
        profundidad: 20.5,
        latitud: 10.1234,
        longitud: -85.5678,
        ubicacion: 'Villa Maria',
        region: 'Provincia de Cordoba',
        origen: 'Sensor automático',
        clasificacion: 'Alta',
        alcance: 'Regional',
        estadoId: autoconfirmado.id
      }
    });
    console.log('✅ Sismo 1 (Autoconfirmado) creado:', sismo1.id);

    const sismo2 = await prisma.eventoSismico.create({
      data: {
        fechaHora: new Date('2024-12-18T11:00:00Z'),
        magnitud: 3.2,
        profundidad: 10.2,
        latitud: 9.9876,
        longitud: -84.7654,
        ubicacion: 'Cordoba',
        region: 'Provincia de Cordoba',
        origen: 'Sensor automático',
        clasificacion: 'Baja',
        alcance: 'Local',
        estadoId: autodetectado.id
      }
    });
    console.log('✅ Sismo 2 (Autodetectado) creado:', sismo2.id);

    const sismo3 = await prisma.eventoSismico.create({
      data: {
        fechaHora: new Date('2024-12-18T12:00:00Z'),
        magnitud: 3.8,
        profundidad: 15.0,
        latitud: 10.5555,
        longitud: -84.3333,
        ubicacion: 'Catamarca',
        region: 'Provincia de Catamarca',
        origen: 'Sensor automático',
        clasificacion: 'Media',
        alcance: 'Local',
        estadoId: pendiente.id
      }
    });
    console.log('✅ Sismo 3 (Pendiente) creado:', sismo3.id);

    const sismo4 = await prisma.eventoSismico.create({
      data: {
        fechaHora: new Date('2024-01-15T14:30:22Z'),
        magnitud: 7.2,
        profundidad: 15.2,
        latitud: 9.7489,
        longitud: -84.0907,
        ubicacion: 'Comodoro Rivadavia',
        region: 'Provincia de Chubut',
        origen: 'Sensor automático',
        clasificacion: 'Alta',
        alcance: 'Regional',
        estadoId: rechazado.id
      }
    });
    console.log('✅ Sismo 4 (Bloqueado) creado:', sismo4.id);

    console.log('✅ Todos los sismos creados correctamente');

  } catch (error) {
    console.error('❌ Error en seed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

main()
  .catch(e => {
    console.error('❌ Error fatal:', e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
