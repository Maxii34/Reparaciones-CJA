import { prisma } from "../config/prisma";
import { Prisma } from "../generated/prisma/client";

export const repuestoRepository = {
  findAll: (skip?: number, take?: number) =>
    prisma.repuesto.findMany({
      skip,
      take,
      orderBy: { id: "asc" },
    }),

  count: () => prisma.repuesto.count(),

  findById: (id: number) =>
    prisma.repuesto.findUnique({
      where: { id },
      include: { usos: true },
    }),

  create: (data: Prisma.RepuestoUncheckedCreateInput) =>
    prisma.repuesto.create({ data }),

  update: (id: number, data: Prisma.RepuestoUncheckedUpdateInput) =>
    prisma.repuesto.update({ where: { id }, data }),

  // Delete físico: si el repuesto tiene usos cargados, Prisma va a tirar
  // un error de foreign key (por el onDelete: Restrict del schema), que
  // el errorHandler centralizado captura y devuelve como 409.
  delete: (id: number) => prisma.repuesto.delete({ where: { id } }),
};
