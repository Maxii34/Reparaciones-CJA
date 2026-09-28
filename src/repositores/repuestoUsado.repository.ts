import { prisma } from "../config/prisma";
import { Prisma } from "../generated/prisma/client";

export const repuestoUsadoRepository = {
  findAll: (skip?: number, take?: number) =>
    prisma.repuestoUsado.findMany({
      skip,
      take,
      orderBy: { id: "asc" },
      include: { orden: true, repuesto: true },
    }),

  count: () => prisma.repuestoUsado.count(),

  // Detalle de repuestos de una orden en particular, útil para el desglose dentro de la ficha de la orden
  findByOrdenId: (ordenId: number) =>
    prisma.repuestoUsado.findMany({
      where: { ordenId },
      orderBy: { id: "asc" },
      include: { repuesto: true },
    }),

  findById: (id: number) =>
    prisma.repuestoUsado.findUnique({
      where: { id },
      include: { orden: true, repuesto: true },
    }),

  create: (data: Prisma.RepuestoUsadoUncheckedCreateInput) =>
    prisma.repuestoUsado.create({ data }),

  update: (id: number, data: Prisma.RepuestoUsadoUncheckedUpdateInput) =>
    prisma.repuestoUsado.update({ where: { id }, data }),

  delete: (id: number) => prisma.repuestoUsado.delete({ where: { id } }),
};
