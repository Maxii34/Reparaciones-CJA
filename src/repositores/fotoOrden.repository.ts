import { prisma } from "../config/prisma";

export const fotoOrdenRepository = {
  findById: (id: number) =>
    prisma.fotoOrden.findUnique({ where: { id } }),

  findByOrdenId: (ordenId: number) =>
    prisma.fotoOrden.findMany({
      where: { ordenId },
      orderBy: { id: "asc" },
    }),

  create: (ordenId: number, url: string, publicId: string) =>
    prisma.fotoOrden.create({ data: { ordenId, url, publicId } }),

  delete: (id: number) => prisma.fotoOrden.delete({ where: { id } }),
};
