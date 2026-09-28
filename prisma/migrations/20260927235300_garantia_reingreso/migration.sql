-- AlterTable
ALTER TABLE "ordenes_reparacion" ADD COLUMN     "esGarantia" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ordenOrigenId" INTEGER;

-- AddForeignKey
ALTER TABLE "ordenes_reparacion" ADD CONSTRAINT "ordenes_reparacion_ordenOrigenId_fkey" FOREIGN KEY ("ordenOrigenId") REFERENCES "ordenes_reparacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
