import { prisma } from "../config/prisma";
import { Prisma } from "../generated/prisma/client";

export const pagoRepository = {
  findAll: (skip?: number, take?: number) =>
    prisma.pago.findMany({
      skip,
      take,
      orderBy: { id: "asc" },
      include: { orden: true, registradoPor: true },
    }),

  count: () => prisma.pago.count(),

  // Pagos de una orden en particular, útil para el detalle de cobros dentro de la ficha de la orden
  findByOrdenId: (ordenId: number) =>
    prisma.pago.findMany({
      where: { ordenId },
      orderBy: { fecha: "desc" },
      include: { registradoPor: true },
    }),

  findById: (id: number) =>
    prisma.pago.findUnique({
      where: { id },
      include: { orden: true, registradoPor: true },
    }),

  create: (data: Prisma.PagoUncheckedCreateInput) =>
    prisma.pago.create({ data }),

  update: (id: number, data: Prisma.PagoUncheckedUpdateInput) =>
    prisma.pago.update({ where: { id }, data }),

  delete: (id: number) => prisma.pago.delete({ where: { id } }),
};
