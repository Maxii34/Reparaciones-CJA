-- CreateTable
CREATE TABLE "fotos_orden" (
    "id" SERIAL NOT NULL,
    "ordenId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fotos_orden_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "fotos_orden_publicId_key" ON "fotos_orden"("publicId");

-- CreateIndex
CREATE INDEX "fotos_orden_ordenId_idx" ON "fotos_orden"("ordenId");

-- AddForeignKey
ALTER TABLE "fotos_orden" ADD CONSTRAINT "fotos_orden_ordenId_fkey" FOREIGN KEY ("ordenId") REFERENCES "ordenes_reparacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
