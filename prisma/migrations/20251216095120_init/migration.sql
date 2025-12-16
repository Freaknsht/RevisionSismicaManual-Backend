-- CreateTable
CREATE TABLE "Estado" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "ambito" TEXT,

    CONSTRAINT "Estado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventoSismico" (
    "id" SERIAL NOT NULL,
    "fechaHora" TIMESTAMP(3) NOT NULL,
    "latitudEpicentro" DOUBLE PRECISION NOT NULL,
    "longitudEpicentro" DOUBLE PRECISION NOT NULL,
    "magnitud" DOUBLE PRECISION NOT NULL,
    "profundidad" DOUBLE PRECISION NOT NULL,
    "alcance" TEXT,
    "origen" TEXT,
    "clasificacion" TEXT,
    "estadoId" INTEGER NOT NULL,

    CONSTRAINT "EventoSismico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CambioEstado" (
    "id" SERIAL NOT NULL,
    "fechaHoraInicio" TIMESTAMP(3) NOT NULL,
    "fechaHoraFin" TIMESTAMP(3),
    "eventoId" INTEGER NOT NULL,
    "estadoId" INTEGER NOT NULL,

    CONSTRAINT "CambioEstado_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EventoSismico" ADD CONSTRAINT "EventoSismico_estadoId_fkey" FOREIGN KEY ("estadoId") REFERENCES "Estado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CambioEstado" ADD CONSTRAINT "CambioEstado_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "EventoSismico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CambioEstado" ADD CONSTRAINT "CambioEstado_estadoId_fkey" FOREIGN KEY ("estadoId") REFERENCES "Estado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
