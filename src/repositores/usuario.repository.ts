import { prisma } from "../config/prisma";
import type { Prisma, Usuario } from "../generated/prisma/client";

export type UsuarioPublico = Omit<Usuario, "passwordHash">;

const usuarioPublicoSelect = {
  id: true,
  nombre: true,
  email: true,
  rol: true,
  activo: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UsuarioSelect;

export const usuarioRepository = {
  findAll(activo?: boolean): Promise<UsuarioPublico[]> {
    return prisma.usuario.findMany({
      where: activo === undefined ? undefined : { activo },
      select: usuarioPublicoSelect,
      orderBy: { id: "asc" },
    });
  },

  findById(id: number): Promise<UsuarioPublico | null> {
    return prisma.usuario.findUnique({
      where: { id },
      select: usuarioPublicoSelect,
    });
  },

  // Incluye passwordHash: usar solo para login/verificación de credenciales
  findByEmail(email: string): Promise<Usuario | null> {
    return prisma.usuario.findUnique({ where: { email } });
  },

  create(data: Prisma.UsuarioCreateInput): Promise<UsuarioPublico> {
    return prisma.usuario.create({ data, select: usuarioPublicoSelect });
  },

  update(id: number, data: Prisma.UsuarioUpdateInput): Promise<UsuarioPublico> {
    return prisma.usuario.update({ where: { id }, data, select: usuarioPublicoSelect });
  },

  remove(id: number): Promise<UsuarioPublico> {
    return prisma.usuario.delete({ where: { id }, select: usuarioPublicoSelect });
  },
};
