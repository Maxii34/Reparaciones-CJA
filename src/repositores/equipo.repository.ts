import { prisma } from "../config/prisma";
import { Prisma } from "../generated/prisma/client";

export const equipoRepository = {
  findAll: (skip?: number, take?: number) =>
    prisma.equipo.findMany({
      skip,
      take,
      orderBy: { id: "asc" },
      include: { cliente: true },
    }),

  count: () => prisma.equipo.count(),

  // Equipos de un cliente en particular, útil para el historial dentro de la ficha del cliente
  findByClienteId: (clienteId: number) =>
    prisma.equipo.findMany({
      where: { clienteId },
      orderBy: { id: "desc" },
    }),

  findById: (id: number) =>
    prisma.equipo.findUnique({
      where: { id },
      include: { cliente: true, ordenes: true },
    }),

  create: (data: Prisma.EquipoUncheckedCreateInput) =>
    prisma.equipo.create({ data }),

  update: (id: number, data: Prisma.EquipoUncheckedUpdateInput) =>
    prisma.equipo.update({ where: { id }, data }),

  // Delete físico: si el equipo tiene órdenes cargadas, Prisma va a tirar
  // un error de foreign key (por el onDelete: Restrict del schema), que
  // el errorHandler centralizado captura y devuelve como 409.
  delete: (id: number) => prisma.equipo.delete({ where: { id } }),
};