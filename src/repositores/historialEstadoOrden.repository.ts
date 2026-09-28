import { prisma } from "../config/prisma";
import { Prisma } from "../generated/prisma/client";

export const historialEstadoOrdenRepository = {
  findAll: (skip?: number, take?: number) =>
    prisma.historialEstadoOrden.findMany({
      skip,
      take,
      orderBy: { id: "asc" },
      include: { orden: true, usuario: true },
    }),

  count: () => prisma.historialEstadoOrden.count(),

  // Historial de una orden en particular, útil para la trazabilidad dentro de la ficha de la orden
  findByOrdenId: (ordenId: number) =>
    prisma.historialEstadoOrden.findMany({
      where: { ordenId },
      orderBy: { fecha: "desc" },
      include: { usuario: true },
    }),

  findById: (id: number) =>
    prisma.historialEstadoOrden.findUnique({
      where: { id },
      include: { orden: true, usuario: true },
    }),

  create: (data: Prisma.HistorialEstadoOrdenUncheckedCreateInput) =>
    prisma.historialEstadoOrden.create({ data }),

  update: (id: number, data: Prisma.HistorialEstadoOrdenUncheckedUpdateInput) =>
    prisma.historialEstadoOrden.update({ where: { id }, data }),

  delete: (id: number) => prisma.historialEstadoOrden.delete({ where: { id } }),
};
