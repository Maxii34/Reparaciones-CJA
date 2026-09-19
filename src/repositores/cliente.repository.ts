import { prisma } from "../config/prisma";
import { Prisma } from "../generated/prisma/client";

export const clienteRepository = {
  findAll: (skip: number, take: number) =>
    prisma.cliente.findMany({
      where: { activo: true },
      skip,
      take,
      orderBy: { id: "asc" },
    }),

  count: () => prisma.cliente.count({ where: { activo: true } }),

  findById: (id: number) => prisma.cliente.findUnique({ where: { id } }),

  findByDni: (dni: string) => prisma.cliente.findUnique({ where: { dni } }),

  findByEmail: (email: string) => prisma.cliente.findUnique({ where: { email } }),

  create: (data: Prisma.ClienteCreateInput) => prisma.cliente.create({ data }),

  update: (id: number, data: Prisma.ClienteUpdateInput) =>
    prisma.cliente.update({ where: { id }, data }),

  // Soft delete: nunca borrado físico (Equipo -> Cliente usa onDelete: Restrict)
  delete: (id: number) =>
    prisma.cliente.update({ where: { id }, data: { activo: false } }),
};
