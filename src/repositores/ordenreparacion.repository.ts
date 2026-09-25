import { prisma } from "../config/prisma";
import { Prisma } from "../generated/prisma/client";

// CRUD básico: crear, listar, obtener por ID, actualizar por ID y eliminar por ID.

export const ordenReparacionRepository = {
  // Buscar todas las órdenes - listar
  findAll: ( skip?: number, take?: number ) =>
    prisma.ordenReparacion.findMany({
        skip,
        take,
      // Orden ascendente por ID
      orderBy: { id: "asc" },
      // Incluir equipo y cliente asociado
      include: {
        equipo: {
          include: {
            cliente: true,
          },
        },
      },
    }),

    count: () => prisma.ordenReparacion.count(),

  findById: (id: number) =>
    prisma.ordenReparacion.findUnique({
      // Buscar una orden de reparación por su ID
      where: { id },
      // Incluir equipo y cliente asociado
      include: {
        equipo: {
          include: {
            cliente: true,
          },
        },
      },
    }),

  create: (data: Prisma.OrdenReparacionCreateInput) =>
    prisma.ordenReparacion.create({ data }),

  update: (id: number, data: Prisma.OrdenReparacionUpdateInput) =>
    prisma.ordenReparacion.update({ where: { id }, data }),

  delete: (id: number) => prisma.ordenReparacion.delete({ where: { id } }),
};
