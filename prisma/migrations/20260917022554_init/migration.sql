-- CreateEnum
CREATE TYPE "RolUsuario" AS ENUM ('ADMIN', 'TECNICO');

-- CreateEnum
CREATE TYPE "EstadoOrden" AS ENUM ('RECIBIDO', 'EN_DIAGNOSTICO', 'ESPERANDO_REPUESTO', 'EN_REPARACION', 'LISTO', 'ENTREGADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('PENDIENTE', 'PARCIAL', 'PAGADO');

-- CreateEnum
CREATE TYPE "MedioPago" AS ENUM ('EFECTIVO', 'TRANSFERENCIA', 'TARJETA_DEBITO', 'TARJETA_CREDITO', 'MERCADO_PAGO', 'OTRO');

-- CreateEnum
CREATE TYPE "CondicionFisicaEquipo" AS ENUM ('BUEN_ESTADO', 'GOLPES_ABOLLADURAS', 'RAYONES_SUPERFICIALES', 'PIEZAS_ROTAS_FALTANTES');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "rol" "RolUsuario" NOT NULL DEFAULT 'TECNICO',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT,
    "dni" TEXT,
    "telefono" TEXT,
    "whatsapp" TEXT,
    "email" TEXT,
    "direccion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipos" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "numeroSerie" TEXT,
    "observaciones" TEXT,
    "clienteId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "equipos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ordenes_reparacion" (
    "id" SERIAL NOT NULL,
    "numero" TEXT NOT NULL,
    "equipoId" INTEGER NOT NULL,
    "fechaIngreso" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fallaReportada" TEXT NOT NULL,
    "accesorios" TEXT,
    "condicionFisica" "CondicionFisicaEquipo"[],
    "detalleCondicionFisica" TEXT,
    "diagnostico" TEXT,
    "pruebasRealizadas" TEXT,
    "recomendaciones" TEXT,
    "costoEstimado" DECIMAL(10,2),
    "autorizadoCliente" BOOLEAN NOT NULL DEFAULT false,
    "fechaAutorizacion" TIMESTAMP(3),
    "reparacionRealizada" TEXT,
    "manoDeObra" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "precioFinal" DECIMAL(10,2),
    "estadoPago" "EstadoPago" NOT NULL DEFAULT 'PENDIENTE',
    "fechaEntrega" TIMESTAMP(3),
    "garantiaDias" INTEGER NOT NULL DEFAULT 90,
    "conformidadEntregaCliente" BOOLEAN NOT NULL DEFAULT false,
    "firmaClienteRecepcion" BOOLEAN NOT NULL DEFAULT false,
    "firmaTecnicoRecepcion" BOOLEAN NOT NULL DEFAULT false,
    "estado" "EstadoOrden" NOT NULL DEFAULT 'RECIBIDO',
    "creadoPorId" INTEGER,
    "tecnicoId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ordenes_reparacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historial_estados_orden" (
    "id" SERIAL NOT NULL,
    "ordenId" INTEGER NOT NULL,
    "estado" "EstadoOrden" NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comentario" TEXT,
    "usuarioId" INTEGER,

    CONSTRAINT "historial_estados_orden_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "repuestos" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "costo" DECIMAL(10,2) NOT NULL,
    "precioVenta" DECIMAL(10,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "repuestos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "repuestos_usados" (
    "id" SERIAL NOT NULL,
    "ordenId" INTEGER NOT NULL,
    "repuestoId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "costoUnitario" DECIMAL(10,2) NOT NULL,
    "precioUnitario" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "repuestos_usados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagos" (
    "id" SERIAL NOT NULL,
    "ordenId" INTEGER NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "medioPago" "MedioPago" NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observaciones" TEXT,
    "registradoPorId" INTEGER,

    CONSTRAINT "pagos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_dni_key" ON "clientes"("dni");

-- CreateIndex
CREATE INDEX "equipos_clienteId_idx" ON "equipos"("clienteId");

-- CreateIndex
CREATE UNIQUE INDEX "ordenes_reparacion_numero_key" ON "ordenes_reparacion"("numero");

-- CreateIndex
CREATE INDEX "ordenes_reparacion_equipoId_idx" ON "ordenes_reparacion"("equipoId");

-- CreateIndex
CREATE INDEX "ordenes_reparacion_estado_idx" ON "ordenes_reparacion"("estado");

-- CreateIndex
CREATE INDEX "historial_estados_orden_ordenId_idx" ON "historial_estados_orden"("ordenId");

-- CreateIndex
CREATE INDEX "repuestos_usados_ordenId_idx" ON "repuestos_usados"("ordenId");

-- CreateIndex
CREATE INDEX "repuestos_usados_repuestoId_idx" ON "repuestos_usados"("repuestoId");

-- CreateIndex
CREATE INDEX "pagos_ordenId_idx" ON "pagos"("ordenId");

-- AddForeignKey
ALTER TABLE "equipos" ADD CONSTRAINT "equipos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordenes_reparacion" ADD CONSTRAINT "ordenes_reparacion_equipoId_fkey" FOREIGN KEY ("equipoId") REFERENCES "equipos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordenes_reparacion" ADD CONSTRAINT "ordenes_reparacion_creadoPorId_fkey" FOREIGN KEY ("creadoPorId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordenes_reparacion" ADD CONSTRAINT "ordenes_reparacion_tecnicoId_fkey" FOREIGN KEY ("tecnicoId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_estados_orden" ADD CONSTRAINT "historial_estados_orden_ordenId_fkey" FOREIGN KEY ("ordenId") REFERENCES "ordenes_reparacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_estados_orden" ADD CONSTRAINT "historial_estados_orden_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repuestos_usados" ADD CONSTRAINT "repuestos_usados_ordenId_fkey" FOREIGN KEY ("ordenId") REFERENCES "ordenes_reparacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repuestos_usados" ADD CONSTRAINT "repuestos_usados_repuestoId_fkey" FOREIGN KEY ("repuestoId") REFERENCES "repuestos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_ordenId_fkey" FOREIGN KEY ("ordenId") REFERENCES "ordenes_reparacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_registradoPorId_fkey" FOREIGN KEY ("registradoPorId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
