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
      // Incluir equipo/cliente, técnico, pagos e historial para la ficha
      include: {
        equipo: {
          include: {
            cliente: true,
          },
        },
        tecnico: {
          select: { id: true, nombre: true, email: true, rol: true, activo: true },
        },
        pagos: {
          orderBy: { fecha: "desc" },
        },
        fotos: {
          orderBy: { id: "asc" },
        },
        historialEstados: {
          orderBy: { fecha: "desc" },
          include: {
            usuario: { select: { id: true, nombre: true } },
          },
        },
      },
    }),

    count: () => prisma.ordenReparacion.count(),

  // Orden abierta de un equipo (cualquier estado menos ENTREGADO/CANCELADO)
  findAbiertaPorEquipo: (equipoId: number) =>
    prisma.ordenReparacion.findFirst({
      where: { equipoId, estado: { notIn: ["ENTREGADO", "CANCELADO"] } },
      orderBy: { id: "desc" },
      select: { id: true, numero: true, estado: true },
    }),

  findById: (id: number) =>
    prisma.ordenReparacion.findUnique({
      // Buscar una orden de reparación por su ID
      where: { id },
      // Incluir equipo/cliente, técnico, pagos e historial para la ficha
      include: {
        equipo: {
          include: {
            cliente: true,
          },
        },
        tecnico: {
          select: { id: true, nombre: true, email: true, rol: true, activo: true },
        },
        pagos: {
          orderBy: { fecha: "desc" },
        },
        fotos: {
          orderBy: { id: "asc" },
        },
        historialEstados: {
          orderBy: { fecha: "desc" },
          include: {
            usuario: { select: { id: true, nombre: true } },
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
